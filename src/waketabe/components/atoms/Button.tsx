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
        ? 'bg-orange-200 text-orange-500 cursor-not-allowed '
        : 'bg-gradient-to-r from-orange-400 via-amber-400 to-amber-500 text-white shadow-md hover:brightness-105 ') +
      (props.className || '')
    }
  >
    {children}
  </button>
);
