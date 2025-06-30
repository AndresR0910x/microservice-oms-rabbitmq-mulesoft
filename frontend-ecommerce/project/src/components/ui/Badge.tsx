import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md' 
}) => {
  const variantClasses = {
    default: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800',
    success: 'bg-gradient-to-r from-green-100 to-emerald-200 text-green-800',
    warning: 'bg-gradient-to-r from-yellow-100 to-orange-200 text-yellow-800',
    danger: 'bg-gradient-to-r from-red-100 to-pink-200 text-red-800',
    info: 'bg-gradient-to-r from-blue-100 to-indigo-200 text-blue-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`
      inline-flex items-center font-semibold rounded-full shadow-sm
      ${variantClasses[variant]} ${sizeClasses[size]}
    `}>
      {children}
    </span>
  );
};

export default Badge;