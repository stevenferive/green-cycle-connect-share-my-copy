
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Plus, 
  Shield, 
  History, 
  DollarSign,
  Lock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import PaymentMethodsList from '@/components/payment/PaymentMethodsList';
import AddPaymentMethodModal from '@/components/payment/AddPaymentMethodModal';
import PaymentHistoryTable from '@/components/payment/PaymentHistoryTable';
import EarningsHistoryTable from '@/components/payment/EarningsHistoryTable';

// Mock data para métodos de pago
const mockPaymentMethods = [
  {
    id: '1',
    type: 'credit_card' as const,
    brand: 'visa',
    lastFour: '1234',
    holderName: 'Juan Pérez',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
    isVerified: true
  },
  {
    id: '2',
    type: 'bank_account' as const,
    bankName: 'Banco Nacional',
    accountNumber: '****5678',
    holderName: 'Juan Pérez',
    isDefault: false,
    isVerified: true
  }
];

// Mock data para historial de pagos
const mockPaymentHistory = [
  {
    id: '1',
    date: new Date('2024-01-15'),
    amount: 25.99,
    product: 'Jabón Artesanal de Lavanda',
    status: 'completed' as const,
    paymentMethod: 'Visa ****1234'
  },
  {
    id: '2',
    date: new Date('2024-01-10'),
    amount: 15.50,
    product: 'Bolsa Reutilizable de Algodón',
    status: 'completed' as const,
    paymentMethod: 'Cuenta Bancaria ****5678'
  }
];

// Mock data para historial de cobros
const mockEarningsHistory = [
  {
    id: '1',
    date: new Date('2024-01-14'),
    amount: 18.75,
    product: 'Maceta de Cerámica Reciclada',
    status: 'completed' as const,
    paymentMethod: 'Transferencia Bancaria'
  },
  {
    id: '2',
    date: new Date('2024-01-12'),
    amount: 12.00,
    product: 'Vela de Cera de Soja',
    status: 'pending' as const,
    paymentMethod: 'PayPal'
  }
];

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'bank_account' | 'digital_wallet';
  brand?: string;
  lastFour?: string;
  holderName: string;
  expiryMonth?: number;
  expiryYear?: number;
  bankName?: string;
  accountNumber?: string;
  isDefault: boolean;
  isVerified: boolean;
}

export interface PaymentHistoryItem {
  id: string;
  date: Date;
  amount: number;
  product: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
}

export interface EarningsHistoryItem {
  id: string;
  date: Date;
  amount: number;
  product: string;
  status: 'completed' | 'pending' | 'under_review';
  paymentMethod: string;
}

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  const handleAddPaymentMethod = (newMethod: Omit<PaymentMethod, 'id'>) => {
    const method: PaymentMethod = {
      ...newMethod,
      id: Date.now().toString()
    };
    setPaymentMethods(prev => [...prev, method]);
    setIsAddModalOpen(false);
    toast({
      title: "Método de pago agregado",
      description: "El método de pago ha sido agregado exitosamente",
    });
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    );
    toast({
      title: "Método principal actualizado",
      description: "El método de pago ha sido marcado como principal",
    });
  };

  const handleDeleteMethod = (methodId: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
    toast({
      title: "Método de pago eliminado",
      description: "El método de pago ha sido eliminado correctamente",
    });
  };

  const hasPaymentMethods = paymentMethods.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-green" />
              <h1 className="text-2xl font-bold">Métodos de Pago</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-green" />
              <span>Conexión segura</span>
            </div>
          </div>

          {/* Mensaje de seguridad */}
          <Card className="mb-6 border-green-light bg-green-light/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-green" />
                <div>
                  <p className="text-sm font-medium text-green">Seguridad garantizada</p>
                  <p className="text-xs text-muted-foreground">
                    Todos tus datos están protegidos con cifrado de extremo a extremo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contenido principal */}
          {!hasPaymentMethods ? (
            /* Estado vacío */
            <Card className="text-center py-12">
              <CardContent>
                <CreditCard className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes métodos de pago configurados</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Aún no tienes métodos de pago configurados. Agrega uno para empezar a comprar o recibir cobros de forma segura.
                </p>
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-green hover:bg-green-dark"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar método de pago
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Contenido con métodos */
            <Tabs defaultValue="methods" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="methods" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Métodos de Pago
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Mis Pagos
                </TabsTrigger>
                <TabsTrigger value="earnings" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Mis Cobros
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="methods" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Tus métodos de pago</h2>
                  <Button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-green hover:bg-green-dark"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar método
                  </Button>
                </div>
                <PaymentMethodsList 
                  methods={paymentMethods}
                  onSetDefault={handleSetDefault}
                  onDelete={handleDeleteMethod}
                />
              </TabsContent>
              
              <TabsContent value="payments" className="mt-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Historial de pagos</h2>
                  <p className="text-muted-foreground">
                    Todos los pagos realizados en la plataforma
                  </p>
                </div>
                <PaymentHistoryTable payments={mockPaymentHistory} />
              </TabsContent>
              
              <TabsContent value="earnings" className="mt-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Historial de cobros</h2>
                  <p className="text-muted-foreground">
                    Pagos recibidos por tus ventas e intercambios
                  </p>
                </div>
                <EarningsHistoryTable earnings={mockEarningsHistory} />
              </TabsContent>
            </Tabs>
          )}

          {/* Modal para agregar método de pago */}
          <AddPaymentMethodModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddPaymentMethod}
          />
        </div>
      </main>
    </div>
  );
};

export default PaymentMethods;
