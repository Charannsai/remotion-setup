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

// SCENE 0 — LOGO CONSTRUCTION OPEN
// Visual: Gear spins in, cursor swoops, both merge into keyboard key, zoom out + wordmark
// Motion: Ultra-high-end logo animation with metallic reflections and depth lighting

export const LogoConstructionScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Phase 1: Gear spinning in from depth (frames 0-40)
    const gearProgress = spring({
        frame,
        fps,
        config: { damping: 18, stiffness: 80, mass: 1.2 },
    });

    const gearScale = interpolate(gearProgress, [0, 1], [0.1, 1], {
        extrapolateRight: "clamp",
    });

    const gearRotation = interpolate(frame, [0, 60], [0, 360], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
    });

    const gearZ = interpolate(gearProgress, [0, 1], [-500, 0], {
        extrapolateRight: "clamp",
    });

    // Phase 2: Cursor swooping in (frames 30-60)
    const cursorProgress = spring({
        frame: frame - 30,
        fps,
        config: { damping: 15, stiffness: 120, mass: 0.8 },
    });

    const cursorX = interpolate(cursorProgress, [0, 1], [400, 0], {
        extrapolateRight: "clamp",
    });

    const cursorY = interpolate(cursorProgress, [0, 1], [-200, 0], {
        extrapolateRight: "clamp",
    });

    // Click ripple effect (frame 55-70)
    const clickProgress = spring({
        frame: frame - 55,
        fps,
        config: { damping: 12, stiffness: 200 },
    });

    const rippleScale = interpolate(clickProgress, [0, 1], [0, 3], {
        extrapolateRight: "clamp",
    });

    const rippleOpacity = interpolate(clickProgress, [0, 0.5, 1], [0.8, 0.4, 0], {
        extrapolateRight: "clamp",
    });

    // Phase 3: Merge into keyboard key (frames 70-100)
    const mergeProgress = spring({
        frame: frame - 70,
        fps,
        config: { damping: 20, stiffness: 100 },
    });

    const elementsScale = interpolate(mergeProgress, [0, 1], [1, 0.5], {
        extrapolateRight: "clamp",
    });

    const keyFormProgress = spring({
        frame: frame - 85,
        fps,
        config: { damping: 15, stiffness: 80 },
    });

    // Phase 4: Zoom out + pan right (frames 100-140)
    const zoomOutProgress = spring({
        frame: frame - 100,
        fps,
        config: springConfigs.ultraSmooth,
    });

    const cameraZoom = interpolate(zoomOutProgress, [0, 1], [1.5, 1], {
        extrapolateRight: "clamp",
    });

    const cameraPanX = interpolate(zoomOutProgress, [0, 1], [0, -150], {
        extrapolateRight: "clamp",
    });

    // Phase 5: Wordmark animation (frames 120-160)
    const wordmarkProgress = spring({
        frame: frame - 120,
        fps,
        config: springConfigs.liquid,
    });

    // Glow pulse
    const glowPulse = Math.sin((frame / fps) * 2) * 0.3 + 0.7;

    // Metallic reflection shimmer
    const shimmerX = interpolate(frame, [0, 180], [-100, 200], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#050510" accentColor="#FFD700" />
            <PremiumParticles count={40} color="#FFD700" />

            {/* Background ambient glows */}
            <GlowOrb x={50} y={50} size={500} color="#FFD700" delay={0} intensity={0.3} />
            <GlowOrb x={40} y={45} size={300} color="#FF6B35" delay={20} intensity={0.2} />

            {/* Main container with camera movement */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) scale(${cameraZoom}) translateX(${cameraPanX}px)`,
                    display: "flex",
                    alignItems: "center",
                    gap: 60,
                }}
            >
                {/* Logo Icon Container */}
                <div
                    style={{
                        position: "relative",
                        width: 180,
                        height: 180,
                    }}
                >
                    {/* Keyboard Key (forms around elements) */}
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: `translate(-50%, -50%) scale(${keyFormProgress})`,
                            width: 160,
                            height: 160,
                            borderRadius: 30,
                            background: `linear-gradient(145deg, #2a2a3a 0%, #1a1a28 50%, #252535 100%)`,
                            boxShadow: `
                                0 15px 40px rgba(0,0,0,0.5),
                                inset 0 2px 0 rgba(255,255,255,0.1),
                                inset 0 -2px 4px rgba(0,0,0,0.3),
                                0 0 ${60 * glowPulse}px rgba(255,215,0,${glowPulse * 0.3})
                            `,
                            border: "1px solid rgba(255,255,255,0.08)",
                            opacity: keyFormProgress,
                            overflow: "hidden",
                        }}
                    >
                        {/* Metallic shimmer effect */}
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: shimmerX,
                                width: 60,
                                height: "200%",
                                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                                transform: "rotate(20deg)",
                            }}
                        />
                    </div>

                    {/* Gear Icon */}
                    <div
                        style={{
                            position: "absolute",
                            left: "35%",
                            top: "40%",
                            transform: `translate(-50%, -50%) scale(${gearScale * elementsScale}) rotate(${gearRotation}deg) translateZ(${gearZ}px)`,
                            opacity: gearProgress,
                        }}
                    >
                        <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
                            <defs>
                                <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#FFD700" />
                                    <stop offset="50%" stopColor="#FFA500" />
                                    <stop offset="100%" stopColor="#FF6B35" />
                                </linearGradient>
                                <filter id="gearGlow">
                                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            <path
                                d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"
                                fill="url(#gearGrad)"
                                filter="url(#gearGlow)"
                            />
                        </svg>
                    </div>

                    {/* Cursor Pointer */}
                    <div
                        style={{
                            position: "absolute",
                            left: "65%",
                            top: "55%",
                            transform: `translate(-50%, -50%) translate(${cursorX}px, ${cursorY}px) scale(${elementsScale})`,
                            opacity: cursorProgress,
                        }}
                    >
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                            <defs>
                                <linearGradient id="cursorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#FFFFFF" />
                                    <stop offset="100%" stopColor="#E0E0E0" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M4 4l16 7.5-6.5 2L11 20z"
                                fill="url(#cursorGrad)"
                                stroke="#333"
                                strokeWidth="0.5"
                                style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.3))" }}
                            />
                        </svg>

                        {/* Click ripple */}
                        {clickProgress > 0 && (
                            <div
                                style={{
                                    position: "absolute",
                                    left: "70%",
                                    top: "20%",
                                    width: 20,
                                    height: 20,
                                    borderRadius: "50%",
                                    border: "2px solid #FFD700",
                                    transform: `scale(${rippleScale})`,
                                    opacity: rippleOpacity,
                                    boxShadow: "0 0 20px rgba(255,215,0,0.5)",
                                }}
                            />
                        )}
                    </div>

                    {/* Combined logo glow (after merge) */}
                    {keyFormProgress > 0.5 && (
                        <div
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 200,
                                height: 200,
                                borderRadius: "50%",
                                background: `radial-gradient(circle, rgba(255,215,0,${glowPulse * 0.3}) 0%, transparent 70%)`,
                                pointerEvents: "none",
                            }}
                        />
                    )}
                </div>

                {/* EasyBuild Wordmark */}
                <div
                    style={{
                        opacity: wordmarkProgress,
                        transform: `translateX(${interpolate(wordmarkProgress, [0, 1], [100, 0], { extrapolateRight: "clamp" })}px)`,
                    }}
                >
                    {/* Kinetic typography - each letter animates */}
                    <div style={{ display: "flex", gap: 0 }}>
                        {"EasyBuild".split("").map((letter, i) => {
                            const letterDelay = 120 + i * 3;
                            const letterProgress = spring({
                                frame: frame - letterDelay,
                                fps,
                                config: { damping: 20, stiffness: 180 },
                            });

                            const letterY = interpolate(letterProgress, [0, 1], [40, 0], {
                                extrapolateRight: "clamp",
                            });

                            const letterRotation = interpolate(letterProgress, [0, 1], [15, 0], {
                                extrapolateRight: "clamp",
                            });

                            const isE = i === 0;
                            const isB = i === 4;

                            return (
                                <span
                                    key={i}
                                    style={{
                                        display: "inline-block",
                                        fontSize: 72,
                                        fontWeight: 800,
                                        transform: `translateY(${letterY}px) rotate(${letterRotation}deg)`,
                                        opacity: letterProgress,
                                        background: (isE || isB)
                                            ? "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)"
                                            : "none",
                                        WebkitBackgroundClip: (isE || isB) ? "text" : "none",
                                        WebkitTextFillColor: (isE || isB) ? "transparent" : "#ffffff",
                                        color: (isE || isB) ? "transparent" : "#ffffff",
                                        textShadow: (isE || isB) ? "none" : "0 0 30px rgba(255,255,255,0.1)",
                                        filter: (isE || isB) ? `drop-shadow(0 0 15px rgba(255,215,0,${glowPulse * 0.5}))` : "none",
                                    }}
                                >
                                    {letter}
                                </span>
                            );
                        })}
                    </div>

                    {/* Tagline */}
                    <div
                        style={{
                            marginTop: 15,
                            fontSize: 18,
                            color: "rgba(255,255,255,0.5)",
                            letterSpacing: 4,
                            textTransform: "uppercase",
                            opacity: interpolate(wordmarkProgress, [0.5, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                        }}
                    >
                        Secure Execution Gateway
                    </div>
                </div>
            </div>

            <CinematicVignette intensity={0.7} />
        </AbsoluteFill>
    );
};
