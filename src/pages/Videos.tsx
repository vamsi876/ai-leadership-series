
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const videosData = [
  {
    id: '1',
    title: 'Building AI-Ready Leadership Teams',
    description: 'Learn how to structure and develop leadership teams that are prepared for AI transformation.',
    duration: '24 min',
    category: 'Team Development',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2274&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Leading Through AI Transformation',
    description: 'Strategies for guiding your organization through the challenges of AI adoption and integration.',
    duration: '18 min',
    category: 'Change Management',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'AI Communication Strategies for Leaders',
    description: 'Effective ways to communicate about AI initiatives with stakeholders at all levels.',
    duration: '31 min',
    category: 'Communication',
    thumbnail: 'https://images.unsplash.com/photo-1539786774582-301f537aae5f?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Ethical Considerations in AI Leadership',
    description: 'Navigating ethical challenges when implementing AI solutions in your organization.',
    duration: '27 min',
    category: 'Ethics',
    thumbnail: 'https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'Strategic Planning for AI Implementation',
    description: 'A step-by-step approach to creating effective AI strategies aligned with business goals.',
    duration: '36 min',
    category: 'Strategy',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: '6',
    title: 'Measuring ROI on AI Investments',
    description: 'Methods and metrics for evaluating the business impact of AI initiatives.',
    duration: '22 min',
    category: 'Strategy',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop',
  },
];

const VideoCard = ({ video }: { video: typeof videosData[0] }) => {
  return (
    <Link to={`/videos/${video.id}`}>
      <Card className="overflow-hidden card-hover">
        <div className="relative aspect-video">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="h-5 w-5 ml-0.5" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium mb-1">{video.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
          <div className="mt-2">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {video.category}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const Videos = () => {
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Training Video Library</h1>
          <p className="text-muted-foreground">Watch instructional videos on AI leadership topics</p>
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Videos</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="teams">Team Development</TabsTrigger>
            <TabsTrigger value="change">Change Management</TabsTrigger>
            <TabsTrigger value="ethics">Ethics</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosData.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="strategy" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosData
                .filter(video => video.category === "Strategy")
                .map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="teams" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosData
                .filter(video => video.category === "Team Development")
                .map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="change" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosData
                .filter(video => video.category === "Change Management")
                .map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="ethics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosData
                .filter(video => video.category === "Ethics")
                .map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Videos;
