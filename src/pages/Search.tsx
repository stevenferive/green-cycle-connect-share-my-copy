
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as SearchIcon, User, Package, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/loading';
import { RatingDisplay } from '@/components/ui/rating';
import { Badge } from '@/components/ui/badge';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useUserSearch } from '@/hooks/useUserSearch';
import { UserService } from '@/services/userService';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const { isLoading, executeAsync } = useLoadingState();

  // Hook para búsqueda de usuarios
  const {
    users,
    loading: usersLoading,
    error: usersError,
    startChat,
    startingChat,
    searchUsers: searchUsersFromHook,
    clearResults
  } = useUserSearch();


  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    await executeAsync(async () => {
      if (activeTab === 'users') {
        searchUsersFromHook(searchQuery);
      } else {
        // Simular búsqueda de productos hasta que se implemente
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Buscando productos:', searchQuery);
      }
    });
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    
    // Búsqueda automática para usuarios (con debounce en el hook)
    if (activeTab === 'users' && value.length >= 2) {
      searchUsersFromHook(value);
    } else if (value.length === 0) {
      clearResults();
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'users' && searchQuery.length >= 2) {
      searchUsersFromHook(searchQuery);
    }
  };

  const handleStartChat = async (user: any) => {
    await startChat(user);
  };

  return (
    <div className="h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Búsqueda</h1>
          
          {/* Barra de búsqueda */}
          <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos o usuarios..."
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
            <Button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              size="sm"
              onClick={handleSearch}
              disabled={isLoading || usersLoading}
            >
              {(isLoading || usersLoading) ? <LoadingSpinner size="sm" /> : <SearchIcon className="h-4 w-4" />}
            </Button>
          </div>

          {/* Tabs para productos y usuarios */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              {/* <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Productos
              </TabsTrigger> */}
              <TabsTrigger value="users" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Usuarios
              </TabsTrigger>
            </TabsList>
            
            
            
            <TabsContent value="users" className="mt-6">
              {usersLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner text="Buscando usuarios..." />
                </div>
              ) : usersError ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Error al buscar usuarios</h3>
                  <p className="text-muted-foreground text-sm mb-4">{usersError}</p>
                  <Button onClick={() => searchUsersFromHook(searchQuery)}>
                    Reintentar
                  </Button>
                </div>
              ) : users.length === 0 && searchQuery.length >= 2 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No se encontraron usuarios</h3>
                  <p className="text-muted-foreground text-sm">
                    Intenta con otros términos de búsqueda o verifica la ortografía.
                  </p>
                </div>
              ) : searchQuery.length < 2 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Buscar usuarios</h3>
                  <p className="text-muted-foreground text-sm">
                    Escribe al menos 2 caracteres para buscar usuarios.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <Card key={user._id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            {user.avatar ? (
                              <AvatarImage src={user.avatar} alt={UserService.getUserFullName(user)} />
                            ) : (
                              <AvatarFallback className="bg-green text-white">
                                {UserService.getUserInitials(user)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">
                                {UserService.getUserFullName(user)}
                              </h3>
                              {user.city && (
                                <Badge variant="outline" className="text-xs">
                                  {user.city}
                                </Badge>
                              )}
                            </div>
                            
                            {user.description && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {user.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {user.productsCount !== undefined && (
                                <span>{user.productsCount} productos</span>
                              )}
                              
                              {user.rating && user.reviewsCount && (
                                <RatingDisplay 
                                  rating={user.rating} 
                                  reviews={user.reviewsCount} 
                                  size="sm" 
                                />
                              )}
                            </div>
                            
                            {user.ecoInterests && user.ecoInterests.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {user.ecoInterests.slice(0, 3).map((interest) => (
                                  <Badge key={interest} variant="secondary" className="text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                                {user.ecoInterests.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{user.ecoInterests.length - 3} más
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStartChat(user)}
                              disabled={startingChat}
                            >
                              {startingChat ? (
                                <LoadingSpinner size="sm" />
                              ) : (
                                <>
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  Chat
                                </>
                              )}
                            </Button>
                            
                            <Button variant="ghost" size="sm">
                              Ver perfil
                            </Button>
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

export default Search;
