
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { ProfileFormData } from '@/hooks/useProfileForm';

interface ProfileAvatarProps {
  formData: ProfileFormData;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  formData,
  isEditing,
  onInputChange
}) => {
  return (
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
              onChange={(e) => onInputChange('firstName', e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
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
              onChange={(e) => onInputChange('email', e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileAvatar;
