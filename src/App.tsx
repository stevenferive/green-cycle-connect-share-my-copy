import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { CartProvider } from "@/contexts/CartContext";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import Index from "@/pages/Index";
import Explore from "@/pages/Explore";
import Categories from "@/pages/Categories";
import About from "@/pages/About";
import EcoTips from "@/pages/EcoTips";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
// import NotFound from "@/pages/NotFound";
import ProductDetail from "@/pages/ProductDetail";
// import Feed from "@/pages/Feed";
import Search from "@/pages/Search";
import SimpleChats from "@/pages/SimpleChats";
import Menu from "@/pages/Menu";
// import Settings from "@/pages/Settings";
import Cart from "@/pages/Cart";
import Orders from "@/pages/Orders";
import Profile from "@/pages/Profile";
import MyProducts from "@/pages/MyProducts";
import PendingOrdersPage from "@/pages/PendingOrdersPage";
// import Favorites from "@/pages/Favorites";
// import Notifications from "@/pages/Notifications";
// import PaymentMethods from "@/pages/PaymentMethods";
// import PrivacySecurity from "@/pages/PrivacySecurity";
import HelpSupport from "@/pages/HelpSupport";
// import Locations from "@/pages/Locations";
// import Dashboard from "@/pages/Dashboard";
// import TransactionHistory from "@/pages/TransactionHistory";
// import Reviews from "@/pages/Reviews";

const queryClient = new QueryClient();

// Componente de carga con animación de ola
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Imagen con animación de flotación */}
        <div className="animate-bounce">
          <img 
            src="/leaf.png" 
            alt="Leaf" 
            className="w-16 h-16 mx-auto drop-shadow-lg"
          />
        </div>
        
        {/* Texto de carga */}
        <p className="text-green-700 font-medium text-lg mb-4">Cargando...</p>
        
        {/* Animación de ola */}
        <div className="flex justify-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
        </div>
      </div>
    </div>
  );
};

// Componente para rutas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
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
    return <LoadingSpinner />;
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
      
      {/* Producto individual - disponible para todos */}
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
      {/* <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } /> */}
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
      <Route path="/orders" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />
      <Route path="/chats" element={
        <ProtectedRoute>
          <SimpleChats />
        </ProtectedRoute>
      } />
      <Route path="/menu" element={
        <ProtectedRoute>
          <Menu />
        </ProtectedRoute>
      } />
      {/* <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } /> */}
      {/* <Route path="/notifications" element={
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      } /> */}
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
      <Route path="/pending-orders" element={
        <ProtectedRoute>
          <PendingOrdersPage />
        </ProtectedRoute>
      } />
      {/* <Route path="/favorites" element={
        <ProtectedRoute>
          <Favorites />
        </ProtectedRoute>
      } /> */}
      {/* <Route path="/locations" element={
        <ProtectedRoute>
          <Locations />
        </ProtectedRoute>
      } /> */}
      {/* <Route path="/transaction-history" element={
        <ProtectedRoute>
          <TransactionHistory />
        </ProtectedRoute>
      } /> */}
      {/* <Route path="/reviews" element={
        <ProtectedRoute>
          <Reviews />
        </ProtectedRoute>
      } /> */}
      {/* <Route path="/payment-methods" element={
        <ProtectedRoute>
          <PaymentMethods />
        </ProtectedRoute>
      } /> */}
      {/* <Route path="/privacy-security" element={
        <ProtectedRoute>
          <PrivacySecurity />
        </ProtectedRoute>
      } /> */}
      <Route path="/help-support" element={
        <ProtectedRoute>
          <HelpSupport />
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
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
