
import { AppLayout } from '@/components/layout/AppLayout';
import { CourseCard } from '@/components/dashboard/CourseCard';
import { mockCourses } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Courses = () => {
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Leadership Series</h1>
          <p className="text-muted-foreground">Comprehensive training modules for AI leadership development</p>
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="not-started">Not Started</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="in-progress" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCourses
                .filter(course => course.progress > 0 && course.progress < 100)
                .map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCourses
                .filter(course => course.progress === 100)
                .map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              {mockCourses.filter(course => course.progress === 100).length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">You haven't completed any courses yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="not-started" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCourses
                .filter(course => course.progress === 0)
                .map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Courses;
