import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerActions?: ReactNode;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  subtitle,
  className = '', 
  headerActions,
  gradient = false
}) => {
  return (
    <div className={`
      ${gradient 
        ? 'bg-gradient-to-br from-white/80 to-blue-50/80' 
        : 'bg-white/70'
      } 
      backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden 
      hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02]
      ${className}
    `}>
      {title && (
        <div className="px-6 py-5 border-b border-white/20 bg-gradient-to-r from-transparent to-blue-50/30">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
            {headerActions && <div>{headerActions}</div>}
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;