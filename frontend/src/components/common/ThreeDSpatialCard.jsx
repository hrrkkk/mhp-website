import React, { useRef, useState } from 'react';

/**
 * ThreeDSpatialCard - Container wrapper providing subtle cursor-tilt 3D spatial perspective
 * and depth layering for homepage content panels and numbers.
 */
const ThreeDSpatialCard = ({ 
  children, 
  className = '', 
  depth = 20, 
  glowColor = 'rgba(215, 122, 77, 0.25)',
  interactive = true 
}) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (y / (rect.height / 2)) * -10;
    const rotY = (x / (rect.width / 2)) * 10;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(${depth}px)`,
      boxShadow: `0 20px 45px rgba(0,0,0,0.85), 0 0 30px ${glowColor}`,
      borderColor: '#D77A4D'
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      boxShadow: '0 10px 30px rgba(11, 9, 9, 0.85)',
      borderColor: '#3A191A'
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-300 ease-out preserve-3d border border-[#3A191A] bg-[#140D0D] rounded-3xl ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default ThreeDSpatialCard;
