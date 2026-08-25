import React, { useEffect, useRef } from 'react';

/**
 * LiveThreeDBackground - Persistent Live Animated 3D Environmental Background System.
 * Renders slowly sweeping warm copper spotlighting, floating 3D dust specks,
 * and atmospheric depth haze for the entire MHP Customer World.
 */
const LiveThreeDBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle Array
    const numParticles = 40;
    const particles = [];
    const colors = ['rgba(199, 111, 77, 0.4)', 'rgba(215, 154, 67, 0.35)', 'rgba(53, 25, 35, 0.3)'];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 2 + 0.5,
        radius: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.35 - 0.1
      });
    }

    let lightAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Render Slowly Sweeping Warm Copper Ambient Spotlight Light Beam
      lightAngle += 0.005;
      const lightX = canvas.width / 2 + Math.sin(lightAngle) * (canvas.width * 0.3);
      const lightY = canvas.height * 0.3 + Math.cos(lightAngle * 0.7) * (canvas.height * 0.15);

      const lightGradient = ctx.createRadialGradient(
        lightX, lightY, 10,
        lightX, lightY, canvas.width * 0.55
      );
      lightGradient.addColorStop(0, 'rgba(199, 111, 77, 0.15)');
      lightGradient.addColorStop(0.5, 'rgba(215, 154, 67, 0.08)');
      lightGradient.addColorStop(1, 'rgba(13, 11, 12, 0)');

      ctx.fillStyle = lightGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Render Floating 3D Depth Dust Specks
      particles.forEach((p) => {
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.z, 0, Math.PI * 2, false);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0D0B0C]">
      {/* Base Atmospheric Color Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0B0C] via-[#1B1212]/90 to-[#0D0B0C]" />
      
      {/* Live Animated Canvas Light Beam & Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80" />
      
      {/* Radial Depth Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0D0B0C]/60 to-[#0D0B0C]" />
    </div>
  );
};

export default LiveThreeDBackground;
