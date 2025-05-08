
import React from 'react';
import { cn } from '@/lib/utils';

interface RewearLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showImage?: boolean;
}

const RewearLogo: React.FC<RewearLogoProps> = ({ 
  className, 
  size = 'md',
  showImage = true 
}) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };

  const imageSizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  return (
    <div className={cn('font-bold text-primary flex items-center gap-2', sizeClasses[size], className)}>
      {showImage && (
        <img 
          src="/lovable-uploads/e2665b21-1ae1-4164-aeea-448d1a5633ac.png" 
          alt="Rewear It Logo" 
          className={cn('object-contain', imageSizes[size])}
        />
      )}
      <span className="inline-flex items-center justify-center">
        <span className="relative">
          <span className="text-primary">Re</span>
          <span className="text-rewear-pink">wear</span>
          <span className="text-primary ml-1">It</span>
        </span>
      </span>
    </div>
  );
};

export default RewearLogo;
