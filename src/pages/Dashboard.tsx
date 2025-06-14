
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Package, 
  Heart, 
  MessageCircle, 
  DollarSign,
  Users,
  Leaf,
  Award
} from 'lucide-react';

const Dashboard = () => {
  const stats = {
    totalProducts: 15,
    activeProducts: 8,
    soldProducts: 7,
    totalViews: 1247,
    totalMessages: 89,
    totalFavorites: 156,
    totalEarnings: 2850,
    ecoImpact: 12.5,
    rating: 4.8,
    completedTransactions: 23
  };

  const recentActivity = [
    { id: 1, type: 'sale', description: 'Vendiste "Bicicleta Vintage"', amount: 450, time: '2 horas' },
    { id: 2, type: 'message', description: 'Nuevo mensaje sobre "Lámpara Artesanal"', time: '4 horas' },
    { id: 3, type: 'favorite', description: 'Alguien agregó "Monitor 4K" a favoritos', time: '1 día' },
    { id: 4, type: 'view', description: 'Tu producto "Silla Ergonómica" fue visto 15 veces', time: '2 días' }
  ];

  const monthlyData = [
    { month: 'Ene', sales: 2, earnings: 340 },
    { month: 'Feb', sales: 3, earnings: 520 },
    { month: 'Mar', sales: 4, earnings: 680 },
    { month: 'Abr', sales: 6, earnings: 920 },
    { month: 'May', sales: 8, earnings: 1200 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Resumen de tu actividad en GreenCycle</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeProducts}</div>
                <p className="text-xs text-muted-foreground">
                  de {stats.totalProducts} productos totales
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ganancias Totales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalEarnings}</div>
                <p className="text-xs text-green">
                  +15% desde el mes pasado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visualizaciones</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews}</div>
                <p className="text-xs text-muted-foreground">
                  últimos 30 días
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calificación</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.rating}/5</div>
                <p className="text-xs text-muted-foreground">
                  {stats.completedTransactions} transacciones
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Impacto Ecológico */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green" />
                  Impacto Ecológico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>CO₂ Ahorrado</span>
                      <span className="font-medium">{stats.ecoImpact} kg</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Productos Reutilizados</span>
                      <span className="font-medium">{stats.soldProducts}</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="pt-2">
                    <Badge variant="secondary" className="bg-green/10 text-green">
                      Eco Warrior
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actividad Reciente */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="p-1 bg-muted rounded-full">
                        {activity.type === 'sale' && <DollarSign className="h-3 w-3" />}
                        {activity.type === 'message' && <MessageCircle className="h-3 w-3" />}
                        {activity.type === 'favorite' && <Heart className="h-3 w-3" />}
                        {activity.type === 'view' && <TrendingUp className="h-3 w-3" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">hace {activity.time}</p>
                      </div>
                      {activity.amount && (
                        <span className="text-sm font-medium text-green">
                          +${activity.amount}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance mensual */}
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {monthlyData.map((data, index) => (
                  <div key={data.month} className="text-center space-y-2">
                    <div className="text-sm text-muted-foreground">{data.month}</div>
                    <div 
                      className="bg-green rounded-t mx-auto" 
                      style={{ 
                        height: `${(data.earnings / 1200) * 100}px`,
                        width: '20px'
                      }}
                    />
                    <div className="text-xs">
                      <div className="font-medium">{data.sales} ventas</div>
                      <div className="text-muted-foreground">${data.earnings}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
