import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseDetail from "./pages/CourseDetail";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ForgotPassword from "./pages/ForgotPassword";
import AuthCallback from "./pages/AuthCallback";
import Cart from "./pages/Cart";
import Payment from './pages/Payment'
import PaymentSuccess from './pages/PaymentSuccess'
import TestPayment from './pages/TestPayment'
import MockVNPay from './pages/MockVNPay'
import TestQRCode from './pages/TestQRCode'
import Recharge from './pages/Recharge'
import Admin from './pages/Admin'
import SubscriptionPayment from './pages/SubscriptionPayment'
import TransactionHistory from './pages/TransactionHistory'
import MyCourses from './pages/MyCourses'
import PaymentManual from './pages/PaymentManual'
import CreateCourse from './pages/CreateCourse'
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/course/:slug" element={<CourseDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment/:orderId" element={<Payment />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                        <Route path="/test-payment" element={<TestPayment />} />
        <Route path="/mock-vnpay" element={<MockVNPay />} />
        <Route path="/test-qr" element={<TestQRCode />} />
        <Route path="/recharge" element={<Recharge />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/subscription-payment" element={<SubscriptionPayment />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/payment-manual" element={<PaymentManual />} />
        <Route path="/create-course" element={<CreateCourse />} />

                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<Help />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </TooltipProvider>
        </QueryClientProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
