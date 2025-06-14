
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  readonly = false,
  size = 'md',
  showValue = false,
  className
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleStarClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleStarHover = (rating: number) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(null);
    }
  };

  const displayValue = hoverValue ?? value;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex" onMouseLeave={handleMouseLeave}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              "transition-colors",
              !readonly && "cursor-pointer",
              star <= displayValue
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-400"
            )}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground ml-1">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

interface RatingDisplayProps {
  rating: number;
  reviews?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  reviews,
  size = 'md',
  className
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Rating value={rating} readonly size={size} />
      <span className="text-sm text-muted-foreground">
        {rating.toFixed(1)}
        {reviews !== undefined && (
          <span className="ml-1">({reviews} reseñas)</span>
        )}
      </span>
    </div>
  );
};
