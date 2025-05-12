
import { useState } from 'react';
import { Book, Calendar, FileText, List, Video } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { CourseCard } from '@/components/dashboard/CourseCard';
import { RecentResources } from '@/components/dashboard/RecentResources';
import { RecommendedVideos } from '@/components/dashboard/RecommendedVideos';
import { mockCourses, mockProgressStats, mockResources, mockUser, mockVideos } from '@/data/mockData';

const Index = () => {
  const [user] = useState(mockUser);
  
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="text-muted-foreground">Continue your AI leadership journey</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ProgressCard 
            title="Course Completion" 
            progress={mockProgressStats[0].progress} 
            total={mockProgressStats[0].total} 
            icon={<Book className="h-4 w-4 text-primary" />} 
          />
          <ProgressCard 
            title="Resources Explored" 
            progress={mockProgressStats[1].progress} 
            total={mockProgressStats[1].total} 
            icon={<FileText className="h-4 w-4 text-primary" />} 
          />
          <ProgressCard 
            title="Videos Watched" 
            progress={mockProgressStats[2].progress} 
            total={mockProgressStats[2].total} 
            icon={<Video className="h-4 w-4 text-primary" />} 
          />
          <ProgressCard 
            title="Prompts Used" 
            progress={mockProgressStats[3].progress} 
            total={mockProgressStats[3].total} 
            icon={<List className="h-4 w-4 text-primary" />} 
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
          <RecentResources resources={mockResources} />
          <RecommendedVideos videos={mockVideos} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
