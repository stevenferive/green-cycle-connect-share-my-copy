
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle, Clock, XCircle, ArrowUpRight } from 'lucide-react';
import { PaymentHistoryItem } from '@/pages/PaymentMethods';

interface PaymentHistoryTableProps {
  payments: PaymentHistoryItem[];
}

const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({ payments }) => {
  const getStatusIcon = (status: PaymentHistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: PaymentHistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green text-white">Completado</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">En proceso</Badge>;
      case 'failed':
        return <Badge variant="destructive">Fallido</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <ArrowUpRight className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay pagos realizados</h3>
          <p className="text-muted-foreground">
            Aquí aparecerán todos los pagos que realices en la plataforma.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpRight className="h-5 w-5 text-green" />
          Pagos realizados ({payments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Método de pago</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">
                  {formatDate(payment.date)}
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="font-medium truncate">{payment.product}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {payment.paymentMethod}
                  </span>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatAmount(payment.amount)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {getStatusIcon(payment.status)}
                    {getStatusBadge(payment.status)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PaymentHistoryTable;
