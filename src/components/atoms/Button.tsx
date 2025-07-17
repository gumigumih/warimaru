import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export const Button = ({ children, className = '', ...props }: ButtonProps) => (
  <button className={`py-2 px-4 rounded-md font-bold focus:outline-none focus:ring-2 transition-colors ${className}`} {...props}>
    {children}
  </button>
); 