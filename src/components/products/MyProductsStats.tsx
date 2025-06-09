
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
  id: string;
  status: 'active' | 'paused' | 'out_of_stock';
  views: number;
  favorites: number;
}

interface MyProductsStatsProps {
  products: Product[];
}

const MyProductsStats: React.FC<MyProductsStatsProps> = ({ products }) => {
  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalViews = products.reduce((sum, p) => sum + p.views, 0);
  const totalFavorites = products.reduce((sum, p) => sum + p.favorites, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-green">{products.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Activos</p>
              <p className="text-2xl font-bold text-green">{activeProducts}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Visualizaciones</p>
              <p className="text-2xl font-bold text-green">{totalViews}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Favoritos</p>
              <p className="text-2xl font-bold text-green">{totalFavorites}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProductsStats;
