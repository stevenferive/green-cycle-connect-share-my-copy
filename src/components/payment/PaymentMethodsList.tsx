
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  CreditCard, 
  MoreVertical, 
  Star, 
  CheckCircle, 
  AlertCircle,
  Building2,
  Smartphone
} from 'lucide-react';
import { PaymentMethod } from '@/pages/PaymentMethods';

interface PaymentMethodsListProps {
  methods: PaymentMethod[];
  onSetDefault: (methodId: string) => void;
  onDelete: (methodId: string) => void;
}

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({
  methods,
  onSetDefault,
  onDelete
}) => {
  const getPaymentIcon = (type: PaymentMethod['type'], brand?: string) => {
    switch (type) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="h-5 w-5" />;
      case 'bank_account':
        return <Building2 className="h-5 w-5" />;
      case 'digital_wallet':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getBrandColor = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return 'text-blue-600';
      case 'mastercard':
        return 'text-red-500';
      case 'amex':
        return 'text-blue-500';
      default:
        return 'text-green';
    }
  };

  const getTypeLabel = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'credit_card':
        return 'Tarjeta de Crédito';
      case 'debit_card':
        return 'Tarjeta de Débito';
      case 'bank_account':
        return 'Cuenta Bancaria';
      case 'digital_wallet':
        return 'Billetera Digital';
      default:
        return 'Método de Pago';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {methods.map((method) => (
        <Card key={method.id} className="relative">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${getBrandColor(method.brand)}`}>
                  {getPaymentIcon(method.type, method.brand)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      {method.brand ? method.brand.toUpperCase() : getTypeLabel(method.type)}
                    </h3>
                    {method.isDefault && (
                      <Badge variant="secondary" className="bg-green-light text-green">
                        <Star className="h-3 w-3 mr-1" />
                        Principal
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {method.lastFour && `**** ${method.lastFour}`}
                    {method.accountNumber && method.accountNumber}
                  </p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!method.isDefault && (
                    <DropdownMenuItem onClick={() => onSetDefault(method.id)}>
                      <Star className="mr-2 h-4 w-4" />
                      Marcar como principal
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => onDelete(method.id)}
                    className="text-destructive"
                  >
                    Eliminar método
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Titular:</span>
                <span className="text-sm font-medium">{method.holderName}</span>
              </div>
              
              {method.expiryMonth && method.expiryYear && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vencimiento:</span>
                  <span className="text-sm font-medium">
                    {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                  </span>
                </div>
              )}
              
              {method.bankName && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Banco:</span>
                  <span className="text-sm font-medium">{method.bankName}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estado:</span>
                <div className="flex items-center gap-1">
                  {method.isVerified ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green" />
                      <span className="text-sm text-green">Verificado</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 text-yellow-500" />
                      <span className="text-sm text-yellow-500">Pendiente</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PaymentMethodsList;
