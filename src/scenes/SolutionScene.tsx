import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { ParticleBackground } from "../components/ParticleBackground";
import { FloatingShapes } from "../components/ParallaxEffects";
import { AnimatedIcon } from "../components/AnimatedIcons";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "700", "800"],
    subsets: ["latin"],
});

export const SolutionScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Main text animation
    const titleProgress = spring({
        frame,
        fps,
        config: { damping: 20, stiffness: 100 },
    });

    const titleScale = interpolate(titleProgress, [0, 1], [0.8, 1], {
        extrapolateRight: "clamp",
    });

    const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Feature highlights
    const features = [
        { icon: "lightning" as const, title: "Zero Latency", desc: "Global edge routing", x: 20, y: 20 },
        { icon: "code" as const, title: "End-to-End Typed", desc: "Auto-inferred types", x: 80, y: 20 },
        { icon: "shield" as const, title: "Military Grade", desc: "PII redaction & secrets", x: 20, y: 80 },
        { icon: "api" as const, title: "Type-Safe SDK", desc: "Ready in minutes", x: 80, y: 80 },
    ];

    // Center hub animation
    const hubProgress = spring({
        frame: frame - 30,
        fps,
        config: { damping: 12, stiffness: 100 },
    });

    const hubScale = interpolate(hubProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    const hubRotation = (frame / fps) * 20;

    // Connection lines animation
    const lineProgress = spring({
        frame: frame - 50,
        fps,
        config: { damping: 200 },
    });

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParticleBackground />
            <FloatingShapes delay={5} />

            {/* Title at top */}
            <div
                style={{
                    position: "absolute",
                    top: 60,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    transform: `scale(${titleScale})`,
                    opacity: titleOpacity,
                }}
            >
                <span
                    style={{
                        fontSize: 42,
                        fontWeight: 700,
                        color: "#ffffff",
                    }}
                >
                    One{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #FFD700 0%, #FF6B35 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Unified Execution Layer
                    </span>
                </span>
            </div>

            {/* Center hub */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) scale(${hubScale})`,
                }}
            >
                {/* Rotating rings */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 200,
                        height: 200,
                        transform: `translate(-50%, -50%) rotate(${hubRotation}deg)`,
                        border: "2px solid rgba(255,215,0,0.3)",
                        borderRadius: "50%",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 260,
                        height: 260,
                        transform: `translate(-50%, -50%) rotate(${-hubRotation * 0.7}deg)`,
                        border: "2px dashed rgba(255,215,0,0.2)",
                        borderRadius: "50%",
                    }}
                />

                {/* Center logo */}
                <div
                    style={{
                        width: 140,
                        height: 140,
                        borderRadius: 35,
                        background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0 0 60px rgba(255,215,0,0.6), 0 0 100px rgba(255,107,53,0.4)",
                    }}
                >
                    <span
                        style={{
                            fontSize: 70,
                            fontWeight: 800,
                            color: "#0a0a0a",
                        }}
                    >
                        E
                    </span>
                </div>
            </div>

            {/* Connection lines to features */}
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
                {features.map((feature, i) => {
                    const startX = 640; // center
                    const startY = 360; // center
                    const endX = (feature.x / 100) * 1280;
                    const endY = (feature.y / 100) * 720;

                    const dashOffset = interpolate(lineProgress, [0, 1], [500, 0], {
                        extrapolateRight: "clamp",
                    });

                    const pulse = Math.sin((frame / fps) * 3 + i) * 0.5 + 0.5;

                    return (
                        <g key={i}>
                            <line
                                x1={startX}
                                y1={startY}
                                x2={endX}
                                y2={endY}
                                stroke="url(#goldGradient)"
                                strokeWidth={2}
                                strokeDasharray="10 5"
                                strokeDashoffset={dashOffset}
                                opacity={lineProgress * 0.6}
                            />
                            <circle
                                cx={startX + (endX - startX) * pulse}
                                cy={startY + (endY - startY) * pulse}
                                r={4}
                                fill="#FFD700"
                                opacity={lineProgress}
                                style={{ filter: "blur(1px)" }}
                            />
                        </g>
                    );
                })}
                <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FF6B35" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Feature cards */}
            {features.map((feature, i) => {
                const cardDelay = 60 + i * 10;
                const cardProgress = spring({
                    frame: frame - cardDelay,
                    fps,
                    config: { damping: 15, stiffness: 120 },
                });

                const cardScale = interpolate(cardProgress, [0, 1], [0.5, 1], {
                    extrapolateRight: "clamp",
                });

                const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1], {
                    extrapolateRight: "clamp",
                });

                const floatY = Math.sin((frame / fps) * 1.5 + i) * 5;

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: `${feature.x}%`,
                            top: `${feature.y}%`,
                            transform: `translate(-50%, -50%) scale(${cardScale}) translateY(${floatY}px)`,
                            opacity: cardOpacity,
                            textAlign: "center",
                        }}
                    >
                        <AnimatedIcon
                            icon={feature.icon}
                            delay={cardDelay - 10}
                            x={50}
                            y={30}
                            size={50}
                            color="#FFD700"
                        />
                        <div
                            style={{
                                fontSize: 22,
                                fontWeight: 700,
                                color: "#FFD700",
                                marginTop: 60,
                                textShadow: "0 0 20px rgba(255,215,0,0.4)",
                            }}
                        >
                            {feature.title}
                        </div>
                        <div
                            style={{
                                fontSize: 14,
                                color: "rgba(255,255,255,0.7)",
                                marginTop: 8,
                            }}
                        >
                            {feature.desc}
                        </div>
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};
