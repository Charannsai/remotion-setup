import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
    weights: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
});

// ============================================
// PROBLEM SCENE - Creative Kinetic Typography
// Horizontal tracking then vertical descent
// ============================================

const easeOutExpo = Easing.out(Easing.exp);
const easeOutCubic = Easing.out(Easing.cubic);

export const ProblemScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();
    const time = frame / fps;

    // ============ SCENE TIMING ============
    const scene1End = 420;
    const scene2Start = 420;
    const scene2End = 600;
    const scene3Start = 600;
    const scene3End = 720;
    const scene4Start = 720;
    const scene4End = 900;
    const scene5Start = 900;
    const scene5End = 1080;

    const currentScene =
        frame < scene1End ? 1 :
            frame < scene2End ? 2 :
                frame < scene3End ? 3 :
                    frame < scene4End ? 4 : 5;

    // ============ WORD DEFINITIONS WITH POSITIONS ============
    // Phase 1: Horizontal tracking (Today, modern, software)
    // Phase 2: Camera pivots down, "is" "not" appear reversed
    // Phase 3: Camera shifts down more, "Built" appears big

    const words = [
        // Horizontal phase - left to right
        { text: "Today,", startFrame: 40, x: 0, y: 0, phase: "horizontal" },
        { text: "modern", startFrame: 75, x: 200, y: 0, phase: "horizontal" },
        { text: "software", startFrame: 110, x: 420, y: 0, phase: "horizontal" },
        // Vertical descent - reversed "is not"
        { text: "is", startFrame: 170, x: 520, y: 180, phase: "vertical", size: 48 },
        { text: "not", startFrame: 195, x: 380, y: 180, phase: "vertical", size: 48 },
        // Big "Built" below
        { text: "Built", startFrame: 240, x: 420, y: 340, phase: "vertical", size: 90, emphasis: true },
    ];

    // ============ CAMERA SYSTEM ============
    // Camera follows the visual flow:
    // 1. Pan right during horizontal phase
    // 2. Pan down during vertical phase

    const getCameraPosition = () => {
        // Phase 1: Horizontal tracking (frames 0-150)
        if (frame < 160) {
            const horizontalProgress = interpolate(
                frame,
                [40, 75, 110, 150],
                [0, 200, 420, 420],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutCubic }
            );
            return { x: horizontalProgress, y: 0 };
        }

        // Phase 2: Transition down to "is not" (frames 160-220)
        if (frame < 230) {
            const transitionProgress = interpolate(
                frame, [160, 210], [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutExpo }
            );
            return {
                x: 420 + interpolate(transitionProgress, [0, 1], [0, 30]),
                y: interpolate(transitionProgress, [0, 1], [0, 180]),
            };
        }

        // Phase 3: Shift down to "Built" (frames 230+)
        const builtProgress = interpolate(
            frame, [230, 280], [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutExpo }
        );
        return {
            x: 450,
            y: 180 + interpolate(builtProgress, [0, 1], [0, 160]),
        };
    };

    const cameraPos = getCameraPosition();
    const zoomLevel = 2.8;

    // ============ GRAIN TEXTURE ============
    const renderGrain = () => (
        <div
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                opacity: 0.035,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                transform: `translate(${Math.sin(time) * 2}px, ${Math.cos(time * 0.7) * 2}px)`,
                pointerEvents: "none",
            }}
        />
    );

    // ============ SCENE 1: KINETIC TYPOGRAPHY ============
    const renderScene1 = () => {
        const fadeOut = interpolate(
            frame, [scene1End - 50, scene1End], [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
            <div
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    opacity: fadeOut,
                    overflow: "hidden",
                    background: "#08080c",
                }}
            >
                {/* Parallax background */}
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        background: `radial-gradient(circle at ${50 - cameraPos.x * 0.02}% ${50 - cameraPos.y * 0.02}%, rgba(99,102,241,0.06) 0%, transparent 60%)`,
                        transform: `translate(${-cameraPos.x * 0.2}px, ${-cameraPos.y * 0.2}px)`,
                    }}
                />

                {/* CAMERA CONTAINER */}
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        transform: `scale(${zoomLevel}) translate(${-cameraPos.x}px, ${-cameraPos.y}px)`,
                        transformOrigin: "center center",
                    }}
                >
                    {/* Word container - positioned at center */}
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(0, -50%)",
                        }}
                    >
                        {words.map((word, i) => {
                            const wordStarted = frame >= word.startFrame;
                            const framesSinceStart = frame - word.startFrame;

                            // Animation progress
                            const slideProgress = interpolate(
                                framesSinceStart,
                                [0, 30],
                                [0, 1],
                                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutExpo }
                            );

                            // Different slide direction based on phase
                            let slideX = 0;
                            let slideY = 0;

                            if (word.phase === "horizontal") {
                                // Slide from right
                                slideX = wordStarted ? interpolate(slideProgress, [0, 1], [100, 0]) : 120;
                            } else {
                                // Vertical phase - slide from below
                                slideY = wordStarted ? interpolate(slideProgress, [0, 1], [60, 0]) : 80;
                            }

                            // Motion blur
                            const motionBlur = wordStarted
                                ? interpolate(slideProgress, [0, 0.4, 1], [15, 6, 0])
                                : 20;

                            // Opacity
                            const opacity = wordStarted
                                ? interpolate(slideProgress, [0, 0.25, 1], [0, 0.6, 1])
                                : 0;

                            // Scale
                            const scale = wordStarted
                                ? interpolate(slideProgress, [0, 1], [0.88, 1])
                                : 0.85;

                            // Base font size
                            const baseSize = word.size || 52;

                            // Emphasis glow
                            const isEmphasis = word.emphasis;
                            const glowIntensity = isEmphasis && slideProgress > 0.6
                                ? interpolate(slideProgress, [0.6, 1], [0, 1])
                                : 0;

                            return (
                                <span
                                    key={i}
                                    style={{
                                        position: "absolute",
                                        left: word.x,
                                        top: word.y,
                                        display: "inline-block",
                                        fontSize: baseSize,
                                        fontWeight: isEmphasis ? 700 : word.phase === "horizontal" ? 500 : 400,
                                        color: "#FFFFFF",
                                        fontFamily,
                                        opacity,
                                        filter: motionBlur > 0.5 ? `blur(${motionBlur * 0.25}px)` : undefined,
                                        textShadow: motionBlur > 1
                                            ? word.phase === "horizontal"
                                                ? `${motionBlur}px 0 ${motionBlur * 0.6}px rgba(255,255,255,0.4)`
                                                : `0 ${motionBlur}px ${motionBlur * 0.6}px rgba(255,255,255,0.4)`
                                            : isEmphasis && glowIntensity > 0
                                                ? `0 0 ${60 * glowIntensity}px rgba(147,112,219,0.8), 0 0 ${120 * glowIntensity}px rgba(147,112,219,0.5)`
                                                : "none",
                                        transform: `translate(${slideX}px, ${slideY}px) scale(${scale})`,
                                        letterSpacing: isEmphasis ? "0.02em" : "-0.02em",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {word.text}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* Vignettes */}
                <div style={{ position: "absolute", left: 0, top: 0, width: 300, height: "100%", background: "linear-gradient(to right, #08080c 0%, transparent 100%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", right: 0, top: 0, width: 300, height: "100%", background: "linear-gradient(to left, #08080c 0%, transparent 100%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 200, background: "linear-gradient(to bottom, #08080c 0%, transparent 100%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 200, background: "linear-gradient(to top, #08080c 0%, transparent 100%)", pointerEvents: "none" }} />
            </div>
        );
    };

    // ============ NETWORK LINES ============
    const renderNetworkLines = (intensity: number = 1, expanding: boolean = false) => {
        const centerX = width / 2;
        const centerY = height / 2;
        const nodes = [
            { x: 0, y: 0 }, { x: -300, y: -180 }, { x: 300, y: -150 },
            { x: -350, y: 120 }, { x: 320, y: 160 }, { x: -150, y: 250 },
            { x: 180, y: -280 }, { x: -400, y: -50 }, { x: 400, y: 50 },
        ];
        const connections = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 7], [2, 6], [3, 5], [4, 5]];
        const expandScale = expanding ? interpolate(frame, [scene5Start, scene5Start + 60], [1, 1.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }) : 1;

        return (
            <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366F1" /><stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                    <filter id="glow"><feGaussianBlur stdDeviation="4" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                {connections.map(([from, to], i) => {
                    const lineDelay = scene2Start + 20 + i * 10;
                    const lineProgress = spring({ frame: frame - lineDelay, fps, config: { damping: 30, stiffness: 60 } });
                    if (lineProgress <= 0 || frame < scene2Start) return null;
                    const x1 = centerX + nodes[from].x * expandScale, y1 = centerY + nodes[from].y * expandScale;
                    const x2 = centerX + nodes[to].x * expandScale, y2 = centerY + nodes[to].y * expandScale;
                    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                    return (
                        <g key={i}>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#lineGrad)" strokeWidth={1.5} strokeDasharray={length} strokeDashoffset={length * (1 - lineProgress)} opacity={lineProgress * 0.5 * intensity} strokeLinecap="round" filter="url(#glow)" />
                            {lineProgress > 0.5 && <circle cx={x1 + (x2 - x1) * ((time * 0.3 + i * 0.1) % 1)} cy={y1 + (y2 - y1) * ((time * 0.3 + i * 0.1) % 1)} r={3} fill="white" opacity={0.7 * intensity} />}
                        </g>
                    );
                })}
                {nodes.map((node, i) => {
                    const nodeDelay = scene2Start + 50 + i * 8;
                    const nodeProgress = spring({ frame: frame - nodeDelay, fps, config: { damping: 20, stiffness: 80 } });
                    if (nodeProgress <= 0 || frame < scene2Start) return null;
                    return (
                        <g key={`node-${i}`}>
                            <circle cx={centerX + node.x * expandScale} cy={centerY + node.y * expandScale} r={15 * nodeProgress} fill="#6366F1" opacity={0.2 * intensity} />
                            <circle cx={centerX + node.x * expandScale} cy={centerY + node.y * expandScale} r={6 * nodeProgress} fill="#A855F7" opacity={0.6 * intensity} />
                        </g>
                    );
                })}
            </svg>
        );
    };

    // ============ SCENE 2-5 ============
    const renderScene2 = () => {
        const fadeIn = interpolate(frame, [scene2Start, scene2Start + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(frame, [scene2End - 30, scene2End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const textStart = scene2Start + 40;
        const glow = Math.sin((time - scene2Start / fps) * 3) * 0.3 + 0.7;
        return (
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", textAlign: "center", opacity: fadeIn * fadeOut }}>
                <div style={{ display: "flex", gap: "0.3em", justifyContent: "center", flexWrap: "wrap" }}>
                    {["It", "is", "built", "around"].map((word, i) => {
                        const p = spring({ frame: frame - textStart - i * 12, fps, config: { damping: 25, stiffness: 100 } });
                        return <span key={i} style={{ fontSize: 68, fontWeight: 400, color: "rgba(255,255,255,0.9)", fontFamily, transform: `translateY(${interpolate(p, [0, 1], [25, 0], { extrapolateRight: "clamp" })}px)`, opacity: p }}>{word}</span>;
                    })}
                    <span style={{ fontSize: 80, fontWeight: 600, color: "#FFF", fontFamily, transform: `translateY(${interpolate(spring({ frame: frame - textStart - 48, fps, config: { damping: 20, stiffness: 80 } }), [0, 1], [30, 0], { extrapolateRight: "clamp" })}px)`, opacity: spring({ frame: frame - textStart - 48, fps, config: { damping: 20, stiffness: 80 } }), textShadow: `0 0 ${60 * glow}px rgba(167,139,250,0.8)` }}>integrations.</span>
                </div>
            </div>
        );
    };

    const renderScene3 = () => {
        const textFade = interpolate(frame, [scene3Start + 30, scene3Start + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutCubic });
        const fadeOut = interpolate(frame, [scene3End - 20, scene3End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", opacity: textFade * fadeOut }}>
                <span style={{ fontSize: 48, fontWeight: 300, color: "rgba(255,255,255,0.7)", fontFamily, letterSpacing: 4 }}>Pause.</span>
            </div>
        );
    };

    const renderScene4 = () => {
        const fadeIn = interpolate(frame, [scene4Start, scene4Start + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(frame, [scene4End - 30, scene4End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const textStart = scene4Start + 30;
        return (
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", textAlign: "center", opacity: fadeIn * fadeOut }}>
                <div style={{ display: "flex", gap: "0.3em", justifyContent: "center" }}>
                    {["And", "with", "every", "integration…"].map((word, i) => {
                        const p = spring({ frame: frame - textStart - i * 18, fps, config: { damping: 25, stiffness: 100 } });
                        const emph = word.includes("every") || word.includes("integration");
                        return <span key={i} style={{ fontSize: emph ? 72 : 64, fontWeight: emph ? 600 : 400, color: emph ? "#FFF" : "rgba(255,255,255,0.9)", fontFamily, transform: `translateY(${interpolate(p, [0, 1], [25, 0], { extrapolateRight: "clamp" })}px)`, opacity: p, textShadow: emph ? "0 0 40px rgba(147,112,219,0.5)" : "none" }}>{word}</span>;
                    })}
                </div>
            </div>
        );
    };

    const renderScene5 = () => {
        const fadeIn = interpolate(frame, [scene5Start, scene5Start + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(frame, [scene5End - 60, scene5End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const textStart = scene5Start + 30;
        const impactScale = interpolate(frame, [scene5Start, scene5Start + 40], [1.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.5)) });
        const glow = Math.sin((time - scene5Start / fps) * 4) * 0.4 + 0.8;
        return (
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) scale(${impactScale})`, textAlign: "center", opacity: fadeIn * fadeOut }}>
                <div style={{ display: "flex", gap: "0.35em", justifyContent: "center" }}>
                    {["The", "surface"].map((word, i) => {
                        const p = spring({ frame: frame - textStart - i * 15, fps, config: { damping: 20, stiffness: 90 } });
                        return <span key={i} style={{ fontSize: 88, fontWeight: 600, color: "#FFF", fontFamily, transform: `translateY(${interpolate(p, [0, 1], [30, 0], { extrapolateRight: "clamp" })}px)`, opacity: p }}>{word}</span>;
                    })}
                    <span style={{ position: "relative", fontSize: 96, fontWeight: 700, color: "#FFF", fontFamily, transform: `translateY(${interpolate(spring({ frame: frame - textStart - 30, fps, config: { damping: 15, stiffness: 70 } }), [0, 1], [40, 0], { extrapolateRight: "clamp" })}px)`, opacity: spring({ frame: frame - textStart - 30, fps, config: { damping: 15, stiffness: 70 } }), textShadow: `0 0 ${80 * glow}px rgba(167,139,250,0.9)` }}>
                        expands.
                        <span style={{ position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)", width: `${interpolate(spring({ frame: frame - textStart - 30, fps, config: { damping: 15, stiffness: 70 } }), [0.5, 1], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`, height: 4, background: "linear-gradient(90deg, transparent, #A855F7, transparent)", borderRadius: 2 }} />
                    </span>
                </div>
            </div>
        );
    };

    // ============ MAIN RENDER ============
    const gradientAngle = time * 12;
    const scene3Black = currentScene === 3 && frame < scene3Start + 30;
    const networkIntensity = currentScene >= 2 && currentScene !== 3 ? 1 : currentScene === 3 ? 0.2 : 0;

    return (
        <AbsoluteFill style={{ background: scene3Black ? "#000" : `linear-gradient(${gradientAngle}deg, #08080c 0%, #0d0d14 50%, #0f0f18 100%)`, fontFamily, overflow: "hidden" }}>
            {!scene3Black && currentScene !== 1 && renderGrain()}
            {networkIntensity > 0 && renderNetworkLines(networkIntensity, currentScene === 5)}

            {currentScene === 1 && renderScene1()}
            {currentScene === 2 && renderScene2()}
            {currentScene === 3 && renderScene3()}
            {currentScene === 4 && renderScene4()}
            {currentScene === 5 && renderScene5()}

            {currentScene !== 1 && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.8) 100%)", pointerEvents: "none" }} />}
        </AbsoluteFill>
    );
};
