import { useState, useEffect } from 'react';
import { Book, Calendar, FileText, List, Video } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { CourseCard } from '@/components/dashboard/CourseCard';
import { RecentResources } from '@/components/dashboard/RecentResources';
import { RecommendedVideos } from '@/components/dashboard/RecommendedVideos';
import { mockCourses, mockProgressStats, mockResources } from '@/data/mockData';
import { mockVideos as trainingVideos } from '@/data/mockContent';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [videosWatched, setVideosWatched] = useState<number>(0);
  const [videosTotal, setVideosTotal] = useState<number>(trainingVideos.length);
  const [promptsUsed, setPromptsUsed] = useState<number | null>(null);
  const [promptsTotal, setPromptsTotal] = useState<number | null>(null);
  const [resourcesExplored, setResourcesExplored] = useState<number>(0);
  const [resourcesTotal, setResourcesTotal] = useState<number>(0);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !user.email) return;

        const { data, error } = await supabase
          .from('users_personal_information')
          .select('full_name')
          .eq('email', user.email)
          .single();

        if (data?.full_name) {
          setUserName(data.full_name.split(' ')[0]); // Get first name
        } else if (user.user_metadata?.name) {
          setUserName(user.user_metadata.name.split(' ')[0]); // Fallback to auth metadata
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchVideosWatched = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('video_progress')
        .select('video_id')
        .eq('user_id', user.id)
        .eq('watched', true);
      if (data) {
        setVideosWatched(data.length);
      }
    };
    fetchVideosWatched();
  }, []);

  useEffect(() => {
    const fetchPromptsProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // Fetch used prompts count
      const { data: usedData } = await supabase
        .from('prompt_progress')
        .select('prompt_id')
        .eq('user_id', user.id)
        .eq('used', true);
      if (usedData) {
        setPromptsUsed(usedData.length);
      }
      // Fetch total prompts count
      const { data: allPrompts } = await supabase
        .from('prompts')
        .select('id');
      if (allPrompts) {
        setPromptsTotal(allPrompts.length);
      }
    };
    fetchPromptsProgress();
  }, []);

  useEffect(() => {
    const fetchResourcesProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // Fetch explored resources count
      const { data: exploredData } = await supabase
        .from('resource_progress')
        .select('resource_id')
        .eq('user_id', user.id)
        .eq('explored', true);
      if (exploredData) {
        setResourcesExplored(exploredData.length);
      }
      // Fetch total resources count
      const { data: allResources } = await supabase
        .from('resources')
        .select('id');
      if (allResources) {
        setResourcesTotal(allResources.length);
      }
    };
    fetchResourcesProgress();
  }, []);
  
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{loading ? 'Welcome back' : `Welcome back, ${userName}`}</h1>
          <p className="text-muted-foreground">Continue your AI leadership journey</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProgressCard 
            title="Resources Explored" 
            progress={resourcesExplored} 
            total={resourcesTotal} 
            icon={<FileText className="h-6 w-6" />} 
          />
          <ProgressCard 
            title="Videos Watched" 
            progress={videosWatched} 
            total={videosTotal} 
            icon={<Video className="h-6 w-6" />} 
          />
          <ProgressCard 
            title="Prompts Used" 
            progress={typeof promptsUsed === 'number' ? promptsUsed : 0}
            total={typeof promptsTotal === 'number' ? promptsTotal : 0}
            showProgressBar={typeof promptsUsed === 'number' && typeof promptsTotal === 'number'}
            icon={<List className="h-6 w-6" />} 
          />
        </div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Continue Learning</h2>
            <a href="/courses" className="text-sm text-primary hover:underline">View all courses</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentResources />
          <RecommendedVideos videos={[
            // Most relevant videos for leadership training
            trainingVideos[0], // How AI is Changing Leadership
            trainingVideos[4], // AI Strategy in Modern Organizations
            trainingVideos[6], // Building AI-Ready Teams
            trainingVideos[7], // AI Communication Skills for Leaders
          ].map(video => ({
            id: video.id.toString(),
            title: video.title,
            duration: video.duration,
            thumbnail: video.thumbnail,
            url: video.url
          }))} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
