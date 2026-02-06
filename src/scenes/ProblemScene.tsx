import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
    weights: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
});

// ============================================
// PROBLEM SCENE - Refined Kinetic Typography
// Smooth, seamless, precise positioning
// ============================================

// Ultra smooth easing
const easeOutQuart = Easing.out(Easing.quad);
const easeInOutCubic = Easing.inOut(Easing.cubic);

export const ProblemScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();
    const time = frame / fps;

    // ============ SCENE TIMING ============
    const scene1End = 380;
    const scene2Start = 380;
    const scene2End = 560;
    const scene3Start = 560;
    const scene3End = 680;
    const scene4Start = 680;
    const scene4End = 860;
    const scene5Start = 860;
    const scene5End = 1080;

    const currentScene =
        frame < scene1End ? 1 :
            frame < scene2End ? 2 :
                frame < scene3End ? 3 :
                    frame < scene4End ? 4 : 5;


    // ============ PRECISE WORD LAYOUT ============
    // Tight, intentional positioning with widths for highlight

    const words = [
        // Row 1: Horizontal flow - tight spacing
        { text: "Today,", startFrame: 35, x: 0, y: 0, width: 130 },
        { text: "modern", startFrame: 70, x: 145, y: 0, width: 150 },
        { text: "software", startFrame: 108, x: 310, y: 0, width: 190 },
        // Row 2: Below "software", reversed "is not" - aligned
        { text: "is", startFrame: 155, x: 420, y: 70, width: 45 },
        { text: "not", startFrame: 175, x: 350, y: 70, width: 60 },
        // Row 3: "Built" centered below, bigger
        { text: "Built", startFrame: 210, x: 355, y: 145, width: 140 },
    ];

    // ============ ACTIVE WORD HIGHLIGHT ============
    // Calculate which word is currently active and interpolate highlight position

    const getActiveWordIndex = () => {
        for (let i = words.length - 1; i >= 0; i--) {
            if (frame >= words[i].startFrame) return i;
        }
        return -1;
    };

    const activeIndex = getActiveWordIndex();

    // Highlight position - smoothly interpolates between words
    const getHighlightProps = () => {
        if (activeIndex < 0) return { x: 0, y: 0, width: 0, height: 0, opacity: 0 };

        const currentWord = words[activeIndex];
        const nextWord = words[activeIndex + 1];

        // Base position on current word
        let highlightX = currentWord.x - 15; // Padding
        let highlightY = currentWord.y - 12;
        let highlightWidth = currentWord.width + 30;
        let highlightHeight = currentWord.text === "Built" ? 85 : 58;

        // If there's a next word, interpolate towards it as we approach its start frame
        if (nextWord) {
            const transitionStart = nextWord.startFrame - 20;
            const transitionEnd = nextWord.startFrame + 10;

            if (frame >= transitionStart && frame <= transitionEnd) {
                const t = interpolate(
                    frame, [transitionStart, transitionEnd], [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const eased = easeInOutCubic(t);

                const nextHeight = nextWord.text === "Built" ? 85 : 58;

                highlightX = currentWord.x - 15 + (nextWord.x - 15 - (currentWord.x - 15)) * eased;
                highlightY = currentWord.y - 12 + (nextWord.y - 12 - (currentWord.y - 12)) * eased;
                highlightWidth = (currentWord.width + 30) + ((nextWord.width + 30) - (currentWord.width + 30)) * eased;
                highlightHeight = highlightHeight + (nextHeight - highlightHeight) * eased;
            }
        }

        // Fade in on first word
        const opacity = activeIndex === 0
            ? interpolate(frame - words[0].startFrame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : 1;

        return { x: highlightX, y: highlightY, width: highlightWidth, height: highlightHeight, opacity };
    };

    const highlight = getHighlightProps();


    // ============ SEAMLESS CAMERA TRACKING ============
    // No gaps - continuous smooth motion

    const getCameraPosition = () => {
        // Define keyframes for smooth interpolation
        const keyframes = [
            { frame: 0, x: 0, y: 0 },
            { frame: 35, x: 0, y: 0 },      // Start at "Today"
            { frame: 70, x: 145, y: 0 },    // Move to "modern"
            { frame: 108, x: 310, y: 0 },   // Move to "software"
            { frame: 155, x: 385, y: 70 },  // Smoothly curve down to "is not"
            { frame: 210, x: 380, y: 145 }, // Continue down to "Built"
            { frame: 350, x: 380, y: 145 }, // Hold
        ];

        // Find the two keyframes we're between
        let prevKey = keyframes[0];
        let nextKey = keyframes[keyframes.length - 1];

        for (let i = 0; i < keyframes.length - 1; i++) {
            if (frame >= keyframes[i].frame && frame < keyframes[i + 1].frame) {
                prevKey = keyframes[i];
                nextKey = keyframes[i + 1];
                break;
            }
        }

        if (frame >= keyframes[keyframes.length - 1].frame) {
            return { x: nextKey.x, y: nextKey.y };
        }

        // Smooth interpolation between keyframes
        const progress = interpolate(
            frame,
            [prevKey.frame, nextKey.frame],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Extra smooth easing
        const eased = easeInOutCubic(progress);

        return {
            x: prevKey.x + (nextKey.x - prevKey.x) * eased,
            y: prevKey.y + (nextKey.y - prevKey.y) * eased,
        };
    };

    const cameraPos = getCameraPosition();
    const zoomLevel = 3.2; // Tight framing

    // ============ GRAIN ============
    const renderGrain = () => (
        <div
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                opacity: 0.03,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                transform: `translate(${Math.sin(time) * 1.5}px, ${Math.cos(time * 0.7) * 1.5}px)`,
                pointerEvents: "none",
            }}
        />
    );

    // ============ SCENE 1: KINETIC TYPOGRAPHY ============
    const renderScene1 = () => {
        const fadeOut = interpolate(
            frame, [scene1End - 60, scene1End], [1, 0],
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
                    background: "#07070a",
                }}
            >
                {/* Subtle ambient glow that follows camera */}
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        background: `radial-gradient(circle at ${50 - cameraPos.x * 0.015}% ${50 + cameraPos.y * 0.02}%, rgba(99,102,241,0.04) 0%, transparent 50%)`,
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
                        transition: "transform 0.05s ease-out",
                    }}
                >
                    {/* Words container */}
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(0, -50%)",
                        }}
                    >
                        {/* ANIMATED HIGHLIGHT PILL */}
                        {highlight.opacity > 0 && (
                            <div
                                style={{
                                    position: "absolute",
                                    left: highlight.x,
                                    top: highlight.y,
                                    width: highlight.width,
                                    height: highlight.height,
                                    background: "linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.2) 100%)",
                                    borderRadius: 16,
                                    opacity: highlight.opacity,
                                    border: "1px solid rgba(139,92,246,0.3)",
                                    boxShadow: "0 0 30px rgba(139,92,246,0.3), inset 0 0 20px rgba(99,102,241,0.1)",
                                    pointerEvents: "none",
                                }}
                            />
                        )}

                        {words.map((word, i) => {
                            const wordStarted = frame >= word.startFrame;
                            const framesSinceStart = frame - word.startFrame;

                            // Smooth entrance with spring
                            const enterProgress = spring({
                                frame: framesSinceStart,
                                fps,
                                config: { damping: 28, stiffness: 120, mass: 1 },
                            });

                            // Determine motion direction based on position
                            const isHorizontalRow = word.y === 0;
                            const isBuilt = word.text === "Built";

                            // Slide distance - smaller for tighter feel
                            const slideDistance = isBuilt ? 40 : 50;

                            // Slide animation
                            let slideX = 0;
                            let slideY = 0;

                            if (!wordStarted) {
                                slideX = isHorizontalRow ? slideDistance : 0;
                                slideY = !isHorizontalRow ? slideDistance : 0;
                            } else {
                                slideX = isHorizontalRow ? interpolate(enterProgress, [0, 1], [slideDistance, 0]) : 0;
                                slideY = !isHorizontalRow ? interpolate(enterProgress, [0, 1], [slideDistance, 0]) : 0;
                            }

                            // Soft motion blur
                            const blurAmount = wordStarted
                                ? interpolate(enterProgress, [0, 0.5, 1], [8, 3, 0])
                                : 10;

                            // Opacity - fade in smoothly
                            const opacity = wordStarted
                                ? interpolate(enterProgress, [0, 0.4, 1], [0, 0.8, 1])
                                : 0;

                            // Scale
                            const scale = wordStarted
                                ? interpolate(enterProgress, [0, 1], [0.94, 1])
                                : 0.9;

                            // Font sizing
                            const fontSize = isBuilt ? 72 : (word.text === "is" || word.text === "not") ? 42 : 48;
                            const fontWeight = isBuilt ? 700 : (word.text === "modern" || word.text === "software") ? 500 : 400;

                            // Glow for "Built"
                            const builtGlow = isBuilt && enterProgress > 0.5
                                ? interpolate(enterProgress, [0.5, 1], [0, 1])
                                : 0;

                            return (
                                <span
                                    key={i}
                                    style={{
                                        position: "absolute",
                                        left: word.x,
                                        top: word.y,
                                        display: "inline-block",
                                        fontSize,
                                        fontWeight,
                                        color: "#FFFFFF",
                                        fontFamily,
                                        opacity,
                                        filter: blurAmount > 0.3 ? `blur(${blurAmount * 0.4}px)` : undefined,
                                        textShadow: isBuilt && builtGlow > 0
                                            ? `0 0 ${50 * builtGlow}px rgba(139,92,246,0.7), 0 0 ${100 * builtGlow}px rgba(139,92,246,0.4)`
                                            : blurAmount > 1
                                                ? isHorizontalRow
                                                    ? `${blurAmount * 0.8}px 0 ${blurAmount * 0.5}px rgba(255,255,255,0.25)`
                                                    : `0 ${blurAmount * 0.8}px ${blurAmount * 0.5}px rgba(255,255,255,0.25)`
                                                : "none",
                                        transform: `translate(${slideX}px, ${slideY}px) scale(${scale})`,
                                        letterSpacing: isBuilt ? "0.01em" : "-0.015em",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {word.text}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* Soft vignettes */}
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(7,7,10,0.9) 100%)", pointerEvents: "none" }} />
            </div>
        );
    };

    // ============ NETWORK LINES ============
    const renderNetworkLines = (intensity: number = 1, expanding: boolean = false) => {
        const centerX = width / 2;
        const centerY = height / 2;
        const nodes = [
            { x: 0, y: 0 }, { x: -280, y: -160 }, { x: 280, y: -140 },
            { x: -320, y: 100 }, { x: 300, y: 140 }, { x: -140, y: 220 },
            { x: 160, y: -260 }, { x: -380, y: -40 }, { x: 380, y: 40 },
        ];
        const connections = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 7], [2, 6], [3, 5], [4, 5]];
        const expandScale = expanding ? interpolate(frame, [scene5Start, scene5Start + 60], [1, 1.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }) : 1;

        return (
            <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366F1" /><stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                    <filter id="glow"><feGaussianBlur stdDeviation="3" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                {connections.map(([from, to], i) => {
                    const lineDelay = scene2Start + 25 + i * 10;
                    const p = spring({ frame: frame - lineDelay, fps, config: { damping: 30, stiffness: 60 } });
                    if (p <= 0 || frame < scene2Start) return null;
                    const x1 = centerX + nodes[from].x * expandScale, y1 = centerY + nodes[from].y * expandScale;
                    const x2 = centerX + nodes[to].x * expandScale, y2 = centerY + nodes[to].y * expandScale;
                    const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                    return (
                        <g key={i}>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#lineGrad)" strokeWidth={1.5} strokeDasharray={len} strokeDashoffset={len * (1 - p)} opacity={p * 0.5 * intensity} strokeLinecap="round" filter="url(#glow)" />
                            {p > 0.5 && <circle cx={x1 + (x2 - x1) * ((time * 0.3 + i * 0.1) % 1)} cy={y1 + (y2 - y1) * ((time * 0.3 + i * 0.1) % 1)} r={2.5} fill="white" opacity={0.6 * intensity} />}
                        </g>
                    );
                })}
                {nodes.map((n, i) => {
                    const np = spring({ frame: frame - scene2Start - 50 - i * 8, fps, config: { damping: 20, stiffness: 80 } });
                    if (np <= 0 || frame < scene2Start) return null;
                    return (
                        <g key={`n-${i}`}>
                            <circle cx={centerX + n.x * expandScale} cy={centerY + n.y * expandScale} r={12 * np} fill="#6366F1" opacity={0.15 * intensity} />
                            <circle cx={centerX + n.x * expandScale} cy={centerY + n.y * expandScale} r={5 * np} fill="#A855F7" opacity={0.5 * intensity} />
                        </g>
                    );
                })}
            </svg>
        );
    };

    // ============ SCENE 2-5 ============
    const renderScene2 = () => {
        const fadeIn = interpolate(frame, [scene2Start, scene2Start + 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(frame, [scene2End - 35, scene2End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const textStart = scene2Start + 45;
        const glow = Math.sin(time * 2.5) * 0.25 + 0.75;
        return (
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", textAlign: "center", opacity: fadeIn * fadeOut }}>
                <div style={{ display: "flex", gap: "0.25em", justifyContent: "center", flexWrap: "wrap" }}>
                    {["It", "is", "built", "around"].map((w, i) => {
                        const p = spring({ frame: frame - textStart - i * 14, fps, config: { damping: 26, stiffness: 90 } });
                        return <span key={i} style={{ fontSize: 64, fontWeight: 400, color: "rgba(255,255,255,0.9)", fontFamily, transform: `translateY(${interpolate(p, [0, 1], [20, 0], { extrapolateRight: "clamp" })}px)`, opacity: p }}>{w}</span>;
                    })}
                    <span style={{ fontSize: 76, fontWeight: 600, color: "#FFF", fontFamily, transform: `translateY(${interpolate(spring({ frame: frame - textStart - 56, fps, config: { damping: 22, stiffness: 70 } }), [0, 1], [25, 0], { extrapolateRight: "clamp" })}px)`, opacity: spring({ frame: frame - textStart - 56, fps, config: { damping: 22, stiffness: 70 } }), textShadow: `0 0 ${55 * glow}px rgba(167,139,250,0.75)` }}>integrations.</span>
                </div>
            </div>
        );
    };

    const renderScene3 = () => {
        const textFade = interpolate(frame, [scene3Start + 35, scene3Start + 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutQuart });
        const fadeOut = interpolate(frame, [scene3End - 25, scene3End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", opacity: textFade * fadeOut }}>
                <span style={{ fontSize: 44, fontWeight: 300, color: "rgba(255,255,255,0.65)", fontFamily, letterSpacing: 3 }}>Pause.</span>
            </div>
        );
    };

    const renderScene4 = () => {
        const fadeIn = interpolate(frame, [scene4Start, scene4Start + 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(frame, [scene4End - 35, scene4End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const textStart = scene4Start + 35;
        return (
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", textAlign: "center", opacity: fadeIn * fadeOut }}>
                <div style={{ display: "flex", gap: "0.25em", justifyContent: "center" }}>
                    {["And", "with", "every", "integration…"].map((w, i) => {
                        const p = spring({ frame: frame - textStart - i * 16, fps, config: { damping: 26, stiffness: 90 } });
                        const emph = w.includes("every") || w.includes("integration");
                        return <span key={i} style={{ fontSize: emph ? 70 : 62, fontWeight: emph ? 600 : 400, color: emph ? "#FFF" : "rgba(255,255,255,0.88)", fontFamily, transform: `translateY(${interpolate(p, [0, 1], [22, 0], { extrapolateRight: "clamp" })}px)`, opacity: p, textShadow: emph ? "0 0 35px rgba(139,92,246,0.45)" : "none" }}>{w}</span>;
                    })}
                </div>
            </div>
        );
    };

    const renderScene5 = () => {
        const fadeIn = interpolate(frame, [scene5Start, scene5Start + 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(frame, [scene5End - 70, scene5End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const textStart = scene5Start + 35;
        const impactScale = interpolate(frame, [scene5Start, scene5Start + 45], [1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.3)) });
        const glow = Math.sin(time * 3.5) * 0.35 + 0.75;
        return (
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) scale(${impactScale})`, textAlign: "center", opacity: fadeIn * fadeOut }}>
                <div style={{ display: "flex", gap: "0.3em", justifyContent: "center" }}>
                    {["The", "surface"].map((w, i) => {
                        const p = spring({ frame: frame - textStart - i * 14, fps, config: { damping: 22, stiffness: 85 } });
                        return <span key={i} style={{ fontSize: 84, fontWeight: 600, color: "#FFF", fontFamily, transform: `translateY(${interpolate(p, [0, 1], [28, 0], { extrapolateRight: "clamp" })}px)`, opacity: p }}>{w}</span>;
                    })}
                    <span style={{ position: "relative", fontSize: 92, fontWeight: 700, color: "#FFF", fontFamily, transform: `translateY(${interpolate(spring({ frame: frame - textStart - 28, fps, config: { damping: 18, stiffness: 65 } }), [0, 1], [35, 0], { extrapolateRight: "clamp" })}px)`, opacity: spring({ frame: frame - textStart - 28, fps, config: { damping: 18, stiffness: 65 } }), textShadow: `0 0 ${70 * glow}px rgba(167,139,250,0.85)` }}>
                        expands.
                        <span style={{ position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)", width: `${interpolate(spring({ frame: frame - textStart - 28, fps, config: { damping: 18, stiffness: 65 } }), [0.4, 1], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`, height: 3, background: "linear-gradient(90deg, transparent, #A855F7, transparent)", borderRadius: 2 }} />
                    </span>
                </div>
            </div>
        );
    };

    // ============ MAIN ============
    const gradientAngle = time * 10;
    const scene3Black = currentScene === 3 && frame < scene3Start + 35;
    const networkIntensity = currentScene >= 2 && currentScene !== 3 ? 1 : currentScene === 3 ? 0.15 : 0;

    return (
        <AbsoluteFill style={{ background: scene3Black ? "#000" : `linear-gradient(${gradientAngle}deg, #07070a 0%, #0b0b10 50%, #0e0e14 100%)`, fontFamily, overflow: "hidden" }}>
            {!scene3Black && currentScene !== 1 && renderGrain()}
            {networkIntensity > 0 && renderNetworkLines(networkIntensity, currentScene === 5)}

            {currentScene === 1 && renderScene1()}
            {currentScene === 2 && renderScene2()}
            {currentScene === 3 && renderScene3()}
            {currentScene === 4 && renderScene4()}
            {currentScene === 5 && renderScene5()}

            {currentScene !== 1 && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.75) 100%)", pointerEvents: "none" }} />}
        </AbsoluteFill>
    );
};
