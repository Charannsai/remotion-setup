import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Sequence } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { ParticleBackground } from "../components/ParticleBackground";
import { AnimatedText } from "../components/AnimatedText";
import { FloatingShapes } from "../components/ParallaxEffects";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "700", "800"],
    subsets: ["latin"],
});

export const IntroScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Logo animation
    const logoProgress = spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 100, mass: 0.8 },
    });

    const logoScale = interpolate(logoProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    const logoRotation = interpolate(logoProgress, [0, 1], [180, 0], {
        extrapolateRight: "clamp",
    });

    const logoOpacity = interpolate(logoProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Glow pulse
    const glowIntensity = interpolate(
        Math.sin((frame / fps) * 3),
        [-1, 1],
        [0.4, 0.8]
    );

    // Tagline animation
    const taglineProgress = spring({
        frame: frame - 20,
        fps,
        config: { damping: 20, stiffness: 100 },
    });

    const taglineY = interpolate(taglineProgress, [0, 1], [50, 0], {
        extrapolateRight: "clamp",
    });

    const taglineOpacity = interpolate(taglineProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Beta badge
    const badgeProgress = spring({
        frame: frame - 35,
        fps,
        config: { damping: 15, stiffness: 150 },
    });

    const badgeScale = interpolate(badgeProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParticleBackground />
            <FloatingShapes delay={10} />

            {/* Center content */}
            <AbsoluteFill
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        transform: `scale(${logoScale}) rotate(${logoRotation}deg)`,
                        opacity: logoOpacity,
                        marginBottom: 30,
                    }}
                >
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

                {/* EasyBuild text */}
                <div
                    style={{
                        transform: `scale(${logoScale})`,
                        opacity: logoOpacity,
                    }}
                >
                    <span
                        style={{
                            fontSize: 72,
                            fontWeight: 800,
                            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            textShadow: "0 0 40px rgba(255,215,0,0.3)",
                        }}
                    >
                        EasyBuild
                    </span>
                </div>

                {/* Beta badge */}
                <div
                    style={{
                        transform: `scale(${badgeScale})`,
                        marginTop: 15,
                        padding: "8px 20px",
                        background: "rgba(255,215,0,0.15)",
                        borderRadius: 20,
                        border: "1px solid rgba(255,215,0,0.4)",
                    }}
                >
                    <span
                        style={{
                            fontSize: 14,
                            color: "#FFD700",
                            letterSpacing: 2,
                            textTransform: "uppercase",
                        }}
                    >
                        Now in Beta • v0.1
                    </span>
                </div>

                {/* Tagline */}
                <div
                    style={{
                        transform: `translateY(${taglineY}px)`,
                        opacity: taglineOpacity,
                        marginTop: 40,
                        maxWidth: 700,
                        textAlign: "center",
                    }}
                >
                    <span
                        style={{
                            fontSize: 32,
                            fontWeight: 400,
                            color: "rgba(255,255,255,0.9)",
                            lineHeight: 1.4,
                        }}
                    >
                        Build secure APIs without the backend
                    </span>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
