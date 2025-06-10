
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Leaf } from 'lucide-react';

interface ProfileInterestsProps {
  selectedInterests: string[];
  isEditing: boolean;
  onInterestToggle: (interest: string) => void;
}

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

const ProfileInterests: React.FC<ProfileInterestsProps> = ({
  selectedInterests,
  isEditing,
  onInterestToggle
}) => {
  return (
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
                onCheckedChange={() => onInterestToggle(interest)}
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
  );
};

export default ProfileInterests;
