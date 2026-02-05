import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from "remotion";
import React from "react";

// Ultra-smooth easing curves for $50M feel
export const smoothEasing = Easing.bezier(0.25, 0.1, 0.25, 1);
export const premiumEasing = Easing.bezier(0.4, 0, 0.2, 1);
export const liquidEasing = Easing.bezier(0.68, -0.55, 0.265, 1.55);

// Premium spring configs
export const springConfigs = {
    ultraSmooth: { damping: 30, stiffness: 80, mass: 1 },
    liquid: { damping: 25, stiffness: 120, mass: 0.8 },
    snappy: { damping: 20, stiffness: 200, mass: 0.5 },
    bouncy: { damping: 12, stiffness: 100, mass: 1 },
    gentle: { damping: 40, stiffness: 60, mass: 1.2 },
};

// Premium Glow Effect Component
interface GlowOrbProps {
    x: number;
    y: number;
    size: number;
    color: string;
    delay?: number;
    intensity?: number;
}

export const GlowOrb: React.FC<GlowOrbProps> = ({
    x,
    y,
    size,
    color,
    delay = 0,
    intensity = 1,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const progress = spring({
        frame: frame - delay,
        fps,
        config: springConfigs.ultraSmooth,
    });

    const pulse = Math.sin((frame / fps) * 2) * 0.15 + 1;
    const drift = Math.sin((frame / fps) * 0.5) * 10;

    const scale = interpolate(progress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    const opacity = interpolate(progress, [0, 1], [0, 0.6 * intensity], {
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                transform: `translate(-50%, -50%) scale(${scale * pulse}) translateY(${drift}px)`,
                background: `radial-gradient(circle, ${color}60 0%, ${color}20 40%, transparent 70%)`,
                borderRadius: "50%",
                opacity,
                filter: `blur(${size * 0.3}px)`,
                pointerEvents: "none",
            }}
        />
    );
};

// Depth-aware Parallax Background
interface ParallaxBackgroundProps {
    baseColor?: string;
    accentColor?: string;
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
    baseColor = "#0a0a0a",
    accentColor = "#FFD700",
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const layers = [
        { depth: 0.2, color: accentColor, opacity: 0.03 },
        { depth: 0.4, color: accentColor, opacity: 0.05 },
        { depth: 0.6, color: "#FF6B35", opacity: 0.04 },
        { depth: 0.8, color: "#4ECDC4", opacity: 0.03 },
    ];

    return (
        <AbsoluteFill
            style={{
                background: `radial-gradient(ellipse at 50% 30%, ${baseColor} 0%, #050505 100%)`,
                overflow: "hidden",
            }}
        >
            {layers.map((layer, i) => {
                const offset = (frame / fps) * 20 * layer.depth;
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            width: "200%",
                            height: "200%",
                            left: "-50%",
                            top: "-50%",
                            background: `radial-gradient(circle at ${50 + Math.sin(offset * 0.1) * 20}% ${50 + Math.cos(offset * 0.1) * 20}%, ${layer.color}${Math.floor(layer.opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 50%)`,
                            transform: `translateY(${offset}px)`,
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};

// Premium Floating Particles
export const PremiumParticles: React.FC<{ count?: number; color?: string }> = ({
    count = 50,
    color = "#FFD700",
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const particles = React.useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            x: (i * 37) % 100,
            y: (i * 53) % 100,
            size: 2 + (i % 4),
            speed: 0.3 + (i % 5) * 0.15,
            delay: i * 3,
            phase: i * 0.5,
        }));
    }, [count]);

    return (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
            {particles.map((p, i) => {
                const time = frame / fps;
                const y = (p.y + time * p.speed * 20) % 120 - 10;
                const x = p.x + Math.sin(time * 0.5 + p.phase) * 5;
                const opacity = Math.sin(time * 2 + p.phase) * 0.3 + 0.5;

                const fadeIn = spring({
                    frame: frame - p.delay,
                    fps,
                    config: springConfigs.gentle,
                });

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: `${x}%`,
                            top: `${y}%`,
                            width: p.size,
                            height: p.size,
                            background: color,
                            borderRadius: "50%",
                            opacity: opacity * fadeIn,
                            boxShadow: `0 0 ${p.size * 3}px ${color}`,
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};

// Liquid Morph Shape
interface LiquidShapeProps {
    size: number;
    color: string;
    x: number;
    y: number;
    delay?: number;
}

export const LiquidShape: React.FC<LiquidShapeProps> = ({
    size,
    color,
    x,
    y,
    delay = 0,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const time = frame / fps;
    const morph1 = 30 + Math.sin(time * 1.5) * 15;
    const morph2 = 70 + Math.cos(time * 1.2) * 15;
    const morph3 = 30 + Math.sin(time * 1.8 + 1) * 15;
    const morph4 = 70 + Math.cos(time * 1.4 + 1) * 15;

    const progress = spring({
        frame: frame - delay,
        fps,
        config: springConfigs.liquid,
    });

    const scale = interpolate(progress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    const rotation = time * 10;

    return (
        <div
            style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                background: `linear-gradient(135deg, ${color}40 0%, ${color}10 100%)`,
                borderRadius: `${morph1}% ${morph2}% ${morph3}% ${morph4}% / ${morph4}% ${morph3}% ${morph2}% ${morph1}%`,
                border: `2px solid ${color}40`,
                boxShadow: `0 0 40px ${color}20`,
            }}
        />
    );
};

// Cinematic Vignette
export const CinematicVignette: React.FC<{ intensity?: number }> = ({
    intensity = 0.8,
}) => {
    return (
        <AbsoluteFill
            style={{
                background: `radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,${intensity}) 100%)`,
                pointerEvents: "none",
            }}
        />
    );
};

// Subtle Light Beam
interface LightBeamProps {
    angle?: number;
    color?: string;
    delay?: number;
}

export const LightBeam: React.FC<LightBeamProps> = ({
    angle = 45,
    color = "#FFD700",
    delay = 0,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const progress = spring({
        frame: frame - delay,
        fps,
        config: springConfigs.gentle,
    });

    const opacity = interpolate(progress, [0, 1], [0, 0.1], {
        extrapolateRight: "clamp",
    });

    const sweep = (frame / fps) * 5;

    return (
        <div
            style={{
                position: "absolute",
                width: "200%",
                height: "200%",
                left: "-50%",
                top: "-50%",
                background: `linear-gradient(${angle + sweep}deg, transparent 40%, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 50%, transparent 60%)`,
                opacity,
                pointerEvents: "none",
            }}
        />
    );
};

// Animated Bezier Line (for connection animations)
interface BezierLineProps {
    start: { x: number; y: number };
    end: { x: number; y: number };
    color?: string;
    delay?: number;
    strokeWidth?: number;
}

export const BezierLine: React.FC<BezierLineProps> = ({
    start,
    end,
    color = "#FFD700",
    delay = 0,
    strokeWidth = 2,
}) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    const progress = spring({
        frame: frame - delay,
        fps,
        config: springConfigs.ultraSmooth,
        durationInFrames: 60,
    });

    const startX = (start.x / 100) * width;
    const startY = (start.y / 100) * height;
    const endX = (end.x / 100) * width;
    const endY = (end.y / 100) * height;

    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2 - 50;

    const pathLength = 500;
    const dashOffset = interpolate(progress, [0, 1], [pathLength, 0], {
        extrapolateRight: "clamp",
    });

    const glowPulse = Math.sin((frame / fps) * 3) * 0.3 + 0.7;

    return (
        <svg
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
            }}
        >
            <defs>
                <linearGradient id={`grad-${start.x}-${end.x}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor="#FF6B35" />
                </linearGradient>
                <filter id={`glow-${start.x}-${end.x}`}>
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path
                d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                fill="none"
                stroke={`url(#grad-${start.x}-${end.x})`}
                strokeWidth={strokeWidth}
                strokeDasharray={pathLength}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                opacity={progress * glowPulse}
                filter={`url(#glow-${start.x}-${end.x})`}
            />
            {/* Traveling particle */}
            {progress > 0.1 && (
                <circle
                    cx={startX + (endX - startX) * progress}
                    cy={startY + (endY - startY) * progress - Math.sin(progress * Math.PI) * 50}
                    r={4}
                    fill={color}
                    opacity={progress}
                    style={{ filter: "blur(1px)" }}
                />
            )}
        </svg>
    );
};

// Camera Push Effect (wrapper component)
interface CameraPushProps {
    children: React.ReactNode;
    intensity?: number;
    delay?: number;
}

export const CameraPush: React.FC<CameraPushProps> = ({
    children,
    intensity = 0.05,
    delay = 0,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const progress = spring({
        frame: frame - delay,
        fps,
        config: springConfigs.gentle,
    });

    const scale = interpolate(progress, [0, 1], [1, 1 + intensity], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill
            style={{
                transform: `scale(${scale})`,
                transformOrigin: "center center",
            }}
        >
            {children}
        </AbsoluteFill>
    );
};
