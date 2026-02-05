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

// SCENE 7 — USE CASES
// Visual: Half-cut UI cards sliding, stack morphing, layout shifts
// Motion: Card-based UI animation, parallax, NotebookLM-level polish

export const UseCasesSceneAdvanced: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Use cases with half-cut card effect
    const useCases = [
        { title: "AI Apps", icon: "🤖", desc: "GPT, Claude, Gemini", color: "#FF6B9D" },
        { title: "Payments", icon: "💳", desc: "Stripe, PayPal", color: "#635bff" },
        { title: "SaaS", icon: "☁️", desc: "Multi-tenant", color: "#4ECDC4" },
        { title: "Extensions", icon: "🧩", desc: "Chrome, Firefox", color: "#FFD700" },
        { title: "Mobile", icon: "📱", desc: "iOS, Android", color: "#96F550" },
    ];

    // Staggered card animations with half-cut reveal
    const cardAnimations = useCases.map((_, i) => {
        const delay = 25 + i * 18;
        return spring({
            frame: frame - delay,
            fps,
            config: springConfigs.liquid,
        });
    });

    // Stack morph - cards overlap then separate
    const stackPhase = interpolate(frame, [0, 60, 120], [0, 1, 0], {
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
    });

    // Parallax for depth
    const parallaxX = Math.sin((frame / fps) * 0.3) * 15;
    const parallaxY = Math.cos((frame / fps) * 0.4) * 8;

    // Title animation
    const titleProgress = spring({
        frame,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Center hub (EasyBuild)
    const hubProgress = spring({
        frame: frame - 40,
        fps,
        config: springConfigs.bouncy,
    });

    const hubPulse = Math.sin((frame / fps) * 2.5) * 0.1 + 1;

    // Bottom text
    const textProgress = spring({
        frame: frame - 130,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Calculate card positions - they stack then spread
    const getCardPosition = (index: number, progress: number) => {
        // Final spread positions in arc around center
        const angles = [-60, -30, 0, 30, 60];
        const finalAngle = angles[index];
        const radius = 350;

        // Initial stacked position
        const stackedX = 0;
        const stackedY = index * 5;
        const stackedRotation = (index - 2) * 3;

        // Final spread position
        const finalX = Math.sin((finalAngle * Math.PI) / 180) * radius;
        const finalY = Math.cos((finalAngle * Math.PI) / 180) * radius * 0.3 - 80;
        const finalRotation = finalAngle * 0.2;

        return {
            x: interpolate(progress, [0, 1], [stackedX, finalX], { extrapolateRight: "clamp" }),
            y: interpolate(progress, [0, 1], [stackedY, finalY], { extrapolateRight: "clamp" }),
            rotation: interpolate(progress, [0, 1], [stackedRotation, finalRotation], { extrapolateRight: "clamp" }),
            scale: interpolate(progress, [0, 0.5, 1], [0.8, 1.1, 1], { extrapolateRight: "clamp" }),
        };
    };

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#0a0a14" accentColor="#FFD700" />
            <PremiumParticles count={40} color="#FFD700" />

            {/* Background glows */}
            <GlowOrb x={50} y={50} size={450} color="#FFD700" delay={25} intensity={0.4} />

            {/* Title */}
            <div
                style={{
                    position: "absolute",
                    top: 55,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    opacity: titleProgress,
                    transform: `translateY(${interpolate(titleProgress, [0, 1], [-40, 0], { extrapolateRight: "clamp" })}px)`,
                }}
            >
                <div style={{ fontSize: 48, fontWeight: 800, color: "#ffffff" }}>
                    Universally{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 50%, #96F550 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Adaptable
                    </span>
                </div>
            </div>

            {/* Main container with parallax */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "55%",
                    transform: `translate(-50%, -50%) translate(${parallaxX}px, ${parallaxY}px)`,
                }}
            >
                {/* Center EasyBuild hub */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: `translate(-50%, -50%) scale(${hubProgress * hubPulse})`,
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{
                            width: 110,
                            height: 110,
                            borderRadius: 28,
                            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: `0 0 ${80 * hubPulse}px rgba(255,215,0,${hubPulse * 0.7}), 0 20px 60px rgba(0,0,0,0.5)`,
                        }}
                    >
                        <span style={{ fontSize: 55, fontWeight: 800, color: "#0a0a0a" }}>E</span>
                    </div>
                </div>

                {/* Connection lines from hub to cards */}
                <svg
                    style={{
                        position: "absolute",
                        left: -400,
                        top: -300,
                        width: 800,
                        height: 600,
                        pointerEvents: "none",
                    }}
                >
                    <defs>
                        <linearGradient id="lineGradUse" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                    {useCases.map((useCase, i) => {
                        const pos = getCardPosition(i, cardAnimations[i]);
                        const lineProgress = interpolate(cardAnimations[i], [0.5, 1], [0, 1], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        });
                        return (
                            <line
                                key={i}
                                x1={400}
                                y1={300}
                                x2={400 + pos.x}
                                y2={300 + pos.y}
                                stroke={useCase.color}
                                strokeWidth={2}
                                strokeDasharray="200"
                                strokeDashoffset={interpolate(lineProgress, [0, 1], [200, 0])}
                                opacity={lineProgress * 0.5}
                            />
                        );
                    })}
                </svg>

                {/* Use case cards with half-cut effect */}
                {useCases.map((useCase, i) => {
                    const progress = cardAnimations[i];
                    const pos = getCardPosition(i, progress);

                    // Half-cut reveal effect
                    const clipProgress = interpolate(progress, [0, 0.6], [100, 0], {
                        extrapolateRight: "clamp",
                    });

                    // Floating animation
                    const floatY = Math.sin((frame / fps) * 1.5 + i * 1.2) * 6;

                    // Glow pulse
                    const cardGlow = Math.sin((frame / fps) * 2 + i) * 0.3 + 0.7;

                    return (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y + floatY}px) rotate(${pos.rotation}deg) scale(${pos.scale})`,
                                zIndex: 5 - Math.abs(i - 2),
                            }}
                        >
                            <div
                                style={{
                                    width: 160,
                                    padding: "25px 20px",
                                    background: `linear-gradient(160deg, ${useCase.color}18 0%, ${useCase.color}05 100%)`,
                                    border: `2px solid ${useCase.color}50`,
                                    borderRadius: 20,
                                    textAlign: "center",
                                    boxShadow: `0 0 ${50 * cardGlow}px ${useCase.color}25, 0 20px 50px rgba(0,0,0,0.4)`,
                                    // Half-cut clip effect
                                    clipPath: `inset(${clipProgress}% 0 0 0)`,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 48,
                                        marginBottom: 12,
                                        filter: `drop-shadow(0 0 20px ${useCase.color})`,
                                    }}
                                >
                                    {useCase.icon}
                                </div>
                                <div
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 800,
                                        color: useCase.color,
                                        marginBottom: 6,
                                        textShadow: `0 0 15px ${useCase.color}60`,
                                    }}
                                >
                                    {useCase.title}
                                </div>
                                <div
                                    style={{
                                        fontSize: 12,
                                        color: "rgba(255,255,255,0.6)",
                                    }}
                                >
                                    {useCase.desc}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom kinetic text */}
            <div
                style={{
                    position: "absolute",
                    bottom: 55,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    gap: 15,
                    opacity: textProgress,
                }}
            >
                {useCases.map((useCase, i) => {
                    const wordProgress = spring({
                        frame: frame - 130 - i * 6,
                        fps,
                        config: springConfigs.bouncy,
                    });

                    return (
                        <span
                            key={i}
                            style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: useCase.color,
                                transform: `translateY(${interpolate(wordProgress, [0, 1], [30, 0], { extrapolateRight: "clamp" })}px)`,
                                opacity: wordProgress,
                                textShadow: `0 0 15px ${useCase.color}50`,
                            }}
                        >
                            {useCase.title}
                            {i < useCases.length - 1 && (
                                <span style={{ color: "rgba(255,255,255,0.3)", margin: "0 5px" }}>·</span>
                            )}
                        </span>
                    );
                })}
            </div>

            <CinematicVignette intensity={0.75} />
        </AbsoluteFill>
    );
};
