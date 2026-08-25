import React, { useRef, useState } from 'react';

/**
 * ThreeDTiltCard - Wraps any element with smooth, performance-optimized 3D perspective rotation,
 * dynamic glare effect, and depth elevation on hover.
 */
const ThreeDTiltCard = ({
  children,
  className = '',
  maxTilt = 10,
  scale = 1.02,
  perspective = 1000,
  glare = true,
  onClick,
  style = {},
  ...rest
}) => {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(
      `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    if (glare) {
      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
      const intensity = Math.min(
        Math.hypot(x - centerX, y - centerY) / Math.hypot(centerX, centerY),
        1
      );
      setGlareStyle({
        opacity: intensity * 0.35,
        background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)`
      });
    }
  };

  const handleMouseLeave = () => {
    setTransformStyle(
      `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    );
    setGlareStyle({ opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden transition-transform duration-300 ease-out preserve-3d ${className}`}
      style={{
        transform: transformStyle,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style
      }}
      {...rest}
    >
      {children}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={glareStyle}
        />
      )}
    </div>
  );
};

export default ThreeDTiltCard;
