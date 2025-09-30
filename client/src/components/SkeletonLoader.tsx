import React from 'react';

interface SkeletonLoaderProps {
  type?: 'text' | 'button' | 'form' | 'card';
  width?: string;
  height?: string;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'text', 
  width = '100%', 
  height = '20px',
  className = ''
}) => {
  const getSkeletonStyle = () => {
    const baseStyle = {
      background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-loading 1.5s infinite',
      borderRadius: '4px',
      width,
      height
    };

    switch (type) {
      case 'button':
        return { ...baseStyle, borderRadius: '8px', height: '48px' };
      case 'form':
        return { ...baseStyle, borderRadius: '8px', height: '56px' };
      case 'card':
        return { ...baseStyle, borderRadius: '12px', height: '200px' };
      default:
        return baseStyle;
    }
  };

  return (
    <div 
      className={`skeleton-loader ${className}`}
      style={getSkeletonStyle()}
    />
  );
};

export default SkeletonLoader;
