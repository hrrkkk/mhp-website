import React, { useRef, useState } from 'react';

/**
 * ThreeDSpatialCard - Container wrapper providing subtle cursor-tilt 3D spatial perspective
 * and depth layering for homepage content panels and numbers.
 */
const ThreeDSpatialCard = ({ 
  children, 
  className = '', 
  depth = 20, 
  glowColor = 'rgba(244, 123, 32, 0.25)',
  interactive = true 
}) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (y / (rect.height / 2)) * -8;
    const rotY = (x / (rect.width / 2)) * 8;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(${depth}px)`,
      boxShadow: `0 20px 45px rgba(24, 58, 42, 0.15), 0 0 25px ${glowColor}`,
      borderColor: '#F47B20'
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      boxShadow: '0 10px 30px rgba(24, 58, 42, 0.08)',
      borderColor: 'rgba(125, 150, 126, 0.3)'
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-300 ease-out preserve-3d border border-[#7D967E]/30 bg-[#FFFFFF] rounded-3xl ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default ThreeDSpatialCard;

