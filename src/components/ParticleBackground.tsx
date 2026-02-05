import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import React from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

// Generate deterministic particles
const generateParticles = (count: number): Particle[] => {
  const particles: Particle[] = [];
  const colors = ["#FFD700", "#FFA500", "#FF6B35", "#4ECDC4", "#45B7D1", "#96F550"];
  
  for (let i = 0; i < count; i++) {
    const seed = i * 1234.5678;
    particles.push({
      x: (Math.sin(seed) * 0.5 + 0.5) * 100,
      y: (Math.cos(seed * 2) * 0.5 + 0.5) * 100,
      size: 2 + (Math.sin(seed * 3) * 0.5 + 0.5) * 4,
      speedX: (Math.sin(seed * 4) - 0.5) * 0.3,
      speedY: (Math.cos(seed * 5) - 0.5) * 0.3,
      opacity: 0.3 + (Math.sin(seed * 6) * 0.5 + 0.5) * 0.5,
      color: colors[i % colors.length],
    });
  }
  return particles;
};

const particles = generateParticles(50);

export const ParticleBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
      }}
    >
      {particles.map((particle, i) => {
        const time = frame / fps;
        const x = (particle.x + particle.speedX * time * 100) % 120 - 10;
        const y = (particle.y + particle.speedY * time * 100) % 120 - 10;
        
        const pulse = Math.sin(time * 2 + i) * 0.3 + 0.7;
        
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: particle.size * pulse,
              height: particle.size * pulse,
              borderRadius: "50%",
              background: particle.color,
              opacity: particle.opacity * pulse,
              boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
              filter: "blur(1px)",
            }}
          />
        );
      })}
      
      {/* Gradient overlays for depth */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.6) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
