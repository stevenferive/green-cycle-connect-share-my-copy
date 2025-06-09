
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Building2, Smartphone, Shield } from 'lucide-react';
import { PaymentMethod } from '@/pages/PaymentMethods';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (method: Omit<PaymentMethod, 'id'>) => void;
}

const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [selectedType, setSelectedType] = useState<PaymentMethod['type']>('credit_card');
  const [formData, setFormData] = useState({
    holderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    bankName: '',
    accountNumber: '',
    isDefault: false
  });

  const paymentTypes = [
    {
      value: 'credit_card' as const,
      label: 'Tarjeta de Crédito',
      icon: CreditCard
    },
    {
      value: 'debit_card' as const,
      label: 'Tarjeta de Débito',
      icon: CreditCard
    },
    {
      value: 'bank_account' as const,
      label: 'Cuenta Bancaria',
      icon: Building2
    },
    {
      value: 'digital_wallet' as const,
      label: 'Billetera Digital',
      icon: Smartphone
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMethod: Omit<PaymentMethod, 'id'> = {
      type: selectedType,
      holderName: formData.holderName,
      isDefault: formData.isDefault,
      isVerified: false
    };

    if (selectedType === 'credit_card' || selectedType === 'debit_card') {
      newMethod.lastFour = formData.cardNumber.slice(-4);
      newMethod.expiryMonth = parseInt(formData.expiryMonth);
      newMethod.expiryYear = parseInt(formData.expiryYear);
      newMethod.brand = detectCardBrand(formData.cardNumber);
    } else if (selectedType === 'bank_account') {
      newMethod.bankName = formData.bankName;
      newMethod.accountNumber = `****${formData.accountNumber.slice(-4)}`;
    }

    onAdd(newMethod);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      holderName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      bankName: '',
      accountNumber: '',
      isDefault: false
    });
    setSelectedType('credit_card');
    onClose();
  };

  const detectCardBrand = (cardNumber: string): string => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'unknown';
  };

  const isCardType = selectedType === 'credit_card' || selectedType === 'debit_card';
  const isBankAccount = selectedType === 'bank_account';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green" />
            Agregar Método de Pago
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selector de tipo */}
          <div className="space-y-3">
            <Label>Tipo de método de pago</Label>
            <div className="grid grid-cols-2 gap-2">
              {paymentTypes.map((type) => (
                <Card 
                  key={type.value}
                  className={`cursor-pointer transition-colors ${
                    selectedType === type.value 
                      ? 'ring-2 ring-green bg-green-light/10' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedType(type.value)}
                >
                  <CardContent className="p-3 text-center">
                    <type.icon className="h-6 w-6 mx-auto mb-1 text-green" />
                    <p className="text-xs font-medium">{type.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Nombre del titular */}
          <div className="space-y-2">
            <Label htmlFor="holderName">Nombre del titular *</Label>
            <Input
              id="holderName"
              value={formData.holderName}
              onChange={(e) => setFormData(prev => ({ ...prev, holderName: e.target.value }))}
              placeholder="Nombre completo del titular"
              required
            />
          </div>

          {/* Campos específicos para tarjeta */}
          {isCardType && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Número de tarjeta *</Label>
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="expiryMonth">Mes *</Label>
                  <Select
                    value={formData.expiryMonth}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, expiryMonth: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                          {(i + 1).toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryYear">Año *</Label>
                  <Select
                    value={formData.expiryYear}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, expiryYear: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem key={i} value={(new Date().getFullYear() + i).toString()}>
                          {new Date().getFullYear() + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    value={formData.cvv}
                    onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Campos específicos para cuenta bancaria */}
          {isBankAccount && (
            <>
              <div className="space-y-2">
                <Label htmlFor="bankName">Nombre del banco *</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                  placeholder="Banco Nacional"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Número de cuenta *</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder="123456789"
                  required
                />
              </div>
            </>
          )}

          {/* Mensaje de seguridad */}
          <div className="bg-green-light/10 border border-green-light rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-green">
              <Shield className="h-4 w-4" />
              <span>Tu información está protegida con cifrado de extremo a extremo</span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-green hover:bg-green-dark">
              Agregar método
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentMethodModal;
