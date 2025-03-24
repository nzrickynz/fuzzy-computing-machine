import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ 
  children, 
  className, 
  variant = 'primary',
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        variant === 'primary' 
          ? 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:bg-gray-600',
        'disabled:cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
} 