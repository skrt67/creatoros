import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`bg-gray-200 ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

// Skeleton Group Component for common patterns
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`card ${className}`}>
    <Skeleton variant="rectangular" height={200} className="mb-4" />
    <Skeleton variant="text" height={24} className="mb-2" />
    <Skeleton variant="text" height={16} width="80%" className="mb-2" />
    <Skeleton variant="text" height={16} width="60%" />
  </div>
);

export const SkeletonList: React.FC<{ count?: number; className?: string }> = ({ 
  count = 3, 
  className = '' 
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" height={16} width="40%" />
          <Skeleton variant="text" height={14} width="60%" />
        </div>
      </div>
    ))}
  </div>
);
