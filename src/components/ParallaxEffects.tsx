import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import React from "react";

interface ParallaxLayerProps {
    children: React.ReactNode;
    speed?: number;
    direction?: "up" | "down" | "left" | "right";
    offset?: number;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
    children,
    speed = 1,
    direction = "up",
    offset = 0,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const movement = (frame / fps) * 50 * speed;

    let transform = "";
    switch (direction) {
        case "up":
            transform = `translateY(${offset - movement}px)`;
            break;
        case "down":
            transform = `translateY(${offset + movement}px)`;
            break;
        case "left":
            transform = `translateX(${offset - movement}px)`;
            break;
        case "right":
            transform = `translateX(${offset + movement}px)`;
            break;
    }

    return (
        <div
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                transform,
            }}
        >
            {children}
        </div>
    );
};

interface ParallaxGridProps {
    delay?: number;
}

export const ParallaxGrid: React.FC<ParallaxGridProps> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    const progress = spring({
        frame: frame - delay,
        fps,
        config: { damping: 200 },
    });

    const opacity = interpolate(progress, [0, 1], [0, 0.3], {
        extrapolateRight: "clamp",
    });

    const gridSize = 60;
    const cols = Math.ceil(width / gridSize) + 2;
    const rows = Math.ceil(height / gridSize) + 2;

    const scrollOffset = ((frame / fps) * 30) % gridSize;

    return (
        <AbsoluteFill style={{ opacity }}>
            {/* Vertical lines */}
            {Array.from({ length: cols }).map((_, i) => (
                <div
                    key={`v-${i}`}
                    style={{
                        position: "absolute",
                        left: i * gridSize - scrollOffset,
                        top: 0,
                        width: 1,
                        height: "100%",
                        background: "linear-gradient(to bottom, transparent, #FFD700 20%, #FFD700 80%, transparent)",
                    }}
                />
            ))}
            {/* Horizontal lines */}
            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={`h-${i}`}
                    style={{
                        position: "absolute",
                        left: 0,
                        top: i * gridSize - scrollOffset,
                        width: "100%",
                        height: 1,
                        background: "linear-gradient(to right, transparent, #FFD700 20%, #FFD700 80%, transparent)",
                    }}
                />
            ))}
            {/* Perspective overlay */}
            <div
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    background: "radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.9) 100%)",
                }}
            />
        </AbsoluteFill>
    );
};

export const FloatingShapes: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const shapes = [
        { x: 10, y: 20, size: 120, speed: 0.5, rotation: 1 },
        { x: 80, y: 30, size: 80, speed: 0.7, rotation: -1.5 },
        { x: 15, y: 70, size: 100, speed: 0.3, rotation: 0.8 },
        { x: 85, y: 65, size: 60, speed: 0.9, rotation: -0.5 },
        { x: 50, y: 15, size: 90, speed: 0.4, rotation: 1.2 },
        { x: 45, y: 80, size: 70, speed: 0.6, rotation: -1 },
    ];

    const progress = spring({
        frame: frame - delay,
        fps,
        config: { damping: 200 },
    });

    const baseOpacity = interpolate(progress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill>
            {shapes.map((shape, i) => {
                const time = frame / fps;
                const floatY = Math.sin(time * shape.speed + i) * 20;
                const floatX = Math.cos(time * shape.speed * 0.7 + i) * 15;
                const rotation = time * shape.rotation * 30;

                const shapeProgress = spring({
                    frame: frame - delay - i * 5,
                    fps,
                    config: { damping: 15, stiffness: 100 },
                });

                const scale = interpolate(shapeProgress, [0, 1], [0, 1], {
                    extrapolateRight: "clamp",
                });

                const colors = ["#FFD700", "#4ECDC4", "#FF6B35", "#45B7D1", "#96F550", "#FF6B9D"];
                const color = colors[i % colors.length];

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: `${shape.x}%`,
                            top: `${shape.y}%`,
                            width: shape.size,
                            height: shape.size,
                            borderRadius: i % 2 === 0 ? "50%" : "20%",
                            border: `2px solid ${color}`,
                            background: `${color}10`,
                            transform: `translate(-50%, -50%) translate(${floatX}px, ${floatY}px) rotate(${rotation}deg) scale(${scale})`,
                            opacity: baseOpacity * 0.5,
                            boxShadow: `0 0 30px ${color}30, inset 0 0 30px ${color}10`,
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};
