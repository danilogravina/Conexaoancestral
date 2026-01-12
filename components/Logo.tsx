import React from 'react';

export const Logo: React.FC<{ className?: string, forceWhite?: boolean }> = ({ className = "", forceWhite = false }) => {
  return (
    <div className={`flex items-center group select-none ${className}`}>
      <img
        src="/assets/img/LogoHorizontal.svg"
        alt="Conexão Ancestral"
        className={`h-[75px] w-auto transition-all duration-300 group-hover:scale-105 ${forceWhite ? 'brightness-0 invert' : 'dark:brightness-0 dark:invert'}`}
      />
    </div>
  );
};