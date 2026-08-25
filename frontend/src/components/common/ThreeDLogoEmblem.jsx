import React, { useRef, useState } from 'react';

/**
 * ThreeDLogoEmblem - Clean Standalone Crisp MHP Circular Logo Emblem
 * Renders ONLY the standalone circular MHP logo image (/assets/mhp_logo.png) directly.
 * ABSOLUTELY ZERO square containers, zero rounded boxes, zero background plates, zero extra divs, and zero card borders.
 */
const ThreeDLogoEmblem = ({ size = 'medium', interactive = true, className = '' }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (y / (rect.height / 2)) * -12;
    const rotY = (x / (rect.width / 2)) * 12;

    setTransform(`perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.05, 1.05, 1.05)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
    hero: 'w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56',
    large: 'w-24 h-24 sm:w-32 sm:h-32'
  }[size] || 'w-16 h-16';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block transition-transform duration-300 ease-out cursor-pointer select-none ${sizeClasses} ${className}`}
      style={{ transform }}
    >
      <img
        src="/assets/mhp_logo.png"
        alt="MHP Official Logo"
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.95)] contrast-[1.05] brightness-[1.02]"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/assets/mhp_logo.png";
        }}
      />
    </div>
  );
};

export default ThreeDLogoEmblem;
