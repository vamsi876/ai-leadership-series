import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Loader2, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ProgressManager } from '@/lib/progress';
import { Progress } from '@/components/ui/progress';

interface LessonProgressProps {
  lessonId: string;
  courseId: string;
  onComplete?: () => void;
  autoCompleteOnScroll?: boolean;
  totalLessons?: number;
}

export const LessonProgress: React.FC<LessonProgressProps> = ({
  lessonId,
  courseId,
  onComplete,
  autoCompleteOnScroll = false,
  totalLessons = 0,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastViewed, setLastViewed] = useState<string | null>(null);
  const [courseCompletion, setCourseCompletion] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const { toast } = useToast();

  // Load initial progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        console.log('Loading progress for:', { courseId, lessonId });
        const progress = await ProgressManager.getLessonProgress(courseId, lessonId);
        console.log('Loaded progress:', progress);
        
        setIsCompleted(progress?.completed || false);
        setLastViewed(progress?.lastViewedAt || null);
        setTimeSpent(progress?.timeSpent || 0);
        
        if (totalLessons > 0) {
          const completion = await ProgressManager.getCourseCompletion(courseId, totalLessons);
          setCourseCompletion(completion);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
        toast({
          title: "Error",
          description: "Failed to load lesson progress. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    loadProgress();
  }, [courseId, lessonId, totalLessons]);

  // Track time spent
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isCompleted) {
      interval = setInterval(async () => {
        setTimeSpent(prev => prev + 1);
        try {
          await ProgressManager.updateTimeSpent(courseId, lessonId, 1);
        } catch (error) {
          console.error('Error updating time spent:', error);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [courseId, lessonId, isCompleted]);

  // Function to handle PDF scroll events
  const handlePDFScroll = (event: MessageEvent) => {
    if (!autoCompleteOnScroll || isCompleted) return;
    
    if (event.data?.type === 'pdf-scroll') {
      const { currentPage, totalPages } = event.data;
      if (currentPage === totalPages) {
        markAsComplete();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('message', handlePDFScroll);
    return () => window.removeEventListener('message', handlePDFScroll);
  }, [isCompleted]);

  const markAsComplete = async () => {
    if (isCompleted) return;
    
    setIsLoading(true);
    try {
      console.log('Marking lesson as complete:', { courseId, lessonId });
      
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          lessonId,
          completed: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Failed to mark lesson as complete:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`Failed to mark lesson as complete: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Mark as complete response:', result);
      
      setIsCompleted(true);
      setLastViewed(new Date().toISOString());
      
      if (totalLessons > 0) {
        const completion = await ProgressManager.getCourseCompletion(courseId, totalLessons);
        setCourseCompletion(completion);
      }
      
      onComplete?.();
      
      toast({
        title: "Lesson Completed! 🎉",
        description: "Great job! You've completed this lesson.",
      });
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to mark lesson as complete. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  return (
    <Card className="p-4 mt-4">
      <div className="space-y-4">
        {/* Progress Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
            )}
            <span className="text-sm font-medium">
              {isCompleted ? "Lesson Completed" : "Lesson Progress"}
            </span>
          </div>
          
          {!isCompleted && !autoCompleteOnScroll && (
            <Button
              onClick={markAsComplete}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Mark as Done"
              )}
            </Button>
          )}
        </div>

        {/* Course Progress */}
        {totalLessons > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Course Progress</span>
              <span className="font-medium">{courseCompletion}%</span>
            </div>
            <Progress value={courseCompletion} className="h-2" />
          </div>
        )}

        {/* Time Spent */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Time spent: {formatTime(timeSpent)}</span>
        </div>

        {/* Last Viewed */}
        {lastViewed && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last viewed: {formatDate(lastViewed)}</span>
          </div>
        )}
        
        {/* Auto-complete Message */}
        {autoCompleteOnScroll && !isCompleted && (
          <p className="text-sm text-muted-foreground">
            This lesson will be marked as complete when you reach the last page of the PDF.
          </p>
        )}
      </div>
    </Card>
  );
}; 