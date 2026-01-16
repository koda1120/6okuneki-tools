import type { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-sm ${className}`}
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
      {...props}
    >
      {children}
    </div>
  );
}
