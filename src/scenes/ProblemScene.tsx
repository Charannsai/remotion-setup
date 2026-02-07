import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
    weights: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
});

// ============================================
// PROBLEM SCENE - Premium Cinematic Typography
// Camera chasing the sentence
// ============================================

// Premium easing curves
const easeOutExpo = Easing.out(Easing.exp);
const easeInOutQuart = Easing.bezier(0.76, 0, 0.24, 1);
const easeOutBack = Easing.out(Easing.back(1.4));

export const ProblemScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();
    const time = frame / fps;

    // ============ SCENE TIMING ============
    const scene1End = 480;
    const scene2Start = 480;
    const scene2End = 660;
    const scene3Start = 660;
    const scene3End = 780;
    const scene4Start = 780;
    const scene4End = 980;
    const scene5Start = 980;
    const scene5End = 1200;

    const currentScene =
        frame < scene1End ? 1 :
            frame < scene2End ? 2 :
                frame < scene3End ? 3 :
                    frame < scene4End ? 4 : 5;

    // ============ WORD LAYOUT WITH RHYTHM ============
    // Variable timing: Hold → Slide → Lock → Micro pause

    const words = [
        // Row 1: Horizontal flow - "Every frontend wants to"
        { text: "Every", startFrame: 50, x: 0, y: 0, width: 145, holdExtra: 15 },
        { text: "frontend", startFrame: 110, x: 175, y: 0, width: 210, holdExtra: 0 },
        { text: "wants", startFrame: 165, x: 420, y: 0, width: 145, holdExtra: 0 },
        { text: "to", startFrame: 210, x: 600, y: 0, width: 50, holdExtra: 8 },
        // Row 2: Reversed flow (right to left, camera moves LEFT) - "talk" then "to" then "the"
        { text: "talk", startFrame: 270, x: 520, y: 100, width: 100, holdExtra: 0 },
        { text: "to", startFrame: 315, x: 420, y: 100, width: 50, holdExtra: 0 },
        { text: "the", startFrame: 360, x: 330, y: 100, width: 75, holdExtra: 5 },
        // Row 3: Big impact word - "World"
        { text: "World", startFrame: 420, x: 360, y: 210, width: 200, holdExtra: 20 },
    ];

    // ============ CAMERA MOTION - GLIDING ON RAILS ============

    const getCameraMotion = () => {
        // Build keyframes with micro pauses (breathing room)
        const keyframes = [
            { frame: 0, x: 0, y: 0, z: 0 },
            { frame: 50, x: 0, y: 0, z: 0 },         // Hold on "Every"
            { frame: 100, x: 0, y: 0, z: 0 },        // Breathing pause
            { frame: 110, x: 175, y: 0, z: 2 },      // Slide to "frontend"
            { frame: 155, x: 175, y: 0, z: 0 },      // Lock + pause
            { frame: 165, x: 420, y: 0, z: 3 },      // Slide to "wants"
            { frame: 200, x: 420, y: 0, z: 0 },      // Lock
            { frame: 210, x: 600, y: 0, z: 2 },      // Slide to "to" (end of row 1)
            { frame: 260, x: 600, y: 0, z: 0 },      // Lock + pause
            { frame: 270, x: 520, y: 100, z: 4 },    // Curve down to "talk" (start of row 2)
            { frame: 305, x: 520, y: 100, z: 0 },    // Lock
            { frame: 315, x: 420, y: 100, z: 2 },    // Slide LEFT to "to"
            { frame: 350, x: 420, y: 100, z: 0 },    // Lock
            { frame: 360, x: 330, y: 100, z: 2 },    // Slide LEFT to "the"
            { frame: 410, x: 330, y: 100, z: 0 },    // Lock + pause
            { frame: 420, x: 400, y: 210, z: 5 },    // Down to "World"
            { frame: 500, x: 400, y: 210, z: 0 },    // Final lock
        ];

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
            return { x: nextKey.x, y: nextKey.y, z: nextKey.z, velocity: 0 };
        }

        const duration = nextKey.frame - prevKey.frame;
        const progress = (frame - prevKey.frame) / duration;

        // Gliding motion: ease-in-out with slight acceleration
        const eased = easeInOutQuart(progress);

        // Calculate velocity for motion blur
        const velocity = Math.abs(eased - easeInOutQuart(Math.max(0, progress - 0.02))) * 50;

        return {
            x: prevKey.x + (nextKey.x - prevKey.x) * eased,
            y: prevKey.y + (nextKey.y - prevKey.y) * eased,
            z: prevKey.z + (nextKey.z - prevKey.z) * eased,
            velocity,
        };
    };

    const camera = getCameraMotion();
    const zoomLevel = 3.2; // Macro-level framing

    // Fake 3D depth push based on camera z
    const depthPush = 1 + camera.z * 0.008;

    // ============ ACTIVE WORD & HIGHLIGHT ============

    const getActiveWordIndex = () => {
        for (let i = words.length - 1; i >= 0; i--) {
            if (frame >= words[i].startFrame) return i;
        }
        return -1;
    };

    const activeIndex = getActiveWordIndex();

    // Calculate font size for a word
    const getFontSize = (word: typeof words[0]) => {
        if (word.text === "World") return 78;
        if (word.text === "to" || word.text === "talk" || word.text === "the") return 46;
        return 52;
    };

    const getHighlightProps = () => {
        if (activeIndex < 0) return { x: 0, y: 0, width: 0, height: 0, opacity: 0 };

        const currentWord = words[activeIndex];
        const nextWord = words[activeIndex + 1];

        // Calculate height based on font size + padding
        const currentFontSize = getFontSize(currentWord);
        const padding = 28; // Horizontal padding each side
        const verticalPadding = 18; // Vertical padding each side

        let highlightX = currentWord.x - padding;
        let highlightHeight = currentFontSize + verticalPadding * 2;
        let highlightY = currentWord.y - verticalPadding + 4; // +4 for baseline adjustment
        let highlightWidth = currentWord.width + padding * 2;

        if (nextWord) {
            const transitionStart = nextWord.startFrame - 30;
            const transitionEnd = nextWord.startFrame + 10;

            if (frame >= transitionStart && frame <= transitionEnd) {
                const t = interpolate(frame, [transitionStart, transitionEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const eased = easeInOutQuart(t);

                const nextFontSize = getFontSize(nextWord);
                const nextHeight = nextFontSize + verticalPadding * 2;
                const nextY = nextWord.y - verticalPadding + 4;

                highlightX = (currentWord.x - padding) + ((nextWord.x - padding) - (currentWord.x - padding)) * eased;
                highlightY = highlightY + (nextY - highlightY) * eased;
                highlightWidth = highlightWidth + ((nextWord.width + padding * 2) - highlightWidth) * eased;
                highlightHeight = highlightHeight + (nextHeight - highlightHeight) * eased;
            }
        }

        const opacity = activeIndex === 0
            ? interpolate(frame - words[0].startFrame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : 1;

        return { x: highlightX, y: highlightY, width: highlightWidth, height: highlightHeight, opacity };
    };

    const highlight = getHighlightProps();

    // ============ SCENE 1: CINEMATIC TYPOGRAPHY ============

    const renderScene1 = () => {
        const fadeOut = interpolate(frame, [scene1End - 60, scene1End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        // Simple parallax offset (no blur - too expensive)
        const bgOffsetX = camera.x * 0.15;
        const bgOffsetY = camera.y * 0.15;

        return (
            <div style={{ position: "absolute", width: "100%", height: "100%", opacity: fadeOut, overflow: "hidden", background: "#06060a" }}>

                {/* ========== SIMPLE AMBIENT BACKGROUND ========== */}
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        background: `radial-gradient(circle at ${50 - bgOffsetX * 0.1}% ${50 + bgOffsetY * 0.1}%, rgba(99,102,241,0.05) 0%, transparent 50%)`,
                    }}
                />

                {/* ========== CAMERA CONTAINER ========== */}
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        transform: `scale(${zoomLevel * depthPush}) translate(${-camera.x}px, ${-camera.y}px)`,
                        transformOrigin: "center center",
                    }}
                >
                    {/* Words container */}
                    <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(0, -50%)" }}>

                        {/* ========== ANIMATED HIGHLIGHT PILL ========== */}
                        {highlight.opacity > 0 && (
                            <div
                                style={{
                                    position: "absolute",
                                    left: highlight.x,
                                    top: highlight.y,
                                    width: highlight.width,
                                    height: highlight.height,
                                    background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.15) 100%)",
                                    borderRadius: 18,
                                    opacity: highlight.opacity,
                                    border: "1px solid rgba(139,92,246,0.25)",
                                    boxShadow: `0 0 40px rgba(139,92,246,0.25), inset 0 0 30px rgba(99,102,241,0.08)`,
                                    pointerEvents: "none",
                                }}
                            />
                        )}

                        {/* ========== WORDS ========== */}
                        {words.map((word, i) => {
                            const wordStarted = frame >= word.startFrame;
                            const framesSinceStart = frame - word.startFrame;

                            // ===== SLIDE IN FROM RIGHT =====
                            const slideProgress = interpolate(
                                framesSinceStart,
                                [0, 28], // Faster slide
                                [0, 1],
                                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutExpo }
                            );

                            const slideX = wordStarted
                                ? interpolate(slideProgress, [0, 1], [60, 0])
                                : 80;

                            // ===== BLUR (only when significant) =====
                            const blurAmount = wordStarted && slideProgress < 0.5
                                ? interpolate(slideProgress, [0, 0.5], [6, 0])
                                : 0;

                            // ===== SCALE WITH OVERSHOOT (102-104% → 101% → 100%) =====
                            const baseScale = wordStarted
                                ? interpolate(slideProgress, [0, 0.6, 0.85, 1], [1.03, 1.005, 1.012, 1])
                                : 1.04;

                            // ===== OPACITY =====
                            const opacity = wordStarted
                                ? interpolate(slideProgress, [0, 0.3, 1], [0, 0.8, 1])
                                : 0;

                            // Font sizing
                            const isWorld = word.text === "World";
                            const isSmall = word.text === "to" || word.text === "talk" || word.text === "the";
                            const fontSize = isWorld ? 78 : isSmall ? 46 : 52;
                            const fontWeight = isWorld ? 700 : isSmall ? 400 : 500;

                            // Glow effect for impact words
                            const isKeyword = ["frontend", "talk", "World"].includes(word.text);
                            const glowIntensity = isKeyword && slideProgress > 0.6
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
                                        fontSize,
                                        fontWeight,
                                        color: "#FFFFFF",
                                        fontFamily,
                                        opacity,
                                        filter: blurAmount > 1 ? `blur(${blurAmount}px)` : undefined,
                                        transform: `translateX(${slideX}px) scale(${baseScale})`,
                                        textShadow: glowIntensity > 0.3
                                            ? `0 0 ${40 * glowIntensity}px rgba(139,92,246,0.5)`
                                            : undefined,
                                        letterSpacing: isWorld ? "0.01em" : "-0.015em",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {word.text}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* ========== SIMPLE VIGNETTE ========== */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(6,6,10,0.8) 100%)",
                        pointerEvents: "none",
                    }}
                />
            </div>
        );
    };

    // ============ NETWORK LINES ============
    const renderNetworkLines = (intensity: number = 1, expanding: boolean = false) => {
        const centerX = width / 2, centerY = height / 2;
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
                    const p = spring({ frame: frame - scene2Start - 25 - i * 10, fps, config: { damping: 30, stiffness: 60 } });
                    if (p <= 0 || frame < scene2Start) return null;
                    const x1 = centerX + nodes[from].x * expandScale, y1 = centerY + nodes[from].y * expandScale;
                    const x2 = centerX + nodes[to].x * expandScale, y2 = centerY + nodes[to].y * expandScale;
                    const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                    return (
                        <g key={i}>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#lineGrad)" strokeWidth={1.5} strokeDasharray={len} strokeDashoffset={len * (1 - p)} opacity={p * 0.5 * intensity} filter="url(#glow)" />
                            {p > 0.5 && <circle cx={x1 + (x2 - x1) * ((time * 0.3 + i * 0.1) % 1)} cy={y1 + (y2 - y1) * ((time * 0.3 + i * 0.1) % 1)} r={2.5} fill="white" opacity={0.6 * intensity} />}
                        </g>
                    );
                })}
                {nodes.map((n, i) => {
                    const np = spring({ frame: frame - scene2Start - 50 - i * 8, fps, config: { damping: 20, stiffness: 80 } });
                    if (np <= 0 || frame < scene2Start) return null;
                    return <g key={`n-${i}`}><circle cx={centerX + n.x * expandScale} cy={centerY + n.y * expandScale} r={12 * np} fill="#6366F1" opacity={0.15 * intensity} /><circle cx={centerX + n.x * expandScale} cy={centerY + n.y * expandScale} r={5 * np} fill="#A855F7" opacity={0.5 * intensity} /></g>;
                })}
            </svg>
        );
    };

    // ============ SCENE 2-5 ============
    const renderScene2 = () => {
        const fadeIn = interpolate(frame, [scene2Start, scene2Start + 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(frame, [scene2End - 35, scene2End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const textStart = scene2Start + 50;
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
        const textFade = interpolate(frame, [scene3Start + 40, scene3Start + 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutExpo });
        const fadeOut = interpolate(frame, [scene3End - 25, scene3End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", opacity: textFade * fadeOut }}><span style={{ fontSize: 44, fontWeight: 300, color: "rgba(255,255,255,0.65)", fontFamily, letterSpacing: 3 }}>Pause.</span></div>;
    };

    const renderScene4 = () => {
        const fadeIn = interpolate(frame, [scene4Start, scene4Start + 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(frame, [scene4End - 35, scene4End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const textStart = scene4Start + 40;
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
        const textStart = scene5Start + 40;
        const impactScale = interpolate(frame, [scene5Start, scene5Start + 50], [1.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutBack });
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
    const gradientAngle = time * 8;
    const scene3Black = currentScene === 3 && frame < scene3Start + 40;
    const networkIntensity = currentScene >= 2 && currentScene !== 3 ? 1 : currentScene === 3 ? 0.15 : 0;

    return (
        <AbsoluteFill style={{ background: scene3Black ? "#000" : `linear-gradient(${gradientAngle}deg, #06060a 0%, #0a0a10 50%, #0c0c14 100%)`, fontFamily, overflow: "hidden" }}>
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
