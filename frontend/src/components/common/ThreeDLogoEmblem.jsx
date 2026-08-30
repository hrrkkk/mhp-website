import React, { useRef, useState } from 'react';

/**
 * ThreeDLogoEmblem - Official MHP Brand Emblem (IMAGE 2)
 * Renders the official MHP 3D Logo (/assets/mhp_logo.png) cleanly in the navbar brand area
 * next to "MHP THE MOST HAPPENING PLACE".
 */
const ThreeDLogoEmblem = ({ size = 'medium', interactive = true, className = '' }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (y / (rect.height / 2)) * -10;
    const rotY = (x / (rect.width / 2)) * 10;

    setTransform(`perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  const sizeClasses = {
    small: 'w-9 h-9',
    medium: 'w-12 h-12 sm:w-14 sm:h-14',
    hero: 'w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56',
    large: 'w-24 h-24 sm:w-32 sm:h-32'
  }[size] || 'w-12 h-12';

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
        alt="MHP Official Brand Emblem"
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] contrast-[1.04] brightness-[1.02]"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/assets/mhp_logo.png";
        }}
      />
    </div>
  );
};

export default ThreeDLogoEmblem;
