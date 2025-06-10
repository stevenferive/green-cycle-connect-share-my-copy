
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf } from 'lucide-react';

const ProfileHeader = () => {
  return (
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
  );
};

export default ProfileHeader;
