-- Thêm cột is_admin vào bảng profiles nếu chưa có
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Tạo function để tự động tạo profile khi user đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo trigger nếu chưa có
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Tạo bảng mã nạp tiền
CREATE TABLE IF NOT EXISTS public.recharge_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  amount_vnd INTEGER NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES public.profiles(id),
  used_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- Tạo bảng số dư người dùng
CREATE TABLE IF NOT EXISTS public.user_balances (
  user_id UUID REFERENCES public.profiles(id) PRIMARY KEY,
  balance_vnd INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo bảng lịch sử giao dịch
CREATE TABLE IF NOT EXISTS public.transaction_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('recharge', 'purchase', 'refund')),
  amount_vnd INTEGER NOT NULL,
  description TEXT,
  reference_id UUID, -- ID của đơn hàng hoặc mã nạp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo function để sử dụng mã nạp tiền
CREATE OR REPLACE FUNCTION public.use_recharge_code(
  p_code VARCHAR(20),
  p_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code_record public.recharge_codes%ROWTYPE;
  v_balance_record public.user_balances%ROWTYPE;
  v_result JSON;
BEGIN
  -- Kiểm tra mã có tồn tại và chưa sử dụng
  SELECT * INTO v_code_record 
  FROM public.recharge_codes 
  WHERE code = p_code AND is_used = FALSE AND expires_at > NOW();
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Mã nạp tiền không hợp lệ hoặc đã hết hạn');
  END IF;
  
  -- Kiểm tra số dư hiện tại của user
  SELECT * INTO v_balance_record 
  FROM public.user_balances 
  WHERE user_id = p_user_id;
  
  -- Nếu chưa có bản ghi balance, tạo mới
  IF NOT FOUND THEN
    INSERT INTO public.user_balances (user_id, balance_vnd)
    VALUES (p_user_id, 0)
    RETURNING * INTO v_balance_record;
  END IF;
  
  -- Cập nhật mã nạp tiền
  UPDATE public.recharge_codes 
  SET is_used = TRUE, used_by = p_user_id, used_at = NOW()
  WHERE id = v_code_record.id;
  
  -- Cập nhật số dư
  UPDATE public.user_balances 
  SET balance_vnd = balance_vnd + v_code_record.amount_vnd,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Thêm lịch sử giao dịch
  INSERT INTO public.transaction_history (user_id, type, amount_vnd, description, reference_id)
  VALUES (p_user_id, 'recharge', v_code_record.amount_vnd, 
          'Nạp tiền bằng mã: ' || p_code, v_code_record.id);
  
  RETURN json_build_object(
    'success', true,
    'amount', v_code_record.amount_vnd,
    'new_balance', v_balance_record.balance_vnd + v_code_record.amount_vnd,
    'message', 'Nạp tiền thành công!'
  );
END;
$$;

-- Tạo function để thanh toán bằng số dư
CREATE OR REPLACE FUNCTION public.pay_with_balance(
  p_user_id UUID,
  p_amount_vnd INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_balance_record public.user_balances%ROWTYPE;
  v_result JSON;
BEGIN
  -- Lấy số dư hiện tại
  SELECT * INTO v_balance_record 
  FROM public.user_balances 
  WHERE user_id = p_user_id;
  
  IF NOT FOUND OR v_balance_record.balance_vnd < p_amount_vnd THEN
    RETURN json_build_object('success', false, 'error', 'Số dư không đủ để thanh toán');
  END IF;
  
  -- Trừ tiền từ số dư
  UPDATE public.user_balances 
  SET balance_vnd = balance_vnd - p_amount_vnd,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Thêm lịch sử giao dịch
  INSERT INTO public.transaction_history (user_id, type, amount_vnd, description)
  VALUES (p_user_id, 'purchase', -p_amount_vnd, 'Thanh toán khóa học');
  
  RETURN json_build_object(
    'success', true,
    'new_balance', v_balance_record.balance_vnd - p_amount_vnd,
    'message', 'Thanh toán thành công!'
  );
END;
$$;

-- Tạo function để tạo mã nạp tiền (cho admin)
CREATE OR REPLACE FUNCTION public.create_recharge_code(
  p_amount_vnd INTEGER,
  p_created_by UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code VARCHAR(20);
  v_code_record public.recharge_codes%ROWTYPE;
BEGIN
  -- Tạo mã ngẫu nhiên 8 ký tự
  v_code := upper(substring(md5(random()::text) from 1 for 8));
  
  -- Đảm bảo mã không trùng
  WHILE EXISTS (SELECT 1 FROM public.recharge_codes WHERE code = v_code) LOOP
    v_code := upper(substring(md5(random()::text) from 1 for 8));
  END LOOP;
  
  -- Tạo mã nạp tiền
  INSERT INTO public.recharge_codes (code, amount_vnd, created_by)
  VALUES (v_code, p_amount_vnd, p_created_by)
  RETURNING * INTO v_code_record;
  
  RETURN json_build_object(
    'success', true,
    'code', v_code_record.code,
    'amount', v_code_record.amount_vnd,
    'message', 'Tạo mã nạp tiền thành công!'
  );
END;
$$;

-- RLS Policies cho recharge_codes
ALTER TABLE public.recharge_codes ENABLE ROW LEVEL SECURITY;

-- Admin có thể xem tất cả mã
CREATE POLICY "Admin can view all recharge codes" ON public.recharge_codes
  FOR SELECT USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE is_admin = TRUE
  ));

-- Admin có thể tạo mã
CREATE POLICY "Admin can create recharge codes" ON public.recharge_codes
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT id FROM public.profiles WHERE is_admin = TRUE
  ));

-- User có thể xem mã đã sử dụng của mình
CREATE POLICY "Users can view their used codes" ON public.recharge_codes
  FOR SELECT USING (used_by = auth.uid());

-- RLS Policies cho user_balances
ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;

-- User chỉ có thể xem số dư của mình
CREATE POLICY "Users can view own balance" ON public.user_balances
  FOR SELECT USING (user_id = auth.uid());

-- Admin có thể xem tất cả số dư
CREATE POLICY "Admin can view all balances" ON public.user_balances
  FOR SELECT USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE is_admin = TRUE
  ));

-- RLS Policies cho transaction_history
ALTER TABLE public.transaction_history ENABLE ROW LEVEL SECURITY;

-- User chỉ có thể xem lịch sử của mình
CREATE POLICY "Users can view own transactions" ON public.transaction_history
  FOR SELECT USING (user_id = auth.uid());

-- Admin có thể xem tất cả lịch sử
CREATE POLICY "Admin can view all transactions" ON public.transaction_history
  FOR SELECT USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE is_admin = TRUE
  ));

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.use_recharge_code TO authenticated;
GRANT EXECUTE ON FUNCTION public.pay_with_balance TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_recharge_code TO authenticated;
