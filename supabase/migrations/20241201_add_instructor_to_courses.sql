-- Add instructor field to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS instructor text DEFAULT 'Phạm Diệu Thuý';

-- Update all existing courses to have Phạm Diệu Thuý as instructor
UPDATE public.courses 
SET instructor = 'Phạm Diệu Thuý' 
WHERE instructor IS NULL OR instructor != 'Phạm Diệu Thuý';

-- Add index for instructor field
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON public.courses(instructor);
