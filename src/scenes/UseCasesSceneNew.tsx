import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import {
    ParallaxBackground,
    PremiumParticles,
    CinematicVignette,
    springConfigs,
    GlowOrb,
} from "../components/PremiumEffects";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "600", "700", "800"],
    subsets: ["latin"],
});

// Scene 7 — Product Use Cases
// Visual: AI app, Payment app, SaaS dashboard, Chrome extension, Mobile app - all flowing through EasyBuild
// Motion: Card-based UI transitions, Soft stacking, Smooth layout shifts

export const UseCasesSceneNew: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Title animation
    const titleProgress = spring({
        frame,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Use cases
    const useCases = [
        { title: "AI Apps", icon: "🤖", desc: "GPT, Claude, Image Gen", color: "#FF6B9D", x: 20, y: 35 },
        { title: "Payments", icon: "💳", desc: "Stripe, PayPal, Crypto", color: "#635bff", x: 50, y: 25 },
        { title: "SaaS", icon: "☁️", desc: "Multi-tenant platforms", color: "#4ECDC4", x: 80, y: 35 },
        { title: "Extensions", icon: "🧩", desc: "Chrome, Firefox, Safari", color: "#FFD700", x: 30, y: 65 },
        { title: "Mobile", icon: "📱", desc: "iOS, Android, React Native", color: "#96F550", x: 70, y: 65 },
    ];

    // Center hub animation
    const hubProgress = spring({
        frame: frame - 30,
        fps,
        config: springConfigs.bouncy,
    });

    const hubScale = interpolate(hubProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Connection flow animation
    const flowProgress = spring({
        frame: frame - 70,
        fps,
        config: springConfigs.gentle,
        durationInFrames: 80,
    });

    // Subtitle text
    const textProgress = spring({
        frame: frame - 130,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Rotating ring
    const ringRotation = (frame / fps) * 20;

    // Glow pulse
    const glowPulse = Math.sin((frame / fps) * 2) * 0.2 + 0.8;

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#0a0a12" accentColor="#FFD700" />
            <PremiumParticles count={35} color="#FFD700" />

            {/* Background glow for center */}
            <GlowOrb x={50} y={50} size={400} color="#FFD700" delay={30} intensity={0.35} />

            {/* Title */}
            <div
                style={{
                    position: "absolute",
                    top: 50,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    opacity: titleProgress,
                    transform: `translateY(${interpolate(titleProgress, [0, 1], [-30, 0], { extrapolateRight: "clamp" })}px)`,
                }}
            >
                <span style={{ fontSize: 42, fontWeight: 700, color: "#ffffff" }}>
                    Universally{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Adaptable
                    </span>
                </span>
            </div>

            {/* Center EasyBuild Hub */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) scale(${hubScale})`,
                }}
            >
                {/* Rotating outer ring */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 180,
                        height: 180,
                        transform: `translate(-50%, -50%) rotate(${ringRotation}deg)`,
                        border: "2px dashed rgba(255,215,0,0.3)",
                        borderRadius: "50%",
                    }}
                />

                {/* Logo */}
                <div
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 25,
                        background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: `0 0 ${60 * glowPulse}px rgba(255,215,0,${glowPulse * 0.7})`,
                    }}
                >
                    <span style={{ fontSize: 50, fontWeight: 800, color: "#0a0a0a" }}>E</span>
                </div>
            </div>

            {/* Connection lines to use cases */}
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
                    <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FF6B35" />
                    </linearGradient>
                </defs>
                {useCases.map((useCase, i) => {
                    const centerX = 960; // 50% of 1920
                    const centerY = 540; // 50% of 1080
                    const useCaseX = (useCase.x / 100) * 1920;
                    const useCaseY = (useCase.y / 100) * 1080;

                    const lineProgress = interpolate(flowProgress, [i * 0.15, i * 0.15 + 0.5], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    });

                    // Animated pulse along the line
                    const pulsePosition = ((frame / fps) * 0.5 + i * 0.2) % 1;

                    return (
                        <g key={i}>
                            <line
                                x1={centerX}
                                y1={centerY}
                                x2={useCaseX}
                                y2={useCaseY}
                                stroke="url(#flowGrad)"
                                strokeWidth={2}
                                strokeDasharray="500"
                                strokeDashoffset={interpolate(lineProgress, [0, 1], [500, 0])}
                                opacity={lineProgress * 0.6}
                            />
                            {/* Traveling dot */}
                            {lineProgress > 0.5 && (
                                <circle
                                    cx={centerX + (useCaseX - centerX) * pulsePosition}
                                    cy={centerY + (useCaseY - centerY) * pulsePosition}
                                    r={4}
                                    fill={useCase.color}
                                    opacity={0.8}
                                    style={{ filter: "blur(1px)" }}
                                />
                            )}
                        </g>
                    );
                })}
            </svg>

            {/* Use case cards */}
            {useCases.map((useCase, i) => {
                const cardDelay = 40 + i * 15;
                const cardProgress = spring({
                    frame: frame - cardDelay,
                    fps,
                    config: springConfigs.liquid,
                });

                const cardScale = interpolate(cardProgress, [0, 1], [0.5, 1], {
                    extrapolateRight: "clamp",
                });

                const cardRotation = interpolate(cardProgress, [0, 1], [15, 0], {
                    extrapolateRight: "clamp",
                });

                // Floating effect
                const floatY = Math.sin((frame / fps) * 1.5 + i * 1.2) * 8;
                const floatGlow = Math.sin((frame / fps) * 2 + i) * 0.3 + 0.5;

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: `${useCase.x}%`,
                            top: `${useCase.y}%`,
                            transform: `translate(-50%, -50%) scale(${cardScale}) rotate(${cardRotation}deg) translateY(${floatY}px)`,
                            opacity: cardProgress,
                        }}
                    >
                        <div
                            style={{
                                width: 140,
                                padding: "20px 15px",
                                background: `linear-gradient(135deg, ${useCase.color}15 0%, ${useCase.color}05 100%)`,
                                border: `1px solid ${useCase.color}40`,
                                borderRadius: 16,
                                textAlign: "center",
                                boxShadow: `0 0 ${40 * floatGlow}px ${useCase.color}${Math.floor(floatGlow * 30).toString(16)}`,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 40,
                                    marginBottom: 10,
                                    filter: `drop-shadow(0 0 15px ${useCase.color})`,
                                }}
                            >
                                {useCase.icon}
                            </div>
                            <div
                                style={{
                                    fontSize: 17,
                                    fontWeight: 700,
                                    color: useCase.color,
                                    marginBottom: 5,
                                    textShadow: `0 0 15px ${useCase.color}50`,
                                }}
                            >
                                {useCase.title}
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: "rgba(255,255,255,0.6)",
                                    lineHeight: 1.3,
                                }}
                            >
                                {useCase.desc}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Bottom subtitle */}
            <div
                style={{
                    position: "absolute",
                    bottom: 60,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    opacity: textProgress,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 40,
                        fontSize: 18,
                        fontWeight: 600,
                    }}
                >
                    {["AI apps", "Payments", "SaaS", "Extensions", "Mobile"].map((item, i) => {
                        const colors = ["#FF6B9D", "#635bff", "#4ECDC4", "#FFD700", "#96F550"];
                        return (
                            <span
                                key={i}
                                style={{
                                    color: colors[i],
                                    opacity: 0.9,
                                }}
                            >
                                {item}
                            </span>
                        );
                    })}
                </div>
            </div>

            <CinematicVignette intensity={0.75} />
        </AbsoluteFill>
    );
};
