
import React, { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as SearchIcon, User, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data para productos
  const products = [
    {
      id: 1,
      name: 'Lámpara Vintage',
      price: '$45.000',
      image: '/lovable-uploads/117c21d0-7e1c-4db0-9d91-dafa39c4f63e.png',
      seller: 'María González'
    },
    {
      id: 2,
      name: 'Juego de Té Clásico',
      price: '$32.000',
      image: '/lovable-uploads/2afc4aac-da4d-48b8-8aec-4b8241e62c0c.png',
      seller: 'Carlos Ruiz'
    }
  ];

  // Mock data para usuarios
  const users = [
    {
      id: 1,
      name: 'María González',
      initials: 'MG',
      bio: 'Coleccionista de antigüedades',
      products: 12
    },
    {
      id: 2,
      name: 'Carlos Ruiz',
      initials: 'CR',
      bio: 'Vendedor de artículos vintage',
      products: 8
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Búsqueda</h1>
          
          {/* Barra de búsqueda */}
          <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos o usuarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabs para productos y usuarios */}
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Productos
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Usuarios
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-green font-bold mb-2">{product.price}</p>
                      <p className="text-sm text-muted-foreground">Por {product.seller}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="mt-6">
              <div className="space-y-4">
                {users.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-green text-white">
                            {user.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{user.bio}</p>
                          <p className="text-xs text-muted-foreground">{user.products} productos</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver perfil
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Search;
