import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, X, Trash2, Loader2 } from 'lucide-react';

interface ProfileActionsProps {
  isEditing: boolean;
  isLoading: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  isEditing,
  isLoading,
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
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                  disabled={isLoading}
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
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Eliminando...' : 'Eliminar Cuenta'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileActions;
