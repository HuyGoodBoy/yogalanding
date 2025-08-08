-- Create storage bucket for course images
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-images', 'course-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for course images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'course-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'course-images' 
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own uploads
CREATE POLICY "Users can update own uploads" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'course-images' 
  AND auth.role() = 'authenticated'
);
