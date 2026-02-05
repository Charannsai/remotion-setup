import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import {
    ParallaxBackground,
    PremiumParticles,
    CinematicVignette,
    springConfigs,
    GlowOrb,
    LiquidShape,
} from "../components/PremiumEffects";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "600", "700", "800"],
    subsets: ["latin"],
});

// Scene 9 — Product Identity
// Visual: EasyBuild dashboard UI (blurred mock), Gateway nodes, Clean motion typography
// Motion: Hero parallax, Subtle lighting, Soft reflections

export const ProductIdentityScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Title animation
    const titleProgress = spring({
        frame,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Dashboard mockup animation
    const dashboardProgress = spring({
        frame: frame - 30,
        fps,
        config: springConfigs.liquid,
    });

    const dashboardScale = interpolate(dashboardProgress, [0, 1], [0.9, 1], {
        extrapolateRight: "clamp",
    });

    // Gateway nodes
    const nodes = [
        { x: 30, y: 45, label: "Edge Node - US East", status: "active" },
        { x: 60, y: 35, label: "Edge Node - EU West", status: "active" },
        { x: 75, y: 55, label: "Edge Node - Asia", status: "active" },
    ];

    // Subtitle animation
    const subtitleProgress = spring({
        frame: frame - 110,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Glow pulse
    const glowPulse = Math.sin((frame / fps) * 2) * 0.2 + 0.8;

    // Parallax movement
    const parallaxY = Math.sin((frame / fps) * 0.5) * 10;

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#050510" accentColor="#FFD700" />
            <PremiumParticles count={50} color="#FFD700" />

            {/* Background glows */}
            <GlowOrb x={40} y={50} size={500} color="#FFD700" delay={10} intensity={0.35} />
            <GlowOrb x={70} y={40} size={350} color="#FF6B35" delay={20} intensity={0.25} />

            {/* Decorative liquid shapes */}
            <LiquidShape size={120} color="#FFD700" x={10} y={30} delay={40} />
            <LiquidShape size={90} color="#FF6B35" x={90} y={70} delay={50} />

            {/* Title */}
            <div
                style={{
                    position: "absolute",
                    top: 55,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    opacity: titleProgress,
                    transform: `translateY(${interpolate(titleProgress, [0, 1], [-30, 0], { extrapolateRight: "clamp" })}px)`,
                }}
            >
                <span
                    style={{
                        fontSize: 60,
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        filter: "drop-shadow(0 0 30px rgba(255,215,0,0.4))",
                    }}
                >
                    EasyBuild
                </span>
            </div>

            {/* Blurred dashboard mockup */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) scale(${dashboardScale}) translateY(${parallaxY}px)`,
                    opacity: dashboardProgress * 0.85,
                    width: 800,
                    height: 450,
                    background: "linear-gradient(180deg, rgba(20,20,30,0.95) 0%, rgba(15,15,25,0.98) 100%)",
                    borderRadius: 20,
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: `
                        0 50px 100px rgba(0,0,0,0.5),
                        0 0 0 1px rgba(255,255,255,0.05),
                        0 0 80px rgba(255,215,0,0.15)
                    `,
                    overflow: "hidden",
                }}
            >
                {/* Dashboard header */}
                <div
                    style={{
                        padding: "15px 20px",
                        background: "rgba(0,0,0,0.3)",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    {/* Logo */}
                    <div
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: "linear-gradient(135deg, #FFD700 0%, #FF6B35 100%)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <span style={{ fontSize: 16, fontWeight: 800, color: "#0a0a0a" }}>E</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
                        EasyBuild Dashboard
                    </span>
                    <div style={{ flex: 1 }} />
                    {/* Status indicator */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "5px 12px",
                            background: "rgba(150,245,80,0.1)",
                            borderRadius: 20,
                            border: "1px solid rgba(150,245,80,0.3)",
                        }}
                    >
                        <div
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "#96F550",
                                boxShadow: `0 0 ${10 * glowPulse}px #96F550`,
                            }}
                        />
                        <span style={{ fontSize: 11, color: "#96F550" }}>All systems operational</span>
                    </div>
                </div>

                {/* Dashboard content (blurred/abstracted) */}
                <div style={{ padding: 25 }}>
                    {/* Stats row */}
                    <div
                        style={{
                            display: "flex",
                            gap: 20,
                            marginBottom: 25,
                        }}
                    >
                        {["Requests Today", "Active Endpoints", "Avg. Latency"].map((label, i) => (
                            <div
                                key={i}
                                style={{
                                    flex: 1,
                                    padding: 15,
                                    background: "rgba(255,255,255,0.03)",
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.05)",
                                }}
                            >
                                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 5 }}>
                                    {label}
                                </div>
                                <div
                                    style={{
                                        fontSize: 22,
                                        fontWeight: 700,
                                        color: "#FFD700",
                                    }}
                                >
                                    {i === 0 ? "12,847" : i === 1 ? "8" : "42ms"}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Activity graph placeholder */}
                    <div
                        style={{
                            height: 120,
                            background: "rgba(255,255,255,0.02)",
                            borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.05)",
                            display: "flex",
                            alignItems: "flex-end",
                            padding: "10px 15px",
                            gap: 8,
                        }}
                    >
                        {Array.from({ length: 24 }).map((_, i) => {
                            const height = 20 + Math.sin(i * 0.5 + frame * 0.02) * 30 + Math.random() * 20;
                            return (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        height: `${height}%`,
                                        background: `linear-gradient(180deg, #FFD700 0%, #FF6B35 100%)`,
                                        borderRadius: 3,
                                        opacity: 0.6,
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Endpoints list */}
                    <div style={{ marginTop: 20 }}>
                        {["/api/p/openai/chat", "/api/p/stripe/checkout", "/api/p/twilio/sms"].map(
                            (endpoint, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: "10px 15px",
                                        background: i === 0 ? "rgba(255,215,0,0.1)" : "transparent",
                                        borderRadius: 8,
                                        marginBottom: 5,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            background: "#96F550",
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: 12,
                                            color: "rgba(255,255,255,0.7)",
                                            fontFamily: "monospace",
                                        }}
                                    >
                                        {endpoint}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Blur overlay for premium effect */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 100,
                        background: "linear-gradient(transparent, rgba(5,5,16,0.9))",
                    }}
                />
            </div>

            {/* Gateway nodes floating */}
            {nodes.map((node, i) => {
                const nodeProgress = spring({
                    frame: frame - 60 - i * 15,
                    fps,
                    config: springConfigs.liquid,
                });

                const floatY = Math.sin((frame / fps) * 1.5 + i * 2) * 10;

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: `${node.x}%`,
                            top: `${node.y}%`,
                            transform: `translate(-50%, -50%) translateY(${floatY}px)`,
                            opacity: nodeProgress * 0.9,
                        }}
                    >
                        <div
                            style={{
                                padding: "8px 16px",
                                background: "rgba(150,245,80,0.1)",
                                border: "1px solid rgba(150,245,80,0.4)",
                                borderRadius: 20,
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <div
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    background: "#96F550",
                                    boxShadow: `0 0 ${10 * glowPulse}px #96F550`,
                                }}
                            />
                            <span style={{ fontSize: 11, color: "#96F550", fontWeight: 500 }}>
                                {node.label}
                            </span>
                        </div>
                    </div>
                );
            })}

            {/* Subtitle */}
            <div
                style={{
                    position: "absolute",
                    bottom: 80,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    opacity: subtitleProgress,
                }}
            >
                <div
                    style={{
                        fontSize: 28,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.9)",
                        marginBottom: 10,
                    }}
                >
                    Frontend-first execution gateway.
                </div>
                <div
                    style={{
                        fontSize: 18,
                        color: "rgba(255,255,255,0.5)",
                    }}
                >
                    Built for the modern web.
                </div>
            </div>

            <CinematicVignette intensity={0.7} />
        </AbsoluteFill>
    );
};
