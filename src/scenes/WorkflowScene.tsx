import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { ParticleBackground } from "../components/ParticleBackground";
import { ParallaxGrid } from "../components/ParallaxEffects";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "700", "800"],
    subsets: ["latin"],
});

export const WorkflowScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const steps = [
        { number: "01", title: "Connect", desc: "Link your GitHub repo", icon: "🔗", color: "#4ECDC4" },
        { number: "02", title: "Define", desc: "Declare your endpoints", icon: "📝", color: "#FFD700" },
        { number: "03", title: "Integrate", desc: "Use the auto-gen SDK", icon: "⚡", color: "#FF6B35" },
        { number: "04", title: "Deploy", desc: "One-click production", icon: "🚀", color: "#96F550" },
    ];

    // Title animation
    const titleProgress = spring({
        frame,
        fps,
        config: { damping: 20, stiffness: 100 },
    });

    const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Progress line
    const lineProgress = spring({
        frame: frame - 20,
        fps,
        config: { damping: 200 },
        durationInFrames: 120,
    });

    const lineWidth = interpolate(lineProgress, [0, 1], [0, 100], {
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
                    Simple{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #4ECDC4 0%, #96F550 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Four-Step
                    </span>{" "}
                    Workflow
                </span>
            </div>

            {/* Steps container */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    gap: 40,
                    alignItems: "flex-start",
                }}
            >
                {steps.map((step, i) => {
                    const stepDelay = 30 + i * 25;
                    const stepProgress = spring({
                        frame: frame - stepDelay,
                        fps,
                        config: { damping: 15, stiffness: 120 },
                    });

                    const stepScale = interpolate(stepProgress, [0, 1], [0.5, 1], {
                        extrapolateRight: "clamp",
                    });

                    const stepOpacity = interpolate(stepProgress, [0, 1], [0, 1], {
                        extrapolateRight: "clamp",
                    });

                    const stepY = interpolate(stepProgress, [0, 1], [50, 0], {
                        extrapolateRight: "clamp",
                    });

                    const floatY = Math.sin((frame / fps) * 1.5 + i) * 5;

                    const isActive = (lineWidth / 100) * 4 > i;
                    const activeGlow = isActive ? 0.6 : 0.2;

                    return (
                        <div
                            key={i}
                            style={{
                                transform: `scale(${stepScale}) translateY(${stepY + floatY}px)`,
                                opacity: stepOpacity,
                                width: 200,
                                textAlign: "center",
                            }}
                        >
                            {/* Number badge */}
                            <div
                                style={{
                                    width: 80,
                                    height: 80,
                                    margin: "0 auto 20px",
                                    borderRadius: 20,
                                    background: isActive
                                        ? `linear-gradient(135deg, ${step.color}40, ${step.color}20)`
                                        : "rgba(255,255,255,0.05)",
                                    border: `2px solid ${isActive ? step.color : "rgba(255,255,255,0.1)"}`,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    boxShadow: isActive ? `0 0 30px ${step.color}${Math.floor(activeGlow * 100)}` : "none",
                                    transition: "all 0.3s",
                                }}
                            >
                                <span style={{ fontSize: 36 }}>{step.icon}</span>
                            </div>

                            {/* Step number */}
                            <div
                                style={{
                                    fontSize: 14,
                                    color: step.color,
                                    letterSpacing: 3,
                                    marginBottom: 8,
                                    fontWeight: 700,
                                }}
                            >
                                STEP {step.number}
                            </div>

                            {/* Title */}
                            <div
                                style={{
                                    fontSize: 24,
                                    fontWeight: 700,
                                    color: "#ffffff",
                                    marginBottom: 8,
                                }}
                            >
                                {step.title}
                            </div>

                            {/* Description */}
                            <div
                                style={{
                                    fontSize: 14,
                                    color: "rgba(255,255,255,0.6)",
                                }}
                            >
                                {step.desc}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Progress line */}
            <div
                style={{
                    position: "absolute",
                    bottom: 120,
                    left: "10%",
                    right: "10%",
                    height: 4,
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${lineWidth}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #4ECDC4 0%, #FFD700 50%, #FF6B35 75%, #96F550 100%)",
                        borderRadius: 2,
                        boxShadow: "0 0 20px rgba(255,215,0,0.5)",
                    }}
                />
            </div>
        </AbsoluteFill>
    );
};
