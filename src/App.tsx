
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
      <Route path="/products" element={<Explore />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/about" element={<About />} />
      <Route path="/education" element={<EcoTips />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      
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
      <Route path="/feed" element={
        <ProtectedRoute>
          <Feed />
        </ProtectedRoute>
      } />
      
      {/* Ruta catch-all */}
      <Route path="*" element={<NotFound />} />
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
