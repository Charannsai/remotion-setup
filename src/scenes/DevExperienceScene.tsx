import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
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

// Scene 5 — Developer Experience
// Visual: Code writing, cursor animation, console success, no API keys
// Motion: Cursor typing animation, Soft zoom, Smooth code highlight

export const DevExperienceScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Title animation
    const titleProgress = spring({
        frame,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Code editor appearance
    const editorProgress = spring({
        frame: frame - 20,
        fps,
        config: springConfigs.liquid,
    });

    // Typewriter effect for code
    const codeLines = [
        { text: "// Just call the EasyBuild endpoint", color: "#6A9955", delay: 40 },
        { text: "", color: "", delay: 0 },
        { text: 'const response = await fetch(', color: "#DCDCAA", delay: 50 },
        { text: '  "https://api.tryezbuild.tech/api/p/openai/chat",', color: "#CE9178", delay: 60, highlight: true },
        { text: "  {", color: "#D4D4D4", delay: 70 },
        { text: "    method: 'POST',", color: "#D4D4D4", delay: 75 },
        { text: "    body: JSON.stringify({ prompt })", color: "#D4D4D4", delay: 80 },
        { text: "  }", color: "#D4D4D4", delay: 85 },
        { text: ");", color: "#D4D4D4", delay: 90 },
        { text: "", color: "", delay: 0 },
        { text: "// That's it! No API keys needed 🎉", color: "#6A9955", delay: 100 },
    ];

    // Cursor blink
    const cursorVisible = Math.sin((frame / fps) * 8) > 0;

    // Current typing line (for cursor position)
    const currentTypingLine = codeLines.findIndex((line, i) => {
        return frame < line.delay + 20 && line.text.length > 0;
    });

    // Console animation
    const consoleProgress = spring({
        frame: frame - 110,
        fps,
        config: springConfigs.bouncy,
    });

    // Success checkmark
    const successProgress = spring({
        frame: frame - 130,
        fps,
        config: springConfigs.bouncy,
    });

    // Bottom text
    const textProgress = spring({
        frame: frame - 145,
        fps,
        config: springConfigs.ultraSmooth,
    });

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#0a0a12" accentColor="#4ECDC4" />
            <PremiumParticles count={30} color="#4ECDC4" />

            <GlowOrb x={30} y={40} size={350} color="#4ECDC4" delay={20} intensity={0.3} />
            <GlowOrb x={70} y={60} size={250} color="#96F550" delay={30} intensity={0.2} />

            <CameraPush intensity={0.02} delay={10}>
                {/* Title */}
                <div
                    style={{
                        position: "absolute",
                        top: 50,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        opacity: titleProgress,
                        transform: `translateY(${interpolate(titleProgress, [0, 1], [-30, 0], { extrapolateRight: "clamp" })}px)`,
                    }}
                >
                    <span style={{ fontSize: 40, fontWeight: 700, color: "#ffffff" }}>
                        Developer{" "}
                        <span
                            style={{
                                background: "linear-gradient(135deg, #4ECDC4 0%, #96F550 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Experience
                        </span>
                    </span>
                </div>

                {/* Code Editor */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "48%",
                        transform: `translate(-50%, -50%) scale(${interpolate(editorProgress, [0, 1], [0.9, 1], { extrapolateRight: "clamp" })})`,
                        opacity: editorProgress,
                        width: 800,
                    }}
                >
                    {/* Editor header */}
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
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F56" }} />
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27C93F" }} />
                        <span style={{ marginLeft: 20, color: "#808080", fontSize: 13, fontFamily: monoFont }}>
                            app.js — your frontend
                        </span>
                    </div>

                    {/* Code content */}
                    <div
                        style={{
                            background: "#1E1E1E",
                            borderRadius: "0 0 12px 12px",
                            padding: "20px 24px",
                            fontFamily: monoFont,
                            fontSize: 15,
                            lineHeight: 1.8,
                            boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
                            minHeight: 280,
                        }}
                    >
                        {codeLines.map((line, i) => {
                            if (line.text === "") {
                                return <div key={i} style={{ height: "1.8em" }} />;
                            }

                            const lineVisible = frame >= line.delay;
                            const charsPerFrame = 1.5;
                            const framesElapsed = Math.max(0, frame - line.delay);
                            const visibleChars = Math.min(
                                Math.floor(framesElapsed * charsPerFrame),
                                line.text.length
                            );

                            const lineProgress = spring({
                                frame: frame - line.delay,
                                fps,
                                config: { damping: 30, stiffness: 200 },
                            });

                            if (!lineVisible) return null;

                            return (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        opacity: lineProgress,
                                    }}
                                >
                                    <span style={{ color: "#858585", width: 35, textAlign: "right", marginRight: 20 }}>
                                        {i + 1}
                                    </span>
                                    <span
                                        style={{
                                            color: line.color,
                                            position: "relative",
                                        }}
                                    >
                                        {line.text.slice(0, visibleChars)}
                                        {/* Cursor */}
                                        {visibleChars < line.text.length && cursorVisible && (
                                            <span style={{ color: "#FFD700" }}>|</span>
                                        )}
                                        {/* Highlight effect on EasyBuild URL */}
                                        {line.highlight && visibleChars === line.text.length && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: -3,
                                                    left: 8,
                                                    right: 0,
                                                    bottom: -3,
                                                    background: "rgba(78,205,196,0.15)",
                                                    borderRadius: 4,
                                                    border: "1px solid rgba(78,205,196,0.3)",
                                                    zIndex: -1,
                                                }}
                                            />
                                        )}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Console output */}
                    <div
                        style={{
                            marginTop: 20,
                            opacity: consoleProgress,
                            transform: `translateY(${interpolate(consoleProgress, [0, 1], [20, 0], { extrapolateRight: "clamp" })}px)`,
                        }}
                    >
                        <div
                            style={{
                                background: "#1A1A1A",
                                borderRadius: 10,
                                padding: "12px 20px",
                                fontFamily: monoFont,
                                fontSize: 14,
                                border: "1px solid #333",
                            }}
                        >
                            <span style={{ color: "#96F550" }}>✓</span>
                            <span style={{ color: "#858585" }}> [</span>
                            <span style={{ color: "#4ECDC4" }}>200 OK</span>
                            <span style={{ color: "#858585" }}>] Response received in </span>
                            <span style={{ color: "#FFD700" }}>47ms</span>
                        </div>
                    </div>
                </div>

                {/* Success badge */}
                <div
                    style={{
                        position: "absolute",
                        right: 80,
                        top: "40%",
                        transform: `scale(${interpolate(successProgress, [0, 1], [0, 1], { extrapolateRight: "clamp" })})`,
                        opacity: successProgress,
                    }}
                >
                    <div
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #96F550 0%, #4ECDC4 100%)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0 0 50px rgba(150,245,80,0.5)",
                        }}
                    >
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
                                fill="#0a0a0a"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                    <div
                        style={{
                            textAlign: "center",
                            marginTop: 15,
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#96F550",
                        }}
                    >
                        Works instantly!
                    </div>
                </div>

                {/* Bottom text */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 70,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        opacity: textProgress,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 50,
                            fontSize: 20,
                            fontWeight: 600,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ color: "#96F550" }}>✓</span>
                            <span style={{ color: "rgba(255,255,255,0.8)" }}>No backend needed</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ color: "#96F550" }}>✓</span>
                            <span style={{ color: "rgba(255,255,255,0.8)" }}>No secrets in frontend</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ color: "#96F550" }}>✓</span>
                            <span style={{ color: "rgba(255,255,255,0.8)" }}>Just ship</span>
                        </div>
                    </div>
                </div>
            </CameraPush>

            <CinematicVignette intensity={0.75} />
        </AbsoluteFill>
    );
};
