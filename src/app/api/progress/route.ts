import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      console.error('[PROGRESS_GET] No user ID found');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const lessonId = searchParams.get('lessonId');

    if (!courseId) {
      console.error('[PROGRESS_GET] No course ID provided');
      return new NextResponse('Course ID is required', { status: 400 });
    }

    console.log('[PROGRESS_GET] Fetching progress:', { userId, courseId, lessonId });

    let query = supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId);

    if (lessonId) {
      query = query.eq('lesson_id', lessonId);
    }

    const { data: progress, error } = await query;

    if (error) {
      console.error('[PROGRESS_GET] Database error:', error);
      return new NextResponse('Database Error', { status: 500 });
    }

    console.log('[PROGRESS_GET] Success:', { progress });
    return NextResponse.json(progress);
  } catch (error) {
    console.error('[PROGRESS_GET] Unexpected error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      console.error('[PROGRESS_POST] No user ID found');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    console.log('[PROGRESS_POST] Request body:', body);

    const { courseId, lessonId, completed, timeSpent } = body;

    if (!courseId || !lessonId) {
      console.error('[PROGRESS_POST] Missing required fields:', { courseId, lessonId });
      return new NextResponse('Course ID and Lesson ID are required', { status: 400 });
    }

    const now = new Date().toISOString();

    // First, try to get existing progress
    console.log('[PROGRESS_POST] Checking existing progress:', { userId, courseId, lessonId });
    const { data: existingProgress, error: fetchError } = await supabase
      .from('course_progress')
      .select('time_spent')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('lesson_id', lessonId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('[PROGRESS_POST] Error fetching existing progress:', fetchError);
      return new NextResponse('Database Error', { status: 500 });
    }

    // Prepare the data for upsert
    const progressData = {
      user_id: userId,
      course_id: courseId,
      lesson_id: lessonId,
      completed: completed ?? false,
      completed_at: completed ? now : null,
      last_viewed_at: now,
      time_spent: timeSpent 
        ? (existingProgress?.time_spent || 0) + timeSpent 
        : existingProgress?.time_spent || 0
    };

    console.log('[PROGRESS_POST] Upserting progress:', progressData);

    // Upsert the progress
    const { error: upsertError } = await supabase
      .from('course_progress')
      .upsert(progressData, {
        onConflict: 'user_id,course_id,lesson_id'
      });

    if (upsertError) {
      console.error('[PROGRESS_POST] Error upserting progress:', upsertError);
      return new NextResponse('Database Error', { status: 500 });
    }

    console.log('[PROGRESS_POST] Success');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PROGRESS_POST] Unexpected error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 