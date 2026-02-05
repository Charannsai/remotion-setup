import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import {
    ParallaxBackground,
    PremiumParticles,
    CinematicVignette,
    springConfigs,
    GlowOrb,
    LightBeam,
} from "../components/PremiumEffects";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "600", "700", "800"],
    subsets: ["latin"],
});

// SCENE 10 — FINAL CTA
// Visual: Logo center, glow pulse, URL fades in
// Motion: Slow cinematic zoom out, ultra-smooth exit, premium SaaS launch vibe

export const FinalCTAScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Slow cinematic zoom out
    const zoomProgress = interpolate(frame, [0, 200], [1.15, 1], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
    });

    // Logo animation with bounce
    const logoProgress = spring({
        frame: frame - 15,
        fps,
        config: springConfigs.bouncy,
    });

    const logoScale = interpolate(logoProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    const logoRotation = interpolate(logoProgress, [0, 1], [180, 0], {
        extrapolateRight: "clamp",
    });

    // Kinetic text - word by word
    const words = ["Stop", "leaking", "secrets."];

    // Second line kinetic text
    const words2 = ["Ship", "faster."];

    // CTA button
    const ctaProgress = spring({
        frame: frame - 100,
        fps,
        config: springConfigs.liquid,
    });

    // URL fade in
    const urlProgress = spring({
        frame: frame - 130,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Rotating ring
    const ringRotation = (frame / fps) * 20;

    // Glow pulse
    const glowPulse = Math.sin((frame / fps) * 2.5) * 0.4 + 0.6;

    // Particle burst on logo appear
    const burstProgress = spring({
        frame: frame - 20,
        fps,
        config: { damping: 8, stiffness: 60 },
    });

    return (
        <AbsoluteFill
            style={{
                fontFamily,
                transform: `scale(${zoomProgress})`,
                transformOrigin: "center center",
            }}
        >
            <ParallaxBackground baseColor="#050510" accentColor="#FFD700" />
            <PremiumParticles count={80} color="#FFD700" />

            {/* Light beams */}
            <LightBeam angle={35} color="#FFD700" delay={10} />
            <LightBeam angle={-35} color="#FF6B35" delay={20} />
            <LightBeam angle={15} color="#FFA500" delay={30} />
            <LightBeam angle={-15} color="#FFD700" delay={40} />

            {/* Background glows */}
            <GlowOrb x={50} y={45} size={700} color="#FFD700" delay={10} intensity={0.6} />
            <GlowOrb x={50} y={45} size={500} color="#FFA500" delay={20} intensity={0.5} />
            <GlowOrb x={50} y={45} size={300} color="#FF6B35" delay={30} intensity={0.4} />

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
                        marginBottom: 50,
                    }}
                >
                    {/* Outer rotating ring */}
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            width: 300,
                            height: 300,
                            transform: `translate(-50%, -50%) rotate(${ringRotation}deg) scale(${logoScale})`,
                            border: "3px solid rgba(255,215,0,0.2)",
                            borderRadius: "50%",
                        }}
                    >
                        {/* Orbiting energy dots */}
                        {[0, 72, 144, 216, 288].map((angle, i) => (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    left: "50%",
                                    top: 0,
                                    width: 12,
                                    height: 12,
                                    transform: `translateX(-50%) rotate(${angle}deg) translateY(-6px)`,
                                    transformOrigin: "center 150px",
                                    background: "#FFD700",
                                    borderRadius: "50%",
                                    boxShadow: `0 0 20px rgba(255,215,0,${glowPulse})`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Middle dashed ring */}
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            width: 380,
                            height: 380,
                            transform: `translate(-50%, -50%) rotate(${-ringRotation * 0.6}deg) scale(${logoScale})`,
                            border: "2px dashed rgba(255,215,0,0.15)",
                            borderRadius: "50%",
                        }}
                    />

                    {/* Inner glowing ring */}
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            width: 230,
                            height: 230,
                            transform: `translate(-50%, -50%) scale(${logoScale * (0.95 + glowPulse * 0.05)})`,
                            border: "5px solid rgba(255,215,0,0.5)",
                            borderRadius: "50%",
                            boxShadow: `
                                0 0 ${80 * glowPulse}px rgba(255,215,0,${glowPulse * 0.6}),
                                inset 0 0 60px rgba(255,215,0,0.1)
                            `,
                        }}
                    />

                    {/* Main logo */}
                    <div
                        style={{
                            transform: `scale(${logoScale}) rotate(${logoRotation}deg)`,
                        }}
                    >
                        <div
                            style={{
                                width: 170,
                                height: 170,
                                borderRadius: 42,
                                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                boxShadow: `
                                    0 0 ${150 * glowPulse}px rgba(255,215,0,${glowPulse}),
                                    0 0 250px rgba(255,107,53,0.5),
                                    0 35px 100px rgba(0,0,0,0.5)
                                `,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 100,
                                    fontWeight: 800,
                                    color: "#0a0a0a",
                                }}
                            >
                                E
                            </span>
                        </div>
                    </div>

                    {/* Particle burst */}
                    {burstProgress > 0.1 && (
                        <>
                            {Array.from({ length: 16 }).map((_, i) => {
                                const angle = (i / 16) * 360;
                                const rad = (angle * Math.PI) / 180;
                                const distance = 100 + burstProgress * 200;
                                const x = Math.cos(rad) * distance;
                                const y = Math.sin(rad) * distance;
                                const scale = interpolate(burstProgress, [0, 0.4, 1], [0, 1.2, 0], {
                                    extrapolateRight: "clamp",
                                });

                                return (
                                    <div
                                        key={i}
                                        style={{
                                            position: "absolute",
                                            left: "50%",
                                            top: "50%",
                                            width: 10,
                                            height: 10,
                                            borderRadius: "50%",
                                            background: "#FFD700",
                                            transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
                                            boxShadow: "0 0 15px rgba(255,215,0,0.8)",
                                        }}
                                    />
                                );
                            })}
                        </>
                    )}
                </div>

                {/* Kinetic text line 1 */}
                <div
                    style={{
                        display: "flex",
                        gap: 18,
                        marginBottom: 18,
                        perspective: 600,
                    }}
                >
                    {words.map((word, i) => {
                        const wordProgress = spring({
                            frame: frame - 40 - i * 10,
                            fps,
                            config: springConfigs.liquid,
                        });

                        const y = interpolate(wordProgress, [0, 1], [60, 0], {
                            extrapolateRight: "clamp",
                        });

                        const rotateX = interpolate(wordProgress, [0, 1], [30, 0], {
                            extrapolateRight: "clamp",
                        });

                        const isAccent = i === 1;

                        return (
                            <span
                                key={i}
                                style={{
                                    fontSize: 56,
                                    fontWeight: 800,
                                    transform: `translateY(${y}px) rotateX(${rotateX}deg)`,
                                    opacity: wordProgress,
                                    transformStyle: "preserve-3d",
                                    ...(isAccent
                                        ? {
                                            background: "linear-gradient(135deg, #FF4444 0%, #FF0000 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            filter: "drop-shadow(0 0 15px rgba(255,68,68,0.6))",
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

                {/* Kinetic text line 2 */}
                <div
                    style={{
                        display: "flex",
                        gap: 18,
                        marginBottom: 45,
                        perspective: 600,
                    }}
                >
                    {words2.map((word, i) => {
                        const wordProgress = spring({
                            frame: frame - 70 - i * 10,
                            fps,
                            config: springConfigs.liquid,
                        });

                        const y = interpolate(wordProgress, [0, 1], [50, 0], {
                            extrapolateRight: "clamp",
                        });

                        return (
                            <span
                                key={i}
                                style={{
                                    fontSize: 44,
                                    fontWeight: 700,
                                    color: "rgba(255,255,255,0.8)",
                                    transform: `translateY(${y}px)`,
                                    opacity: wordProgress,
                                }}
                            >
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* CTA Button */}
                <div
                    style={{
                        transform: `scale(${interpolate(ctaProgress, [0, 1], [0.6, 1], { extrapolateRight: "clamp" })})`,
                        opacity: ctaProgress,
                        marginBottom: 30,
                    }}
                >
                    <div
                        style={{
                            padding: "22px 55px",
                            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)",
                            borderRadius: 18,
                            fontSize: 24,
                            fontWeight: 800,
                            color: "#0a0a0a",
                            boxShadow: `
                                0 0 ${60 * glowPulse}px rgba(255,215,0,${glowPulse * 0.8}),
                                0 20px 60px rgba(0,0,0,0.4)
                            `,
                            display: "flex",
                            alignItems: "center",
                            gap: 15,
                        }}
                    >
                        <span>Try EasyBuild Free</span>
                        <span style={{ fontSize: 28 }}>→</span>
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
                    transform: `translateY(${interpolate(urlProgress, [0, 1], [30, 0], { extrapolateRight: "clamp" })}px)`,
                }}
            >
                <span
                    style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#FFD700",
                        letterSpacing: 4,
                        textShadow: `0 0 40px rgba(255,215,0,${glowPulse * 0.6})`,
                    }}
                >
                    tryezbuild.tech
                </span>
            </div>

            <CinematicVignette intensity={0.65} />
        </AbsoluteFill>
    );
};
