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
} from "../components/PremiumEffects";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "600", "700", "800"],
    subsets: ["latin"],
});

// Scene 3 — Enter EasyBuild
// Visual: Everything fades out, clean glowing gateway forms, EasyBuild logo animates in
// Motion: Soft light bloom, Liquid morphing, Elegant logo reveal

export const EnterEasyBuildScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Chaos collapse animation
    const collapseProgress = spring({
        frame,
        fps,
        config: springConfigs.gentle,
        durationInFrames: 40,
    });

    // Gateway formation
    const gatewayProgress = spring({
        frame: frame - 30,
        fps,
        config: springConfigs.liquid,
    });

    // Logo reveal
    const logoProgress = spring({
        frame: frame - 60,
        fps,
        config: springConfigs.bouncy,
    });

    const logoScale = interpolate(logoProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    const logoRotation = interpolate(logoProgress, [0, 1], [180, 0], {
        extrapolateRight: "clamp",
    });

    // Text reveal
    const textProgress = spring({
        frame: frame - 80,
        fps,
        config: springConfigs.ultraSmooth,
    });

    const taglineProgress = spring({
        frame: frame - 100,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Glow pulse
    const glowPulse = Math.sin((frame / fps) * 2) * 0.3 + 0.7;

    // Rotating rings
    const ringRotation = (frame / fps) * 15;

    // Collapsing chaos elements (from previous scene conceptually)
    const chaosElements = [
        { x: 20, y: 30, targetX: 50, targetY: 50 },
        { x: 80, y: 25, targetX: 50, targetY: 50 },
        { x: 15, y: 70, targetX: 50, targetY: 50 },
        { x: 85, y: 75, targetX: 50, targetY: 50 },
        { x: 30, y: 50, targetX: 50, targetY: 50 },
        { x: 70, y: 50, targetX: 50, targetY: 50 },
    ];

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#050510" accentColor="#FFD700" />

            {/* Collapsing chaos elements */}
            {chaosElements.map((el, i) => {
                const x = interpolate(collapseProgress, [0, 1], [el.x, el.targetX], {
                    extrapolateRight: "clamp",
                });
                const y = interpolate(collapseProgress, [0, 1], [el.y, el.targetY], {
                    extrapolateRight: "clamp",
                });
                const scale = interpolate(collapseProgress, [0, 0.8, 1], [1, 0.5, 0], {
                    extrapolateRight: "clamp",
                });

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: `${x}%`,
                            top: `${y}%`,
                            width: 60,
                            height: 60,
                            transform: `translate(-50%, -50%) scale(${scale}) rotate(${collapseProgress * 360}deg)`,
                            background: "rgba(255,107,53,0.2)",
                            border: "1px solid rgba(255,107,53,0.4)",
                            borderRadius: 10,
                            opacity: 1 - collapseProgress,
                        }}
                    />
                );
            })}

            <PremiumParticles count={60} color="#FFD700" />

            {/* Premium glow orbs */}
            <GlowOrb x={50} y={50} size={600} color="#FFD700" delay={40} intensity={0.5} />
            <GlowOrb x={50} y={50} size={400} color="#FFA500" delay={50} intensity={0.4} />
            <GlowOrb x={50} y={50} size={200} color="#FF6B35" delay={60} intensity={0.3} />

            {/* Central gateway visualization */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "45%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                {/* Outer rotating ring */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 320,
                        height: 320,
                        transform: `translate(-50%, -50%) rotate(${ringRotation}deg) scale(${gatewayProgress})`,
                        border: "3px solid rgba(255,215,0,0.2)",
                        borderRadius: "50%",
                        opacity: gatewayProgress,
                    }}
                >
                    {/* Orbiting dots */}
                    {[0, 90, 180, 270].map((angle, i) => (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: 0,
                                width: 12,
                                height: 12,
                                transform: `translateX(-50%) rotate(${angle}deg) translateY(-6px)`,
                                transformOrigin: "center 160px",
                                background: "#FFD700",
                                borderRadius: "50%",
                                boxShadow: "0 0 15px rgba(255,215,0,0.8)",
                            }}
                        />
                    ))}
                </div>

                {/* Middle pulsing ring */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 260,
                        height: 260,
                        transform: `translate(-50%, -50%) rotate(${-ringRotation * 0.7}deg) scale(${gatewayProgress})`,
                        border: "2px dashed rgba(255,215,0,0.3)",
                        borderRadius: "50%",
                        opacity: gatewayProgress,
                    }}
                />

                {/* Inner glowing ring */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 200,
                        height: 200,
                        transform: `translate(-50%, -50%) scale(${gatewayProgress * glowPulse})`,
                        border: "4px solid rgba(255,215,0,0.5)",
                        borderRadius: "50%",
                        boxShadow: `0 0 ${40 * glowPulse}px rgba(255,215,0,0.4), inset 0 0 40px rgba(255,215,0,0.1)`,
                        opacity: gatewayProgress,
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
                            width: 140,
                            height: 140,
                            borderRadius: 35,
                            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: `
                                0 0 ${80 * glowPulse}px rgba(255,215,0,${glowPulse}),
                                0 0 120px rgba(255,107,53,0.5),
                                0 20px 60px rgba(0,0,0,0.4)
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
            </div>

            {/* Brand name */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "72%",
                    transform: "translateX(-50%)",
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        fontSize: 64,
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        opacity: textProgress,
                        transform: `translateY(${interpolate(textProgress, [0, 1], [40, 0], { extrapolateRight: "clamp" })}px)`,
                        filter: `drop-shadow(0 0 30px rgba(255,215,0,0.4))`,
                    }}
                >
                    EasyBuild
                </div>
            </div>

            {/* Tagline */}
            <div
                style={{
                    position: "absolute",
                    bottom: 100,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        fontSize: 32,
                        fontWeight: 600,
                        color: "#ffffff",
                        opacity: taglineProgress,
                        transform: `translateY(${interpolate(taglineProgress, [0, 1], [30, 0], { extrapolateRight: "clamp" })}px)`,
                        marginBottom: 15,
                    }}
                >
                    Meet{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        EasyBuild
                    </span>
                </div>
                <div
                    style={{
                        fontSize: 22,
                        color: "rgba(255,255,255,0.6)",
                        opacity: taglineProgress,
                        transform: `translateY(${interpolate(taglineProgress, [0, 1], [20, 0], { extrapolateRight: "clamp" })}px)`,
                    }}
                >
                    The secure execution gateway for frontend apps.
                </div>
            </div>

            {/* Decorative liquid shapes */}
            <LiquidShape size={100} color="#FFD700" x={15} y={30} delay={70} />
            <LiquidShape size={80} color="#FF6B35" x={85} y={35} delay={80} />
            <LiquidShape size={70} color="#FFA500" x={20} y={70} delay={90} />
            <LiquidShape size={90} color="#FFD700" x={80} y={75} delay={100} />

            <CinematicVignette intensity={0.7} />
        </AbsoluteFill>
    );
};
