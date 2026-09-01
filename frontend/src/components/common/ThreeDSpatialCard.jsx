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

    // Subdued, subtle tilt (2.5 deg max) to avoid jarring motion in content sections
    const rotX = (y / (rect.height / 2)) * -2.5;
    const rotY = (x / (rect.width / 2)) * 2.5;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-2px)`,
      boxShadow: `0 14px 30px rgba(24, 58, 42, 0.12)`,
      borderColor: 'rgba(244, 123, 32, 0.5)'
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
      boxShadow: '0 8px 24px rgba(24, 58, 42, 0.06)',
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

