interface LessonProgress {
  completed: boolean;
  completedAt: string | null;
  lastViewedAt: string;
  timeSpent: number;
}

interface CourseProgress {
  [lessonId: string]: LessonProgress;
}

export const ProgressManager = {
  async getProgress(courseId: string): Promise<CourseProgress> {
    try {
      const response = await fetch(`/api/lesson-progress?courseId=${courseId}`);
      if (!response.ok) throw new Error('Failed to fetch progress');
      const progress = await response.json();
      return progress.reduce((acc: CourseProgress, curr: any) => {
        acc[curr.lesson_id] = {
          completed: curr.completed,
          completedAt: curr.completed_at,
          lastViewedAt: curr.last_viewed_at,
          timeSpent: curr.time_spent,
        };
        return acc;
      }, {});
    } catch (error) {
      console.error('Error fetching progress:', error);
      return {};
    }
  },

  async getLessonProgress(courseId: string, lessonId: string): Promise<LessonProgress | null> {
    try {
      const response = await fetch(`/api/lesson-progress?courseId=${courseId}&lessonId=${lessonId}`);
      if (!response.ok) throw new Error('Failed to fetch lesson progress');
      const progress = await response.json();
      if (!progress.length) return null;
      const lessonProgress = progress[0];
      return {
        completed: lessonProgress.completed,
        completedAt: lessonProgress.completed_at,
        lastViewedAt: lessonProgress.last_viewed_at,
        timeSpent: lessonProgress.time_spent,
      };
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
      return null;
    }
  },

  async updateLessonProgress(
    courseId: string, 
    lessonId: string, 
    completed: boolean,
    timeSpent?: number
  ): Promise<void> {
    try {
      const response = await fetch('/api/lesson-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          lessonId,
          completed,
          timeSpent,
        }),
      });
      if (!response.ok) throw new Error('Failed to update progress');
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  },

  async isLessonCompleted(courseId: string, lessonId: string): Promise<boolean> {
    const lessonProgress = await this.getLessonProgress(courseId, lessonId);
    return lessonProgress?.completed || false;
  },

  async getCourseCompletion(courseId: string, totalLessons: number): Promise<number> {
    const progress = await this.getProgress(courseId);
    const completedLessons = Object.values(progress).filter(p => p.completed).length;
    return Math.round((completedLessons / totalLessons) * 100);
  },

  // Helper method to track time spent
  async updateTimeSpent(courseId: string, lessonId: string, seconds: number): Promise<void> {
    await this.updateLessonProgress(courseId, lessonId, false, seconds);
  }
}; 