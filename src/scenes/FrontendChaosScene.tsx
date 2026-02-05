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

// SCENE 1 — FRONTEND CHAOS
// Visual: Crazy zoom into browser, code editor slides in, API key exposed, hacker blur rips it, UI shards explode
// Motion: NotebookLM-tier zooms, kinetic typography, parallax depth, shattering glass

export const FrontendChaosScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // Crazy zoom into browser
    const zoomProgress = interpolate(frame, [0, 60], [0.3, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.exp),
    });

    const zoomIn = interpolate(frame, [0, 60], [5, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.exp),
    });

    // Code editor slide in from left
    const editorProgress = spring({
        frame: frame - 20,
        fps,
        config: { damping: 15, stiffness: 100 },
    });

    const editorX = interpolate(editorProgress, [0, 1], [-800, 0], {
        extrapolateRight: "clamp",
    });

    // API key glow pulse (danger)
    const keyGlowPhase = frame > 50 ? Math.sin((frame - 50) / fps * 8) * 0.5 + 0.5 : 0;

    // Hacker blur extraction (frames 70-110)
    const hackerProgress = spring({
        frame: frame - 70,
        fps,
        config: { damping: 12, stiffness: 60, mass: 1.5 },
    });

    const keyExtractX = interpolate(hackerProgress, [0, 1], [0, 400], {
        extrapolateRight: "clamp",
    });

    const keyBlur = interpolate(hackerProgress, [0, 0.3, 1], [0, 0, 8], {
        extrapolateRight: "clamp",
    });

    // UI Shards explosion (frames 100-150)
    const shardProgress = spring({
        frame: frame - 100,
        fps,
        config: { damping: 8, stiffness: 50 },
    });

    const shards = Array.from({ length: 12 }, (_, i) => ({
        angle: (i / 12) * 360 + Math.random() * 30,
        distance: 200 + Math.random() * 300,
        rotation: Math.random() * 720 - 360,
        size: 30 + Math.random() * 60,
        delay: i * 2,
    }));

    // Kinetic typography
    const text1Progress = spring({
        frame: frame - 110,
        fps,
        config: springConfigs.bouncy,
    });

    const text2Progress = spring({
        frame: frame - 130,
        fps,
        config: springConfigs.bouncy,
    });

    // Camera shake during extraction
    const shakeIntensity = frame > 70 && frame < 120 ? 3 : 0;
    const shakeX = Math.sin(frame * 1.5) * shakeIntensity;
    const shakeY = Math.cos(frame * 2) * shakeIntensity;

    // Code content
    const codeLines = [
        { text: "// frontend/api.js", color: "#6A9955" },
        { text: "", color: "" },
        { text: "const response = await fetch(", color: "#DCDCAA" },
        { text: '  "https://api.openai.com/v1/chat",', color: "#CE9178" },
        { text: "  {", color: "#D4D4D4" },
        { text: '    headers: {', color: "#D4D4D4" },
        { text: '      "Authorization": "Bearer sk-proj-abc123xyz789"', color: "#FF5555", isKey: true },
        { text: "    }", color: "#D4D4D4" },
        { text: "  }", color: "#D4D4D4" },
        { text: ");", color: "#D4D4D4" },
    ];

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#080810" accentColor="#FF4444" />
            <PremiumParticles count={50} color="#FF4444" />

            {/* Danger glows */}
            <GlowOrb x={60} y={40} size={400} color="#FF4444" delay={20} intensity={0.4} />
            <GlowOrb x={30} y={60} size={300} color="#FF6B35" delay={30} intensity={0.3} />

            {/* Main container with zoom + shake */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) scale(${zoomIn}) translate(${shakeX}px, ${shakeY}px)`,
                    opacity: zoomProgress,
                }}
            >
                {/* Browser window frame */}
                <div
                    style={{
                        width: 900,
                        background: "#1E1E1E",
                        borderRadius: 12,
                        boxShadow: "0 50px 150px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
                        overflow: "hidden",
                        transform: `translateX(${editorX}px)`,
                    }}
                >
                    {/* Editor header */}
                    <div
                        style={{
                            background: "linear-gradient(180deg, #2D2D30 0%, #252526 100%)",
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
                            api.js — exposed in browser
                        </span>
                        {/* Danger badge */}
                        <div
                            style={{
                                marginLeft: "auto",
                                padding: "4px 12px",
                                background: "rgba(255,85,85,0.2)",
                                border: "1px solid rgba(255,85,85,0.5)",
                                borderRadius: 4,
                                fontSize: 10,
                                color: "#FF5555",
                                fontWeight: 700,
                            }}
                        >
                            ⚠️ EXPOSED
                        </div>
                    </div>

                    {/* Code content */}
                    <div
                        style={{
                            padding: "20px 24px",
                            fontFamily: monoFont,
                            fontSize: 16,
                            lineHeight: 1.8,
                            position: "relative",
                        }}
                    >
                        {codeLines.map((line, i) => {
                            if (line.text === "") return <div key={i} style={{ height: "1.8em" }} />;

                            const lineProgress = spring({
                                frame: frame - 25 - i * 2,
                                fps,
                                config: { damping: 25, stiffness: 200 },
                            });

                            return (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        opacity: lineProgress,
                                        transform: `translateX(${interpolate(lineProgress, [0, 1], [-30, 0], { extrapolateRight: "clamp" })}px)`,
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
                                        {line.isKey ? (
                                            <>
                                                {/* Key highlight glow */}
                                                <span
                                                    style={{
                                                        position: "relative",
                                                        zIndex: 2,
                                                        filter: `blur(${keyBlur}px)`,
                                                        transform: `translateX(${keyExtractX}px)`,
                                                        display: "inline-block",
                                                    }}
                                                >
                                                    {line.text}
                                                </span>
                                                {/* Danger glow behind */}
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: -5,
                                                        left: 200,
                                                        width: 280,
                                                        height: 30,
                                                        background: `rgba(255,85,85,${keyGlowPhase * 0.4})`,
                                                        borderRadius: 4,
                                                        boxShadow: `0 0 ${40 * keyGlowPhase}px rgba(255,85,85,${keyGlowPhase})`,
                                                        zIndex: 1,
                                                    }}
                                                />
                                            </>
                                        ) : (
                                            line.text
                                        )}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Hacker visual */}
                        {hackerProgress > 0.2 && (
                            <div
                                style={{
                                    position: "absolute",
                                    right: -60,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    opacity: hackerProgress,
                                }}
                            >
                                <div
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #FF4444 0%, #FF0000 100%)",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        fontSize: 40,
                                        boxShadow: "0 0 50px rgba(255,68,68,0.8)",
                                    }}
                                >
                                    👤
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* UI Shards explosion */}
                {shards.map((shard, i) => {
                    const shardDelay = shard.delay;
                    const individualProgress = spring({
                        frame: frame - 100 - shardDelay,
                        fps,
                        config: { damping: 10, stiffness: 40 },
                    });

                    const rad = (shard.angle * Math.PI) / 180;
                    const x = Math.cos(rad) * shard.distance * individualProgress;
                    const y = Math.sin(rad) * shard.distance * individualProgress;
                    const rotation = shard.rotation * individualProgress;
                    const opacity = interpolate(individualProgress, [0, 0.3, 1], [0, 1, 0], {
                        extrapolateRight: "clamp",
                    });

                    return (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
                                width: shard.size,
                                height: shard.size * 0.6,
                                background: `linear-gradient(135deg, rgba(255,85,85,0.3) 0%, rgba(255,85,85,0.1) 100%)`,
                                border: "1px solid rgba(255,85,85,0.5)",
                                borderRadius: 4,
                                opacity,
                                boxShadow: "0 0 20px rgba(255,85,85,0.3)",
                            }}
                        />
                    );
                })}
            </div>

            {/* Kinetic Typography - 3D flying text */}
            <div
                style={{
                    position: "absolute",
                    bottom: 120,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    perspective: 1000,
                }}
            >
                <div
                    style={{
                        fontSize: 48,
                        fontWeight: 800,
                        color: "#ffffff",
                        transform: `translateY(${interpolate(text1Progress, [0, 1], [100, 0], { extrapolateRight: "clamp" })}px) rotateX(${interpolate(text1Progress, [0, 1], [45, 0], { extrapolateRight: "clamp" })}deg)`,
                        opacity: text1Progress,
                        marginBottom: 15,
                    }}
                >
                    API keys in your{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #FF4444 0%, #FF0000 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            filter: "drop-shadow(0 0 20px rgba(255,68,68,0.8))",
                        }}
                    >
                        frontend
                    </span>
                    .
                </div>
                <div
                    style={{
                        fontSize: 32,
                        color: "rgba(255,255,255,0.7)",
                        transform: `translateY(${interpolate(text2Progress, [0, 1], [50, 0], { extrapolateRight: "clamp" })}px)`,
                        opacity: text2Progress,
                    }}
                >
                    A{" "}
                    <span style={{ color: "#FF4444", fontWeight: 700 }}>disaster</span>{" "}
                    waiting to happen.
                </div>
            </div>

            <CinematicVignette intensity={0.85} />
        </AbsoluteFill>
    );
};
