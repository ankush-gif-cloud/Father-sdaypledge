import React from 'react';

export function Adda247Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="https://www.adda247.com/images/header-logo.svg" 
        alt="Adda247 Logo" 
        className="h-10 w-auto" 
      />
    </div>
  );
}
