import React, { useEffect, useRef } from "react";

export default function StarField({ warp = false, density = 150 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Create stars
    const stars = [];
    for (let i = 0; i < density; i++) {
      stars.push({
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * width,
        color: `rgba(${150 + Math.random() * 105}, ${200 + Math.random() * 55}, 255, ${0.4 + Math.random() * 0.6})`,
        size: 0.5 + Math.random() * 1.5,
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Main animation loop
    const animate = () => {
      // Background clear
      ctx.fillStyle = "rgba(3, 0, 20, 0.25)"; // slight trailing blur effect
      ctx.fillRect(0, 0, width, height);

      // Draw active space center coords
      const cx = width / 2;
      const cy = height / 2;

      stars.forEach((star) => {
        // Decrement Z to make it move forward (3D space projection)
        const currentSpeed = warp ? 35 : 0.8;
        star.z -= currentSpeed;

        if (star.z <= 0) {
          star.z = width;
          star.x = Math.random() * width - cx;
          star.y = Math.random() * height - cy;
        }

        // Project coordinate to 2D
        const px = (star.x / star.z) * width + cx;
        const py = (star.y / star.z) * height + cy;

        // Size scaling based on proximity
        const sizeScale = (1 - star.z / width) * 2;
        const starSize = Math.max(0.1, star.size * sizeScale + 0.1);

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.beginPath();
          ctx.arc(px, py, starSize, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.fill();

          // If in warp mode, draw hyperdrive tail lines
          if (warp) {
            ctx.beginPath();
            const tailZ = star.z + currentSpeed * 2.5;
            const tx = (star.x / tailZ) * width + cx;
            const ty = (star.y / tailZ) * height + cy;
            ctx.moveTo(px, py);
            ctx.lineTo(tx, ty);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 + (1 - star.z / width) * 0.7})`;
            ctx.lineWidth = starSize * 0.6;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [warp, density]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#030014]"
    />
  );
}
