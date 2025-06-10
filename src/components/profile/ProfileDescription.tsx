
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';
import { ProfileFormData } from '@/hooks/useProfileForm';

interface ProfileDescriptionProps {
  formData: ProfileFormData;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

const ProfileDescription: React.FC<ProfileDescriptionProps> = ({
  formData,
  isEditing,
  onInputChange
}) => {
  return (
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
          onChange={(e) => onInputChange('description', e.target.value)}
          disabled={!isEditing}
          placeholder="Ej: Amante de la permacultura y el intercambio de productos artesanales..."
          className="mt-1 min-h-[100px]"
        />
      </CardContent>
    </Card>
  );
};

export default ProfileDescription;
