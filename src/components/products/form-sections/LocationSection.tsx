
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProductValidationErrors } from '@/types/product';

interface LocationSectionProps {
  city: string;
  region: string;
  onNestedChange: (parentField: string, childField: string, value: any) => void;
  validationErrors: ProductValidationErrors;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  city,
  region,
  onNestedChange,
  validationErrors
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ubicación *</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Ciudad *</Label>
            <Input
              id="city"
              placeholder="Ej: Lima"
              value={city}
              onChange={(e) => onNestedChange('location', 'city', e.target.value)}
              className={validationErrors.location ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Región *</Label>
            <Input
              id="region"
              placeholder="Ej: Lima"
              value={region}
              onChange={(e) => onNestedChange('location', 'region', e.target.value)}
              className={validationErrors.location ? 'border-red-500' : ''}
            />
          </div>
        </div>
        {validationErrors.location && (
          <p className="text-sm text-red-500">{validationErrors.location}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationSection;
