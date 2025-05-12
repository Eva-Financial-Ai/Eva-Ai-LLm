import React from 'react';

interface EVALogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const EVALogo: React.FC<EVALogoProps> = ({ 
  className = '', 
  width = 1506, 
  height = 242 
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 1506 242"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left section - darker vectors (#222222) */}
      <path
        d="M162.3 93.8H54.3v54.4h108V93.8z"
        fill="#222222"
      />
      <path
        d="M369.3 93.8H261.3v54.4h108V93.8z"
        fill="#222222"
      />
      <path
        d="M560.9 93.8H452.9v54.4h108V93.8z"
        fill="#222222"
      />
      
      {/* Right section - lighter vectors (#616161) */}
      <path
        d="M808.6 93.8H700.6v54.4h108V93.8z"
        fill="#616161"
      />
      <path
        d="M1032.2 93.8H924.2v54.4h108V93.8z"
        fill="#616161"
      />
      <path
        d="M1156.2 93.8H1048.2v54.4h108V93.8z"
        fill="#616161"
      />
    </svg>
  );
};

// SVG version with improved E-V-A styling
const ModernEVALogo: React.FC<EVALogoProps> = ({ 
  className = '', 
  width = 1506, 
  height = 242 
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 1506 242"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* E */}
      <path
        d="M50 50h200v30H90v40h150v30H90v40h160v30H50V50z"
        fill="#222222"
      />
      
      {/* V */}
      <path
        d="M290 50h50l80 170h-50l-55-120-55 120h-50l80-170z"
        fill="#222222"
      />
      
      {/* A */}
      <path
        d="M500 220L580 50h50l80 170h-50l-15-35h-80l-15 35h-50zm75-65h50l-25-55-25 55z"
        fill="#222222"
      />
      
      {/* F */}
      <path
        d="M750 50h190v30H790v40h140v30H790v70h-40V50z"
        fill="#616161"
      />
      
      {/* I */}
      <path
        d="M980 50h40v170h-40V50z"
        fill="#616161"
      />
      
      {/* N */}
      <path
        d="M1060 50h40v110l80-110h40v170h-40V110l-80 110h-40V50z"
        fill="#616161"
      />
    </svg>
  );
};

export { EVALogo, ModernEVALogo };
export default ModernEVALogo; 