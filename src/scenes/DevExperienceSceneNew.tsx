import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadFiraCode } from "@remotion/google-fonts/FiraCode";
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

const { fontFamily: monoFont } = loadFiraCode("normal", {
    weights: ["400", "500"],
    subsets: ["latin"],
});

// SCENE 5 — DEV EXPERIENCE
// Visual: Code typing animation, no API keys shown, console success tick
// Motion: Soft zoom, smooth highlight, kinetic text, premium dev-tool feel

export const DevExperienceSceneNew: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Soft zoom in
    const zoomProgress = interpolate(frame, [0, 180], [0.95, 1.05], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
    });

    // Code lines with typing effect
    const codeLines = [
        { text: "// Your frontend code", color: "#6A9955", delay: 20 },
        { text: "", color: "", delay: 0 },
        { text: 'const response = await fetch(', color: "#DCDCAA", delay: 35 },
        { text: '  "https://api.tryezbuild.tech/api/p/openai/chat",', color: "#4EC9A3", delay: 50, highlight: true },
        { text: "  {", color: "#D4D4D4", delay: 65 },
        { text: "    method: 'POST',", color: "#D4D4D4", delay: 75 },
        { text: "    headers: { 'Content-Type': 'application/json' },", color: "#D4D4D4", delay: 85 },
        { text: "    body: JSON.stringify({ prompt })", color: "#D4D4D4", delay: 95 },
        { text: "  }", color: "#D4D4D4", delay: 105 },
        { text: ");", color: "#D4D4D4", delay: 110 },
        { text: "", color: "", delay: 0 },
        { text: "// ✨ No API key needed!", color: "#FFD700", delay: 120 },
    ];


    // Cursor blink
    const cursorVisible = Math.floor((frame / fps) * 4) % 2 === 0;

    // Editor appearance
    const editorProgress = spring({
        frame: frame - 10,
        fps,
        config: springConfigs.liquid,
    });

    // Console success
    const consoleProgress = spring({
        frame: frame - 130,
        fps,
        config: springConfigs.bouncy,
    });

    // Success checkmark animation
    const checkProgress = spring({
        frame: frame - 140,
        fps,
        config: { damping: 10, stiffness: 150 },
    });

    // Kinetic text cards at bottom
    const card1Progress = spring({
        frame: frame - 150,
        fps,
        config: springConfigs.bouncy,
    });

    const card2Progress = spring({
        frame: frame - 160,
        fps,
        config: springConfigs.bouncy,
    });

    const card3Progress = spring({
        frame: frame - 170,
        fps,
        config: springConfigs.bouncy,
    });

    // Highlight pulse for EasyBuild URL
    const highlightPulse = frame > 70 ? Math.sin((frame - 70) / fps * 4) * 0.3 + 0.7 : 0;

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#0a0a14" accentColor="#4ECDC4" />
            <PremiumParticles count={35} color="#4ECDC4" />

            <GlowOrb x={35} y={40} size={400} color="#4ECDC4" delay={20} intensity={0.35} />
            <GlowOrb x={75} y={55} size={300} color="#96F550" delay={30} intensity={0.25} />

            {/* Main container with zoom */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) scale(${zoomProgress})`,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: 50,
                        alignItems: "center",
                    }}
                >
                    {/* Code Editor */}
                    <div
                        style={{
                            transform: `scale(${interpolate(editorProgress, [0, 1], [0.8, 1], { extrapolateRight: "clamp" })}) translateX(${interpolate(editorProgress, [0, 1], [-80, 0], { extrapolateRight: "clamp" })}px)`,
                            opacity: editorProgress,
                        }}
                    >
                        <div
                            style={{
                                width: 700,
                                background: "#1E1E1E",
                                borderRadius: 14,
                                boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
                                overflow: "hidden",
                            }}
                        >
                            {/* Editor header */}
                            <div
                                style={{
                                    background: "linear-gradient(180deg, #2D2D30 0%, #252526 100%)",
                                    padding: "11px 16px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    borderBottom: "1px solid #3C3C3C",
                                }}
                            >
                                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F56" }} />
                                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
                                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27C93F" }} />
                                <span style={{ marginLeft: 20, color: "#808080", fontSize: 12, fontFamily: monoFont }}>
                                    app.js
                                </span>
                            </div>

                            {/* Code content */}
                            <div
                                style={{
                                    padding: "18px 22px",
                                    fontFamily: monoFont,
                                    fontSize: 14,
                                    lineHeight: 1.7,
                                    minHeight: 280,
                                }}
                            >
                                {codeLines.map((line, i) => {
                                    if (line.text === "") return <div key={i} style={{ height: "1.7em" }} />;
                                    if (frame < line.delay) return null;

                                    const charsPerFrame = 1.5;
                                    const framesElapsed = Math.max(0, frame - line.delay);
                                    const visibleChars = Math.min(
                                        Math.floor(framesElapsed * charsPerFrame),
                                        line.text.length
                                    );

                                    const isTyping = visibleChars < line.text.length;

                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                display: "flex",
                                                position: "relative",
                                            }}
                                        >
                                            <span style={{ color: "#858585", width: 32, textAlign: "right", marginRight: 18 }}>
                                                {i + 1}
                                            </span>
                                            <span style={{ color: line.color, position: "relative" }}>
                                                {line.text.slice(0, visibleChars)}
                                                {isTyping && cursorVisible && (
                                                    <span
                                                        style={{
                                                            color: "#FFD700",
                                                            fontWeight: 400,
                                                        }}
                                                    >
                                                        |
                                                    </span>
                                                )}
                                                {/* Highlight for EasyBuild URL */}
                                                {line.highlight && visibleChars === line.text.length && (
                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            top: -4,
                                                            left: 8,
                                                            right: 0,
                                                            bottom: -4,
                                                            background: `rgba(78,201,163,${highlightPulse * 0.15})`,
                                                            borderRadius: 4,
                                                            border: `1px solid rgba(78,201,163,${highlightPulse * 0.4})`,
                                                            zIndex: -1,
                                                            boxShadow: `0 0 ${20 * highlightPulse}px rgba(78,201,163,${highlightPulse * 0.3})`,
                                                        }}
                                                    />
                                                )}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Console output */}
                        <div
                            style={{
                                marginTop: 20,
                                transform: `translateY(${interpolate(consoleProgress, [0, 1], [30, 0], { extrapolateRight: "clamp" })}px)`,
                                opacity: consoleProgress,
                            }}
                        >
                            <div
                                style={{
                                    background: "#0D0D0D",
                                    borderRadius: 10,
                                    padding: "14px 20px",
                                    fontFamily: monoFont,
                                    fontSize: 13,
                                    border: "1px solid #2a2a2a",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <span style={{ color: "#96F550", fontSize: 18 }}>✓</span>
                                <span style={{ color: "#858585" }}>[</span>
                                <span style={{ color: "#4ECDC4" }}>200 OK</span>
                                <span style={{ color: "#858585" }}>]</span>
                                <span style={{ color: "rgba(255,255,255,0.6)" }}>Response received in</span>
                                <span style={{ color: "#FFD700", fontWeight: 600 }}>42ms</span>
                            </div>
                        </div>
                    </div>

                    {/* Success indicator */}
                    <div
                        style={{
                            transform: `scale(${checkProgress})`,
                            opacity: checkProgress,
                        }}
                    >
                        <div
                            style={{
                                width: 140,
                                height: 140,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #96F550 0%, #4ECDC4 100%)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                boxShadow: "0 0 80px rgba(150,245,80,0.5), 0 20px 60px rgba(0,0,0,0.4)",
                            }}
                        >
                            <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
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
                                marginTop: 18,
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#96F550",
                            }}
                        >
                            It just works!
                        </div>
                    </div>
                </div>
            </div>

            {/* Kinetic text cards at bottom */}
            <div
                style={{
                    position: "absolute",
                    bottom: 60,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    gap: 30,
                }}
            >
                {[
                    { text: "No backend.", progress: card1Progress, color: "#4ECDC4" },
                    { text: "No secrets.", progress: card2Progress, color: "#FFD700" },
                    { text: "Just ship.", progress: card3Progress, color: "#96F550" },
                ].map((card, i) => (
                    <div
                        key={i}
                        style={{
                            transform: `translateY(${interpolate(card.progress, [0, 1], [80, 0], { extrapolateRight: "clamp" })}px) rotate(${interpolate(card.progress, [0, 1], [15, 0], { extrapolateRight: "clamp" })}deg)`,
                            opacity: card.progress,
                            padding: "16px 36px",
                            background: `linear-gradient(135deg, ${card.color}18 0%, ${card.color}05 100%)`,
                            border: `2px solid ${card.color}50`,
                            borderRadius: 14,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 26,
                                fontWeight: 800,
                                color: card.color,
                                textShadow: `0 0 25px ${card.color}60`,
                            }}
                        >
                            {card.text}
                        </span>
                    </div>
                ))}
            </div>

            <CinematicVignette intensity={0.75} />
        </AbsoluteFill>
    );
};
