
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProgressStats, mockCourses, mockResources, mockVideos } from '@/data/mockData';
import { Book, Calendar, CheckCheck, FileText, PlayCircle } from 'lucide-react';

const ProgressChart = ({ title, progress, total, icon }: { title: string, progress: number, total: number, icon: React.ReactNode }) => {
  const percentage = Math.round((progress / total) * 100);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <svg className="h-full w-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="10"
            strokeDasharray={`${percentage * 2.83} ${283 - percentage * 2.83}`}
            strokeDashoffset="70.75"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
          <span className="text-2xl font-bold">{percentage}%</span>
        </div>
      </div>
      <h3 className="mt-2 font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">
        {progress} of {total} complete
      </p>
    </div>
  );
};

const ActivityItem = ({ icon, title, date, type }: { icon: React.ReactNode, title: string, date: string, type: string }) => {
  return (
    <div className="flex gap-4 pb-5">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{type}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

const recentActivity = [
  { 
    id: '1', 
    icon: <Book className="h-5 w-5 text-primary" />, 
    title: 'Completed Module 3: AI Decision Frameworks', 
    date: '2 days ago',
    type: 'Course'
  },
  { 
    id: '2', 
    icon: <PlayCircle className="h-5 w-5 text-primary" />, 
    title: 'Watched Building AI-Ready Leadership Teams', 
    date: '3 days ago',
    type: 'Video'
  },
  { 
    id: '3', 
    icon: <FileText className="h-5 w-5 text-primary" />, 
    title: 'Downloaded AI Strategy Planning Worksheet', 
    date: '4 days ago',
    type: 'Resource'
  },
  { 
    id: '4', 
    icon: <CheckCheck className="h-5 w-5 text-primary" />, 
    title: 'Completed Strategic AI Implementation Course', 
    date: '1 week ago',
    type: 'Course'
  },
];

const Progress = () => {
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Progress</h1>
          <p className="text-muted-foreground">Track your learning journey and achievements</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
              <CardDescription>Your learning journey statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <ProgressChart 
                  title="Courses" 
                  progress={mockProgressStats[0].progress} 
                  total={mockProgressStats[0].total} 
                  icon={<Book className="h-4 w-4 text-primary" />} 
                />
                <ProgressChart 
                  title="Resources" 
                  progress={mockProgressStats[1].progress} 
                  total={mockProgressStats[1].total} 
                  icon={<FileText className="h-4 w-4 text-primary" />} 
                />
                <ProgressChart 
                  title="Videos" 
                  progress={mockProgressStats[2].progress} 
                  total={mockProgressStats[2].total} 
                  icon={<PlayCircle className="h-4 w-4 text-primary" />} 
                />
                <ProgressChart 
                  title="Prompts" 
                  progress={mockProgressStats[3].progress} 
                  total={mockProgressStats[3].total} 
                  icon={<Calendar className="h-4 w-4 text-primary" />} 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your most recent learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {recentActivity.map((activity) => (
                  <ActivityItem 
                    key={activity.id} 
                    icon={activity.icon} 
                    title={activity.title} 
                    date={activity.date} 
                    type={activity.type} 
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Tabs defaultValue="courses">
            <TabsList>
              <TabsTrigger value="courses">Courses Progress</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
            </TabsList>
            <TabsContent value="courses" className="mt-6">
              <div className="space-y-4">
                {mockCourses.map((course) => (
                  <Card key={course.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={course.image} 
                            alt={course.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">{course.modules} Modules</p>
                        </div>
                        <div className="w-full md:w-1/3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{course.progress}% Complete</span>
                            <span>{course.progress > 0 ? 'In Progress' : 'Not Started'}</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-value" style={{ width: `${course.progress}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="resources" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockResources.map((resource) => (
                  <Card key={resource.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-3 items-start">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground">{resource.type} • Accessed on {resource.date}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="videos" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockVideos.map((video) => (
                  <Card key={video.id}>
                    <div className="relative aspect-video">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black text-white text-xs px-1.5 py-0.5 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">{video.title}</h3>
                      <p className="text-sm text-muted-foreground">Watched on May 8, 2025</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="certificates" className="mt-6">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                </div>
                <h3 className="text-lg font-medium mb-2">No Certificates Yet</h3>
                <p className="text-muted-foreground mb-4">Complete a full course to earn your first certificate.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default Progress;
