-- Seed data for courses
insert into public.courses (slug, title, description, thumbnail_url, level, duration_weeks, price_vnd, instructor)
values
  ('yoga-co-ban','Yoga Cơ Bản','Khóa học dành cho người mới bắt đầu','/images.jpg','Cơ bản',8,999000,'Phạm Diệu Thuý'),
  ('hatha-yoga-nang-cao','Hatha Yoga Nâng Cao','Nâng cao kỹ thuật và thực hành','/download (1).jpg','Nâng cao',12,1499000,'Phạm Diệu Thuý'),
  ('vinyasa-flow','Vinyasa Flow','Yoga động với các chuỗi tư thế linh hoạt','/download (2).jpg','Trung cấp',10,1299000,'Phạm Diệu Thuý')
on conflict (slug) do nothing;


