import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Dot } from 'lucide-react';
import { mockCourses, mockLessons } from '@/data/mockData';
import { PDFViewer } from '@/components/PDFViewer';
import { ProgressManager } from '@/lib/progress';
import { useToast } from '@/components/ui/use-toast';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<{ [lessonId: string]: boolean }>({});
  const [inProgressLesson, setInProgressLesson] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const pdfViewerRef = useRef<any>(null);
  const { toast } = useToast();
  const [loadingLessonId, setLoadingLessonId] = useState<string | null>(null);
  
  const course = mockCourses.find(c => c.id === courseId);
  const lessons = mockLessons.filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);
  
  // Fetch progress from backend on mount
  useEffect(() => {
    if (!courseId) return;
    setLoadingProgress(true);
    ProgressManager.getProgress(courseId).then(progress => {
      const completed: { [lessonId: string]: boolean } = {};
      Object.entries(progress).forEach(([lessonId, data]) => {
        if (data.completed) completed[lessonId] = true;
      });
      setCompletedLessons(completed);
      setLoadingProgress(false);
    });
  }, [courseId]);

  useEffect(() => {
    if (selectedLesson) {
      setInProgressLesson(selectedLesson);
    }
  }, [selectedLesson]);

  useEffect(() => {
    // Listen for PDF scroll events
    const handlePDFScroll = (event: MessageEvent) => {
      if (!selectedLesson) return;
      if (event.data?.type === 'pdf-scroll') {
        const { currentPage, totalPages } = event.data;
        if (currentPage === totalPages) {
          markLessonAsDone(selectedLesson);
        }
      }
    };
    window.addEventListener('message', handlePDFScroll);
    return () => window.removeEventListener('message', handlePDFScroll);
  }, [selectedLesson]);

  // Helper to determine if a lesson is enabled for navigation
  const isLessonEnabled = (lessonIndex: number) => {
    if (completedLessons[lessons[lessonIndex].id]) return true;
    if (lessonIndex === 0) return true;
    for (let i = 0; i < lessonIndex; i++) {
      if (!completedLessons[lessons[i].id]) return false;
    }
    return true;
  };

  // Mark lesson as done and update backend
  const markLessonAsDone = async (lessonId: string) => {
    if (!lessonId || completedLessons[lessonId]) return false;
    try {
      await ProgressManager.updateLessonProgress(courseId!, lessonId, true);
      setCompletedLessons(prev => ({ ...prev, [lessonId]: true }));
      return true;
    } catch (error) {
      console.error('Error marking lesson as done:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark lesson as done. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // When a lesson is clicked: only update UI state locally
  const handleLessonClick = (lesson: typeof lessons[0], idx: number) => {
    if (!isLessonEnabled(idx)) return;
    setCompletedLessons(prev => ({ ...prev, [lesson.id]: true }));
    setSelectedLesson(lesson.id);
  };

  if (!course) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
        </div>
      </AppLayout>
    );
  }

  const selectedLessonData = selectedLesson 
    ? lessons.find(l => l.id === selectedLesson)
    : lessons[0];

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lessons List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Lessons</CardTitle>
                <CardDescription>{lessons.length} modules to complete</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {loadingProgress ? (
                  <div className="text-center py-8 text-muted-foreground">Loading progress...</div>
                ) : (
                  lessons.map((lesson, idx) => {
                    const isCompleted = completedLessons[lesson.id];
                    const isInProgress = selectedLesson === lesson.id && !isCompleted;
                    const enabled = isLessonEnabled(idx);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson, idx)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                          selectedLesson === lesson.id
                            ? 'bg-primary/10 text-primary'
                            : enabled
                            ? 'hover:bg-muted'
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        disabled={!enabled}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : isInProgress ? (
                          <Dot className="h-5 w-5 text-green-600 fill-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">{lesson.title}</p>
                          <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-2 space-y-6">
            {selectedLessonData && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedLessonData.title}</CardTitle>
                    <CardDescription>{selectedLessonData.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p>{selectedLessonData.content}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* PDF Viewer */}
                <PDFViewer 
                  pdfUrl={selectedLessonData.pdfUrl} 
                  pdfTitle={selectedLessonData.pdfTitle} 
                  notes={selectedLessonData.notes}
                />

                {/* Mark as Done Button - removed, progress is now tracked automatically */}
                {/* <div className="flex justify-end mt-4">
                  <Button
                    onClick={() => markLessonAsDone(selectedLessonData.id)}
                    disabled={completedLessons[selectedLessonData.id]}
                  >
                    {completedLessons[selectedLessonData.id] ? 'Completed' : 'Mark as Done'}
                  </Button>
                </div> */}
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseDetail; 