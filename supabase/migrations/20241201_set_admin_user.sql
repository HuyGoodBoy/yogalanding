-- Set user as admin (thay YOUR_EMAIL bằng email của user muốn set làm admin)
UPDATE public.profiles 
SET is_admin = TRUE 
WHERE email = 'giahuy31639801@gmail.com';

-- Hoặc có thể set bằng user ID
-- UPDATE public.profiles 
-- SET is_admin = TRUE 
-- WHERE id = 'your-user-id-here';
