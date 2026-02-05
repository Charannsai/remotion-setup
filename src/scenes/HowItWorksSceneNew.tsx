import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import {
    ParallaxBackground,
    PremiumParticles,
    CinematicVignette,
    springConfigs,
    GlowOrb,
    BezierLine,
} from "../components/PremiumEffects";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "600", "700", "800"],
    subsets: ["latin"],
});

// SCENE 4 — HOW IT WORKS
// Visual: Frontend → EasyBuild → Provider flow, secret injection glow, response flows back
// Motion: Smooth bezier line motion, layer glow, parallax depth, NotebookLM-tier clarity

export const HowItWorksSceneNew: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Camera parallax movement
    const parallaxX = Math.sin((frame / fps) * 0.3) * 20;
    const parallaxY = Math.cos((frame / fps) * 0.4) * 10;

    // Flow nodes
    const nodes = [
        { label: "Frontend App", icon: "💻", x: 12, color: "#4ECDC4" },
        { label: "EasyBuild", icon: "⚡", x: 50, color: "#FFD700", isCenter: true },
        { label: "API Provider", icon: "☁️", x: 88, color: "#96F550" },
    ];

    // Node animations
    const node1Progress = spring({
        frame: frame - 20,
        fps,
        config: springConfigs.bouncy,
    });

    const node2Progress = spring({
        frame: frame - 40,
        fps,
        config: springConfigs.bouncy,
    });

    const node3Progress = spring({
        frame: frame - 60,
        fps,
        config: springConfigs.bouncy,
    });

    const nodeProgresses = [node1Progress, node2Progress, node3Progress];

    // Bezier flow lines
    const line1Progress = spring({
        frame: frame - 50,
        fps,
        config: springConfigs.liquid,
        durationInFrames: 40,
    });

    const line2Progress = spring({
        frame: frame - 90,
        fps,
        config: springConfigs.liquid,
        durationInFrames: 40,
    });

    // Secret injection moment (big glow event)
    const injectionProgress = spring({
        frame: frame - 80,
        fps,
        config: { damping: 12, stiffness: 150 },
    });

    const injectionGlow = interpolate(injectionProgress, [0, 0.5, 1], [0, 1, 0.5], {
        extrapolateRight: "clamp",
    });

    // Data packets traveling
    const packet1Position = interpolate(frame, [50, 80], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
    });

    const packet2Position = interpolate(frame, [100, 130], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
    });

    // Response flowing back
    const responseProgress = spring({
        frame: frame - 120,
        fps,
        config: springConfigs.gentle,
    });

    const responsePosition = interpolate(frame, [120, 160], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
    });

    // Text animations
    const text1Progress = spring({
        frame: frame - 100,
        fps,
        config: springConfigs.ultraSmooth,
    });

    const text2Progress = spring({
        frame: frame - 130,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Center glow pulse
    const centerPulse = Math.sin((frame / fps) * 3) * 0.15 + 1;
    const glowPulse = Math.sin((frame / fps) * 2) * 0.3 + 0.7;

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#080815" accentColor="#FFD700" />
            <PremiumParticles count={45} color="#FFD700" />

            {/* Background glows */}
            <GlowOrb x={50} y={45} size={500} color="#FFD700" delay={30} intensity={0.45} />
            <GlowOrb x={15} y={45} size={250} color="#4ECDC4" delay={20} intensity={0.25} />
            <GlowOrb x={85} y={45} size={250} color="#96F550" delay={25} intensity={0.25} />

            {/* Main container with parallax */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: "100%",
                    height: "100%",
                    transform: `translate(-50%, -50%) translate(${parallaxX}px, ${parallaxY}px)`,
                }}
            >
                {/* Title */}
                <div
                    style={{
                        position: "absolute",
                        top: 60,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            fontSize: 48,
                            fontWeight: 800,
                            color: "#ffffff",
                            opacity: node1Progress,
                            transform: `translateY(${interpolate(node1Progress, [0, 1], [-40, 0], { extrapolateRight: "clamp" })}px)`,
                        }}
                    >
                        How{" "}
                        <span
                            style={{
                                background: "linear-gradient(135deg, #FFD700 0%, #FF6B35 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            It Works
                        </span>
                    </div>
                </div>

                {/* Flow nodes */}
                {nodes.map((node, i) => {
                    const progress = nodeProgresses[i];
                    const scale = node.isCenter
                        ? interpolate(progress, [0, 1], [0, 1], { extrapolateRight: "clamp" }) * centerPulse
                        : interpolate(progress, [0, 1], [0, 1], { extrapolateRight: "clamp" });

                    return (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                left: `${node.x}%`,
                                top: "45%",
                                transform: `translate(-50%, -50%) scale(${scale})`,
                            }}
                        >
                            <div
                                style={{
                                    width: node.isCenter ? 180 : 140,
                                    height: node.isCenter ? 180 : 140,
                                    borderRadius: node.isCenter ? 45 : 30,
                                    background: node.isCenter
                                        ? "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)"
                                        : `linear-gradient(135deg, ${node.color}25 0%, ${node.color}10 100%)`,
                                    border: node.isCenter ? "none" : `3px solid ${node.color}60`,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    boxShadow: node.isCenter
                                        ? `0 0 ${100 * glowPulse}px rgba(255,215,0,${glowPulse}), 0 30px 80px rgba(0,0,0,0.5)`
                                        : `0 0 40px ${node.color}30, 0 20px 60px rgba(0,0,0,0.4)`,
                                }}
                            >
                                <span style={{ fontSize: node.isCenter ? 70 : 55 }}>{node.icon}</span>
                            </div>
                            <div
                                style={{
                                    marginTop: 18,
                                    textAlign: "center",
                                    fontSize: node.isCenter ? 20 : 16,
                                    fontWeight: node.isCenter ? 800 : 600,
                                    color: node.color,
                                    textShadow: `0 0 20px ${node.color}50`,
                                }}
                            >
                                {node.label}
                            </div>
                        </div>
                    );
                })}

                {/* Flow line 1: Frontend → EasyBuild */}
                <svg
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                    }}
                >
                    <defs>
                        <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4ECDC4" />
                            <stop offset="100%" stopColor="#FFD700" />
                        </linearGradient>
                        <linearGradient id="flowGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FFD700" />
                            <stop offset="100%" stopColor="#96F550" />
                        </linearGradient>
                        <filter id="lineGlow">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Line 1 */}
                    <path
                        d="M 270 486 Q 480 420 870 486"
                        fill="none"
                        stroke="url(#flowGrad1)"
                        strokeWidth={4}
                        strokeDasharray="800"
                        strokeDashoffset={interpolate(line1Progress, [0, 1], [800, 0], { extrapolateRight: "clamp" })}
                        strokeLinecap="round"
                        filter="url(#lineGlow)"
                        opacity={line1Progress}
                    />

                    {/* Line 2 */}
                    <path
                        d="M 1050 486 Q 1260 420 1650 486"
                        fill="none"
                        stroke="url(#flowGrad2)"
                        strokeWidth={4}
                        strokeDasharray="800"
                        strokeDashoffset={interpolate(line2Progress, [0, 1], [800, 0], { extrapolateRight: "clamp" })}
                        strokeLinecap="round"
                        filter="url(#lineGlow)"
                        opacity={line2Progress}
                    />

                    {/* Traveling packet 1 */}
                    {packet1Position > 0 && packet1Position < 1 && (
                        <circle
                            cx={270 + packet1Position * 600}
                            cy={486 - Math.sin(packet1Position * Math.PI) * 66}
                            r={12}
                            fill="#4ECDC4"
                            filter="url(#lineGlow)"
                        />
                    )}

                    {/* Traveling packet 2 */}
                    {packet2Position > 0 && packet2Position < 1 && (
                        <circle
                            cx={1050 + packet2Position * 600}
                            cy={486 - Math.sin(packet2Position * Math.PI) * 66}
                            r={12}
                            fill="#96F550"
                            filter="url(#lineGlow)"
                        />
                    )}

                    {/* Response packet (flowing back) */}
                    {responseProgress > 0.3 && responsePosition > 0 && responsePosition < 1 && (
                        <circle
                            cx={1650 - (1 - responsePosition) * 1380}
                            cy={540}
                            r={10}
                            fill="#96F550"
                            opacity={0.8}
                        />
                    )}
                </svg>

                {/* Secret injection badge */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "25%",
                        transform: `translateX(-50%) scale(${interpolate(injectionProgress, [0, 1], [0.5, 1], { extrapolateRight: "clamp" })})`,
                        opacity: injectionProgress,
                    }}
                >
                    <div
                        style={{
                            padding: "16px 32px",
                            background: `rgba(255,215,0,${0.1 + injectionGlow * 0.2})`,
                            border: `2px solid rgba(255,215,0,${0.4 + injectionGlow * 0.4})`,
                            borderRadius: 16,
                            display: "flex",
                            alignItems: "center",
                            gap: 15,
                            boxShadow: `0 0 ${60 * injectionGlow}px rgba(255,215,0,${injectionGlow * 0.6})`,
                        }}
                    >
                        <span style={{ fontSize: 28 }}>🔐</span>
                        <div>
                            <div style={{ fontSize: 14, color: "#FFD700", fontWeight: 700 }}>
                                SECRET INJECTION
                            </div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                                API_KEY=sk-*** added server-side
                            </div>
                        </div>
                        <span style={{ fontSize: 22, color: "#96F550" }}>✓</span>
                    </div>
                </div>
            </div>

            {/* Bottom text - kinetic */}
            <div
                style={{
                    position: "absolute",
                    bottom: 80,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    perspective: 600,
                }}
            >
                <div
                    style={{
                        fontSize: 32,
                        fontWeight: 700,
                        color: "#ffffff",
                        transform: `translateY(${interpolate(text1Progress, [0, 1], [60, 0], { extrapolateRight: "clamp" })}px) rotateX(${interpolate(text1Progress, [0, 1], [20, 0], { extrapolateRight: "clamp" })}deg)`,
                        opacity: text1Progress,
                        marginBottom: 15,
                    }}
                >
                    <span style={{ color: "#4ECDC4" }}>Frontend</span>
                    {" → "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #FFD700 0%, #FF6B35 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        EasyBuild
                    </span>
                    {" → "}
                    <span style={{ color: "#96F550" }}>API</span>
                </div>
                <div
                    style={{
                        fontSize: 22,
                        color: "rgba(255,255,255,0.7)",
                        transform: `translateY(${interpolate(text2Progress, [0, 1], [40, 0], { extrapolateRight: "clamp" })}px)`,
                        opacity: text2Progress,
                    }}
                >
                    Secrets{" "}
                    <span style={{ color: "#FFD700", fontWeight: 600 }}>injected server-side</span>
                    . Never exposed.
                </div>
            </div>

            <CinematicVignette intensity={0.75} />
        </AbsoluteFill>
    );
};
