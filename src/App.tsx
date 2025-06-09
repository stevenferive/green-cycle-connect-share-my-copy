
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import Index from "@/pages/Index";
import Explore from "@/pages/Explore";
import Categories from "@/pages/Categories";
import About from "@/pages/About";
import EcoTips from "@/pages/EcoTips";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import ProductDetail from "@/pages/ProductDetail";
import Feed from "@/pages/Feed";
import Search from "@/pages/Search";
import Chats from "@/pages/Chats";
import Menu from "@/pages/Menu";
import Cart from "@/pages/Cart";
import Profile from "@/pages/Profile";
import MyProducts from "@/pages/MyProducts";
import Favorites from "@/pages/Favorites";
import Notifications from "@/pages/Notifications";
import PaymentMethods from "@/pages/PaymentMethods";

const queryClient = new QueryClient();

// Componente para rutas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Cargando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
};

// Componente para rutas públicas (redirige si ya está autenticado)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Cargando...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/explore" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Index />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/about" element={<About />} />
      <Route path="/education" element={<EcoTips />} />
      
      {/* Rutas de autenticación */}

      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      {/* Rutas protegidas (requieren autenticación) */}
      <Route path="/explore" element={
        <ProtectedRoute>
          <Explore />
        </ProtectedRoute>
      } />
      <Route path="/search" element={
        <ProtectedRoute>
          <Search />
        </ProtectedRoute>
      } />
      <Route path="/cart" element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      } />
      <Route path="/chats" element={
        <ProtectedRoute>
          <Chats />
        </ProtectedRoute>
      } />
      <Route path="/menu" element={
        <ProtectedRoute>
          <Menu />
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/my-products" element={
        <ProtectedRoute>
          <MyProducts />
        </ProtectedRoute>
      } />
      <Route path="/favorites" element={
        <ProtectedRoute>
          <Favorites />
        </ProtectedRoute>
      } />
      <Route path="/payment-methods" element={
        <ProtectedRoute>
          <PaymentMethods />
        </ProtectedRoute>
      } />
      
      {/* Redirigir cualquier otra ruta a /explore si está autenticado, o a /login si no lo está */}
      <Route path="*" element={
        <ProtectedRoute>
          <Navigate to="/explore" replace />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
