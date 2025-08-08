-- Add youtube_playlist_url field to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS youtube_playlist_url text;

-- Add index for youtube_playlist_url field
CREATE INDEX IF NOT EXISTS idx_courses_youtube_playlist ON public.courses(youtube_playlist_url);
