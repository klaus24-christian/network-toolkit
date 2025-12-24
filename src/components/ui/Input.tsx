
import { InputHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  helperText?: string;
}

export const Input = ({
  label,
  error,
  icon,
  helperText,
  className,
  ...props
}: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          className={clsx(
            'w-full px-4 py-2.5 rounded-lg border transition-all duration-200',
            'bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-gray-100',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:outline-none focus:ring-2',
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 animate-fade-in">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};
