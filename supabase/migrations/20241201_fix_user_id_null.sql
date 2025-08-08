-- Fix user_id null issue in recharge functions
-- Cập nhật function use_recharge_code để kiểm tra user_id
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
  -- Kiểm tra user_id có hợp lệ
  IF p_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Không thể xác định người dùng');
  END IF;

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

-- Cập nhật function pay_with_balance để kiểm tra user_id
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
  -- Kiểm tra user_id có hợp lệ
  IF p_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Không thể xác định người dùng');
  END IF;

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
    'amount', p_amount_vnd,
    'new_balance', v_balance_record.balance_vnd - p_amount_vnd,
    'message', 'Thanh toán thành công!'
  );
END;
$$;
