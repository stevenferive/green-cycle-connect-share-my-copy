
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string;
  description: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    website: string;
  };
}

export const useProfileForm = () => {
  const { user, updateProfile, deleteAccount } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    city: '',
    country: '',
    description: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      twitter: '',
      website: ''
    }
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

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
    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        city: formData.city,
        country: formData.country,
        description: formData.description,
        ecoInterests: selectedInterests,
        socialLinks: formData.socialLinks
      };

      const result = await updateProfile(updateData);
      if (result.success) {
        setIsEditing(false);
        console.log('Perfil actualizado exitosamente');
      } else {
        console.error('Error al actualizar perfil:', result.message);
      }
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      city: '',
      country: '',
      description: '',
      socialLinks: {
        instagram: '',
        facebook: '',
        twitter: '',
        website: ''
      }
    });
    setSelectedInterests([]);
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      try {
        const result = await deleteAccount();
        if (result.success) {
          console.log('Cuenta eliminada exitosamente');
        } else {
          console.error('Error al eliminar cuenta:', result.message);
        }
      } catch (error) {
        console.error('Error al eliminar cuenta:', error);
      }
    }
  };

  return {
    formData,
    selectedInterests,
    isEditing,
    setIsEditing,
    handleInputChange,
    handleInterestToggle,
    handleSave,
    handleCancel,
    handleDeleteAccount
  };
};
