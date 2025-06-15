// components/Section.tsx
import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Section({ children, className = '' }: Props) {
  return (
    <section
      className={`bg-white p-6 rounded-xl shadow border border-blue-100 ${className}`}
    >
      {children}
    </section>
  );
}
