
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface PricingSectionProps {
  forBarter: boolean;
  price: number;
  currency: string;
  barterPreferences: string[];
  newBarterPreference: string;
  onInputChange: (field: string, value: any) => void;
  onSetNewBarterPreference: (value: string) => void;
  onAddArrayItem: (field: 'barterPreferences' | 'materials' | 'tags', value: string) => void;
  onRemoveArrayItem: (field: 'barterPreferences' | 'materials' | 'tags' | 'ecoBadges', index: number) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({
  forBarter,
  price,
  currency,
  barterPreferences,
  newBarterPreference,
  onInputChange,
  onSetNewBarterPreference,
  onAddArrayItem,
  onRemoveArrayItem
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Precio e intercambio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="barter"
            checked={forBarter}
            onCheckedChange={(checked) => onInputChange('forBarter', checked)}
          />
          <Label htmlFor="barter">Disponible para intercambio/trueque</Label>
        </div>

        {!forBarter && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio (S/)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={price || ''}
                onChange={(e) => onInputChange('price', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select 
                value={currency} 
                onValueChange={(value) => onInputChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PEN">Soles (PEN)</SelectItem>
                  <SelectItem value="USD">Dólares (USD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {forBarter && (
          <div className="space-y-2">
            <Label>Preferencias de intercambio</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Ej: Libros, ropa, plantas"
                value={newBarterPreference}
                onChange={(e) => onSetNewBarterPreference(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onAddArrayItem('barterPreferences', newBarterPreference);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onAddArrayItem('barterPreferences', newBarterPreference)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {barterPreferences?.map((pref, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {pref}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onRemoveArrayItem('barterPreferences', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PricingSection;
