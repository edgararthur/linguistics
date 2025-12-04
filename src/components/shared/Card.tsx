import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
};

export default function Card({ children, className = '', interactive = true }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 ${interactive ? 'interactive hover:shadow-xl hover:-translate-y-1' : ''} ${className}`}>
      {children}
    </div>
  );
}