import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { ParticleBackground } from "../components/ParticleBackground";
import { FloatingShapes } from "../components/ParallaxEffects";
import { FloatingIcons } from "../components/AnimatedIcons";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "700", "800"],
    subsets: ["latin"],
});

export const CTAScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Main content animation
    const contentProgress = spring({
        frame,
        fps,
        config: { damping: 15, stiffness: 100, mass: 0.8 },
    });

    const contentScale = interpolate(contentProgress, [0, 1], [0.8, 1], {
        extrapolateRight: "clamp",
    });

    const contentOpacity = interpolate(contentProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Title word animation
    const words = ["Build", "faster.", "Scale", "infinitely."];

    // Buttons animation
    const button1Progress = spring({
        frame: frame - 40,
        fps,
        config: { damping: 15, stiffness: 120 },
    });

    const button2Progress = spring({
        frame: frame - 50,
        fps,
        config: { damping: 15, stiffness: 120 },
    });

    // Glow pulse
    const glowIntensity = Math.sin((frame / fps) * 2.5) * 0.3 + 0.7;

    // Logo rotation
    const logoRotation = (frame / fps) * 15;

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParticleBackground />
            <FloatingShapes delay={0} />
            <FloatingIcons delay={20} />

            {/* Main content */}
            <AbsoluteFill
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: `scale(${contentScale})`,
                    opacity: contentOpacity,
                }}
            >
                {/* Logo with glow */}
                <div
                    style={{
                        marginBottom: 40,
                        position: "relative",
                    }}
                >
                    {/* Glow ring */}
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            width: 180,
                            height: 180,
                            transform: `translate(-50%, -50%) rotate(${logoRotation}deg)`,
                            borderRadius: "50%",
                            border: "3px solid rgba(255,215,0,0.3)",
                            boxShadow: `0 0 ${40 * glowIntensity}px rgba(255,215,0,${glowIntensity * 0.5})`,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            width: 220,
                            height: 220,
                            transform: `translate(-50%, -50%) rotate(${-logoRotation * 0.7}deg)`,
                            borderRadius: "50%",
                            border: "2px dashed rgba(255,215,0,0.2)",
                        }}
                    />

                    {/* Logo */}
                    <div
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 30,
                            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: `0 0 ${60 * glowIntensity}px rgba(255,215,0,${glowIntensity}), 0 0 100px rgba(255,107,53,0.4)`,
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 60,
                                fontWeight: 800,
                                color: "#0a0a0a",
                            }}
                        >
                            E
                        </span>
                    </div>
                </div>

                {/* Title */}
                <div
                    style={{
                        display: "flex",
                        gap: 15,
                        marginBottom: 30,
                    }}
                >
                    {words.map((word, i) => {
                        const wordProgress = spring({
                            frame: frame - 10 - i * 6,
                            fps,
                            config: { damping: 15, stiffness: 150 },
                        });

                        const wordY = interpolate(wordProgress, [0, 1], [40, 0], {
                            extrapolateRight: "clamp",
                        });

                        const wordOpacity = interpolate(wordProgress, [0, 1], [0, 1], {
                            extrapolateRight: "clamp",
                        });

                        const isAccent = i === 1 || i === 3;

                        return (
                            <span
                                key={i}
                                style={{
                                    fontSize: 56,
                                    fontWeight: 800,
                                    transform: `translateY(${wordY}px)`,
                                    opacity: wordOpacity,
                                    ...(isAccent
                                        ? {
                                            background: "linear-gradient(135deg, #FFD700 0%, #FF6B35 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                        }
                                        : {
                                            color: "#ffffff",
                                        }),
                                }}
                            >
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Subtitle */}
                <div
                    style={{
                        fontSize: 24,
                        color: "rgba(255,255,255,0.7)",
                        marginBottom: 50,
                        opacity: contentOpacity,
                    }}
                >
                    The developer-first execution gateway for the modern web
                </div>

                {/* CTA Buttons */}
                <div
                    style={{
                        display: "flex",
                        gap: 25,
                    }}
                >
                    {/* Primary button */}
                    <div
                        style={{
                            transform: `scale(${interpolate(button1Progress, [0, 1], [0.5, 1], { extrapolateRight: "clamp" })})`,
                            opacity: button1Progress,
                        }}
                    >
                        <div
                            style={{
                                padding: "18px 45px",
                                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)",
                                borderRadius: 15,
                                fontSize: 20,
                                fontWeight: 700,
                                color: "#0a0a0a",
                                boxShadow: `0 0 30px rgba(255,215,0,${glowIntensity * 0.6}), 0 10px 40px rgba(0,0,0,0.3)`,
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                            }}
                        >
                            <span>Start Building Free</span>
                            <span style={{ fontSize: 24 }}>→</span>
                        </div>
                    </div>

                    {/* Secondary button */}
                    <div
                        style={{
                            transform: `scale(${interpolate(button2Progress, [0, 1], [0.5, 1], { extrapolateRight: "clamp" })})`,
                            opacity: button2Progress,
                        }}
                    >
                        <div
                            style={{
                                padding: "18px 45px",
                                background: "transparent",
                                border: "2px solid rgba(255,255,255,0.3)",
                                borderRadius: 15,
                                fontSize: 20,
                                fontWeight: 600,
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                            }}
                        >
                            <span>📚</span>
                            <span>Documentation</span>
                        </div>
                    </div>
                </div>

                {/* Website URL */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 50,
                        fontSize: 22,
                        color: "#FFD700",
                        letterSpacing: 2,
                        opacity: interpolate(contentProgress, [0.5, 1], [0, 1], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        }),
                    }}
                >
                    tryezbuild.tech
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
