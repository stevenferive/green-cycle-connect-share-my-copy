
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Feed = () => {
  // Mock data para las publicaciones
  const posts = [
    {
      id: 1,
      user: 'María González',
      userInitials: 'MG',
      time: '2h',
      content: '¡Acabo de encontrar esta increíble lámpara vintage! Perfecta para mi nueva oficina 🏠✨',
      image: '/lovable-uploads/117c21d0-7e1c-4db0-9d91-dafa39c4f63e.png',
      likes: 24,
      comments: 8
    },
    {
      id: 2,
      user: 'Carlos Ruiz',
      userInitials: 'CR',
      time: '4h',
      content: 'Miren este hermoso juego de té que conseguí. ¡Es perfecto para las tardes de lluvia! ☕',
      image: '/lovable-uploads/2afc4aac-da4d-48b8-8aec-4b8241e62c0c.png',
      likes: 18,
      comments: 5
    },
    {
      id: 3,
      user: 'Ana Torres',
      userInitials: 'AT',
      time: '6h',
      content: '¿Alguien sabe dónde puedo encontrar muebles vintage como este? Me encanta el estilo retro 🎨',
      image: '/lovable-uploads/3763f33a-0698-4904-89db-fd16ba50b297.png',
      likes: 31,
      comments: 12
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Feed Principal</h1>
        
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="w-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-green text-white">
                      {post.userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{post.user}</p>
                    <p className="text-xs text-muted-foreground">{post.time}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="mb-4 text-sm">{post.content}</p>
                
                {post.image && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={post.image} 
                      alt="Post content" 
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{post.likes}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{post.comments}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Feed;
