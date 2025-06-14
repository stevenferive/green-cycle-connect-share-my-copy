
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text, 
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-green", sizeClasses[size])} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

export const LoadingPage: React.FC<{ text?: string }> = ({ text = "Cargando..." }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};

export const LoadingButton: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      {children}
    </div>
  );
};
