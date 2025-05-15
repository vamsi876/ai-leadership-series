-- First, let's check the existing table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'course_progress';

-- If we need to add any missing columns, we can do it safely:
DO $$ 
BEGIN
    -- Add time_spent column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'course_progress' 
        AND column_name = 'time_spent'
    ) THEN
        ALTER TABLE course_progress 
        ADD COLUMN time_spent integer DEFAULT 0;
    END IF;

    -- Add completed_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'course_progress' 
        AND column_name = 'completed_at'
    ) THEN
        ALTER TABLE course_progress 
        ADD COLUMN completed_at timestamp with time zone;
    END IF;

    -- Add last_viewed_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'course_progress' 
        AND column_name = 'last_viewed_at'
    ) THEN
        ALTER TABLE course_progress 
        ADD COLUMN last_viewed_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
    -- Index for user_id
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_indexes 
        WHERE tablename = 'course_progress' 
        AND indexname = 'course_progress_user_id_idx'
    ) THEN
        CREATE INDEX course_progress_user_id_idx ON course_progress(user_id);
    END IF;

    -- Index for course_id
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_indexes 
        WHERE tablename = 'course_progress' 
        AND indexname = 'course_progress_course_id_idx'
    ) THEN
        CREATE INDEX course_progress_course_id_idx ON course_progress(course_id);
    END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- Create or replace the RLS policy
DROP POLICY IF EXISTS "Users can only access their own progress" ON course_progress;
CREATE POLICY "Users can only access their own progress"
    ON course_progress
    FOR ALL
    USING (auth.uid() = user_id); 