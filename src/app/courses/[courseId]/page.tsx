import { LessonProgress } from '@/components/LessonProgress';

// Add this after the PDFViewer component in the return statement
{lesson.id === 'lesson-1' ? (
  <div className="mt-8">
    <LessonNotesHtml />
  </div>
) : (
  <div className="mt-8">
    <LessonNotes lessonId={lesson.id} />
  </div>
)}

// Add this after the PDFViewer component and before the LessonNotes component
<div className="mt-4">
  <LessonProgress
    lessonId={lesson.id}
    courseId={params.courseId}
    autoCompleteOnScroll={false}
    totalLessons={course.lessons.length}
    onComplete={() => {
      // Handle completion callback
      console.log('Lesson completed!');
    }}
  />
</div> 