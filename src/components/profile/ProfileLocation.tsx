
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { ProfileFormData } from '@/hooks/useProfileForm';

interface ProfileLocationProps {
  formData: ProfileFormData;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

const ProfileLocation: React.FC<ProfileLocationProps> = ({
  formData,
  isEditing,
  onInputChange
}) => {
  return (
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
              onChange={(e) => onInputChange('city', e.target.value)}
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
              onChange={(e) => onInputChange('country', e.target.value)}
              disabled={!isEditing}
              placeholder="Ej: España"
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileLocation;
