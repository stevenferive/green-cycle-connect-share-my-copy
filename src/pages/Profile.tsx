
import React from 'react';
import { useProfileForm } from '@/hooks/useProfileForm';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ProfileLocation from '@/components/profile/ProfileLocation';
import ProfileDescription from '@/components/profile/ProfileDescription';
import ProfileInterests from '@/components/profile/ProfileInterests';
import ProfileSocialLinks from '@/components/profile/ProfileSocialLinks';
import ProfileActions from '@/components/profile/ProfileActions';

const Profile = () => {
  const {
    formData,
    selectedInterests,
    isEditing,
    setIsEditing,
    handleInputChange,
    handleInterestToggle,
    handleSave,
    handleCancel,
    handleDeleteAccount
  } = useProfileForm();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-green mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground mb-6">
            Gestiona tu información personal y preferencias ecológicas
          </p>

          <ProfileHeader />

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ProfileAvatar
                formData={formData}
                isEditing={isEditing}
                onInputChange={handleInputChange}
              />
            </div>

            <div className="md:col-span-2 space-y-6">
              <ProfileLocation
                formData={formData}
                isEditing={isEditing}
                onInputChange={handleInputChange}
              />

              <ProfileDescription
                formData={formData}
                isEditing={isEditing}
                onInputChange={handleInputChange}
              />

              <ProfileInterests
                selectedInterests={selectedInterests}
                isEditing={isEditing}
                onInterestToggle={handleInterestToggle}
              />

              <ProfileSocialLinks
                formData={formData}
                isEditing={isEditing}
                onInputChange={handleInputChange}
              />

              <ProfileActions
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDeleteAccount}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
