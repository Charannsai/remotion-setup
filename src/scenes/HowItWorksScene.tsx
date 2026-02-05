import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadFiraCode } from "@remotion/google-fonts/FiraCode";
import {
    ParallaxBackground,
    PremiumParticles,
    CinematicVignette,
    springConfigs,
    GlowOrb,
    BezierLine,
} from "../components/PremiumEffects";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "600", "700", "800"],
    subsets: ["latin"],
});

const { fontFamily: monoFont } = loadFiraCode("normal", {
    weights: ["400", "500"],
    subsets: ["latin"],
});

// Scene 4 — How It Works (Conceptual)
// Visual: Frontend → EasyBuild → Provider flow, secret injection visualization
// Motion: Line animations, Smooth bezier motion, Layer glow on injection moment

export const HowItWorksScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Title animation
    const titleProgress = spring({
        frame,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Flow diagram nodes
    const nodes = [
        { label: "Frontend App", icon: "💻", x: 15, y: 50, color: "#4ECDC4" },
        { label: "EasyBuild Gateway", icon: "⚡", x: 50, y: 50, color: "#FFD700", isCenter: true },
        { label: "Third-party API", icon: "🔌", x: 85, y: 50, color: "#96F550" },
    ];

    // Secret injection visualization
    const injectionProgress = spring({
        frame: frame - 80,
        fps,
        config: springConfigs.liquid,
        durationInFrames: 40,
    });

    // Flow step texts
    const flowSteps = [
        { text: "Frontend sends request", delay: 60, x: 15, y: 72 },
        { text: "Secrets injected server-side", delay: 100, x: 50, y: 72 },
        { text: "Response flows back", delay: 140, x: 85, y: 72 },
    ];

    // Bottom text animations
    const text1Progress = spring({
        frame: frame - 120,
        fps,
        config: springConfigs.ultraSmooth,
    });

    const text2Progress = spring({
        frame: frame - 140,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Pulse for center node
    const centerPulse = Math.sin((frame / fps) * 3) * 0.1 + 1;

    // Data packet animation
    const packetProgress = interpolate(
        frame,
        [40, 70, 100, 130],
        [0, 1, 1, 2],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#0a0a12" accentColor="#FFD700" />
            <PremiumParticles count={40} color="#FFD700" />

            {/* Background glow for center */}
            <GlowOrb x={50} y={50} size={400} color="#FFD700" delay={40} intensity={0.4} />

            {/* Title */}
            <div
                style={{
                    position: "absolute",
                    top: 60,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    opacity: titleProgress,
                    transform: `translateY(${interpolate(titleProgress, [0, 1], [-30, 0], { extrapolateRight: "clamp" })}px)`,
                }}
            >
                <span style={{ fontSize: 42, fontWeight: 700, color: "#ffffff" }}>
                    How{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #FFD700 0%, #FF6B35 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        It Works
                    </span>
                </span>
            </div>

            {/* Connection lines */}
            <BezierLine
                start={{ x: 22, y: 50 }}
                end={{ x: 42, y: 50 }}
                color="#4ECDC4"
                delay={30}
                strokeWidth={3}
            />
            <BezierLine
                start={{ x: 58, y: 50 }}
                end={{ x: 78, y: 50 }}
                color="#96F550"
                delay={60}
                strokeWidth={3}
            />

            {/* Flow diagram nodes */}
            {nodes.map((node, i) => {
                const nodeProgress = spring({
                    frame: frame - 20 - i * 15,
                    fps,
                    config: springConfigs.bouncy,
                });

                const scale = interpolate(nodeProgress, [0, 1], [0, 1], {
                    extrapolateRight: "clamp",
                });

                const isCenter = node.isCenter;
                const nodeScale = isCenter ? scale * centerPulse : scale;

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: `${node.x}%`,
                            top: `${node.y}%`,
                            transform: `translate(-50%, -50%) scale(${nodeScale})`,
                        }}
                    >
                        {/* Node container */}
                        <div
                            style={{
                                width: isCenter ? 160 : 130,
                                height: isCenter ? 160 : 130,
                                borderRadius: isCenter ? 40 : 25,
                                background: isCenter
                                    ? "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)"
                                    : `linear-gradient(135deg, ${node.color}30 0%, ${node.color}10 100%)`,
                                border: isCenter ? "none" : `2px solid ${node.color}50`,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                boxShadow: isCenter
                                    ? `0 0 80px rgba(255,215,0,0.6), 0 20px 60px rgba(0,0,0,0.4)`
                                    : `0 0 30px ${node.color}30, 0 10px 40px rgba(0,0,0,0.3)`,
                            }}
                        >
                            <span style={{ fontSize: isCenter ? 50 : 40 }}>{node.icon}</span>
                        </div>

                        {/* Label */}
                        <div
                            style={{
                                marginTop: 15,
                                textAlign: "center",
                                fontSize: isCenter ? 18 : 14,
                                fontWeight: isCenter ? 700 : 600,
                                color: isCenter ? "#FFD700" : node.color,
                            }}
                        >
                            {node.label}
                        </div>
                    </div>
                );
            })}

            {/* Traveling data packet */}
            {packetProgress > 0 && packetProgress < 2 && (
                <div
                    style={{
                        position: "absolute",
                        left: `${15 + packetProgress * 35}%`,
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 20,
                        height: 20,
                        background: packetProgress < 1 ? "#4ECDC4" : "#96F550",
                        borderRadius: "50%",
                        boxShadow: `0 0 20px ${packetProgress < 1 ? "#4ECDC4" : "#96F550"}`,
                    }}
                />
            )}

            {/* Secret injection visual */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "28%",
                    transform: "translateX(-50%)",
                    opacity: injectionProgress,
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        padding: "12px 24px",
                        background: "rgba(255,215,0,0.15)",
                        border: "1px solid rgba(255,215,0,0.4)",
                        borderRadius: 12,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        transform: `scale(${interpolate(injectionProgress, [0, 1], [0.8, 1], { extrapolateRight: "clamp" })})`,
                    }}
                >
                    <span style={{ fontSize: 20 }}>🔐</span>
                    <span style={{ fontFamily: monoFont, fontSize: 14, color: "#FFD700" }}>
                        API_KEY=sk-*** injected
                    </span>
                    <span style={{ fontSize: 16, color: "#96F550" }}>✓</span>
                </div>

                {/* Injection line animation */}
                <svg
                    width="4"
                    height="60"
                    style={{ display: "block", margin: "0 auto" }}
                >
                    <line
                        x1="2"
                        y1="0"
                        x2="2"
                        y2="60"
                        stroke="url(#injectionGrad)"
                        strokeWidth="2"
                        strokeDasharray="60"
                        strokeDashoffset={interpolate(injectionProgress, [0, 1], [60, 0], { extrapolateRight: "clamp" })}
                    />
                    <defs>
                        <linearGradient id="injectionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFD700" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Flow step labels */}
            {flowSteps.map((step, i) => {
                const stepProgress = spring({
                    frame: frame - step.delay,
                    fps,
                    config: springConfigs.ultraSmooth,
                });

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: `${step.x}%`,
                            top: `${step.y}%`,
                            transform: "translateX(-50%)",
                            opacity: stepProgress,
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 13,
                                color: "rgba(255,255,255,0.6)",
                                transform: `translateY(${interpolate(stepProgress, [0, 1], [15, 0], { extrapolateRight: "clamp" })}px)`,
                            }}
                        >
                            {step.text}
                        </div>
                    </div>
                );
            })}

            {/* Bottom text */}
            <div
                style={{
                    position: "absolute",
                    bottom: 80,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        fontSize: 28,
                        fontWeight: 600,
                        color: "#ffffff",
                        opacity: text1Progress,
                        transform: `translateY(${interpolate(text1Progress, [0, 1], [20, 0], { extrapolateRight: "clamp" })}px)`,
                        marginBottom: 12,
                    }}
                >
                    <span style={{ color: "#4ECDC4" }}>Frontend</span>
                    {" → "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #FFD700 0%, #FF6B35 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        EasyBuild
                    </span>
                    {" → "}
                    <span style={{ color: "#96F550" }}>Provider</span>
                </div>
                <div
                    style={{
                        fontSize: 22,
                        color: "rgba(255,255,255,0.6)",
                        opacity: text2Progress,
                        transform: `translateY(${interpolate(text2Progress, [0, 1], [20, 0], { extrapolateRight: "clamp" })}px)`,
                    }}
                >
                    No keys ever touch the client.
                </div>
            </div>

            <CinematicVignette intensity={0.75} />
        </AbsoluteFill>
    );
};
