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

// SCENE 8 — BUSINESS IMPACT
// Visual: Backend repo deleted, cost meter drops, speed meter climbs
// Motion: Numeric counters, smooth easing, clean motion physics, satisfying animations

export const BusinessImpactScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Title animation
    const titleProgress = spring({
        frame,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Repo deletion animation (visual)
    const deleteProgress = spring({
        frame: frame - 30,
        fps,
        config: springConfigs.bouncy,
    });

    const repoShake = frame > 30 && frame < 60 ? Math.sin(frame * 2) * 5 : 0;
    const repoOpacity = interpolate(deleteProgress, [0, 0.5, 1], [1, 1, 0], {
        extrapolateRight: "clamp",
    });
    const repoScale = interpolate(deleteProgress, [0.5, 1], [1, 0.5], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // "Deleted" badge
    const deleteBadgeProgress = spring({
        frame: frame - 50,
        fps,
        config: springConfigs.bouncy,
    });

    // Cost meter dropping
    const costProgress = spring({
        frame: frame - 60,
        fps,
        config: springConfigs.gentle,
        durationInFrames: 60,
    });

    const oldCost = 4200;
    const newCost = 0;
    const currentCost = interpolate(costProgress, [0, 1], [oldCost, newCost], {
        extrapolateRight: "clamp",
    });

    // Speed meter rising
    const speedProgress = spring({
        frame: frame - 80,
        fps,
        config: springConfigs.gentle,
        durationInFrames: 60,
    });

    const oldDeployTime = 14; // days
    const newDeployTime = 1; // day
    const currentDeployTime = interpolate(speedProgress, [0, 1], [oldDeployTime, newDeployTime], {
        extrapolateRight: "clamp",
    });

    // Lines of code saved
    const locProgress = spring({
        frame: frame - 100,
        fps,
        config: springConfigs.gentle,
        durationInFrames: 50,
    });

    const savedLOC = interpolate(locProgress, [0, 1], [0, 12400], {
        extrapolateRight: "clamp",
    });

    // Metric cards animation
    const card1Progress = spring({
        frame: frame - 65,
        fps,
        config: springConfigs.liquid,
    });

    const card2Progress = spring({
        frame: frame - 85,
        fps,
        config: springConfigs.liquid,
    });

    const card3Progress = spring({
        frame: frame - 105,
        fps,
        config: springConfigs.liquid,
    });

    // Bottom text
    const textProgress = spring({
        frame: frame - 140,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Glow pulse
    const glowPulse = Math.sin((frame / fps) * 2) * 0.3 + 0.7;

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#0a0a14" accentColor="#96F550" />
            <PremiumParticles count={40} color="#96F550" />

            {/* Background glows */}
            <GlowOrb x={30} y={45} size={350} color="#96F550" delay={20} intensity={0.4} />
            <GlowOrb x={70} y={55} size={350} color="#4ECDC4" delay={30} intensity={0.35} />

            {/* Title */}
            <div
                style={{
                    position: "absolute",
                    top: 55,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    opacity: titleProgress,
                    transform: `translateY(${interpolate(titleProgress, [0, 1], [-40, 0], { extrapolateRight: "clamp" })}px)`,
                }}
            >
                <div style={{ fontSize: 48, fontWeight: 800, color: "#ffffff" }}>
                    Business{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #96F550 0%, #4ECDC4 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Impact
                    </span>
                </div>
            </div>

            {/* Main content area */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    gap: 80,
                    alignItems: "center",
                }}
            >
                {/* Left side - Repo deletion visual */}
                <div
                    style={{
                        position: "relative",
                        width: 350,
                    }}
                >
                    {/* Backend folder being deleted */}
                    <div
                        style={{
                            transform: `translateX(${repoShake}px) scale(${repoScale})`,
                            opacity: repoOpacity,
                        }}
                    >
                        <div
                            style={{
                                width: 300,
                                background: "#1a1a28",
                                borderRadius: 16,
                                border: "1px solid rgba(255,68,68,0.3)",
                                overflow: "hidden",
                                boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
                            }}
                        >
                            {/* Folder header */}
                            <div
                                style={{
                                    padding: "14px 18px",
                                    background: "rgba(255,68,68,0.1)",
                                    borderBottom: "1px solid rgba(255,68,68,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                }}
                            >
                                <span style={{ fontSize: 20 }}>📁</span>
                                <span style={{ color: "#FF6B6B", fontWeight: 600, fontSize: 14 }}>
                                    /backend
                                </span>
                            </div>
                            {/* Files */}
                            <div style={{ padding: 15 }}>
                                {[
                                    "server.js",
                                    "routes/",
                                    "middleware/",
                                    "config.json",
                                    "Dockerfile",
                                    ".env (12 secrets)",
                                ].map((file, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            padding: "8px 10px",
                                            fontSize: 12,
                                            color: "rgba(255,255,255,0.5)",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <span style={{ fontSize: 12, opacity: 0.6 }}>
                                            {file.includes(".") ? "📄" : file.includes("(") ? "🔐" : "📂"}
                                        </span>
                                        {file}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Red X overlay during shake */}
                        {frame > 35 && frame < 70 && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    fontSize: 80,
                                    color: "#FF4444",
                                    opacity: interpolate(frame, [35, 45, 60, 70], [0, 1, 1, 0]),
                                    filter: "drop-shadow(0 0 30px rgba(255,68,68,0.8))",
                                }}
                            >
                                ❌
                            </div>
                        )}
                    </div>

                    {/* Deleted success badge */}
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: `translate(-50%, -50%) scale(${deleteBadgeProgress})`,
                            opacity: deleteBadgeProgress,
                        }}
                    >
                        <div
                            style={{
                                padding: "20px 40px",
                                background: "linear-gradient(135deg, #96F550 0%, #4ECDC4 100%)",
                                borderRadius: 16,
                                textAlign: "center",
                                boxShadow: "0 0 60px rgba(150,245,80,0.5), 0 20px 60px rgba(0,0,0,0.4)",
                            }}
                        >
                            <div style={{ fontSize: 50, marginBottom: 8 }}>🗑️</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: "#0a0a0a" }}>
                                DELETED
                            </div>
                            <div style={{ fontSize: 12, color: "#0a0a0a", opacity: 0.8 }}>
                                No backend needed!
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Metric cards */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 25,
                    }}
                >
                    {/* Cost card */}
                    <div
                        style={{
                            transform: `translateX(${interpolate(card1Progress, [0, 1], [80, 0], { extrapolateRight: "clamp" })}px) scale(${interpolate(card1Progress, [0, 1], [0.8, 1], { extrapolateRight: "clamp" })})`,
                            opacity: card1Progress,
                        }}
                    >
                        <div
                            style={{
                                width: 320,
                                padding: "22px 28px",
                                background: "linear-gradient(135deg, rgba(150,245,80,0.1) 0%, rgba(150,245,80,0.02) 100%)",
                                border: "1px solid rgba(150,245,80,0.4)",
                                borderRadius: 18,
                                boxShadow: `0 0 ${40 * glowPulse}px rgba(150,245,80,0.2)`,
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", letterSpacing: 1 }}>
                                    INFRA COST
                                </span>
                                <span style={{ fontSize: 22 }}>📉</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 15 }}>
                                <span
                                    style={{
                                        fontSize: 44,
                                        fontWeight: 800,
                                        color: "#96F550",
                                        textShadow: "0 0 30px rgba(150,245,80,0.5)",
                                    }}
                                >
                                    ${Math.floor(currentCost).toLocaleString()}
                                </span>
                                <span
                                    style={{
                                        fontSize: 18,
                                        color: "#FF6B6B",
                                        textDecoration: "line-through",
                                        opacity: 0.6,
                                    }}
                                >
                                    ${oldCost}/mo
                                </span>
                            </div>
                            <div style={{ fontSize: 12, color: "#96F550", marginTop: 8 }}>
                                ↓ 100% reduction
                            </div>
                        </div>
                    </div>

                    {/* Deploy time card */}
                    <div
                        style={{
                            transform: `translateX(${interpolate(card2Progress, [0, 1], [80, 0], { extrapolateRight: "clamp" })}px) scale(${interpolate(card2Progress, [0, 1], [0.8, 1], { extrapolateRight: "clamp" })})`,
                            opacity: card2Progress,
                        }}
                    >
                        <div
                            style={{
                                width: 320,
                                padding: "22px 28px",
                                background: "linear-gradient(135deg, rgba(78,205,196,0.1) 0%, rgba(78,205,196,0.02) 100%)",
                                border: "1px solid rgba(78,205,196,0.4)",
                                borderRadius: 18,
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", letterSpacing: 1 }}>
                                    DEPLOY TIME
                                </span>
                                <span style={{ fontSize: 22 }}>⚡</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 15 }}>
                                <span
                                    style={{
                                        fontSize: 44,
                                        fontWeight: 800,
                                        color: "#4ECDC4",
                                        textShadow: "0 0 30px rgba(78,205,196,0.5)",
                                    }}
                                >
                                    {Math.ceil(currentDeployTime)} day{Math.ceil(currentDeployTime) !== 1 ? 's' : ''}
                                </span>
                                <span
                                    style={{
                                        fontSize: 18,
                                        color: "#FF6B6B",
                                        textDecoration: "line-through",
                                        opacity: 0.6,
                                    }}
                                >
                                    {oldDeployTime} days
                                </span>
                            </div>
                            <div style={{ fontSize: 12, color: "#4ECDC4", marginTop: 8 }}>
                                ↓ 93% faster
                            </div>
                        </div>
                    </div>

                    {/* Lines of code saved */}
                    <div
                        style={{
                            transform: `translateX(${interpolate(card3Progress, [0, 1], [80, 0], { extrapolateRight: "clamp" })}px) scale(${interpolate(card3Progress, [0, 1], [0.8, 1], { extrapolateRight: "clamp" })})`,
                            opacity: card3Progress,
                        }}
                    >
                        <div
                            style={{
                                width: 320,
                                padding: "22px 28px",
                                background: "linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.02) 100%)",
                                border: "1px solid rgba(255,215,0,0.4)",
                                borderRadius: 18,
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", letterSpacing: 1 }}>
                                    CODE DELETED
                                </span>
                                <span style={{ fontSize: 22 }}>🗑️</span>
                            </div>
                            <div>
                                <span
                                    style={{
                                        fontSize: 44,
                                        fontWeight: 800,
                                        color: "#FFD700",
                                        textShadow: "0 0 30px rgba(255,215,0,0.5)",
                                    }}
                                >
                                    {Math.floor(savedLOC).toLocaleString()}
                                </span>
                                <span style={{ fontSize: 20, color: "rgba(255,255,255,0.5)", marginLeft: 10 }}>
                                    lines
                                </span>
                            </div>
                            <div style={{ fontSize: 12, color: "#FFD700", marginTop: 8 }}>
                                ✓ Less to maintain
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom text */}
            <div
                style={{
                    position: "absolute",
                    bottom: 55,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    gap: 40,
                    opacity: textProgress,
                }}
            >
                {[
                    { text: "Lower cost.", color: "#96F550" },
                    { text: "Faster shipping.", color: "#4ECDC4" },
                    { text: "No thin backend.", color: "#FFD700" },
                ].map((item, i) => {
                    const wordProgress = spring({
                        frame: frame - 140 - i * 8,
                        fps,
                        config: springConfigs.bouncy,
                    });

                    return (
                        <span
                            key={i}
                            style={{
                                fontSize: 24,
                                fontWeight: 700,
                                color: item.color,
                                transform: `translateY(${interpolate(wordProgress, [0, 1], [40, 0], { extrapolateRight: "clamp" })}px)`,
                                opacity: wordProgress,
                                textShadow: `0 0 20px ${item.color}50`,
                            }}
                        >
                            {item.text}
                        </span>
                    );
                })}
            </div>

            <CinematicVignette intensity={0.75} />
        </AbsoluteFill>
    );
};
