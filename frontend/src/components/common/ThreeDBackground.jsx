import React, { useEffect, useRef } from 'react';

/**
 * ThreeDBackground - Renders multi-layered spatial depth planes,
 * abstract campus architectural geometry, and cursor perspective tracking.
 */
const ThreeDBackground = ({ className = '', density = 36, interactive = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth);
    let height = (canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Deep Plum, Deep Wine, Burnt Copper & Cream Color System
    const colorPalette = [
      'rgba(196, 111, 79, ',  // Burnt Copper
      'rgba(99, 47, 61, ',    // Deep Wine
      'rgba(53, 28, 43, ',    // Deep Plum
      'rgba(241, 231, 216, '  // Warm Cream
    ];

    // Create 3D particles & floating architectural shapes
    const particles = Array.from({ length: density }, () => ({
      x: (Math.random() - 0.5) * width * 1.6,
      y: (Math.random() - 0.5) * height * 1.6,
      z: Math.random() * 700 + 100,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      vz: (Math.random() - 0.5) * 0.65,
      radius: Math.random() * 6.5 + 3,
      isBlock: Math.random() > 0.6,
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      alpha: Math.random() * 0.4 + 0.15
    }));

    const render = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const fov = 450;
      const centerX = width / 2 + (mouse.x - width / 2) * 0.08;
      const centerY = height / 2 + (mouse.y - height / 2) * 0.08;

      // Atmospheric Deep Burgundy Ambient Glow Spotlight
      const spotGradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, Math.max(width * 0.65, 350)
      );
      spotGradient.addColorStop(0, 'rgba(196, 111, 79, 0.1)');
      spotGradient.addColorStop(0.5, 'rgba(53, 28, 43, 0.06)');
      spotGradient.addColorStop(1, 'rgba(23, 20, 23, 0)');

      ctx.fillStyle = spotGradient;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.z <= 10) p.z = 750;
        if (p.z > 800) p.z = 20;

        const scale = fov / (fov + p.z);
        const projX = p.x * scale + centerX;
        const projY = p.y * scale + centerY;
        const projSize = p.radius * scale * 2.2;

        if (projX > -60 && projX < width + 60 && projY > -60 && projY < height + 60) {
          ctx.save();
          ctx.globalAlpha = p.alpha * scale;

          if (p.isBlock) {
            // Draw floating 3D architectural block shape
            ctx.fillStyle = `${p.color}0.45)`;
            ctx.strokeStyle = `${p.color}0.85)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(projX, projY, projSize * 2.2, projSize * 1.5, 4);
            ctx.fill();
            ctx.stroke();
          } else {
            // Draw spatial ambient particle orb
            const gradient = ctx.createRadialGradient(
              projX, projY, 0,
              projX, projY, Math.max(projSize * 2.5, 1)
            );
            gradient.addColorStop(0, `${p.color}1)`);
            gradient.addColorStop(1, `${p.color}0)`);

            ctx.beginPath();
            ctx.arc(projX, projY, Math.max(projSize * 2.5, 1), 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
          }

          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 opacity-80 ${className}`}
    />
  );
};

export default ThreeDBackground;
