
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({ 
  children, 
  className,
  delay = 0
}) => {
  const delayStyle = {
    animationDelay: delay > 0 ? `${delay}ms` : undefined
  };
  
  return (
    <div 
      className={cn("animate-fade-in", className)} 
      style={delayStyle}
    >
      {children}
    </div>
  );
};
