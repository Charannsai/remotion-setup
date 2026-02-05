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
    LightBeam,
} from "../components/PremiumEffects";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "600", "700", "800"],
    subsets: ["latin"],
});

// Scene 10 — Call to Action
// Visual: Logo center, URL fades in, Soft glow pulse
// Motion: Slow cinematic zoom, Ultra-smooth exit

export const CTASceneNew: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Logo animation
    const logoProgress = spring({
        frame: frame - 10,
        fps,
        config: springConfigs.bouncy,
    });

    const logoScale = interpolate(logoProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    const logoRotation = interpolate(logoProgress, [0, 1], [180, 0], {
        extrapolateRight: "clamp",
    });

    // Title words animation
    const words = ["Stop", "leaking", "secrets."];

    // Button animations
    const button1Progress = spring({
        frame: frame - 70,
        fps,
        config: springConfigs.liquid,
    });

    const button2Progress = spring({
        frame: frame - 85,
        fps,
        config: springConfigs.liquid,
    });

    // URL animation
    const urlProgress = spring({
        frame: frame - 100,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Subtitle animation
    const subtitleProgress = spring({
        frame: frame - 50,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Glow pulse
    const glowPulse = Math.sin((frame / fps) * 2) * 0.3 + 0.7;

    // Rotating rings
    const ringRotation = (frame / fps) * 15;

    // Cinematic zoom
    const cinematicZoom = interpolate(frame, [0, 150], [1, 1.05], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill
            style={{
                fontFamily,
                transform: `scale(${cinematicZoom})`,
                transformOrigin: "center center",
            }}
        >
            <ParallaxBackground baseColor="#050510" accentColor="#FFD700" />
            <PremiumParticles count={60} color="#FFD700" />

            {/* Light beam effects */}
            <LightBeam angle={45} color="#FFD700" delay={20} />
            <LightBeam angle={-45} color="#FF6B35" delay={30} />

            {/* Background glows */}
            <GlowOrb x={50} y={45} size={600} color="#FFD700" delay={10} intensity={0.5} />
            <GlowOrb x={50} y={45} size={400} color="#FFA500" delay={20} intensity={0.4} />

            {/* Decorative liquid shapes */}
            <LiquidShape size={100} color="#FFD700" x={12} y={25} delay={30} />
            <LiquidShape size={80} color="#FF6B35" x={88} y={30} delay={40} />
            <LiquidShape size={70} color="#FFA500" x={15} y={75} delay={50} />
            <LiquidShape size={90} color="#FFD700" x={85} y={70} delay={60} />

            {/* Central content */}
            <AbsoluteFill
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {/* Logo with rings */}
                <div
                    style={{
                        position: "relative",
                        marginBottom: 40,
                    }}
                >
                    {/* Outer rotating ring */}
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            width: 220,
                            height: 220,
                            transform: `translate(-50%, -50%) rotate(${ringRotation}deg) scale(${logoScale})`,
                            border: "3px solid rgba(255,215,0,0.25)",
                            borderRadius: "50%",
                        }}
                    >
                        {/* Orbiting dots */}
                        {[0, 120, 240].map((angle, i) => (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    left: "50%",
                                    top: 0,
                                    width: 10,
                                    height: 10,
                                    transform: `translateX(-50%) rotate(${angle}deg) translateY(-5px)`,
                                    transformOrigin: "center 110px",
                                    background: "#FFD700",
                                    borderRadius: "50%",
                                    boxShadow: "0 0 15px rgba(255,215,0,0.8)",
                                }}
                            />
                        ))}
                    </div>

                    {/* Inner ring */}
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            width: 280,
                            height: 280,
                            transform: `translate(-50%, -50%) rotate(${-ringRotation * 0.7}deg) scale(${logoScale})`,
                            border: "2px dashed rgba(255,215,0,0.15)",
                            borderRadius: "50%",
                        }}
                    />

                    {/* Logo */}
                    <div
                        style={{
                            width: 140,
                            height: 140,
                            borderRadius: 35,
                            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            transform: `scale(${logoScale}) rotate(${logoRotation}deg)`,
                            boxShadow: `
                                0 0 ${100 * glowPulse}px rgba(255,215,0,${glowPulse}),
                                0 0 150px rgba(255,107,53,0.5),
                                0 25px 80px rgba(0,0,0,0.4)
                            `,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 80,
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
                        marginBottom: 15,
                    }}
                >
                    {words.map((word, i) => {
                        const wordProgress = spring({
                            frame: frame - 25 - i * 8,
                            fps,
                            config: springConfigs.liquid,
                        });

                        const wordY = interpolate(wordProgress, [0, 1], [50, 0], {
                            extrapolateRight: "clamp",
                        });

                        const isAccent = i === 1;

                        return (
                            <span
                                key={i}
                                style={{
                                    fontSize: 56,
                                    fontWeight: 800,
                                    transform: `translateY(${wordY}px)`,
                                    opacity: wordProgress,
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
                        fontSize: 26,
                        color: "rgba(255,255,255,0.7)",
                        marginBottom: 50,
                        opacity: subtitleProgress,
                        transform: `translateY(${interpolate(subtitleProgress, [0, 1], [20, 0], { extrapolateRight: "clamp" })}px)`,
                    }}
                >
                    Ship faster. Build with confidence.
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
                                padding: "20px 50px",
                                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)",
                                borderRadius: 16,
                                fontSize: 22,
                                fontWeight: 700,
                                color: "#0a0a0a",
                                boxShadow: `
                                    0 0 ${40 * glowPulse}px rgba(255,215,0,${glowPulse * 0.7}),
                                    0 15px 50px rgba(0,0,0,0.3)
                                `,
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <span>Try EasyBuild Free</span>
                            <span style={{ fontSize: 26 }}>→</span>
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
                                padding: "20px 50px",
                                background: "transparent",
                                border: "2px solid rgba(255,255,255,0.3)",
                                borderRadius: 16,
                                fontSize: 22,
                                fontWeight: 600,
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <span style={{ fontSize: 20 }}>📚</span>
                            <span>Read the Docs</span>
                        </div>
                    </div>
                </div>
            </AbsoluteFill>

            {/* Website URL */}
            <div
                style={{
                    position: "absolute",
                    bottom: 60,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    opacity: urlProgress,
                }}
            >
                <span
                    style={{
                        fontSize: 26,
                        fontWeight: 600,
                        color: "#FFD700",
                        letterSpacing: 3,
                        textShadow: "0 0 30px rgba(255,215,0,0.5)",
                    }}
                >
                    tryezbuild.tech
                </span>
            </div>

            <CinematicVignette intensity={0.65} />
        </AbsoluteFill>
    );
};
