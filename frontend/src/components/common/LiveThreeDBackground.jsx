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

    // Particle Array - Reduced count for subtle, clean background
    const numParticles = 15;
    const particles = [];
    const colors = ['rgba(199, 111, 77, 0.15)', 'rgba(215, 154, 67, 0.15)'];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1.5 + 0.5,
        radius: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.15,
        vy: -Math.random() * 0.2 - 0.05
      });
    }

    let lightAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render Subdued Warm Ambient Beam
      lightAngle += 0.002;
      const lightX = canvas.width / 2 + Math.sin(lightAngle) * (canvas.width * 0.2);
      const lightY = canvas.height * 0.3;

      const lightGradient = ctx.createRadialGradient(
        lightX, lightY, 10,
        lightX, lightY, canvas.width * 0.4
      );
      lightGradient.addColorStop(0, 'rgba(244, 123, 32, 0.04)');
      lightGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = lightGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render Floating Specks
      particles.forEach((p) => {
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export default LiveThreeDBackground;
