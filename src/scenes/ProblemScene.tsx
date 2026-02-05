import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { ParticleBackground } from "../components/ParticleBackground";
import { AnimatedText, TypewriterText } from "../components/AnimatedText";
import { ParallaxGrid } from "../components/ParallaxEffects";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "700", "800"],
    subsets: ["latin"],
});

export const ProblemScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Heading animation
    const headingProgress = spring({
        frame,
        fps,
        config: { damping: 20, stiffness: 100 },
    });

    const headingOpacity = interpolate(headingProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    const headingY = interpolate(headingProgress, [0, 1], [-30, 0], {
        extrapolateRight: "clamp",
    });

    // Problem cards
    const problems = [
        { text: "Backend glue code", icon: "🔧", delay: 15 },
        { text: "CORS policies", icon: "🔒", delay: 25 },
        { text: "Deployment pipelines", icon: "🚀", delay: 35 },
        { text: "Secret management", icon: "🔑", delay: 45 },
    ];

    // Percentage counter
    const percentProgress = spring({
        frame: frame - 60,
        fps,
        config: { damping: 200 },
        durationInFrames: 60,
    });

    const percentage = Math.floor(interpolate(percentProgress, [0, 1], [0, 40], {
        extrapolateRight: "clamp",
    }));

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParticleBackground />
            <ParallaxGrid delay={0} />

            <AbsoluteFill
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 80,
                }}
            >
                {/* Heading */}
                <div
                    style={{
                        transform: `translateY(${headingY}px)`,
                        opacity: headingOpacity,
                        marginBottom: 50,
                        textAlign: "center",
                    }}
                >
                    <span
                        style={{
                            fontSize: 48,
                            fontWeight: 700,
                            color: "#ffffff",
                        }}
                    >
                        Infrastructure is the{" "}
                        <span
                            style={{
                                background: "linear-gradient(135deg, #FF6B35 0%, #FF4444 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            silent killer
                        </span>{" "}
                        of speed
                    </span>
                </div>

                {/* Problem cards */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 30,
                        marginBottom: 50,
                    }}
                >
                    {problems.map((problem, i) => {
                        const cardProgress = spring({
                            frame: frame - problem.delay,
                            fps,
                            config: { damping: 15, stiffness: 120 },
                        });

                        const cardScale = interpolate(cardProgress, [0, 1], [0.5, 1], {
                            extrapolateRight: "clamp",
                        });

                        const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1], {
                            extrapolateRight: "clamp",
                        });

                        const cardRotation = interpolate(cardProgress, [0, 1], [15, 0], {
                            extrapolateRight: "clamp",
                        });

                        return (
                            <div
                                key={i}
                                style={{
                                    transform: `scale(${cardScale}) rotate(${cardRotation}deg)`,
                                    opacity: cardOpacity,
                                    padding: "20px 30px",
                                    background: "rgba(255,68,68,0.1)",
                                    border: "1px solid rgba(255,68,68,0.3)",
                                    borderRadius: 15,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 15,
                                }}
                            >
                                <span style={{ fontSize: 28 }}>{problem.icon}</span>
                                <span style={{ fontSize: 20, color: "rgba(255,255,255,0.9)" }}>
                                    {problem.text}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Statistic */}
                <div
                    style={{
                        opacity: interpolate(percentProgress, [0, 1], [0, 1], {
                            extrapolateRight: "clamp",
                        }),
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            fontSize: 100,
                            fontWeight: 800,
                            background: "linear-gradient(135deg, #FF6B35 0%, #FF4444 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            lineHeight: 1,
                        }}
                    >
                        {percentage}%
                    </div>
                    <div
                        style={{
                            fontSize: 24,
                            color: "rgba(255,255,255,0.7)",
                            marginTop: 10,
                        }}
                    >
                        of developer time wasted on backend glue
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
