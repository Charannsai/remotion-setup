import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { ParticleBackground } from "../components/ParticleBackground";
import { FloatingShapes } from "../components/ParallaxEffects";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "700", "800"],
    subsets: ["latin"],
});

export const RoadmapScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const roadmapItems = [
        { text: "Advanced rate limiting", icon: "🎯", delay: 15 },
        { text: "Expanded provider support", icon: "🔌", delay: 25 },
        { text: "Usage insights & analytics", icon: "📊", delay: 35 },
        { text: "Team access & roles", icon: "👥", delay: 45 },
        { text: "Custom domains", icon: "🌐", delay: 55 },
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

    const titleY = interpolate(titleProgress, [0, 1], [-30, 0], {
        extrapolateRight: "clamp",
    });

    // Progress bar animation
    const progressBarDelay = 70;
    const progressBarProgress = spring({
        frame: frame - progressBarDelay,
        fps,
        config: { damping: 200 },
        durationInFrames: 90,
    });

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParticleBackground />
            <FloatingShapes delay={5} />

            {/* Title */}
            <div
                style={{
                    position: "absolute",
                    top: 60,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    opacity: titleOpacity,
                    transform: `translateY(${titleY}px)`,
                }}
            >
                <span
                    style={{
                        fontSize: 42,
                        fontWeight: 700,
                        color: "#ffffff",
                    }}
                >
                    What We're{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #45B7D1 0%, #96F550 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Building Next
                    </span>
                </span>
            </div>

            {/* Roadmap items */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 25,
                    marginTop: 40,
                }}
            >
                {roadmapItems.map((item, i) => {
                    const itemProgress = spring({
                        frame: frame - item.delay,
                        fps,
                        config: { damping: 15, stiffness: 120 },
                    });

                    const itemX = interpolate(itemProgress, [0, 1], [-100, 0], {
                        extrapolateRight: "clamp",
                    });

                    const itemOpacity = interpolate(itemProgress, [0, 1], [0, 1], {
                        extrapolateRight: "clamp",
                    });

                    const checkProgress = interpolate(
                        progressBarProgress,
                        [i / roadmapItems.length, (i + 0.5) / roadmapItems.length],
                        [0, 1],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );

                    return (
                        <div
                            key={i}
                            style={{
                                transform: `translateX(${itemX}px)`,
                                opacity: itemOpacity,
                                display: "flex",
                                alignItems: "center",
                                gap: 20,
                                padding: "15px 30px",
                                background: checkProgress > 0.5
                                    ? "linear-gradient(90deg, rgba(150,245,80,0.15) 0%, rgba(150,245,80,0.05) 100%)"
                                    : "rgba(255,255,255,0.03)",
                                border: `1px solid ${checkProgress > 0.5 ? "rgba(150,245,80,0.4)" : "rgba(255,255,255,0.1)"}`,
                                borderRadius: 15,
                                minWidth: 450,
                            }}
                        >
                            {/* Checkbox */}
                            <div
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 8,
                                    border: `2px solid ${checkProgress > 0.5 ? "#96F550" : "rgba(255,255,255,0.3)"}`,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    background: checkProgress > 0.5 ? "#96F550" : "transparent",
                                    transition: "all 0.3s",
                                }}
                            >
                                {checkProgress > 0.5 && (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
                                            fill="#0a0a0a"
                                        />
                                    </svg>
                                )}
                            </div>

                            {/* Icon */}
                            <span style={{ fontSize: 28 }}>{item.icon}</span>

                            {/* Text */}
                            <span
                                style={{
                                    fontSize: 20,
                                    color: checkProgress > 0.5 ? "#96F550" : "rgba(255,255,255,0.8)",
                                    fontWeight: checkProgress > 0.5 ? 600 : 400,
                                }}
                            >
                                {item.text}
                            </span>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};
