import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function PasswordResetHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handlePasswordReset = async () => {
      const token = searchParams.get("token");
      const type = searchParams.get("type");
      
      console.log("Password reset handler - URL params:", { 
        token, 
        type, 
        allParams: Object.fromEntries(searchParams) 
      });

      if (!token || type !== "recovery") {
        console.log("Invalid token or type");
        toast.error("Link đặt lại mật khẩu không hợp lệ");
        navigate("/forgot-password");
        return;
      }

      try {
        console.log("Attempting to verify token:", token);
        
        // Try different methods to verify the token
        let verificationResult = null;
        
        // Method 1: Try verifyOtp
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery'
          });
          
          if (!error) {
            console.log("verifyOtp succeeded:", data);
            verificationResult = { success: true, data, method: 'verifyOtp' };
          } else {
            console.log("verifyOtp failed:", error);
          }
        } catch (err) {
          console.log("verifyOtp error:", err);
        }

        // Method 2: Try exchangeCodeForSession if verifyOtp failed
        if (!verificationResult) {
          try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(token);
            
            if (!error) {
              console.log("exchangeCodeForSession succeeded:", data);
              verificationResult = { success: true, data, method: 'exchangeCodeForSession' };
            } else {
              console.log("exchangeCodeForSession failed:", error);
            }
          } catch (err) {
            console.log("exchangeCodeForSession error:", err);
          }
        }

        // Method 3: Try direct API call
        if (!verificationResult) {
          try {
            const response = await fetch(`https://wsqarzjsojdjcfgurabx.supabase.co/auth/v1/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzcWFyenNvc2pkamNmZ3VyYWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NzQ4NzEsImV4cCI6MjA0OTE1MDg3MX0.8K525e8K525e8K525e8K525e8K525e8K525e8K525e8K525e'
              },
              body: JSON.stringify({
                token_hash: token,
                type: 'recovery'
              })
            });

            const result = await response.json();
            console.log("Direct API call result:", result);
            
            if (response.ok) {
              verificationResult = { success: true, data: result, method: 'directAPI' };
            }
          } catch (err) {
            console.log("Direct API call error:", err);
          }
        }

        if (verificationResult) {
          console.log("Token verification successful with method:", verificationResult.method);
          toast.success("Token hợp lệ, chuyển đến trang đặt mật khẩu");
          navigate("/reset-password?verified=true");
        } else {
          console.log("All verification methods failed");
          toast.error("Token không hợp lệ hoặc đã hết hạn");
          navigate("/forgot-password");
        }

      } catch (error) {
        console.error("Error in password reset handler:", error);
        toast.error("Có lỗi xảy ra khi xử lý link đặt lại mật khẩu");
        navigate("/forgot-password");
      }
    };

    handlePasswordReset();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang xử lý link đặt lại mật khẩu...</p>
      </div>
    </div>
  );
}
