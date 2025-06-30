import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`
            block w-full rounded-xl border-0 bg-white/70 backdrop-blur-sm shadow-md
            ${icon ? 'pl-10 pr-4' : 'px-4'} py-3
            text-gray-900 placeholder-gray-500
            ring-1 ring-inset ring-gray-300
            focus:ring-2 focus:ring-inset focus:ring-blue-600
            transition-all duration-200
            hover:shadow-lg hover:bg-white/80
            ${error ? 'ring-red-500 focus:ring-red-600' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

export default Input;