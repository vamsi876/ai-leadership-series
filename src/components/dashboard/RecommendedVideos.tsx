import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  url?: string;
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
      <CardContent className="space-y-6">
        {videos.map((video) => (
          <Link 
            key={video.id} 
            to={`/videos?play=${video.url}`}
            state={{ videoTitle: video.title }}
          >
            <div className="flex gap-4 cursor-pointer group p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="relative w-32 h-20 rounded-md overflow-hidden flex-shrink-0">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Play size={20} className="text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2">{video.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{video.duration}</p>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};
