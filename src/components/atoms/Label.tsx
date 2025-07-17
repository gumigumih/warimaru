import type { LabelHTMLAttributes, ReactNode } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  className?: string;
}

export const Label = ({ children, className = '', ...props }: LabelProps) => (
  <label className={`block text-gray-700 font-medium mb-1 ${className}`} {...props}>
    {children}
  </label>
); 