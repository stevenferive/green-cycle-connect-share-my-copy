
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
import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { EarningsHistoryItem } from '@/pages/PaymentMethods';

interface EarningsHistoryTableProps {
  earnings: EarningsHistoryItem[];
}

const EarningsHistoryTable: React.FC<EarningsHistoryTableProps> = ({ earnings }) => {
  const getStatusIcon = (status: EarningsHistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'under_review':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: EarningsHistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green text-white">Completado</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Pendiente</Badge>;
      case 'under_review':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700">En revisión</Badge>;
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

  const totalEarnings = earnings
    .filter(earning => earning.status === 'completed')
    .reduce((sum, earning) => sum + earning.amount, 0);

  if (earnings.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay cobros registrados</h3>
          <p className="text-muted-foreground">
            Aquí aparecerán los pagos que recibas por tus ventas e intercambios.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Resumen de ganancias */}
      <Card className="bg-green-light/10 border-green-light">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green" />
              <div>
                <p className="text-sm text-muted-foreground">Total cobrado</p>
                <p className="text-2xl font-bold text-green">
                  {formatAmount(totalEarnings)}
                </p>
              </div>
            </div>
            <Badge className="bg-green text-white">
              {earnings.filter(e => e.status === 'completed').length} completados
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de cobros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green" />
            Historial de cobros ({earnings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Producto vendido</TableHead>
                <TableHead>Método de cobro</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earnings.map((earning) => (
                <TableRow key={earning.id}>
                  <TableCell className="font-medium">
                    {formatDate(earning.date)}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="font-medium truncate">{earning.product}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {earning.paymentMethod}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-green">
                    {formatAmount(earning.amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getStatusIcon(earning.status)}
                      {getStatusBadge(earning.status)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsHistoryTable;
