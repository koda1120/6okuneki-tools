import type { ReactNode, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'line';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  accentColor?: string;
  isLoading?: boolean;
}

const sizeClasses = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-13 px-8 text-lg',
} as const;

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  accentColor,
  isLoading = false,
  disabled,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2';

  const variantStyles = {
    primary: {
      backgroundColor: accentColor || '#D94343',
      color: '#FFFFFF',
      border: 'none',
    },
    secondary: {
      backgroundColor: '#FFFFFF',
      color: accentColor || '#D94343',
      border: `1px solid ${accentColor || '#D94343'}`,
    },
    line: {
      backgroundColor: '#06C755',
      color: '#FFFFFF',
      border: 'none',
    },
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
      style={{
        ...variantStyles[variant],
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        minHeight: '44px',
        ...style,
      }}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>送信中...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
