import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SellerOrdersContainer from '@/components/products/pendingorders/SellerOrdersContainer';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';

const PendingOrdersPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirigir si no está autenticado
  if (!isAuthenticated || !user?.id) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-muted-foreground mb-4">
                Acceso Restringido
              </h1>
              <p className="text-muted-foreground mb-6">
                Necesitas iniciar sesión para ver tus solicitudes de compra.
              </p>
              <Button 
                onClick={() => navigate('/login')}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header con navegación */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/my-products')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Mis Productos
            </Button>
          </div>

          {/* Título de la página */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Gestión de Órdenes
            </h1>
            <p className="text-muted-foreground">
              Administra todas tus órdenes: pendientes, aprobadas y rechazadas. Puedes aprobar, rechazar o comunicarte con los compradores.
            </p>
          </div>

          {/* Componente de gestión de órdenes */}
          <SellerOrdersContainer sellerId={user.id} />
        </div>
      </main>
    </div>
  );
};

export default PendingOrdersPage; 