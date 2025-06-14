
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  DollarSign
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'sale' | 'purchase';
  productName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  buyerSeller: string;
  paymentMethod: string;
}

const TransactionHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      type: 'sale',
      productName: 'Bicicleta Vintage',
      amount: 450,
      date: '2024-06-10',
      status: 'completed',
      buyerSeller: 'María González',
      paymentMethod: 'Transferencia'
    },
    {
      id: 'TXN002',
      type: 'purchase',
      productName: 'Lámpara Artesanal',
      amount: 120,
      date: '2024-06-08',
      status: 'completed',
      buyerSeller: 'Carlos Ruiz',
      paymentMethod: 'Efectivo'
    },
    {
      id: 'TXN003',
      type: 'sale',
      productName: 'Monitor 4K',
      amount: 680,
      date: '2024-06-05',
      status: 'pending',
      buyerSeller: 'Ana Martín',
      paymentMethod: 'Transferencia'
    },
    {
      id: 'TXN004',
      type: 'purchase',
      productName: 'Silla Ergonómica',
      amount: 300,
      date: '2024-06-03',
      status: 'cancelled',
      buyerSeller: 'Pedro López',
      paymentMethod: 'Efectivo'
    },
    {
      id: 'TXN005',
      type: 'sale',
      productName: 'Guitarra Acústica',
      amount: 850,
      date: '2024-05-28',
      status: 'completed',
      buyerSeller: 'Luis Torres',
      paymentMethod: 'Transferencia'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      cancelled: 'destructive'
    } as const;

    const labels = {
      completed: 'Completada',
      pending: 'Pendiente',
      cancelled: 'Cancelada'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    return type === 'sale' ? (
      <ArrowUpRight className="h-4 w-4 text-green" />
    ) : (
      <ArrowDownLeft className="h-4 w-4 text-blue-500" />
    );
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.buyerSeller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const salesTransactions = filteredTransactions.filter(t => t.type === 'sale');
  const purchaseTransactions = filteredTransactions.filter(t => t.type === 'purchase');

  const totalSales = salesTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPurchases = purchaseTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Historial de Transacciones</h1>
              <p className="text-muted-foreground">Revisa todas tus compras y ventas</p>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vendido</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green">${totalSales}</div>
                <p className="text-xs text-muted-foreground">
                  {salesTransactions.filter(t => t.status === 'completed').length} ventas completadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Comprado</CardTitle>
                <ArrowDownLeft className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">${totalPurchases}</div>
                <p className="text-xs text-muted-foreground">
                  {purchaseTransactions.filter(t => t.status === 'completed').length} compras completadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Balance Neto</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalSales - totalPurchases}</div>
                <p className="text-xs text-muted-foreground">
                  diferencia entre ventas y compras
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por producto o persona..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Filtrar por fecha
                  </Button>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Más filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="sales">Ventas</TabsTrigger>
              <TabsTrigger value="purchases">Compras</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Contraparte</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Método de Pago</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(transaction.type)}
                            <span className="capitalize">
                              {transaction.type === 'sale' ? 'Venta' : 'Compra'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.productName}
                        </TableCell>
                        <TableCell>{transaction.buyerSeller}</TableCell>
                        <TableCell>
                          <span className={transaction.type === 'sale' ? 'text-green' : 'text-blue-500'}>
                            {transaction.type === 'sale' ? '+' : '-'}${transaction.amount}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="sales" className="space-y-4">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Comprador</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Método de Pago</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.productName}</TableCell>
                        <TableCell>{transaction.buyerSeller}</TableCell>
                        <TableCell className="text-green">+${transaction.amount}</TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="purchases" className="space-y-4">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Vendedor</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Método de Pago</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.productName}</TableCell>
                        <TableCell>{transaction.buyerSeller}</TableCell>
                        <TableCell className="text-blue-500">-${transaction.amount}</TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default TransactionHistory;
