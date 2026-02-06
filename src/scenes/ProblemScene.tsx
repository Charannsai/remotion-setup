import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
    weights: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
});

// ============================================
// PROBLEM SCENE - Cinematic 5-Scene Sequence
// Scene 1: Zoomed-in kinetic text scroll
// ============================================

const smoothEase = Easing.bezier(0.4, 0.0, 0.2, 1);

export const ProblemScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();
    const time = frame / fps;

    // ============ SCENE TIMING (60fps) ============
    const scene1End = 300;      // 5s for kinetic text
    const scene2Start = 300;
    const scene2End = 480;      // 3s
    const scene3Start = 480;
    const scene3End = 600;      // 2s
    const scene4Start = 600;
    const scene4End = 780;      // 3s
    const scene5Start = 780;
    const scene5End = 960;      // 3s

    const currentScene =
        frame < scene1End ? 1 :
            frame < scene2End ? 2 :
                frame < scene3End ? 3 :
                    frame < scene4End ? 4 : 5;

    // ============ SCENE 1: WORD TIMINGS ============
    const scene1Words = [
        { text: "Today,", duration: 35 },
        { text: "modern", duration: 30 },
        { text: "software", duration: 32 },
        { text: "is", duration: 22 },
        { text: "not", duration: 26 },
        { text: "built", duration: 28 },
        { text: "around", duration: 28 },
        { text: "a", duration: 20 },
        { text: "single", duration: 30 },
        { text: "system.", duration: 45 },
    ];

    // Build word timings with cumulative start frames
    let cumulative = 30; // Initial delay
    const wordTimings = scene1Words.map((word) => {
        const start = cumulative;
        cumulative += word.duration;
        return { ...word, startFrame: start };
    });

    // Get current word index based on frame
    const getCurrentWordIndex = () => {
        for (let i = wordTimings.length - 1; i >= 0; i--) {
            if (frame >= wordTimings[i].startFrame) return i;
        }
        return 0;
    };
    const currentWordIndex = frame < wordTimings[0].startFrame ? -1 : getCurrentWordIndex();

    // ============ GRAIN TEXTURE ============
    const renderGrain = () => (
        <div
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                opacity: 0.04,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                transform: `translate(${Math.sin(time) * 2}px, ${Math.cos(time * 0.7) * 2}px)`,
                pointerEvents: "none",
            }}
        />
    );

    // ============ SCENE 1: KINETIC TEXT RENDERER ============
    const renderScene1 = () => {
        const fadeOut = interpolate(
            frame, [scene1End - 40, scene1End], [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Camera scroll - how much to move left as words progress
        const wordSpacing = 280; // Space between word centers

        // Smooth camera following current word
        let targetScrollX = 0;
        if (currentWordIndex >= 0) {
            targetScrollX = currentWordIndex * wordSpacing;

            // Smooth transition when approaching next word
            const nextIndex = currentWordIndex + 1;
            if (nextIndex < wordTimings.length) {
                const nextWord = wordTimings[nextIndex];
                const transitionStart = nextWord.startFrame - 15;
                if (frame >= transitionStart && frame < nextWord.startFrame) {
                    const t = (frame - transitionStart) / 15;
                    targetScrollX = currentWordIndex * wordSpacing + (wordSpacing * smoothEase(t));
                }
            }
        }

        // Emphasized words
        const emphasizedWords = ["modern", "software", "single", "system"];

        return (
            <div
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    opacity: fadeOut,
                    overflow: "hidden",
                }}
            >
                {/* Zoomed camera container */}
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* Text strip that scrolls */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 50,
                            transform: `translateX(${-targetScrollX}px) scale(2.2)`,
                            transformOrigin: "left center",
                        }}
                    >
                        {wordTimings.map((word, i) => {
                            const isCurrentWord = i === currentWordIndex;
                            const isPastWord = i < currentWordIndex;
                            const isFutureWord = i > currentWordIndex || currentWordIndex < 0;

                            // Word entrance spring animation
                            const wordProgress = spring({
                                frame: frame - word.startFrame,
                                fps,
                                config: { damping: 20, stiffness: 80 },
                            });

                            // Blur: starts blurry, clears when becoming current
                            let blur = 0;
                            if (isFutureWord && frame >= word.startFrame - 20) {
                                // Peek blur
                                blur = 12;
                            } else if (isCurrentWord) {
                                blur = interpolate(wordProgress, [0, 0.5, 1], [12, 4, 0], { extrapolateRight: "clamp" });
                            }

                            // Opacity calculation
                            let opacity = 0;
                            if (frame < word.startFrame - 20) {
                                opacity = 0; // Not visible yet
                            } else if (frame < word.startFrame) {
                                // Peek state - barely visible
                                opacity = 0.1;
                            } else if (isCurrentWord) {
                                opacity = wordProgress;
                            } else if (isPastWord) {
                                opacity = 0.3;
                            }

                            // Scale
                            const scale = isCurrentWord
                                ? interpolate(wordProgress, [0, 1], [0.85, 1], { extrapolateRight: "clamp" })
                                : isPastWord ? 0.92 : 0.85;

                            // Y offset - word rises as it appears
                            const yOffset = isCurrentWord
                                ? interpolate(wordProgress, [0, 1], [30, 0], { extrapolateRight: "clamp" })
                                : 0;

                            const isEmphasized = emphasizedWords.some(e =>
                                word.text.toLowerCase().includes(e.toLowerCase())
                            );

                            // Glow effect for current word
                            let textShadow = "none";
                            if (isCurrentWord && wordProgress > 0.3) {
                                if (isEmphasized) {
                                    textShadow = `0 0 60px rgba(147,112,219,0.8), 0 0 120px rgba(147,112,219,0.5)`;
                                } else {
                                    textShadow = `0 0 30px rgba(255,255,255,0.3)`;
                                }
                            }

                            return (
                                <span
                                    key={i}
                                    style={{
                                        display: "inline-block",
                                        fontSize: isEmphasized ? 65 : 58,
                                        fontWeight: isEmphasized ? 600 : 500,
                                        color: isCurrentWord ? "#FFFFFF" : isPastWord ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)",
                                        fontFamily,
                                        opacity,
                                        filter: blur > 0 ? `blur(${blur}px)` : undefined,
                                        transform: `scale(${scale}) translateY(${yOffset}px)`,
                                        textShadow,
                                        letterSpacing: "-0.02em",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {word.text}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* Side fade gradients */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: 350,
                        height: "100%",
                        background: `linear-gradient(to right, #0a0a12 0%, #0a0a1280 50%, transparent 100%)`,
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        width: 350,
                        height: "100%",
                        background: `linear-gradient(to left, #0a0a12 0%, #0a0a1280 50%, transparent 100%)`,
                        pointerEvents: "none",
                    }}
                />
            </div>
        );
    };

    // ============ NETWORK LINES FOR LATER SCENES ============
    const renderNetworkLines = (intensity: number = 1, expanding: boolean = false) => {
        const centerX = width / 2;
        const centerY = height / 2;

        const nodes = [
            { x: 0, y: 0 },
            { x: -300, y: -180 }, { x: 300, y: -150 },
            { x: -350, y: 120 }, { x: 320, y: 160 },
            { x: -150, y: 250 }, { x: 180, y: -280 },
            { x: -400, y: -50 }, { x: 400, y: 50 },
            { x: 0, y: -300 }, { x: 0, y: 300 },
        ];

        const connections = [
            [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
            [1, 2], [1, 7], [2, 6], [3, 5], [4, 5],
            [6, 9], [4, 8], [3, 7], [5, 10], [1, 9],
        ];

        const expandScale = expanding ? interpolate(
            frame, [scene5Start, scene5Start + 60], [1, 1.5],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
        ) : 1;

        return (
            <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="4" />
                        <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {connections.map(([from, to], i) => {
                    const lineDelay = scene2Start + 20 + i * 8;
                    const lineProgress = spring({ frame: frame - lineDelay, fps, config: { damping: 30, stiffness: 60 } });
                    if (lineProgress <= 0 || frame < scene2Start) return null;

                    const x1 = centerX + nodes[from].x * expandScale;
                    const y1 = centerY + nodes[from].y * expandScale;
                    const x2 = centerX + nodes[to].x * expandScale;
                    const y2 = centerY + nodes[to].y * expandScale;
                    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                    const dashOffset = length * (1 - lineProgress);
                    const particleT = ((time * 0.3 + i * 0.1) % 1);

                    return (
                        <g key={i}>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#lineGrad)" strokeWidth={1.5}
                                strokeDasharray={length} strokeDashoffset={dashOffset}
                                opacity={lineProgress * 0.5 * intensity} strokeLinecap="round" filter="url(#glow)" />
                            {lineProgress > 0.5 && (
                                <circle cx={x1 + (x2 - x1) * particleT} cy={y1 + (y2 - y1) * particleT} r={3} fill="white" opacity={0.7 * intensity} />
                            )}
                        </g>
                    );
                })}

                {nodes.map((node, i) => {
                    const nodeDelay = scene2Start + 40 + i * 6;
                    const nodeProgress = spring({ frame: frame - nodeDelay, fps, config: { damping: 20, stiffness: 80 } });
                    if (nodeProgress <= 0 || frame < scene2Start) return null;

                    return (
                        <g key={`node-${i}`}>
                            <circle cx={centerX + node.x * expandScale} cy={centerY + node.y * expandScale} r={20 * nodeProgress} fill="#6366F1" opacity={0.2 * intensity} />
                            <circle cx={centerX + node.x * expandScale} cy={centerY + node.y * expandScale} r={8 * nodeProgress} fill="#A855F7" opacity={0.6 * intensity} />
                            <circle cx={centerX + node.x * expandScale} cy={centerY + node.y * expandScale} r={3 * nodeProgress} fill="white" opacity={0.9 * intensity} />
                        </g>
                    );
                })}
            </svg>
        );
    };

    // ============ SCENE 2: "It is built around integrations." ============
    const renderScene2 = () => {
        const fadeIn = interpolate(frame, [scene2Start, scene2Start + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(frame, [scene2End - 30, scene2End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const textStart = scene2Start + 40;
        const glowIntensity = Math.sin((time - scene2Start / fps) * 3) * 0.3 + 0.7;

        return (
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", textAlign: "center", opacity: fadeIn * fadeOut }}>
                <div style={{ display: "flex", gap: "0.3em", justifyContent: "center", flexWrap: "wrap" }}>
                    {["It", "is", "built", "around"].map((word, i) => {
                        const wordStart = textStart + i * 12;
                        const progress = spring({ frame: frame - wordStart, fps, config: { damping: 25, stiffness: 100 } });
                        return (
                            <span key={i} style={{
                                fontSize: 68, fontWeight: 400, color: "rgba(255,255,255,0.9)", fontFamily,
                                transform: `translateY(${interpolate(progress, [0, 1], [25, 0], { extrapolateRight: "clamp" })}px)`, opacity: progress
                            }}>
                                {word}
                            </span>
                        );
                    })}
                    <span style={{
                        fontSize: 80, fontWeight: 600, color: "#FFFFFF", fontFamily,
                        transform: `translateY(${interpolate(spring({ frame: frame - textStart - 48, fps, config: { damping: 20, stiffness: 80 } }), [0, 1], [30, 0], { extrapolateRight: "clamp" })}px)`,
                        opacity: spring({ frame: frame - textStart - 48, fps, config: { damping: 20, stiffness: 80 } }),
                        textShadow: `0 0 ${60 * glowIntensity}px rgba(167,139,250,0.8), 0 0 ${120 * glowIntensity}px rgba(167,139,250,0.4)`
                    }}>
                        integrations.
                    </span>
                </div>
            </div>
        );
    };

    // ============ SCENE 3: "Pause." ============
    const renderScene3 = () => {
        const silenceFrames = 30;
        const textFadeIn = interpolate(frame, [scene3Start + silenceFrames, scene3Start + silenceFrames + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smoothEase });
        const fadeOut = interpolate(frame, [scene3End - 20, scene3End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", textAlign: "center", opacity: textFadeIn * fadeOut }}>
                <span style={{ fontSize: 48, fontWeight: 300, color: "rgba(255,255,255,0.7)", fontFamily, letterSpacing: 4 }}>Pause.</span>
            </div>
        );
    };

    // ============ SCENE 4: "And with every integration…" ============
    const renderScene4 = () => {
        const fadeIn = interpolate(frame, [scene4Start, scene4Start + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(frame, [scene4End - 30, scene4End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const textStart = scene4Start + 30;
        const scale = interpolate(frame, [textStart, textStart + 60], [0.98, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smoothEase });

        const words = ["And", "with", "every", "integration…"];
        return (
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) scale(${scale})`, textAlign: "center", opacity: fadeIn * fadeOut }}>
                <div style={{ display: "flex", gap: "0.3em", justifyContent: "center" }}>
                    {words.map((word, i) => {
                        const wordStart = textStart + i * 18;
                        const progress = spring({ frame: frame - wordStart, fps, config: { damping: 25, stiffness: 100 } });
                        const isEmphasized = word.includes("every") || word.includes("integration");
                        return (
                            <span key={i} style={{
                                fontSize: isEmphasized ? 72 : 64, fontWeight: isEmphasized ? 600 : 400, color: isEmphasized ? "#FFFFFF" : "rgba(255,255,255,0.9)", fontFamily,
                                transform: `translateY(${interpolate(progress, [0, 1], [25, 0], { extrapolateRight: "clamp" })}px)`, opacity: progress,
                                textShadow: isEmphasized ? "0 0 40px rgba(147,112,219,0.5)" : "none"
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>
            </div>
        );
    };

    // ============ SCENE 5: "The surface expands." ============
    const renderScene5 = () => {
        const fadeIn = interpolate(frame, [scene5Start, scene5Start + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(frame, [scene5End - 60, scene5End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const textStart = scene5Start + 30;
        const impactScale = interpolate(frame, [scene5Start, scene5Start + 40], [1.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.5)) });
        const expandsGlow = Math.sin((time - scene5Start / fps) * 4) * 0.4 + 0.8;

        return (
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) scale(${impactScale})`, textAlign: "center", opacity: fadeIn * fadeOut }}>
                <div style={{ display: "flex", gap: "0.35em", justifyContent: "center" }}>
                    {["The", "surface"].map((word, i) => {
                        const progress = spring({ frame: frame - textStart - i * 15, fps, config: { damping: 20, stiffness: 90 } });
                        return (
                            <span key={i} style={{
                                fontSize: 88, fontWeight: 600, color: "#FFFFFF", fontFamily,
                                transform: `translateY(${interpolate(progress, [0, 1], [30, 0], { extrapolateRight: "clamp" })}px)`, opacity: progress
                            }}>
                                {word}
                            </span>
                        );
                    })}
                    <span style={{
                        position: "relative", fontSize: 96, fontWeight: 700, color: "#FFFFFF", fontFamily,
                        transform: `translateY(${interpolate(spring({ frame: frame - textStart - 30, fps, config: { damping: 15, stiffness: 70 } }), [0, 1], [40, 0], { extrapolateRight: "clamp" })}px)`,
                        opacity: spring({ frame: frame - textStart - 30, fps, config: { damping: 15, stiffness: 70 } }),
                        textShadow: `0 0 ${80 * expandsGlow}px rgba(167,139,250,0.9), 0 0 ${160 * expandsGlow}px rgba(139,92,246,0.5)`
                    }}>
                        expands.
                        <span style={{
                            position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)",
                            width: `${interpolate(spring({ frame: frame - textStart - 30, fps, config: { damping: 15, stiffness: 70 } }), [0.5, 1], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`,
                            height: 4, background: "linear-gradient(90deg, transparent, #A855F7, transparent)", borderRadius: 2
                        }} />
                    </span>
                </div>
            </div>
        );
    };

    // ============ BACKGROUNDS & EFFECTS ============
    const gradientAngle = time * 15;
    const gradientShift = Math.sin(time * 0.5) * 10;
    const scene3Black = currentScene === 3 && frame < scene3Start + 30 ? 1 : 0;
    const networkIntensity = currentScene === 2 ? 1 : currentScene === 3 ? 0.3 : currentScene >= 4 ? 1 : 0;
    const scene5Zoom = interpolate(frame, [scene5Start, scene5End], [1.0, 0.95], { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: smoothEase });
    const laterZoom = currentScene === 5 ? scene5Zoom : 1.0;

    return (
        <AbsoluteFill
            style={{
                background: scene3Black > 0 ? "#000000" : `linear-gradient(${gradientAngle}deg, #0a0a12 0%, #0d0d1a ${50 + gradientShift}%, #12101f 100%)`,
                fontFamily,
                overflow: "hidden",
            }}
        >
            {!scene3Black && renderGrain()}

            {!scene3Black && (
                <div style={{
                    position: "absolute", width: "200%", height: "200%", left: "-50%", top: "-50%",
                    background: `radial-gradient(circle at ${50 + Math.sin(time * 0.3) * 20}% ${50 + Math.cos(time * 0.4) * 15}%, rgba(99,102,241,0.08) 0%, transparent 50%)`,
                    pointerEvents: "none"
                }} />
            )}

            {networkIntensity > 0 && renderNetworkLines(networkIntensity, currentScene === 5)}

            {/* Scene 1: Kinetic scroll */}
            {currentScene === 1 && renderScene1()}

            {/* Later scenes with zoom */}
            {currentScene >= 2 && (
                <div style={{ position: "absolute", width: "100%", height: "100%", transform: `scale(${laterZoom})`, transformOrigin: "center center" }}>
                    {currentScene === 2 && renderScene2()}
                    {currentScene === 3 && renderScene3()}
                    {currentScene === 4 && renderScene4()}
                    {currentScene === 5 && renderScene5()}
                </div>
            )}

            <div style={{
                position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                background: `radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.8) 100%)`, pointerEvents: "none"
            }} />
        </AbsoluteFill>
    );
};
