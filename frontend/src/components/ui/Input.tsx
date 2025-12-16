import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  const inputClasses = `input ${error ? 'input-error' : ''} ${className}`.trim();

  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input className={inputClasses} {...props} />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};