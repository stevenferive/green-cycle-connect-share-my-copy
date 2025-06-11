import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string;
  description: string;
  avatar?: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    website: string;
  };
}

export const useProfileForm = () => {
  const { user, updateProfile, deleteAccount } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    city: user?.city || '',
    country: user?.country || '',
    description: user?.description || '',
    avatar: user?.avatar,
    socialLinks: {
      instagram: user?.socialLinks?.instagram || '',
      facebook: user?.socialLinks?.facebook || '',
      twitter: user?.socialLinks?.twitter || '',
      website: user?.socialLinks?.website || ''
    }
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.ecoInterests || []);

  const validateForm = () => {
    if (formData.firstName.length < 2) {
      toast({
        title: "Error de validación",
        description: "El nombre debe tener al menos 2 caracteres",
        variant: "destructive"
      });
      return false;
    }
    
    if (formData.lastName.length < 2) {
      toast({
        title: "Error de validación",
        description: "El apellido debe tener al menos 2 caracteres",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.email.includes('@')) {
      toast({
        title: "Error de validación",
        description: "Ingresa un email válido",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'socialLinks') {
        setFormData(prev => ({
          ...prev,
          socialLinks: {
            ...prev.socialLinks,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        city: formData.city,
        country: formData.country,
        description: formData.description,
        avatar: formData.avatar,
        ecoInterests: selectedInterests,
        socialLinks: formData.socialLinks
      };

      const result = await updateProfile(updateData);
      if (result.success) {
        setIsEditing(false);
        toast({
          title: "Perfil actualizado",
          description: "Tus datos han sido actualizados exitosamente",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Error al actualizar el perfil",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar los cambios",
        variant: "destructive"
      });
      console.error('Error al guardar cambios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      city: user?.city || '',
      country: user?.country || '',
      description: user?.description || '',
      avatar: user?.avatar,
      socialLinks: {
        instagram: user?.socialLinks?.instagram || '',
        facebook: user?.socialLinks?.facebook || '',
        twitter: user?.socialLinks?.twitter || '',
        website: user?.socialLinks?.website || ''
      }
    });
    setSelectedInterests(user?.ecoInterests || []);
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      setIsLoading(true);
      try {
        const result = await deleteAccount();
        if (result.success) {
          toast({
            title: "Cuenta eliminada",
            description: "Tu cuenta ha sido eliminada exitosamente",
          });
        } else {
          toast({
            title: "Error",
            description: result.message || "Error al eliminar la cuenta",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Ocurrió un error al eliminar la cuenta",
          variant: "destructive"
        });
        console.error('Error al eliminar cuenta:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    formData,
    selectedInterests,
    isEditing,
    isLoading,
    setIsEditing,
    handleInputChange,
    handleInterestToggle,
    handleSave,
    handleCancel,
    handleDeleteAccount
  };
};
