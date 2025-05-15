import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockVideos } from '@/data/mockContent';
import { supabase } from '@/integrations/supabase/client';
import { Play } from 'lucide-react';
import { useLocation, useSearchParams } from 'react-router-dom';

const VIDEOS_PER_PAGE = 6;

const Videos: React.FC = () => {
  const [openVideo, setOpenVideo] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState('');
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Check for video to play on mount and when location changes
  useEffect(() => {
    const videoToPlay = searchParams.get('play');
    if (videoToPlay) {
      const video = mockVideos.find(v => v.url === videoToPlay);
      if (video) {
        setOpenVideo(video.url);
        setModalTitle(video.title);
        markVideoWatched(video.url);
      }
    }
  }, [location.search]);

  // Fetch user and watched videos on mount
  useEffect(() => {
    const fetchWatched = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data } = await supabase
        .from('video_progress')
        .select('video_id')
        .eq('user_id', user.id)
        .eq('watched', true);
      if (data) {
        setWatchedVideos(data.map((row: any) => row.video_id));
      }
    };
    fetchWatched();
  }, []);

  // Mark video as watched in Supabase
  const markVideoWatched = async (videoId: string) => {
    if (!userId) return;
    await supabase
      .from('video_progress')
      .upsert({
        user_id: userId,
        video_id: videoId,
        watched: true,
        watched_at: new Date().toISOString(),
      }, { onConflict: ['user_id', 'video_id'] });
    setWatchedVideos((prev) => prev.includes(videoId) ? prev : [...prev, videoId]);
  };

  // When opening a video, mark as watched
  const handleOpenVideo = (video: { url: string, title: string }) => {
    setOpenVideo(video.url);
    setModalTitle(video.title);
    markVideoWatched(video.url);
  };

  // Filter videos by search
  const filteredVideos = mockVideos.filter(video =>
    video.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic for 2 rows (6 videos)
  const videosToShow = showAll ? filteredVideos : filteredVideos.slice(0, VIDEOS_PER_PAGE);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Training Videos</h1>
        <div className="flex justify-between items-center mb-6 gap-4 flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 transition"
          />
          <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
            Showing {videosToShow.length} of {filteredVideos.length} videos
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {videosToShow.map(video => (
            <div
              key={video.id}
              className="relative group bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl"
            >
              <button
                onClick={() => handleOpenVideo(video)}
                className="relative w-full aspect-video focus:outline-none"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-80"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-black/60 rounded-full p-3 group-hover:bg-green-700 transition-colors">
                    <Play className="text-white w-8 h-8 drop-shadow-lg" />
                  </span>
                </span>
                {watchedVideos.includes(video.url) && (
                  <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow font-semibold z-10 flex items-center gap-1">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Watched
                  </span>
                )}
              </button>
              <div className="flex-1 flex flex-col justify-between p-4">
                <div className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2 text-center min-h-[2.5rem]">{video.title}</div>
              </div>
            </div>
          ))}
        </div>
        {/* See More / See Less Buttons */}
        {filteredVideos.length > VIDEOS_PER_PAGE && (
          <div className="flex justify-center mt-8">
            {!showAll ? (
              <button
                onClick={() => setShowAll(true)}
                className="px-6 py-2 bg-green-900 text-white rounded-lg shadow hover:bg-green-800 transition font-semibold"
              >
                See More Videos
              </button>
            ) : (
              <button
                onClick={() => setShowAll(false)}
                className="px-6 py-2 bg-gray-200 text-green-900 rounded-lg shadow hover:bg-gray-300 transition font-semibold"
              >
                See Less Videos
              </button>
            )}
          </div>
        )}
        {/* Modal for video playback */}
        {openVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-0 max-w-4xl w-full relative overflow-hidden">
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-black text-3xl font-bold z-10 bg-white/80 rounded-full w-10 h-10 flex items-center justify-center shadow"
                onClick={() => {
                  setOpenVideo(null);
                  // Remove the play parameter from URL when closing
                  const newUrl = window.location.pathname;
                  window.history.pushState({}, '', newUrl);
                }}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="mb-2 font-bold text-lg text-center pt-6 pb-2 px-6">{modalTitle}</div>
              <div className="aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${openVideo}?autoplay=1`}
                  title={modalTitle}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-[70vh] rounded-b-2xl"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Videos;
