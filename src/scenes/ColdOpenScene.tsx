import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadFiraCode } from "@remotion/google-fonts/FiraCode";
import {
    ParallaxBackground,
    PremiumParticles,
    CinematicVignette,
    CameraPush,
    springConfigs,
    GlowOrb,
} from "../components/PremiumEffects";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "600", "700", "800"],
    subsets: ["latin"],
});

const { fontFamily: monoFont } = loadFiraCode("normal", {
    weights: ["400", "500"],
    subsets: ["latin"],
});

// Scene 1 — Cold Open: The Problem
// Visual: Dark minimal background, Code editor with exposed API key, hacker blur animation
// Motion: Ultra-smooth fade-in, Slow camera push, Soft glitch distortion

export const ColdOpenScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // Code editor appearance
    const editorProgress = spring({
        frame: frame - 10,
        fps,
        config: springConfigs.ultraSmooth,
    });

    const editorScale = interpolate(editorProgress, [0, 1], [0.9, 1], {
        extrapolateRight: "clamp",
    });

    const editorOpacity = interpolate(editorProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    // API key highlight/glow timing
    const keyHighlightProgress = spring({
        frame: frame - 40,
        fps,
        config: springConfigs.liquid,
    });

    const keyGlow = interpolate(keyHighlightProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Warning overlay
    const warningProgress = spring({
        frame: frame - 70,
        fps,
        config: springConfigs.bouncy,
    });

    // Hacker blur animation
    const hackerProgress = spring({
        frame: frame - 100,
        fps,
        config: springConfigs.liquid,
    });

    const hackerPull = interpolate(hackerProgress, [0, 1], [0, 150], {
        extrapolateRight: "clamp",
    });

    // Glitch effect
    const glitchIntensity = frame > 90 && frame < 120
        ? Math.sin(frame * 2) * 0.5 + 0.5
        : 0;

    // Text animations
    const text1Progress = spring({
        frame: frame - 120,
        fps,
        config: springConfigs.ultraSmooth,
    });

    const text2Progress = spring({
        frame: frame - 140,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Code content
    const codeLines = [
        { text: "// frontend/api.js", color: "#6A9955" },
        { text: "", color: "" },
        { text: "const response = await fetch(", color: "#DCDCAA" },
        { text: '  "https://api.openai.com/v1/chat",', color: "#CE9178" },
        { text: "  {", color: "#D4D4D4" },
        { text: '    headers: {', color: "#D4D4D4" },
        { text: '      "Authorization": "Bearer sk-proj-abc123...",', color: "#FF6B6B", isKey: true },
        { text: "    },", color: "#D4D4D4" },
        { text: "    body: JSON.stringify({ prompt })", color: "#D4D4D4" },
        { text: "  }", color: "#D4D4D4" },
        { text: ");", color: "#D4D4D4" },
    ];

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#080808" accentColor="#FF4444" />
            <PremiumParticles count={30} color="#FF4444" />

            <CameraPush intensity={0.03} delay={0}>
                {/* Dark ambient glow orbs */}
                <GlowOrb x={20} y={30} size={400} color="#FF4444" delay={20} intensity={0.3} />
                <GlowOrb x={80} y={70} size={300} color="#FF6B35" delay={30} intensity={0.2} />

                {/* Code Editor Window */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "45%",
                        transform: `translate(-50%, -50%) scale(${editorScale})`,
                        opacity: editorOpacity,
                        width: 900,
                    }}
                >
                    {/* Editor chrome */}
                    <div
                        style={{
                            background: "linear-gradient(180deg, #2D2D30 0%, #252526 100%)",
                            borderRadius: "12px 12px 0 0",
                            padding: "12px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            borderBottom: "1px solid #3C3C3C",
                        }}
                    >
                        {/* Window controls */}
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F56" }} />
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27C93F" }} />
                        <span style={{ marginLeft: 20, color: "#808080", fontSize: 13, fontFamily: monoFont }}>
                            api.js — frontend
                        </span>
                    </div>

                    {/* Code content */}
                    <div
                        style={{
                            background: "#1E1E1E",
                            borderRadius: "0 0 12px 12px",
                            padding: "20px 24px",
                            fontFamily: monoFont,
                            fontSize: 16,
                            lineHeight: 1.8,
                            boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {codeLines.map((line, i) => {
                            const lineProgress = spring({
                                frame: frame - 15 - i * 3,
                                fps,
                                config: { damping: 25, stiffness: 150 },
                            });

                            const lineOpacity = interpolate(lineProgress, [0, 1], [0, 1], {
                                extrapolateRight: "clamp",
                            });

                            const lineX = interpolate(lineProgress, [0, 1], [-20, 0], {
                                extrapolateRight: "clamp",
                            });

                            return (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        transform: `translateX(${lineX}px)`,
                                        opacity: lineOpacity,
                                    }}
                                >
                                    <span style={{ color: "#858585", width: 40, textAlign: "right", marginRight: 20 }}>
                                        {i + 1}
                                    </span>
                                    <span
                                        style={{
                                            color: line.color,
                                            position: "relative",
                                        }}
                                    >
                                        {line.text}
                                        {/* API Key danger glow */}
                                        {line.isKey && (
                                            <>
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: -5,
                                                        left: 170,
                                                        right: 0,
                                                        bottom: -5,
                                                        background: `rgba(255,68,68,${keyGlow * 0.3})`,
                                                        borderRadius: 4,
                                                        boxShadow: `0 0 ${30 * keyGlow}px rgba(255,68,68,${keyGlow * 0.8})`,
                                                        transform: `translateX(${hackerPull}px)`,
                                                        transition: "transform 0.5s",
                                                    }}
                                                />
                                                {/* Extracted key visual */}
                                                {hackerProgress > 0.3 && (
                                                    <span
                                                        style={{
                                                            position: "absolute",
                                                            left: 170 + hackerPull,
                                                            top: 0,
                                                            color: "#FF6B6B",
                                                            opacity: hackerProgress,
                                                            filter: `blur(${(1 - hackerProgress) * 3}px)`,
                                                        }}
                                                    >
                                                        sk-proj-abc123...
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Warning overlay */}
                        <div
                            style={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                padding: "8px 16px",
                                background: "rgba(255,68,68,0.15)",
                                border: "1px solid rgba(255,68,68,0.4)",
                                borderRadius: 8,
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                transform: `scale(${interpolate(warningProgress, [0, 1], [0.5, 1], { extrapolateRight: "clamp" })})`,
                                opacity: warningProgress,
                            }}
                        >
                            <span style={{ fontSize: 16 }}>⚠️</span>
                            <span style={{ color: "#FF6B6B", fontSize: 12, fontWeight: 600 }}>
                                SECRET EXPOSED
                            </span>
                        </div>

                        {/* Glitch overlay */}
                        {glitchIntensity > 0.3 && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: `linear-gradient(${Math.random() * 360}deg, transparent 0%, rgba(255,0,100,${glitchIntensity * 0.1}) 50%, transparent 100%)`,
                                    mixBlendMode: "overlay",
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Hacker visual (blur pull animation) */}
                {hackerProgress > 0.1 && (
                    <div
                        style={{
                            position: "absolute",
                            right: 50,
                            top: "50%",
                            transform: "translateY(-50%)",
                            opacity: hackerProgress * 0.8,
                        }}
                    >
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                            <defs>
                                <linearGradient id="hackerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#FF4444" />
                                    <stop offset="100%" stopColor="#FF6B35" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                                fill="url(#hackerGrad)"
                                style={{ filter: "drop-shadow(0 0 20px rgba(255,68,68,0.8))" }}
                            />
                        </svg>
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: -80,
                                width: 80,
                                height: 2,
                                background: "linear-gradient(90deg, transparent, #FF4444)",
                                transform: "translateY(-50%)",
                                opacity: hackerProgress,
                            }}
                        />
                    </div>
                )}

                {/* Bottom warning text */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 80,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            fontSize: 42,
                            fontWeight: 700,
                            color: "#ffffff",
                            opacity: text1Progress,
                            transform: `translateY(${interpolate(text1Progress, [0, 1], [30, 0], { extrapolateRight: "clamp" })}px)`,
                            marginBottom: 15,
                        }}
                    >
                        Your{" "}
                        <span
                            style={{
                                background: "linear-gradient(135deg, #FF4444 0%, #FF6B35 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            API keys
                        </span>{" "}
                        are exposed.
                    </div>
                    <div
                        style={{
                            fontSize: 24,
                            color: "rgba(255,255,255,0.6)",
                            opacity: text2Progress,
                            transform: `translateY(${interpolate(text2Progress, [0, 1], [20, 0], { extrapolateRight: "clamp" })}px)`,
                        }}
                    >
                        Every frontend app leaks secrets.
                    </div>
                </div>
            </CameraPush>

            <CinematicVignette intensity={0.85} />
        </AbsoluteFill>
    );
};
