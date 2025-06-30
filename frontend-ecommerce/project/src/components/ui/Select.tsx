import React, { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: Option[];
  error?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = '',
  onChange,
  value,
  placeholder = 'Seleccionar...',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        className={`
          block w-full rounded-xl border-0 bg-white/70 backdrop-blur-sm shadow-md
          px-4 py-3 text-gray-900
          ring-1 ring-inset ring-gray-300
          focus:ring-2 focus:ring-inset focus:ring-blue-600
          transition-all duration-200
          hover:shadow-lg hover:bg-white/80
          ${error ? 'ring-red-500 focus:ring-red-600' : ''}
          ${className}
        `}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
};

export default Select;