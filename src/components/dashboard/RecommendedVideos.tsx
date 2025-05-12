
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

interface RecommendedVideosProps {
  videos: Video[];
}

export const RecommendedVideos = ({ videos }: RecommendedVideosProps) => {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Recommended Videos</CardTitle>
        <CardDescription>Leadership training videos for you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {videos.map((video) => (
          <Link key={video.id} to={`/videos/${video.id}`}>
            <div className="flex gap-3 cursor-pointer group">
              <div className="relative w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Play size={18} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium line-clamp-2">{video.title}</p>
                <p className="text-xs text-muted-foreground">{video.duration}</p>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};
