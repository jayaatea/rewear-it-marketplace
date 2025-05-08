
import React from 'react';
import { cn } from '@/lib/utils';

interface RewearLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const RewearLogo: React.FC<RewearLogoProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };

  return (
    <div className={cn('font-bold text-center text-primary flex items-center gap-2', sizeClasses[size], className)}>
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
