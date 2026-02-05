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

// Scene 6 — Security Layer
// Visual: Shield wrapping EasyBuild, brute force bouncing, rate-limit meter, abuse detection
// Motion: Subtle force-field effect, Soft particle motion

export const SecurityLayerScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Title animation
    const titleProgress = spring({
        frame,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Shield animation
    const shieldProgress = spring({
        frame: frame - 20,
        fps,
        config: springConfigs.bouncy,
    });

    const shieldScale = interpolate(shieldProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    const shieldRotation = interpolate(shieldProgress, [0, 1], [-180, 0], {
        extrapolateRight: "clamp",
    });

    // Force field pulse
    const pulseScale = 1 + Math.sin((frame / fps) * 3) * 0.03;
    const pulseOpacity = 0.3 + Math.sin((frame / fps) * 3) * 0.15;

    // Bouncing attacks
    const attacks = [
        { angle: 30, delay: 50, label: "Brute Force" },
        { angle: 90, delay: 70, label: "Rate Limit" },
        { angle: 150, delay: 90, label: "DDoS" },
        { angle: 210, delay: 110, label: "Credential Stuffing" },
        { angle: 270, delay: 130, label: "API Abuse" },
        { angle: 330, delay: 150, label: "Injection" },
    ];

    // Security features
    const securityFeatures = [
        { title: "Browser Safe", desc: "Keys never exposed", icon: "🔐", color: "#4ECDC4" },
        { title: "Rate Limiting", desc: "Abuse prevention", icon: "⏱️", color: "#FFD700" },
        { title: "Auto Rotation", desc: "Secret lifecycle", icon: "🔄", color: "#FF6B35" },
        { title: "PII Redaction", desc: "Data protection", icon: "🛡️", color: "#96F550" },
    ];

    // Bottom text
    const text1Progress = spring({
        frame: frame - 130,
        fps,
        config: springConfigs.ultraSmooth,
    });

    const text2Progress = spring({
        frame: frame - 145,
        fps,
        config: springConfigs.ultraSmooth,
    });

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#0a0a12" accentColor="#4ECDC4" />
            <PremiumParticles count={40} color="#4ECDC4" />

            {/* Background glow */}
            <GlowOrb x={50} y={45} size={500} color="#4ECDC4" delay={20} intensity={0.4} />

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
                    Enterprise-Grade{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Security
                    </span>
                </span>
            </div>

            {/* Central shield visualization */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "45%",
                    transform: `translate(-50%, -50%) scale(${shieldScale}) rotate(${shieldRotation}deg)`,
                }}
            >
                {/* Outer force field rings */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 320,
                        height: 320,
                        transform: `translate(-50%, -50%) scale(${pulseScale})`,
                        border: "3px solid rgba(78,205,196,0.2)",
                        borderRadius: "50%",
                        opacity: pulseOpacity,
                        boxShadow: "0 0 30px rgba(78,205,196,0.2)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 380,
                        height: 380,
                        transform: `translate(-50%, -50%) scale(${pulseScale * 1.05})`,
                        border: "2px solid rgba(78,205,196,0.1)",
                        borderRadius: "50%",
                        opacity: pulseOpacity * 0.7,
                    }}
                />

                {/* Inner glow ring */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 250,
                        height: 250,
                        transform: `translate(-50%, -50%) scale(${pulseScale})`,
                        border: "4px solid rgba(78,205,196,0.5)",
                        borderRadius: "50%",
                        boxShadow: `0 0 ${40 * pulseScale}px rgba(78,205,196,0.4), inset 0 0 40px rgba(78,205,196,0.1)`,
                    }}
                />

                {/* Shield icon */}
                <div style={{ position: "relative" }}>
                    <svg width="180" height="180" viewBox="0 0 24 24" fill="none">
                        <defs>
                            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4ECDC4" />
                                <stop offset="50%" stopColor="#45B7D1" />
                                <stop offset="100%" stopColor="#96F550" />
                            </linearGradient>
                            <filter id="shieldGlow">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <path
                            d="M12 2L4 6v6c0 5.5 3.4 10.3 8 12 4.6-1.7 8-6.5 8-12V6l-8-4z"
                            fill="url(#shieldGradient)"
                            filter="url(#shieldGlow)"
                            style={{
                                filter: `drop-shadow(0 0 ${30 * pulseScale}px rgba(78,205,196,0.6))`,
                            }}
                        />
                        <path
                            d="M9 12l2 2 4-4"
                            stroke="#0a0a0a"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>

            {/* Bouncing attack indicators */}
            {attacks.map((attack, i) => {
                const attackProgress = spring({
                    frame: frame - attack.delay,
                    fps,
                    config: { damping: 15, stiffness: 200 },
                });

                const attackScale = interpolate(attackProgress, [0, 0.5, 1], [0, 1.2, 0], {
                    extrapolateRight: "clamp",
                });

                const attackOpacity = interpolate(attackProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0], {
                    extrapolateRight: "clamp",
                });

                const rad = (attack.angle * Math.PI) / 180;
                const distance = 200;
                const x = 50 + Math.cos(rad) * (distance / 1920) * 100 * 3;
                const y = 45 + Math.sin(rad) * (distance / 1080) * 100 * 3;

                // Bounce effect
                const bounceDistance = interpolate(attackProgress, [0, 0.5, 1], [0, -20, -60], {
                    extrapolateRight: "clamp",
                });

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: `translate(-50%, -50%) scale(${attackScale}) translateX(${bounceDistance}px)`,
                            opacity: attackOpacity,
                        }}
                    >
                        <div
                            style={{
                                padding: "8px 16px",
                                background: "rgba(255,68,68,0.2)",
                                border: "1px solid rgba(255,68,68,0.5)",
                                borderRadius: 8,
                                color: "#FF4444",
                                fontSize: 12,
                                fontWeight: 600,
                                position: "relative",
                            }}
                        >
                            ❌ {attack.label}
                            {/* Deflection spark */}
                            {attackProgress > 0.4 && attackProgress < 0.7 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        right: -10,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        width: 20,
                                        height: 2,
                                        background: "#FF4444",
                                        boxShadow: "0 0 10px #FF4444",
                                    }}
                                />
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Security feature cards */}
            <div
                style={{
                    position: "absolute",
                    bottom: 100,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    gap: 30,
                }}
            >
                {securityFeatures.map((feature, i) => {
                    const cardProgress = spring({
                        frame: frame - 80 - i * 12,
                        fps,
                        config: springConfigs.liquid,
                    });

                    const cardY = interpolate(cardProgress, [0, 1], [40, 0], {
                        extrapolateRight: "clamp",
                    });

                    return (
                        <div
                            key={i}
                            style={{
                                transform: `translateY(${cardY}px)`,
                                opacity: cardProgress,
                                textAlign: "center",
                                width: 160,
                                padding: "16px 12px",
                                background: `${feature.color}10`,
                                border: `1px solid ${feature.color}30`,
                                borderRadius: 12,
                            }}
                        >
                            <span style={{ fontSize: 28 }}>{feature.icon}</span>
                            <div
                                style={{
                                    fontSize: 15,
                                    fontWeight: 700,
                                    color: feature.color,
                                    marginTop: 8,
                                }}
                            >
                                {feature.title}
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: "rgba(255,255,255,0.5)",
                                    marginTop: 4,
                                }}
                            >
                                {feature.desc}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom text */}
            <div
                style={{
                    position: "absolute",
                    bottom: 40,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        fontSize: 22,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.8)",
                        opacity: text1Progress,
                        marginBottom: 8,
                    }}
                >
                    Secrets never leave EasyBuild.
                </div>
                <div
                    style={{
                        fontSize: 18,
                        color: "#4ECDC4",
                        opacity: text2Progress,
                    }}
                >
                    Protected against abuse and leakage.
                </div>
            </div>

            <CinematicVignette intensity={0.75} />
        </AbsoluteFill>
    );
};
