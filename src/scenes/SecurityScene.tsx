import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { ParticleBackground } from "../components/ParticleBackground";
import { FloatingShapes } from "../components/ParallaxEffects";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "700", "800"],
    subsets: ["latin"],
});

export const SecurityScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Shield animation
    const shieldProgress = spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 80, mass: 0.8 },
    });

    const shieldScale = interpolate(shieldProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    const shieldRotation = interpolate(shieldProgress, [0, 1], [-180, 0], {
        extrapolateRight: "clamp",
    });

    // Pulse effect
    const pulseScale = 1 + Math.sin((frame / fps) * 3) * 0.05;
    const pulseOpacity = 0.3 + Math.sin((frame / fps) * 3) * 0.2;

    // Security features
    const securityFeatures = [
        { title: "Browser Safe", value: "Keys never exposed", icon: "🔐" },
        { title: "99.99% Uptime", value: "Global edge network", icon: "⚡" },
        { title: "Auto Rotation", value: "Secret management", icon: "🔄" },
        { title: "PII Redaction", value: "Data protection", icon: "🛡️" },
    ];

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParticleBackground />
            <FloatingShapes delay={5} />

            {/* Title */}
            <div
                style={{
                    position: "absolute",
                    top: 50,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    opacity: shieldProgress,
                }}
            >
                <span
                    style={{
                        fontSize: 42,
                        fontWeight: 700,
                        color: "#ffffff",
                    }}
                >
                    Your Infrastructure,{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Fortress Secure
                    </span>
                </span>
            </div>

            {/* Center shield */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) scale(${shieldScale}) rotate(${shieldRotation}deg)`,
                }}
            >
                {/* Pulse rings */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 250,
                        height: 250,
                        transform: `translate(-50%, -50%) scale(${pulseScale})`,
                        border: "2px solid rgba(78,205,196,0.3)",
                        borderRadius: "50%",
                        opacity: pulseOpacity,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 320,
                        height: 320,
                        transform: `translate(-50%, -50%) scale(${pulseScale * 1.1})`,
                        border: "2px solid rgba(78,205,196,0.2)",
                        borderRadius: "50%",
                        opacity: pulseOpacity * 0.7,
                    }}
                />

                {/* Shield icon */}
                <svg width="180" height="180" viewBox="0 0 24 24" fill="none">
                    <defs>
                        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4ECDC4" />
                            <stop offset="50%" stopColor="#45B7D1" />
                            <stop offset="100%" stopColor="#96F550" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M12 2L4 6v6c0 5.5 3.4 10.3 8 12 4.6-1.7 8-6.5 8-12V6l-8-4z"
                        fill="url(#shieldGrad)"
                        style={{
                            filter: "drop-shadow(0 0 30px rgba(78,205,196,0.6))",
                        }}
                    />
                    <path
                        d="M9 12l2 2 4-4"
                        stroke="#0a0a0a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Security cards */}
            <div
                style={{
                    position: "absolute",
                    bottom: 80,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    gap: 40,
                }}
            >
                {securityFeatures.map((feature, i) => {
                    const cardDelay = 40 + i * 15;
                    const cardProgress = spring({
                        frame: frame - cardDelay,
                        fps,
                        config: { damping: 15, stiffness: 120 },
                    });

                    const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1], {
                        extrapolateRight: "clamp",
                    });

                    const cardY = interpolate(cardProgress, [0, 1], [30, 0], {
                        extrapolateRight: "clamp",
                    });

                    return (
                        <div
                            key={i}
                            style={{
                                transform: `translateY(${cardY}px)`,
                                opacity: cardOpacity,
                                textAlign: "center",
                                width: 180,
                                padding: 20,
                                background: "rgba(78,205,196,0.1)",
                                border: "1px solid rgba(78,205,196,0.3)",
                                borderRadius: 15,
                            }}
                        >
                            <span style={{ fontSize: 32 }}>{feature.icon}</span>
                            <div
                                style={{
                                    fontSize: 18,
                                    fontWeight: 700,
                                    color: "#4ECDC4",
                                    marginTop: 10,
                                }}
                            >
                                {feature.title}
                            </div>
                            <div
                                style={{
                                    fontSize: 13,
                                    color: "rgba(255,255,255,0.6)",
                                    marginTop: 5,
                                }}
                            >
                                {feature.value}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};
