
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  MapPin, 
  Save, 
  X, 
  Trash2,
  Leaf,
  Heart,
  Globe
} from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Estados para el formulario
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    city: '',
    country: '',
    description: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      twitter: '',
      website: ''
    }
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const ecoInterests = [
    'Agricultura orgánica',
    'Reciclaje y upcycling',
    'Cosmética natural',
    'Trueque e intercambio',
    'Compostaje',
    'Energías renovables',
    'Moda sostenible',
    'Alimentación vegana',
    'Permacultura',
    'Zero waste',
    'Productos artesanales',
    'Medicina natural'
  ];

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'socialLinks') {
        setFormData(prev => ({
          ...prev,
          socialLinks: {
            ...prev.socialLinks,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    console.log('Guardando cambios:', { ...formData, interests: selectedInterests });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Resetear los datos del formulario
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      city: '',
      country: '',
      description: '',
      socialLinks: {
        instagram: '',
        facebook: '',
        twitter: '',
        website: ''
      }
    });
    setSelectedInterests([]);
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    // Aquí iría la lógica para eliminar la cuenta
    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-green mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground mb-6">
            Gestiona tu información personal y preferencias ecológicas
          </p>

          {/* Mensaje motivacional */}
          <Card className="mb-6 bg-gradient-to-r from-green/10 to-earth/10 border-green/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Leaf className="h-6 w-6 text-green" />
                <p className="text-sm text-foreground">
                  "Cada pequeña acción cuenta. Tu perfil es el reflejo de tu compromiso con un futuro más sostenible. 🌱"
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Información básica y foto de perfil */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Foto de Perfil</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="h-32 w-32 mx-auto">
                      <AvatarFallback className="bg-green text-white text-2xl">
                        {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button 
                        size="sm" 
                        className="absolute bottom-0 right-0 rounded-full bg-green hover:bg-green/90"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Información detallada */}
            <div className="md:col-span-2 space-y-6">
              {/* Ubicación */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green" />
                    Ubicación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Ej: Barcelona"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">País</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Ej: España"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Descripción personal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-green" />
                    Sobre mí
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="description">Descripción personal</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Ej: Amante de la permacultura y el intercambio de productos artesanales..."
                    className="mt-1 min-h-[100px]"
                  />
                </CardContent>
              </Card>

              {/* Intereses ecológicos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green" />
                    Intereses Ecológicos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ecoInterests.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          checked={selectedInterests.includes(interest)}
                          onCheckedChange={() => handleInterestToggle(interest)}
                          disabled={!isEditing}
                        />
                        <Label 
                          htmlFor={interest}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {interest}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Redes sociales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-green" />
                    Redes Sociales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={formData.socialLinks.instagram}
                        onChange={(e) => handleInputChange('socialLinks.instagram', e.target.value)}
                        disabled={!isEditing}
                        placeholder="@usuario"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={formData.socialLinks.facebook}
                        onChange={(e) => handleInputChange('socialLinks.facebook', e.target.value)}
                        disabled={!isEditing}
                        placeholder="facebook.com/usuario"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter/X</Label>
                      <Input
                        id="twitter"
                        value={formData.socialLinks.twitter}
                        onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                        disabled={!isEditing}
                        placeholder="@usuario"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Sitio Web</Label>
                      <Input
                        id="website"
                        value={formData.socialLinks.website}
                        onChange={(e) => handleInputChange('socialLinks.website', e.target.value)}
                        disabled={!isEditing}
                        placeholder="www.ejemplo.com"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Botones de acción */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3 justify-between">
                    <div className="flex gap-3">
                      {!isEditing ? (
                        <Button 
                          onClick={() => setIsEditing(true)}
                          className="bg-green hover:bg-green/90"
                        >
                          Editar Perfil
                        </Button>
                      ) : (
                        <>
                          <Button 
                            onClick={handleSave}
                            className="bg-green hover:bg-green/90"
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Guardar Cambios
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={handleCancel}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancelar
                          </Button>
                        </>
                      )}
                    </div>
                    
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      className="ml-auto"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar Cuenta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
