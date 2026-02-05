import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from "remotion";
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

// SCENE 3 — EASYBUILD ARRIVAL
// Visual: Everything collapses into glowing gateway, logo flash, clean layer forms
// Motion: Liquid morph transitions, soft light bloom, cinematic camera push

export const EasyBuildArrivalScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Chaos elements that collapse into center
    const chaosElements = Array.from({ length: 20 }, (_, i) => ({
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        startRotation: Math.random() * 360,
        delay: i * 2,
        size: 20 + Math.random() * 40,
    }));

    // Collapse phase (frames 0-60)
    const collapseProgress = spring({
        frame,
        fps,
        config: { damping: 15, stiffness: 60, mass: 1.5 },
    });

    // Light bloom flash (frames 50-80)
    const flashProgress = spring({
        frame: frame - 50,
        fps,
        config: { damping: 8, stiffness: 200 },
    });

    const flashIntensity = interpolate(flashProgress, [0, 0.3, 1], [0, 1, 0], {
        extrapolateRight: "clamp",
    });

    // Logo reveal (frames 70-110)
    const logoProgress = spring({
        frame: frame - 70,
        fps,
        config: springConfigs.bouncy,
    });

    const logoScale = interpolate(logoProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    const logoRotation = interpolate(logoProgress, [0, 1], [180, 0], {
        extrapolateRight: "clamp",
    });

    // Gateway rings forming
    const ring1Progress = spring({
        frame: frame - 60,
        fps,
        config: springConfigs.liquid,
    });

    const ring2Progress = spring({
        frame: frame - 70,
        fps,
        config: springConfigs.liquid,
    });

    const ring3Progress = spring({
        frame: frame - 80,
        fps,
        config: springConfigs.liquid,
    });

    // Rotating rings
    const ringRotation = (frame / fps) * 30;

    // Text animation
    const text1Progress = spring({
        frame: frame - 100,
        fps,
        config: springConfigs.ultraSmooth,
    });

    const text2Progress = spring({
        frame: frame - 120,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Camera push zoom
    const cameraPush = interpolate(frame, [70, 180], [1, 1.1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
    });

    // Glow pulse
    const glowPulse = Math.sin((frame / fps) * 2.5) * 0.3 + 0.7;

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#050510" accentColor="#FFD700" />

            {/* Collapsing chaos elements */}
            {chaosElements.map((el, i) => {
                const individualCollapse = interpolate(
                    collapseProgress,
                    [0, 1],
                    [0, 1],
                    { extrapolateRight: "clamp" }
                );

                const x = interpolate(individualCollapse, [0, 1], [el.startX, 50], {
                    extrapolateRight: "clamp",
                });
                const y = interpolate(individualCollapse, [0, 1], [el.startY, 50], {
                    extrapolateRight: "clamp",
                });
                const rotation = interpolate(individualCollapse, [0, 1], [el.startRotation, el.startRotation + 720], {
                    extrapolateRight: "clamp",
                });
                const scale = interpolate(individualCollapse, [0, 0.7, 1], [1, 0.5, 0], {
                    extrapolateRight: "clamp",
                });
                const opacity = interpolate(individualCollapse, [0, 0.8, 1], [0.7, 0.5, 0], {
                    extrapolateRight: "clamp",
                });

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: `${x}%`,
                            top: `${y}%`,
                            width: el.size,
                            height: el.size * 0.7,
                            transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                            background: `linear-gradient(135deg, rgba(255,107,53,0.4) 0%, rgba(255,68,68,0.2) 100%)`,
                            border: "1px solid rgba(255,107,53,0.4)",
                            borderRadius: 6,
                            opacity,
                        }}
                    />
                );
            })}

            <PremiumParticles count={70} color="#FFD700" />

            {/* Light bloom flash */}
            {flashIntensity > 0 && (
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: flashIntensity * 2000,
                        height: flashIntensity * 2000,
                        background: `radial-gradient(circle, rgba(255,215,0,${flashIntensity}) 0%, transparent 50%)`,
                        pointerEvents: "none",
                    }}
                />
            )}

            {/* Background glows */}
            <GlowOrb x={50} y={45} size={600} color="#FFD700" delay={60} intensity={0.6} />
            <GlowOrb x={50} y={45} size={400} color="#FFA500" delay={70} intensity={0.5} />
            <GlowOrb x={50} y={45} size={200} color="#FF6B35" delay={80} intensity={0.4} />

            {/* Main container with camera push */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "45%",
                    transform: `translate(-50%, -50%) scale(${cameraPush})`,
                }}
            >
                {/* Outer rotating ring */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 400,
                        height: 400,
                        transform: `translate(-50%, -50%) rotate(${ringRotation}deg) scale(${ring1Progress})`,
                        border: "3px solid rgba(255,215,0,0.25)",
                        borderRadius: "50%",
                        opacity: ring1Progress,
                    }}
                >
                    {/* Orbiting energy dots */}
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: 0,
                                width: 14,
                                height: 14,
                                transform: `translateX(-50%) rotate(${angle}deg) translateY(-7px)`,
                                transformOrigin: "center 200px",
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
                        width: 320,
                        height: 320,
                        transform: `translate(-50%, -50%) rotate(${-ringRotation * 0.6}deg) scale(${ring2Progress})`,
                        border: "2px dashed rgba(255,215,0,0.35)",
                        borderRadius: "50%",
                        opacity: ring2Progress,
                    }}
                />

                {/* Inner glowing ring */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 240,
                        height: 240,
                        transform: `translate(-50%, -50%) scale(${ring3Progress * glowPulse})`,
                        border: "5px solid rgba(255,215,0,0.6)",
                        borderRadius: "50%",
                        boxShadow: `
                            0 0 ${60 * glowPulse}px rgba(255,215,0,0.5),
                            inset 0 0 60px rgba(255,215,0,0.15)
                        `,
                        opacity: ring3Progress,
                    }}
                />

                {/* Center logo */}
                <div
                    style={{
                        position: "relative",
                        transform: `scale(${logoScale}) rotate(${logoRotation}deg)`,
                    }}
                >
                    <div
                        style={{
                            width: 160,
                            height: 160,
                            borderRadius: 40,
                            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: `
                                0 0 ${120 * glowPulse}px rgba(255,215,0,${glowPulse}),
                                0 0 200px rgba(255,107,53,0.5),
                                0 30px 80px rgba(0,0,0,0.5)
                            `,
                        }}
                    >
                        <span style={{ fontSize: 90, fontWeight: 800, color: "#0a0a0a" }}>E</span>
                    </div>
                </div>
            </div>

            {/* Text - kinetic with 3D perspective */}
            <div
                style={{
                    position: "absolute",
                    bottom: 120,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    perspective: 800,
                }}
            >
                <div
                    style={{
                        fontSize: 42,
                        fontWeight: 700,
                        color: "#ffffff",
                        transform: `translateY(${interpolate(text1Progress, [0, 1], [80, 0], { extrapolateRight: "clamp" })}px) rotateX(${interpolate(text1Progress, [0, 1], [30, 0], { extrapolateRight: "clamp" })}deg)`,
                        opacity: text1Progress,
                        marginBottom: 20,
                    }}
                >
                    Meet{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #FFD700 0%, #FF6B35 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            filter: `drop-shadow(0 0 25px rgba(255,215,0,${glowPulse}))`,
                        }}
                    >
                        EasyBuild
                    </span>
                    .
                </div>
                <div
                    style={{
                        fontSize: 26,
                        color: "rgba(255,255,255,0.7)",
                        transform: `translateY(${interpolate(text2Progress, [0, 1], [50, 0], { extrapolateRight: "clamp" })}px)`,
                        opacity: text2Progress,
                    }}
                >
                    The{" "}
                    <span style={{ color: "#FFD700", fontWeight: 600 }}>secure execution gateway</span>{" "}
                    for frontend apps.
                </div>
            </div>

            <CinematicVignette intensity={0.7} />
        </AbsoluteFill>
    );
};
