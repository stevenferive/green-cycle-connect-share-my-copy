import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = React.memo(({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#EEFFCD] to-[#C8F8B1] flex flex-col">
      <div className="flex-1 pb-16">
        {children}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  );
});

AuthenticatedLayout.displayName = 'AuthenticatedLayout';

export default AuthenticatedLayout;
