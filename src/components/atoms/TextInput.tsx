import type { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const TextInput = ({ className = '', ...props }: TextInputProps) => (
  <input className={`rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-base ${className}`} {...props} />
); 