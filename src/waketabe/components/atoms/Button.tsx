import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export const Button = ({ children, ...props }: ButtonProps) => (
  <button
    {...props}
    className={
      'px-4 py-2 rounded-md font-medium transition-colors ' +
      (props.disabled
        ? 'bg-gray-300 text-gray-400 cursor-not-allowed '
        : 'bg-blue-600 text-white hover:bg-blue-700 ') +
      (props.className || '')
    }
  >
    {children}
  </button>
);

