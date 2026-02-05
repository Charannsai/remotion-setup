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

// Scene 8 — Why This Matters
// Visual: Dev deleting backend repo, infra cost drops, deployment speed increases
// Motion: Numeric counters, Clean easing, Satisfying motion physics

export const WhyThisMattersScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Title animation
    const titleProgress = spring({
        frame,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Stats with counters
    const stats = [
        {
            label: "Backend Repos Deleted",
            value: 1,
            suffix: "",
            icon: "🗑️",
            color: "#96F550",
            delay: 30,
        },
        {
            label: "Infra Cost Saved",
            value: 847,
            prefix: "$",
            suffix: "/mo",
            icon: "💰",
            color: "#FFD700",
            delay: 50,
        },
        {
            label: "Deployment Speed",
            value: 10,
            suffix: "x faster",
            icon: "🚀",
            color: "#4ECDC4",
            delay: 70,
        },
        {
            label: "Lines of Glue Code",
            value: 0,
            suffix: "",
            icon: "✨",
            color: "#FF6B9D",
            delay: 90,
        },
    ];

    // Visual elements
    const visualProgress = spring({
        frame: frame - 40,
        fps,
        config: springConfigs.liquid,
    });

    // Bottom text
    const textProgress = spring({
        frame: frame - 130,
        fps,
        config: springConfigs.ultraSmooth,
    });

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#0a0a12" accentColor="#96F550" />
            <PremiumParticles count={40} color="#96F550" />

            {/* Background glows */}
            <GlowOrb x={30} y={40} size={350} color="#96F550" delay={20} intensity={0.3} />
            <GlowOrb x={70} y={60} size={300} color="#FFD700" delay={30} intensity={0.25} />

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
                    Why This{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #96F550 0%, #4ECDC4 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Matters
                    </span>
                </span>
            </div>

            {/* Stats grid */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 50,
                    marginTop: 20,
                }}
            >
                {stats.map((stat, i) => {
                    const statProgress = spring({
                        frame: frame - stat.delay,
                        fps,
                        config: springConfigs.bouncy,
                    });

                    const counterProgress = spring({
                        frame: frame - stat.delay - 20,
                        fps,
                        config: springConfigs.gentle,
                        durationInFrames: 60,
                    });

                    const currentValue = Math.floor(
                        interpolate(counterProgress, [0, 1], [0, stat.value], {
                            extrapolateRight: "clamp",
                        })
                    );

                    const scale = interpolate(statProgress, [0, 1], [0.5, 1], {
                        extrapolateRight: "clamp",
                    });

                    const rotation = interpolate(statProgress, [0, 1], [10, 0], {
                        extrapolateRight: "clamp",
                    });

                    // Glow pulse
                    const glowPulse = Math.sin((frame / fps) * 2 + i) * 0.2 + 0.8;

                    return (
                        <div
                            key={i}
                            style={{
                                transform: `scale(${scale}) rotate(${rotation}deg)`,
                                opacity: statProgress,
                                width: 280,
                                padding: 30,
                                background: `linear-gradient(135deg, ${stat.color}12 0%, ${stat.color}05 100%)`,
                                border: `1px solid ${stat.color}30`,
                                borderRadius: 20,
                                textAlign: "center",
                                boxShadow: `0 0 ${40 * glowPulse}px ${stat.color}20`,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 50,
                                    marginBottom: 15,
                                    filter: `drop-shadow(0 0 15px ${stat.color})`,
                                }}
                            >
                                {stat.icon}
                            </div>
                            <div
                                style={{
                                    fontSize: 48,
                                    fontWeight: 800,
                                    color: stat.color,
                                    textShadow: `0 0 30px ${stat.color}60`,
                                    lineHeight: 1,
                                }}
                            >
                                {stat.prefix || ""}
                                {currentValue}
                                {stat.suffix}
                            </div>
                            <div
                                style={{
                                    fontSize: 16,
                                    color: "rgba(255,255,255,0.6)",
                                    marginTop: 12,
                                }}
                            >
                                {stat.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Animated visual - repo deletion effect */}
            <div
                style={{
                    position: "absolute",
                    left: 60,
                    top: "50%",
                    transform: `translateY(-50%) scale(${interpolate(visualProgress, [0, 1], [0.8, 1], { extrapolateRight: "clamp" })})`,
                    opacity: visualProgress * 0.8,
                }}
            >
                <div
                    style={{
                        width: 80,
                        height: 80,
                        background: "rgba(255,68,68,0.2)",
                        border: "1px solid rgba(255,68,68,0.3)",
                        borderRadius: 15,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                    }}
                >
                    <span style={{ fontSize: 35 }}>📦</span>
                    {/* Cross-out effect */}
                    <div
                        style={{
                            position: "absolute",
                            width: "120%",
                            height: 4,
                            background: "#FF4444",
                            transform: "rotate(-45deg)",
                            opacity: visualProgress,
                            boxShadow: "0 0 10px #FF4444",
                        }}
                    />
                </div>
                <div
                    style={{
                        marginTop: 10,
                        fontSize: 11,
                        color: "rgba(255,255,255,0.4)",
                        textAlign: "center",
                    }}
                >
                    backend-api/
                </div>
            </div>

            {/* Check mark effect */}
            <div
                style={{
                    position: "absolute",
                    right: 60,
                    top: "50%",
                    transform: `translateY(-50%) scale(${interpolate(visualProgress, [0, 1], [0, 1], { extrapolateRight: "clamp" })})`,
                    opacity: visualProgress,
                }}
            >
                <div
                    style={{
                        width: 80,
                        height: 80,
                        background: "linear-gradient(135deg, #96F550 0%, #4ECDC4 100%)",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0 0 40px rgba(150,245,80,0.5)",
                    }}
                >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
                            fill="#0a0a0a"
                        />
                    </svg>
                </div>
                <div
                    style={{
                        marginTop: 10,
                        fontSize: 11,
                        color: "#96F550",
                        textAlign: "center",
                    }}
                >
                    Just EasyBuild
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
                    opacity: textProgress,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 60,
                        fontSize: 18,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.8)",
                    }}
                >
                    <span>
                        <span style={{ color: "#96F550" }}>✓</span> No thin backend
                    </span>
                    <span>
                        <span style={{ color: "#FFD700" }}>✓</span> Lower infra cost
                    </span>
                    <span>
                        <span style={{ color: "#4ECDC4" }}>✓</span> Faster shipping
                    </span>
                </div>
            </div>

            <CinematicVignette intensity={0.75} />
        </AbsoluteFill>
    );
};
