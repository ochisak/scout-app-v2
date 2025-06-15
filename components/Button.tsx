// components/Button.tsx
import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function Button({ children, className = '', ...props }: Props) {
  return (
    <button
      className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl shadow transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
