
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, X, Trash2 } from 'lucide-react';

interface ProfileActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-3 justify-between">
          <div className="flex gap-3">
            {!isEditing ? (
              <Button 
                onClick={onEdit}
                className="bg-green hover:bg-green/90"
              >
                Editar Perfil
              </Button>
            ) : (
              <>
                <Button 
                  onClick={onSave}
                  className="bg-green hover:bg-green/90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </>
            )}
          </div>
          
          <Button 
            variant="destructive" 
            onClick={onDelete}
            className="ml-auto"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar Cuenta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileActions;
