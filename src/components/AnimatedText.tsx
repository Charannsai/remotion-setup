import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import React from "react";

interface AnimatedTextProps {
    text: string;
    delay?: number;
    fontSize?: number;
    fontWeight?: string | number;
    color?: string;
    gradient?: boolean;
    style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
    text,
    delay = 0,
    fontSize = 72,
    fontWeight = "bold",
    color = "#ffffff",
    gradient = false,
    style = {},
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const words = text.split(" ");

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "0.3em",
                ...style,
            }}
        >
            {words.map((word, wordIndex) => {
                const wordDelay = delay + wordIndex * 4;

                const progress = spring({
                    frame: frame - wordDelay,
                    fps,
                    config: { damping: 15, stiffness: 150, mass: 0.8 },
                });

                const y = interpolate(progress, [0, 1], [60, 0], {
                    extrapolateRight: "clamp",
                });

                const opacity = interpolate(progress, [0, 1], [0, 1], {
                    extrapolateRight: "clamp",
                });

                const blur = interpolate(progress, [0, 1], [10, 0], {
                    extrapolateRight: "clamp",
                });

                const gradientStyle = gradient
                    ? {
                        background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }
                    : {};

                return (
                    <span
                        key={wordIndex}
                        style={{
                            fontSize,
                            fontWeight,
                            color,
                            transform: `translateY(${y}px)`,
                            opacity,
                            filter: `blur(${blur}px)`,
                            display: "inline-block",
                            textShadow: gradient ? "none" : `0 0 40px ${color}40`,
                            ...gradientStyle,
                        }}
                    >
                        {word}
                    </span>
                );
            })}
        </div>
    );
};

export const TypewriterText: React.FC<AnimatedTextProps> = ({
    text,
    delay = 0,
    fontSize = 48,
    fontWeight = "normal",
    color = "#ffffff",
    style = {},
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const adjustedFrame = Math.max(0, frame - delay);
    const charsPerSecond = 25;
    const visibleChars = Math.min(
        Math.floor((adjustedFrame / fps) * charsPerSecond),
        text.length
    );

    const displayText = text.slice(0, visibleChars);
    const cursorOpacity = Math.sin((frame / fps) * 8) > 0 ? 1 : 0;

    return (
        <div
            style={{
                fontSize,
                fontWeight,
                color,
                fontFamily: "'Fira Code', monospace",
                ...style,
            }}
        >
            {displayText}
            <span style={{ opacity: cursorOpacity, color: "#FFD700" }}>|</span>
        </div>
    );
};

export const GlitchText: React.FC<AnimatedTextProps> = ({
    text,
    delay = 0,
    fontSize = 72,
    fontWeight = "bold",
    color = "#ffffff",
    style = {},
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const glitchIntensity = Math.sin((frame / fps) * 15) > 0.8 ? 1 : 0;
    const hueShift = glitchIntensity * (Math.random() * 20 - 10);
    const xShift = glitchIntensity * (Math.sin(frame * 0.5) * 5);
    const yShift = glitchIntensity * (Math.cos(frame * 0.3) * 3);

    const progress = spring({
        frame: frame - delay,
        fps,
        config: { damping: 20, stiffness: 100 },
    });

    const scale = interpolate(progress, [0, 1], [0.5, 1], {
        extrapolateRight: "clamp",
    });

    const opacity = interpolate(progress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                position: "relative",
                fontSize,
                fontWeight,
                color,
                transform: `scale(${scale}) translate(${xShift}px, ${yShift}px)`,
                opacity,
                ...style,
            }}
        >
            {/* Glitch layers */}
            <span
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    color: "#ff0040",
                    clipPath: `polygon(0 ${30 + glitchIntensity * 10}%, 100% ${30 + glitchIntensity * 10}%, 100% ${50 + glitchIntensity * 10}%, 0 ${50 + glitchIntensity * 10}%)`,
                    transform: `translateX(${glitchIntensity * -3}px)`,
                    opacity: glitchIntensity * 0.8,
                }}
            >
                {text}
            </span>
            <span
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    color: "#00ffff",
                    clipPath: `polygon(0 ${60 + glitchIntensity * 10}%, 100% ${60 + glitchIntensity * 10}%, 100% ${80 + glitchIntensity * 10}%, 0 ${80 + glitchIntensity * 10}%)`,
                    transform: `translateX(${glitchIntensity * 3}px)`,
                    opacity: glitchIntensity * 0.8,
                }}
            >
                {text}
            </span>
            <span>{text}</span>
        </div>
    );
};
