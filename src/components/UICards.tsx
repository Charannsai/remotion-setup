import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import React from "react";

interface FeatureCardProps {
    title: string;
    description: string;
    icon: string;
    delay?: number;
    x?: number;
    y?: number;
    index?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    title,
    description,
    icon,
    delay = 0,
    x = 50,
    y = 50,
    index = 0,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const progress = spring({
        frame: frame - delay,
        fps,
        config: { damping: 15, stiffness: 120, mass: 0.8 },
    });

    const slideX = interpolate(progress, [0, 1], [100, 0], {
        extrapolateRight: "clamp",
    });

    const opacity = interpolate(progress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    const scale = interpolate(progress, [0, 1], [0.8, 1], {
        extrapolateRight: "clamp",
    });

    const floatY = Math.sin((frame / fps) * 1.5 + index) * 3;

    const glowIntensity = interpolate(
        Math.sin((frame / fps) * 2 + index),
        [-1, 1],
        [0.3, 0.6]
    );

    return (
        <div
            style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) translateX(${slideX}px) translateY(${floatY}px) scale(${scale})`,
                opacity,
                width: 320,
                padding: 30,
                background: "linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,107,53,0.05) 100%)",
                borderRadius: 20,
                border: "1px solid rgba(255,215,0,0.3)",
                boxShadow: `0 0 40px rgba(255,215,0,${glowIntensity}), inset 0 1px 0 rgba(255,255,255,0.1)`,
                backdropFilter: "blur(10px)",
            }}
        >
            <div
                style={{
                    fontSize: 40,
                    marginBottom: 15,
                    filter: "drop-shadow(0 0 10px rgba(255,215,0,0.5))",
                }}
            >
                {icon}
            </div>
            <div
                style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "#FFD700",
                    marginBottom: 10,
                    textShadow: "0 0 20px rgba(255,215,0,0.5)",
                }}
            >
                {title}
            </div>
            <div
                style={{
                    fontSize: 16,
                    color: "rgba(255,255,255,0.8)",
                    lineHeight: 1.5,
                }}
            >
                {description}
            </div>
        </div>
    );
};

interface StatsCardProps {
    value: string;
    label: string;
    delay?: number;
    x?: number;
    y?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    value,
    label,
    delay = 0,
    x = 50,
    y = 50,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const progress = spring({
        frame: frame - delay,
        fps,
        config: { damping: 20, stiffness: 100 },
    });

    const scale = interpolate(progress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    const opacity = interpolate(progress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    const rotation = interpolate(progress, [0, 1], [-15, 0], {
        extrapolateRight: "clamp",
    });

    // Animate number counting
    const valueNum = parseFloat(value.replace(/[^0-9.]/g, ""));
    const suffix = value.replace(/[0-9.]/g, "");
    const countProgress = interpolate(progress, [0.3, 1], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const displayValue = Math.floor(valueNum * countProgress);

    return (
        <div
            style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                opacity,
                textAlign: "center",
            }}
        >
            <div
                style={{
                    fontSize: 72,
                    fontWeight: "bold",
                    background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 40px rgba(255,215,0,0.3)",
                    letterSpacing: -2,
                }}
            >
                {displayValue}{suffix}
            </div>
            <div
                style={{
                    fontSize: 22,
                    color: "rgba(255,255,255,0.8)",
                    marginTop: 8,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                }}
            >
                {label}
            </div>
        </div>
    );
};

export const ConnectionLine: React.FC<{
    from: { x: number; y: number };
    to: { x: number; y: number };
    delay?: number;
    color?: string;
}> = ({ from, to, delay = 0, color = "#FFD700" }) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    const progress = spring({
        frame: frame - delay,
        fps,
        config: { damping: 200 },
    });

    const drawProgress = interpolate(progress, [0, 1], [0, 100], {
        extrapolateRight: "clamp",
    });

    const x1 = (from.x / 100) * width;
    const y1 = (from.y / 100) * height;
    const x2 = (to.x / 100) * width;
    const y2 = (to.y / 100) * height;

    const pulse = Math.sin((frame / fps) * 3) * 0.5 + 0.5;

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
                <linearGradient id={`line-gradient-${from.x}-${to.x}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#FF6B35" stopOpacity={0.4} />
                </linearGradient>
            </defs>
            <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={`url(#line-gradient-${from.x}-${to.x})`}
                strokeWidth={2}
                strokeDasharray={`${drawProgress}%`}
                strokeLinecap="round"
                style={{
                    filter: `drop-shadow(0 0 ${5 + pulse * 5}px ${color})`,
                }}
            />
            {/* Animated dot along the line */}
            <circle
                cx={x1 + (x2 - x1) * (pulse * 0.8 + 0.1)}
                cy={y1 + (y2 - y1) * (pulse * 0.8 + 0.1)}
                r={4}
                fill={color}
                opacity={progress}
                style={{
                    filter: `drop-shadow(0 0 10px ${color})`,
                }}
            />
        </svg>
    );
};
