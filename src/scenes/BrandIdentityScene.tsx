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

// SCENE 9 — BRAND IDENTITY
// Visual: Dashboard UI blur mock, hero parallax, soft reflections, clean typography
// Motion: Premium SaaS branding motion

export const BrandIdentityScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Hero parallax movement
    const parallaxX = Math.sin((frame / fps) * 0.4) * 30;
    const parallaxY = Math.cos((frame / fps) * 0.3) * 15;
    const parallaxRotation = Math.sin((frame / fps) * 0.2) * 2;

    // Dashboard entrance
    const dashboardProgress = spring({
        frame: frame - 20,
        fps,
        config: springConfigs.liquid,
    });

    const dashboardScale = interpolate(dashboardProgress, [0, 1], [0.85, 1], {
        extrapolateRight: "clamp",
    });

    const dashboardY = interpolate(dashboardProgress, [0, 1], [80, 0], {
        extrapolateRight: "clamp",
    });

    // Title animation
    const titleProgress = spring({
        frame: frame - 60,
        fps,
        config: springConfigs.bouncy,
    });

    // Tagline animation
    const taglineProgress = spring({
        frame: frame - 90,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Feature badges
    const features = [
        { text: "Secure by default", icon: "🔐" },
        { text: "Zero config", icon: "⚡" },
        { text: "Enterprise ready", icon: "🏢" },
    ];

    // Glow pulse
    const glowPulse = Math.sin((frame / fps) * 2) * 0.3 + 0.7;

    // Soft reflection shimmer
    const shimmerX = interpolate(frame, [0, 180], [-200, 400], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#050510" accentColor="#FFD700" />
            <PremiumParticles count={45} color="#FFD700" />

            {/* Background glows */}
            <GlowOrb x={50} y={40} size={600} color="#FFD700" delay={15} intensity={0.5} />
            <GlowOrb x={40} y={50} size={400} color="#FFA500" delay={25} intensity={0.35} />

            {/* Main content with parallax */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) translate(${parallaxX}px, ${parallaxY}px) rotate(${parallaxRotation}deg)`,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* Dashboard mock (blurred for premium feel) */}
                <div
                    style={{
                        transform: `scale(${dashboardScale}) translateY(${dashboardY}px)`,
                        opacity: dashboardProgress,
                        position: "relative",
                    }}
                >
                    <div
                        style={{
                            width: 900,
                            height: 500,
                            background: "linear-gradient(180deg, rgba(20,20,35,0.95) 0%, rgba(15,15,25,0.98) 100%)",
                            borderRadius: 24,
                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow: `
                                0 60px 150px rgba(0,0,0,0.6),
                                0 0 0 1px rgba(255,255,255,0.03),
                                0 0 ${100 * glowPulse}px rgba(255,215,0,0.12)
                            `,
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        {/* Dashboard header */}
                        <div
                            style={{
                                padding: "18px 24px",
                                background: "rgba(0,0,0,0.25)",
                                borderBottom: "1px solid rgba(255,255,255,0.05)",
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                            }}
                        >
                            <div
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: 10,
                                    background: "linear-gradient(135deg, #FFD700 0%, #FF6B35 100%)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <span style={{ fontSize: 22, fontWeight: 800, color: "#0a0a0a" }}>E</span>
                            </div>
                            <span style={{ fontSize: 18, fontWeight: 700, color: "#ffffff" }}>
                                EasyBuild
                            </span>
                            <div style={{ flex: 1 }} />
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "8px 16px",
                                    background: "rgba(150,245,80,0.1)",
                                    borderRadius: 20,
                                    border: "1px solid rgba(150,245,80,0.3)",
                                }}
                            >
                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: "#96F550",
                                        boxShadow: `0 0 ${15 * glowPulse}px #96F550`,
                                    }}
                                />
                                <span style={{ fontSize: 12, color: "#96F550", fontWeight: 600 }}>
                                    All systems go
                                </span>
                            </div>
                        </div>

                        {/* Dashboard content - abstract/blurred */}
                        <div style={{ padding: 30, position: "relative" }}>
                            {/* Stats row */}
                            <div style={{ display: "flex", gap: 25, marginBottom: 30 }}>
                                {["API Calls", "Active Endpoints", "Avg Latency", "Uptime"].map((label, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            flex: 1,
                                            padding: "20px 24px",
                                            background: "rgba(255,255,255,0.02)",
                                            borderRadius: 16,
                                            border: "1px solid rgba(255,255,255,0.05)",
                                        }}
                                    >
                                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 8, letterSpacing: 1 }}>
                                            {label.toUpperCase()}
                                        </div>
                                        <div style={{ fontSize: 28, fontWeight: 800, color: "#FFD700" }}>
                                            {i === 0 ? "847K" : i === 1 ? "12" : i === 2 ? "38ms" : "99.99%"}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Graph placeholder */}
                            <div
                                style={{
                                    height: 180,
                                    background: "rgba(255,255,255,0.015)",
                                    borderRadius: 16,
                                    border: "1px solid rgba(255,255,255,0.04)",
                                    display: "flex",
                                    alignItems: "flex-end",
                                    padding: "15px 20px",
                                    gap: 6,
                                }}
                            >
                                {Array.from({ length: 30 }).map((_, i) => {
                                    const h = 30 + Math.sin(i * 0.3 + frame * 0.015) * 40 + Math.random() * 20;
                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                flex: 1,
                                                height: `${h}%`,
                                                background: "linear-gradient(180deg, #FFD700 0%, #FF6B35 100%)",
                                                borderRadius: 3,
                                                opacity: 0.6,
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        {/* Reflection shimmer */}
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: shimmerX,
                                width: 100,
                                height: "200%",
                                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
                                transform: "rotate(15deg)",
                                pointerEvents: "none",
                            }}
                        />

                        {/* Blur overlay at bottom */}
                        <div
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: 120,
                                background: "linear-gradient(transparent, rgba(5,5,16,0.98))",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Overlaid branding */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "45%",
                    background: "linear-gradient(transparent 0%, rgba(5,5,16,0.95) 50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingBottom: 70,
                }}
            >
                {/* EasyBuild title */}
                <div
                    style={{
                        transform: `scale(${titleProgress}) translateY(${interpolate(titleProgress, [0, 1], [60, 0], { extrapolateRight: "clamp" })}px)`,
                        opacity: titleProgress,
                        marginBottom: 20,
                    }}
                >
                    <span
                        style={{
                            fontSize: 72,
                            fontWeight: 800,
                            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            filter: `drop-shadow(0 0 40px rgba(255,215,0,${glowPulse * 0.6}))`,
                        }}
                    >
                        EasyBuild
                    </span>
                </div>

                {/* Tagline */}
                <div
                    style={{
                        transform: `translateY(${interpolate(taglineProgress, [0, 1], [40, 0], { extrapolateRight: "clamp" })}px)`,
                        opacity: taglineProgress,
                        textAlign: "center",
                        marginBottom: 35,
                    }}
                >
                    <div style={{ fontSize: 28, fontWeight: 600, color: "#ffffff", marginBottom: 10 }}>
                        Frontend-first execution gateway.
                    </div>
                    <div style={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }}>
                        Built for the modern web.
                    </div>
                </div>

                {/* Feature badges */}
                <div
                    style={{
                        display: "flex",
                        gap: 20,
                    }}
                >
                    {features.map((feature, i) => {
                        const badgeProgress = spring({
                            frame: frame - 110 - i * 12,
                            fps,
                            config: springConfigs.bouncy,
                        });

                        return (
                            <div
                                key={i}
                                style={{
                                    transform: `translateY(${interpolate(badgeProgress, [0, 1], [40, 0], { extrapolateRight: "clamp" })}px) scale(${badgeProgress})`,
                                    opacity: badgeProgress,
                                    padding: "12px 24px",
                                    background: "rgba(255,215,0,0.08)",
                                    border: "1px solid rgba(255,215,0,0.25)",
                                    borderRadius: 30,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                }}
                            >
                                <span style={{ fontSize: 18 }}>{feature.icon}</span>
                                <span style={{ fontSize: 14, color: "#FFD700", fontWeight: 600 }}>
                                    {feature.text}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <CinematicVignette intensity={0.7} />
        </AbsoluteFill>
    );
};
