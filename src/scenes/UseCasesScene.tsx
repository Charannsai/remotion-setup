import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { ParticleBackground } from "../components/ParticleBackground";
import { ParallaxGrid } from "../components/ParallaxEffects";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "700", "800"],
    subsets: ["latin"],
});

export const UseCasesScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const useCases = [
        {
            title: "AI Native Interfaces",
            desc: "Streaming chat, image gen, RAG pipelines",
            icon: "🤖",
            color: "#FF6B9D",
        },
        {
            title: "SaaS Platforms",
            desc: "Multi-tenant auth & billing baked in",
            icon: "☁️",
            color: "#4ECDC4",
        },
        {
            title: "Payment Systems",
            desc: "Secure transaction processing",
            icon: "💳",
            color: "#FFD700",
        },
        {
            title: "Internal Tools",
            desc: "Connect databases securely",
            icon: "🔧",
            color: "#96F550",
        },
    ];

    // Title
    const titleProgress = spring({
        frame,
        fps,
        config: { damping: 20, stiffness: 100 },
    });

    const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParticleBackground />
            <ParallaxGrid delay={0} />

            {/* Title */}
            <div
                style={{
                    position: "absolute",
                    top: 60,
                    left: 0,
                    right: 0,
                    textAlign: "center",
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

            {/* Use case cards in 2x2 grid */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 40,
                    marginTop: 30,
                }}
            >
                {useCases.map((useCase, i) => {
                    const cardDelay = 20 + i * 15;
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

                    const cardRotation = interpolate(cardProgress, [0, 1], [10, 0], {
                        extrapolateRight: "clamp",
                    });

                    const floatY = Math.sin((frame / fps) * 1.5 + i * 1.2) * 6;
                    const glowIntensity = Math.sin((frame / fps) * 2 + i) * 0.3 + 0.5;

                    return (
                        <div
                            key={i}
                            style={{
                                transform: `scale(${cardScale}) rotate(${cardRotation}deg) translateY(${floatY}px)`,
                                opacity: cardOpacity,
                                width: 280,
                                padding: 30,
                                background: `linear-gradient(135deg, ${useCase.color}15 0%, ${useCase.color}05 100%)`,
                                border: `1px solid ${useCase.color}40`,
                                borderRadius: 20,
                                boxShadow: `0 0 40px ${useCase.color}${Math.floor(glowIntensity * 30)}`,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 50,
                                    marginBottom: 15,
                                    filter: `drop-shadow(0 0 15px ${useCase.color})`,
                                }}
                            >
                                {useCase.icon}
                            </div>
                            <div
                                style={{
                                    fontSize: 22,
                                    fontWeight: 700,
                                    color: useCase.color,
                                    marginBottom: 8,
                                    textShadow: `0 0 20px ${useCase.color}50`,
                                }}
                            >
                                {useCase.title}
                            </div>
                            <div
                                style={{
                                    fontSize: 14,
                                    color: "rgba(255,255,255,0.7)",
                                    lineHeight: 1.4,
                                }}
                            >
                                {useCase.desc}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};
