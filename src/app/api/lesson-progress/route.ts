import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const lessonId = searchParams.get('lessonId');

    if (!courseId) {
      return new NextResponse('Course ID is required', { status: 400 });
    }

    let query = supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId);

    if (lessonId) {
      query = query.eq('lesson_id', lessonId);
    }

    const { data: progress, error } = await query;

    if (error) {
      console.error('GET error:', error);
      return new NextResponse('Database Error', { status: 500 });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('GET unexpected error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    console.log('userId value:', userId, 'type:', typeof userId);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { courseId, lessonId, completed, timeSpent } = body;
    console.log('POST body:', body);

    if (!courseId || !lessonId) {
      return new NextResponse('Course ID and Lesson ID are required', { status: 400 });
    }

    const now = new Date().toISOString();

    // First, try to get existing progress
    const { data: existingProgress, error: fetchError } = await supabase
      .from('lesson_progress')
      .select('time_spent')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('lesson_id', lessonId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Fetch error:', fetchError);
      return new NextResponse('Database Error', { status: 500 });
    }

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
    console.log('Upserting progressData:', progressData, 'Types:', {
      user_id: typeof progressData.user_id,
      course_id: typeof progressData.course_id,
      lesson_id: typeof progressData.lesson_id,
      completed: typeof progressData.completed,
      completed_at: typeof progressData.completed_at,
      last_viewed_at: typeof progressData.last_viewed_at,
      time_spent: typeof progressData.time_spent,
    });

    const { error } = await supabase
      .from('lesson_progress')
      .upsert(progressData, {
        onConflict: 'user_id,course_id,lesson_id'
      });

    if (error) {
      console.error('Upsert error:', error, 'Data:', progressData);
      return new NextResponse('Database Error', { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 