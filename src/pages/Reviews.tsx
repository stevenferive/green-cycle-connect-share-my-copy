
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Rating, RatingDisplay } from '@/components/ui/rating';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Flag,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Review {
  id: string;
  type: 'received' | 'given';
  rating: number;
  comment: string;
  date: string;
  reviewer: {
    name: string;
    avatar?: string;
  };
  product: {
    name: string;
    image?: string;
  };
  helpful: number;
  reported: boolean;
}

const Reviews = () => {
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      type: 'received',
      rating: 5,
      comment: 'Excelente vendedor, producto en perfectas condiciones como se describía. Comunicación fluida y entrega puntual. ¡Muy recomendado!',
      date: '2024-06-10',
      reviewer: { name: 'María González' },
      product: { name: 'Bicicleta Vintage' },
      helpful: 3,
      reported: false
    },
    {
      id: '2',
      type: 'received',
      rating: 4,
      comment: 'Buen producto, llegó en buenas condiciones. Solo tardó un poco más de lo esperado en la entrega.',
      date: '2024-06-08',
      reviewer: { name: 'Carlos Ruiz' },
      product: { name: 'Lámpara Artesanal' },
      helpful: 1,
      reported: false
    },
    {
      id: '3',
      type: 'given',
      rating: 5,
      comment: 'Vendedor muy profesional, el monitor estaba impecable. Exactamente lo que buscaba.',
      date: '2024-06-05',
      reviewer: { name: 'Ana Martín' },
      product: { name: 'Monitor 4K' },
      helpful: 2,
      reported: false
    },
    {
      id: '4',
      type: 'received',
      rating: 3,
      comment: 'El producto está bien pero tenía algunos detalles que no se mencionaron en la descripción.',
      date: '2024-06-03',
      reviewer: { name: 'Pedro López' },
      product: { name: 'Silla Ergonómica' },
      helpful: 0,
      reported: false
    }
  ]);

  const averageRating = reviews
    .filter(r => r.type === 'received')
    .reduce((sum, r) => sum + r.rating, 0) / reviews.filter(r => r.type === 'received').length;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.type === 'received' && r.rating === rating).length,
    percentage: (reviews.filter(r => r.type === 'received' && r.rating === rating).length / reviews.filter(r => r.type === 'received').length) * 100
  }));

  const receivedReviews = reviews.filter(r => r.type === 'received');
  const givenReviews = reviews.filter(r => r.type === 'given');

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Reseñas y Calificaciones</h1>
            <p className="text-muted-foreground">Gestiona las reseñas recibidas y dadas</p>
          </div>

          {/* Rating Summary */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                  <RatingDisplay rating={averageRating} reviews={receivedReviews.length} size="lg" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Basado en {receivedReviews.length} reseñas recibidas
                  </p>
                </div>
                
                <div className="space-y-2">
                  {ratingDistribution.map((dist) => (
                    <div key={dist.rating} className="flex items-center gap-3">
                      <span className="text-sm w-8">{dist.rating}</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full transition-all"
                          style={{ width: `${dist.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{dist.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Tabs */}
          <Tabs defaultValue="received" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="received">
                Recibidas ({receivedReviews.length})
              </TabsTrigger>
              <TabsTrigger value="given">
                Dadas ({givenReviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="received" className="space-y-4">
              {receivedReviews.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tienes reseñas aún</h3>
                    <p className="text-muted-foreground text-center">
                      Las reseñas aparecerán aquí cuando completes tus primeras ventas
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {receivedReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {review.reviewer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{review.reviewer.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  sobre {review.product.name}
                                </p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Flag className="mr-2 h-4 w-4" />
                                    Reportar reseña
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Rating value={review.rating} readonly size="sm" />
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <p className="text-sm">{review.comment}</p>
                            
                            <div className="flex items-center gap-4 pt-2">
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="mr-1 h-3 w-3" />
                                Útil ({review.helpful})
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="given" className="space-y-4">
              {givenReviews.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Star className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No has dado reseñas aún</h3>
                    <p className="text-muted-foreground text-center">
                      Compra productos y ayuda a otros usuarios con tus reseñas
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {givenReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {review.reviewer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Tu reseña para {review.reviewer.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  sobre {review.product.name}
                                </p>
                              </div>
                              <Badge variant="secondary">Publicada</Badge>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Rating value={review.rating} readonly size="sm" />
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <p className="text-sm">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Reviews;
