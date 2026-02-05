import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from "remotion";
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

// SCENE 6 — SECURITY SHIELD
// Visual: Shield force-field wrapping EasyBuild, attacks bouncing off, rate-limit meter, abuse pulse
// Motion: Subtle force-field effect, soft particles, cinematic lighting

export const SecurityShieldScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Shield formation
    const shieldProgress = spring({
        frame: frame - 20,
        fps,
        config: springConfigs.bouncy,
    });

    const shieldScale = interpolate(shieldProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Force-field pulse
    const pulsePhase = (frame / fps) * 3;
    const pulse1 = Math.sin(pulsePhase) * 0.05 + 1;
    const pulse2 = Math.sin(pulsePhase + 1) * 0.08 + 1;
    const pulse3 = Math.sin(pulsePhase + 2) * 0.1 + 1;

    // Incoming attacks
    const attacks = [
        { label: "Brute Force", startAngle: 30, delay: 40, color: "#FF4444" },
        { label: "Rate Abuse", startAngle: 75, delay: 55, color: "#FF6B35" },
        { label: "DDoS", startAngle: 120, delay: 70, color: "#FF4444" },
        { label: "Injection", startAngle: 165, delay: 85, color: "#FF0000" },
        { label: "Credential Stuffing", startAngle: 210, delay: 100, color: "#FF4444" },
        { label: "API Abuse", startAngle: 255, delay: 115, color: "#FF6B35" },
        { label: "Data Scraping", startAngle: 300, delay: 130, color: "#FF4444" },
        { label: "Token Theft", startAngle: 345, delay: 145, color: "#FF0000" },
    ];

    // Rate limit meter
    const meterProgress = spring({
        frame: frame - 60,
        fps,
        config: springConfigs.liquid,
    });

    const meterValue = interpolate(meterProgress, [0, 1], [0, 78], {
        extrapolateRight: "clamp",
    });

    // Text animations
    const text1Progress = spring({
        frame: frame - 140,
        fps,
        config: springConfigs.ultraSmooth,
    });

    const text2Progress = spring({
        frame: frame - 155,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Glow pulse
    const glowPulse = Math.sin((frame / fps) * 2.5) * 0.3 + 0.7;

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#080812" accentColor="#4ECDC4" />
            <PremiumParticles count={50} color="#4ECDC4" />

            {/* Background glows */}
            <GlowOrb x={50} y={45} size={550} color="#4ECDC4" delay={15} intensity={0.45} />
            <GlowOrb x={50} y={45} size={350} color="#45B7D1" delay={25} intensity={0.35} />

            {/* Title */}
            <div
                style={{
                    position: "absolute",
                    top: 55,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        fontSize: 48,
                        fontWeight: 800,
                        color: "#ffffff",
                        opacity: shieldProgress,
                        transform: `translateY(${interpolate(shieldProgress, [0, 1], [-50, 0], { extrapolateRight: "clamp" })}px)`,
                    }}
                >
                    Enterprise-Grade{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            filter: `drop-shadow(0 0 20px rgba(78,205,196,${glowPulse}))`,
                        }}
                    >
                        Security
                    </span>
                </div>
            </div>

            {/* Central shield visualization */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) scale(${shieldScale})`,
                }}
            >
                {/* Force-field ring 1 (outer) */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 450,
                        height: 450,
                        transform: `translate(-50%, -50%) scale(${pulse1})`,
                        border: "3px solid rgba(78,205,196,0.2)",
                        borderRadius: "50%",
                        boxShadow: `0 0 40px rgba(78,205,196,0.15)`,
                    }}
                />

                {/* Force-field ring 2 */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 380,
                        height: 380,
                        transform: `translate(-50%, -50%) scale(${pulse2})`,
                        border: "2px solid rgba(78,205,196,0.3)",
                        borderRadius: "50%",
                    }}
                />

                {/* Force-field ring 3 (inner, strongest) */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 300,
                        height: 300,
                        transform: `translate(-50%, -50%) scale(${pulse3})`,
                        border: "4px solid rgba(78,205,196,0.5)",
                        borderRadius: "50%",
                        boxShadow: `
                            0 0 ${60 * glowPulse}px rgba(78,205,196,${glowPulse * 0.5}),
                            inset 0 0 50px rgba(78,205,196,0.1)
                        `,
                    }}
                />

                {/* Shield icon in center */}
                <div style={{ position: "relative" }}>
                    <svg width="200" height="200" viewBox="0 0 24 24" fill="none">
                        <defs>
                            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
                            fill="url(#shieldGrad)"
                            filter="url(#shieldGlow)"
                            style={{
                                filter: `drop-shadow(0 0 ${40 * glowPulse}px rgba(78,205,196,${glowPulse}))`,
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

            {/* Bouncing attacks */}
            {attacks.map((attack, i) => {
                const attackProgress = spring({
                    frame: frame - attack.delay,
                    fps,
                    config: { damping: 8, stiffness: 100 },
                });

                // Attack starts far, comes in, then bounces back
                const inProgress = interpolate(attackProgress, [0, 0.4], [0, 1], {
                    extrapolateRight: "clamp",
                });
                const bounceProgress = interpolate(attackProgress, [0.4, 1], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                });

                const rad = (attack.startAngle * Math.PI) / 180;
                const startDistance = 500;
                const hitDistance = 180;
                const bounceDistance = 350;

                const currentDistance = interpolate(
                    attackProgress,
                    [0, 0.4, 1],
                    [startDistance, hitDistance, bounceDistance],
                    { extrapolateRight: "clamp" }
                );

                const x = 50 + Math.cos(rad) * (currentDistance / 1920) * 100 * 2;
                const y = 50 + Math.sin(rad) * (currentDistance / 1080) * 100 * 2;

                // Deflection spark
                const showSpark = attackProgress > 0.35 && attackProgress < 0.5;
                const sparkOpacity = interpolate(attackProgress, [0.35, 0.42, 0.5], [0, 1, 0], {
                    extrapolateRight: "clamp",
                });

                // Fade out as bouncing away
                const opacity = interpolate(attackProgress, [0, 0.4, 0.7, 1], [0, 1, 0.8, 0], {
                    extrapolateRight: "clamp",
                });

                return (
                    <React.Fragment key={i}>
                        <div
                            style={{
                                position: "absolute",
                                left: `${x}%`,
                                top: `${y}%`,
                                transform: "translate(-50%, -50%)",
                                opacity,
                            }}
                        >
                            <div
                                style={{
                                    padding: "8px 16px",
                                    background: `linear-gradient(135deg, ${attack.color}25 0%, ${attack.color}10 100%)`,
                                    border: `2px solid ${attack.color}60`,
                                    borderRadius: 8,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    boxShadow: `0 0 20px ${attack.color}30`,
                                }}
                            >
                                <span style={{ color: attack.color, fontSize: 14 }}>❌</span>
                                <span style={{ color: attack.color, fontSize: 13, fontWeight: 600 }}>
                                    {attack.label}
                                </span>
                            </div>
                        </div>

                        {/* Deflection spark */}
                        {showSpark && (
                            <div
                                style={{
                                    position: "absolute",
                                    left: `${50 + Math.cos(rad) * (hitDistance / 1920) * 100 * 2}%`,
                                    top: `${50 + Math.sin(rad) * (hitDistance / 1080) * 100 * 2}%`,
                                    transform: "translate(-50%, -50%)",
                                    width: 30,
                                    height: 30,
                                    background: `radial-gradient(circle, ${attack.color} 0%, transparent 70%)`,
                                    borderRadius: "50%",
                                    opacity: sparkOpacity,
                                    boxShadow: `0 0 30px ${attack.color}`,
                                }}
                            />
                        )}
                    </React.Fragment>
                );
            })}

            {/* Rate limit meter */}
            <div
                style={{
                    position: "absolute",
                    right: 60,
                    top: "35%",
                    transform: `scale(${meterProgress})`,
                    opacity: meterProgress,
                }}
            >
                <div
                    style={{
                        background: "rgba(78,205,196,0.08)",
                        border: "1px solid rgba(78,205,196,0.3)",
                        borderRadius: 16,
                        padding: 22,
                        width: 180,
                        textAlign: "center",
                    }}
                >
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 2, marginBottom: 12 }}>
                        RATE LIMITER
                    </div>
                    <div
                        style={{
                            fontSize: 42,
                            fontWeight: 800,
                            color: "#4ECDC4",
                            textShadow: "0 0 30px rgba(78,205,196,0.5)",
                        }}
                    >
                        {Math.floor(meterValue)}%
                    </div>
                    <div
                        style={{
                            width: "100%",
                            height: 8,
                            background: "rgba(78,205,196,0.15)",
                            borderRadius: 4,
                            marginTop: 15,
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: `${meterValue}%`,
                                height: "100%",
                                background: "linear-gradient(90deg, #4ECDC4, #96F550)",
                                borderRadius: 4,
                                boxShadow: "0 0 15px rgba(78,205,196,0.6)",
                            }}
                        />
                    </div>
                    <div style={{ fontSize: 10, color: "#96F550", marginTop: 10 }}>
                        ✓ Abuse blocked
                    </div>
                </div>
            </div>

            {/* Bottom text */}
            <div
                style={{
                    position: "absolute",
                    bottom: 70,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    perspective: 600,
                }}
            >
                <div
                    style={{
                        fontSize: 30,
                        fontWeight: 700,
                        color: "#ffffff",
                        transform: `translateY(${interpolate(text1Progress, [0, 1], [50, 0], { extrapolateRight: "clamp" })}px) rotateX(${interpolate(text1Progress, [0, 1], [15, 0], { extrapolateRight: "clamp" })}deg)`,
                        opacity: text1Progress,
                        marginBottom: 15,
                    }}
                >
                    Secrets{" "}
                    <span style={{ color: "#4ECDC4" }}>never leave</span>{" "}
                    EasyBuild.
                </div>
                <div
                    style={{
                        fontSize: 20,
                        color: "rgba(255,255,255,0.6)",
                        transform: `translateY(${interpolate(text2Progress, [0, 1], [30, 0], { extrapolateRight: "clamp" })}px)`,
                        opacity: text2Progress,
                    }}
                >
                    Protected{" "}
                    <span style={{ color: "#96F550", fontWeight: 600 }}>by design</span>.
                </div>
            </div>

            <CinematicVignette intensity={0.8} />
        </AbsoluteFill>
    );
};
