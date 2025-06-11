
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EcoBadgesSectionProps {
  ecoBadges: string[];
  onToggleEcoBadge: (badge: string) => void;
}

const ecoBadgeOptions = [
  'Producto Sostenible', 'Empaque Biodegradable', 'Comercio Justo',
  'Reciclado', 'Orgánico', 'Artesanal', 'Cero Residuos', 'Vegano'
];

const EcoBadgesSection: React.FC<EcoBadgesSectionProps> = ({
  ecoBadges,
  onToggleEcoBadge
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insignias ecológicas (máximo 5)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {ecoBadgeOptions.map((badge) => (
            <Badge
              key={badge}
              variant={ecoBadges?.includes(badge) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onToggleEcoBadge(badge)}
            >
              {badge}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Seleccionadas: {ecoBadges?.length || 0}/5
        </p>
      </CardContent>
    </Card>
  );
};

export default EcoBadgesSection;
