
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoadingState } from '@/hooks/useLoadingState';
import { LoadingSpinner } from '@/components/ui/loading';
import { MapPin, Plus, Edit2, Trash2, Navigation } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const Locations = () => {
  const [locations, setLocations] = useState<Location[]>([
    {
      id: '1',
      name: 'Casa',
      address: 'Av. Libertador 1234',
      city: 'Buenos Aires',
      state: 'CABA',
      zipCode: '1425',
      isDefault: true,
      coordinates: { lat: -34.6037, lng: -58.3816 }
    },
    {
      id: '2',
      name: 'Trabajo',
      address: 'Av. Corrientes 5678',
      city: 'Buenos Aires',
      state: 'CABA',
      zipCode: '1414',
      isDefault: false,
      coordinates: { lat: -34.6037, lng: -58.3816 }
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const { isLoading, executeAsync } = useLoadingState();

  const handleAddLocation = async () => {
    await executeAsync(async () => {
      const location: Location = {
        id: Date.now().toString(),
        ...newLocation,
        isDefault: locations.length === 0
      };
      setLocations(prev => [...prev, location]);
      setNewLocation({ name: '', address: '', city: '', state: '', zipCode: '' });
      setIsAddDialogOpen(false);
    });
  };

  const handleDeleteLocation = async (locationId: string) => {
    await executeAsync(async () => {
      setLocations(prev => prev.filter(loc => loc.id !== locationId));
    });
  };

  const handleSetDefault = async (locationId: string) => {
    await executeAsync(async () => {
      setLocations(prev => prev.map(loc => ({
        ...loc,
        isDefault: loc.id === locationId
      })));
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Ubicación actual:', position.coords);
          // Aquí podrías usar la API de geocodificación para obtener la dirección
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Mis Ubicaciones</h1>
              <p className="text-muted-foreground">Gestiona tus direcciones para facilitar las transacciones</p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green hover:bg-green-dark">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Ubicación
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Agregar Nueva Ubicación</DialogTitle>
                  <DialogDescription>
                    Agrega una nueva dirección para tus transacciones
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre de la ubicación</Label>
                    <Input
                      id="name"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Casa, Trabajo, etc."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={newLocation.address}
                      onChange={(e) => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Calle y número"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        value={newLocation.city}
                        onChange={(e) => setNewLocation(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Ciudad"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="state">Provincia</Label>
                      <Input
                        id="state"
                        value={newLocation.state}
                        onChange={(e) => setNewLocation(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="Provincia"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="zipCode">Código Postal</Label>
                    <Input
                      id="zipCode"
                      value={newLocation.zipCode}
                      onChange={(e) => setNewLocation(prev => ({ ...prev, zipCode: e.target.value }))}
                      placeholder="Código postal"
                    />
                  </div>
                  <Button variant="outline" onClick={getCurrentLocation} className="w-full">
                    <Navigation className="mr-2 h-4 w-4" />
                    Usar ubicación actual
                  </Button>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddLocation} disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Agregar'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {locations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tienes ubicaciones guardadas</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Agrega tus direcciones frecuentes para facilitar las transacciones
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {locations.map((location) => (
                <Card key={location.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-green/10 rounded-lg">
                          <MapPin className="h-5 w-5 text-green" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{location.name}</h3>
                            {location.isDefault && (
                              <Badge variant="secondary" className="bg-green/10 text-green">
                                Principal
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {location.address}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {location.city}, {location.state} {location.zipCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!location.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(location.id)}
                          >
                            Establecer como principal
                          </Button>
                        )}
                        <Button variant="ghost" size="icon">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteLocation(location.id)}
                          disabled={location.isDefault}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Locations;
