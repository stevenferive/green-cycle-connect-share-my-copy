
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';
import { ProfileFormData } from '@/hooks/useProfileForm';

interface ProfileSocialLinksProps {
  formData: ProfileFormData;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

const ProfileSocialLinks: React.FC<ProfileSocialLinksProps> = ({
  formData,
  isEditing,
  onInputChange
}) => {
  return (
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
              onChange={(e) => onInputChange('socialLinks.instagram', e.target.value)}
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
              onChange={(e) => onInputChange('socialLinks.facebook', e.target.value)}
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
              onChange={(e) => onInputChange('socialLinks.twitter', e.target.value)}
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
              onChange={(e) => onInputChange('socialLinks.website', e.target.value)}
              disabled={!isEditing}
              placeholder="www.ejemplo.com"
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSocialLinks;
