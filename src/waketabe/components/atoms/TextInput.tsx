import React from 'react';

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const TextInput = (props: TextInputProps) => (
  <input
    {...props}
    className={
      'bg-white rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 ' +
      (props.className || '')
    }
  />
);

