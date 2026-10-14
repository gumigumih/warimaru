import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  children?: React.ReactNode;
};

export const Checkbox = ({ children, ...props }: CheckboxProps) => (
  <label className={'inline-flex items-center gap-2 cursor-pointer select-none ' + (props.className || '')}>
    <div className="relative">
      <input 
        type="checkbox" 
        {...props} 
        className="sr-only"
      />
      <div className={`
        w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-200
        ${props.checked 
          ? 'bg-blue-500 border-blue-500 text-white' 
          : 'bg-white border-gray-300 hover:border-blue-400'
        }
        ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
     `}>
        {props.checked && (
          <FontAwesomeIcon 
            icon={faCheck} 
            className="w-3 h-3 text-white"
          />
        )}
      </div>
    </div>
    {children && (
      <span className={`text-sm ${props.disabled ? 'text-gray-400' : 'text-gray-700'}`}>
        {children}
      </span>
    )}
  </label>
);

