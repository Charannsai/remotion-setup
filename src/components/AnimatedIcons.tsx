import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import React from "react";

interface IconProps {
    delay?: number;
    x?: number;
    y?: number;
    size?: number;
    color?: string;
    icon: "shield" | "globe" | "lightning" | "lock" | "code" | "rocket" | "api" | "cloud" | "check" | "star";
}

export const AnimatedIcon: React.FC<IconProps> = ({
    delay = 0,
    x = 50,
    y = 50,
    size = 80,
    color = "#FFD700",
    icon,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const progress = spring({
        frame: frame - delay,
        fps,
        config: { damping: 12, stiffness: 100, mass: 0.6 },
    });

    const scale = interpolate(progress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    const rotation = interpolate(progress, [0, 1], [-180, 0], {
        extrapolateRight: "clamp",
    });

    const opacity = interpolate(progress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    const floatY = Math.sin((frame / fps) * 2) * 5;

    const iconPaths: Record<string, string> = {
        shield: "M12 2L4 6v6c0 5.5 3.4 10.3 8 12 4.6-1.7 8-6.5 8-12V6l-8-4z",
        globe: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 17.9c-3.4-.5-6-3.5-6-7.1 0-.4 0-.7.1-1.1l4.9 4.9v.5c0 1.4 1.1 2.5 2.5 2.5v.3h-1.5zm6.9-2.5c-.4-1-1.3-1.7-2.4-1.7h-.5v-2.5c0-.7-.6-1.3-1.3-1.3H9.5V9.2h1.3c.7 0 1.3-.6 1.3-1.3V6.7h2.5c1.4 0 2.5-1.1 2.5-2.5V4c2.4 1.7 4 4.6 4 7.8 0 2.4-.9 4.6-2.3 6.3l-.4.3z",
        lightning: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
        lock: "M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1s3.1 1.4 3.1 3.1v2z",
        code: "M8 3L2 9.1 8 15l1.4-1.4L4.8 9.1l4.6-4.5L8 3zm8 0l-1.4 1.4 4.6 4.5-4.6 4.5L16 15l6-5.9L16 3z",
        rocket: "M12 2.5c-2 0-6 1.5-6 11 0 5.3 6 8.5 6 8.5s6-3.2 6-8.5c0-9.5-4-11-6-11zm0 12c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zM6.5 13.5l-3.5 6h5l1.5-3-3-3zM17.5 13.5l3.5 6h-5l-1.5-3 3-3z",
        api: "M7 7H5v2h2V7zm0 4H5v2h2v-2zm0 4H5v2h2v-2zm12-8h-8v2h8V7zm0 4h-8v2h8v-2zm0 4h-8v2h8v-2z",
        cloud: "M19.4 10.1c-.1-3.4-2.9-6.1-6.4-6.1-2.5 0-4.6 1.4-5.7 3.4-.4-.1-.8-.2-1.3-.2-2.5 0-4.5 2-4.5 4.4 0 .4.1.8.2 1.2C.7 13.5 0 14.8 0 16.3 0 19 2.2 21 4.9 21h12.7c2.9 0 5.4-2.4 5.4-5.4 0-2.5-1.7-4.6-4-5.2-.2-.8-.4-1.6-.6-2.3z",
        check: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z",
        star: "M12 17.3l6.2 3.7-1.6-7L22 9.2l-7.2-.6L12 2 9.2 8.6 2 9.2l5.4 4.8-1.6 7z",
    };

    return (
        <div
            style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg) translateY(${floatY}px)`,
                opacity,
            }}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                style={{
                    filter: `drop-shadow(0 0 ${size / 4}px ${color})`,
                }}
            >
                <defs>
                    <linearGradient id={`gradient-${icon}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={color} />
                        <stop offset="100%" stopColor="#FF6B35" />
                    </linearGradient>
                </defs>
                <path d={iconPaths[icon]} fill={`url(#gradient-${icon})`} />
            </svg>
        </div>
    );
};

export const FloatingIcons: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const icons: Array<{ icon: IconProps["icon"]; x: number; y: number; delay: number }> = [
        { icon: "shield", x: 15, y: 20, delay: 0 },
        { icon: "globe", x: 85, y: 25, delay: 5 },
        { icon: "lightning", x: 20, y: 70, delay: 10 },
        { icon: "lock", x: 80, y: 75, delay: 15 },
        { icon: "rocket", x: 50, y: 85, delay: 20 },
        { icon: "code", x: 10, y: 45, delay: 8 },
        { icon: "api", x: 90, y: 50, delay: 12 },
    ];

    return (
        <AbsoluteFill>
            {icons.map((item, i) => (
                <AnimatedIcon
                    key={i}
                    icon={item.icon}
                    x={item.x}
                    y={item.y}
                    delay={delay + item.delay}
                    size={50}
                    color="#FFD700"
                />
            ))}
        </AbsoluteFill>
    );
};
