import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
    weights: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
});
import { MicroCard } from "../components/MicroCard";

// ============================================
// PROBLEM SCENE - Premium Cinematic Typography
// Camera chasing the sentence
// ============================================

// Premium easing curves
const easeOutExpo = Easing.out(Easing.exp);
const easeInOutQuart = Easing.bezier(0.76, 0, 0.24, 1);
const easeOutBack = Easing.out(Easing.back(1.4));
const easeInExpo = Easing.in(Easing.exp);

export const ProblemScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();
    const time = frame / fps;

    // ============ SCENE TIMING ============
    const scene1End = 360;  // Extended for Refined Card Sequence
    const scene2Start = 360;
    const scene2End = 480;
    const scene3Start = 480;
    const scene3End = 600;
    const scene4Start = 600;
    const scene4End = 800;
    const scene5Start = 800;
    const scene5End = 1020;

    const currentScene =
        frame < scene1End ? 1 :
            frame < scene2End ? 2 :
                frame < scene3End ? 3 :
                    frame < scene4End ? 4 : 5;

    // ============ WORD LAYOUT WITH RHYTHM ============
    // Variable timing: Hold → Slide → Lock → Micro pause

    const words = [
        // Row 1: "Modern apps connect"
        { text: "Modern", startFrame: 15, x: 0, y: 0, width: 210, holdExtra: 10 },
        { text: "apps", startFrame: 35, x: 220, y: 0, width: 140, holdExtra: 0 },
        { text: "connect", startFrame: 55, x: 370, y: 0, width: 220, holdExtra: 0 },
        // Row 2: "to dozens of" (Standard L->R)
        { text: "to", startFrame: 75, x: 600, y: 0, width: 60, holdExtra: 0 }, // End of row 1 visual
        { text: "dozens", startFrame: 90, x: 600, y: 100, width: 200, holdExtra: 0 },
        { text: "of", startFrame: 105, x: 820, y: 100, width: 70, holdExtra: 0 },
        // Row 3: "APIs"
        { text: "APIs", startFrame: 120, x: 600, y: 220, width: 180, holdExtra: 30 },
    ];

    // ============ CAMERA MOTION - GLIDING ON RAILS ============

    const getCameraMotion = () => {
        // Build keyframes with micro pauses (breathing room)
        const keyframes = [
            { frame: 0, x: 0, y: 0, z: 0 },
            { frame: 15, x: 0, y: 0, z: 0 },         // Hold Modern
            { frame: 35, x: 220, y: 0, z: 2 },       // Slide to apps
            { frame: 55, x: 370, y: 0, z: 0 },       // Slide to connect
            { frame: 75, x: 600, y: 0, z: 2 },       // Slide to to
            { frame: 90, x: 600, y: 100, z: 3 },     // Down to dozens
            { frame: 105, x: 820, y: 100, z: 2 },    // Slide to of
            { frame: 120, x: 600, y: 220, z: 4 },    // Down to APIs
            { frame: 160, x: 600, y: 220, z: 0 },    // Lock
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
        if (word.text === "APIs") return 78;
        if (word.text === "to" || word.text === "of") return 46;
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

    // Transition timings (after World appears at frame 420)
    // Transition timings
    // Text animation finishes ~frame 120 (4 seconds)
    // Transition timings
    // Text animation finishes ~frame 120 (4 seconds)
    // Frame 120: Card sequence begins

    const renderScene1 = () => {
        const fadeOut = interpolate(frame, [scene1End - 20, scene1End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });


        // Simple parallax offset (no blur - too expensive)
        const bgOffsetX = camera.x * 0.15;
        const bgOffsetY = camera.y * 0.15;

        // Hide camera container as text drops (start of Card Sequence)
        const cameraContainerOpacity = interpolate(
            frame,
            [120, 140],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );



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

                {/* ========== CAMERA CONTAINER (fades out during transition) ========== */}
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        transform: `scale(${zoomLevel * depthPush}) translate(${-camera.x}px, ${-camera.y}px)`,
                        transformOrigin: "center center",
                        opacity: cameraContainerOpacity,
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
                            const fontSize = getFontSize(word);
                            const isWorld = word.text === "APIs"; // Highlight style for main word
                            const fontWeight = isWorld ? 700 : (word.text === "to" || word.text === "of") ? 400 : 500;

                            // Glow effect for impact words
                            const isKeyword = ["Modern", "connect", "APIs"].includes(word.text);
                            const glowIntensity = isKeyword && slideProgress > 0.6
                                ? interpolate(slideProgress, [0.6, 1], [0, 1])
                                : 0;

                            // ===== WORD TRANSFORM =====
                            const wordTransform = `translateX(${slideX}px) scale(${baseScale})`;

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
                                        transform: wordTransform,
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



                {/* ========== OPERATIONAL OVERHEAD SEQUENCES ========== */}
                {/* Replaces Globe with Card Animation */}
                {/* ========== OPERATIONAL OVERHEAD SEQUENCES ========== */}
                {/* Refined Card Sequence: Text -> Zoom -> Burst -> Overwhelm -> Collapse */}
                {(() => {
                    const cardSeqStart = 120;
                    if (frame < cardSeqStart) return null;

                    const localFrame = frame - cardSeqStart;

                    // TIMINGS
                    // 0-70: Typewriter "But managing" (Center Card)
                    // 70-130: Dispersion (Explosion + Scale Up)
                    // 90-180: "Shouldn't be this hard" (Text Reveal)
                    // 180-200: Hold/Drift
                    // 200-240: Collapse

                    // 1. Typewriter Phase
                    const typeProgress = interpolate(localFrame, [0, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                    const cursorBlink = localFrame % 30 < 15 ? 1 : 0;

                    const typingText = "But managing";
                    const currentTyped = typingText.substring(0, Math.round(typeProgress * typingText.length));

                    // Card Disappear (Explode)
                    const centerCardScale = interpolate(localFrame, [60, 70], [1, 1.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInExpo });
                    const centerCardOpacity = interpolate(localFrame, [65, 75], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

                    // 2. Dispersion Phase
                    const disperseProgress = interpolate(localFrame, [70, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutExpo });
                    const cardScale = interpolate(localFrame, [70, 120], [0.2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutBack });

                    // 3. Text Completion Phase
                    const finalTextOpacity = interpolate(localFrame, [90, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

                    // 4. Collapse Phase
                    const collapseProgress = interpolate(localFrame, [200, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOutQuart });

                    // Random Positions (Manually curated to avoid center overlap)
                    // Center is (0,0). Space +/- 250px clear.
                    const dispersedPositions = [
                        { x: -380, y: -220, type: "server", title: "Server Setup" },
                        { x: 380, y: -200, type: "git", title: "Code Maint." },
                        { x: -420, y: 80, type: "keys", title: "Credentials" },
                        { x: 450, y: 120, type: "chart", title: "Observability" },
                        { x: -280, y: 280, type: "logs", title: "Provider Logs" },
                        { x: 320, y: 320, type: "server", title: "Hosting" },
                        { x: 0, y: -350, type: "retry", title: "Retry Logic" },
                        { x: 50, y: 400, type: "error", title: "Error Handling" },
                    ];

                    return (
                        <div style={{ position: "absolute", inset: 0, perspective: 1000 }}>
                            {/* PHASE 1: CENTRAL TYPING CARD */}
                            <div style={{
                                position: "absolute", left: "50%", top: "50%",
                                width: 300, height: 180, marginLeft: -150, marginTop: -90,
                                background: "#0F172A", // Dark terminal slate
                                borderRadius: 12,
                                border: "1px solid rgba(255,255,255,0.15)",
                                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transform: `scale(${centerCardScale})`,
                                opacity: centerCardOpacity,
                                zIndex: 50
                            }}>
                                <span style={{
                                    fontFamily: "'Courier New', monospace",
                                    fontSize: 28,
                                    fontWeight: 700,
                                    color: "#E2E8F0",
                                    letterSpacing: -0.5
                                }}>
                                    {currentTyped}
                                    <span style={{
                                        opacity: cursorBlink,
                                        color: "#10B981",
                                        marginLeft: 2,
                                        display: "inline-block",
                                        width: 12,
                                        height: 24,
                                        background: "#10B981",
                                        verticalAlign: "text-bottom"
                                    }}></span>
                                </span>
                            </div>

                            {/* PHASE 2: DISPERSED CARDS */}
                            {disperseProgress > 0.01 && dispersedPositions.map((pos, i) => {
                                // interpolate position from Center (0,0) to Target (pos.x, pos.y)
                                const currentX = pos.x * disperseProgress;
                                const currentY = pos.y * disperseProgress;

                                // Collapse logic: Move back to center
                                const finalX = currentX * (1 - collapseProgress);
                                const finalY = currentY * (1 - collapseProgress);

                                // Breathing/Drift
                                const driftX = Math.sin(time + i) * 10 * (1 - collapseProgress);
                                const driftY = Math.cos(time + i) * 10 * (1 - collapseProgress);

                                return (
                                    <div key={i} style={{
                                        position: "absolute",
                                        left: "50%", top: "50%",
                                        transform: `translate(${finalX + driftX}px, ${finalY + driftY}px) scale(${cardScale * (1 - collapseProgress * 0.5)})`,
                                        zIndex: 10,
                                        opacity: collapseProgress > 0.95 ? 0 : 1
                                    }}>
                                        <div style={{ marginLeft: -70, marginTop: -45 }}>
                                            <MicroCard type={pos.type as any} title={pos.title} opacity={1} />
                                        </div>
                                    </div>
                                );
                            })}

                            {/* PHASE 3: FINAL TEXT ("shouldn't be this hard") */}

                            {/* Clean Text Overlay in Center void */}
                            <div style={{
                                position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
                                textAlign: "center",
                                opacity: finalTextOpacity * (1 - collapseProgress), // Fade out slightly at end
                                zIndex: 40 // Below blinking card, above dispersed
                            }}>
                                <h2 style={{ fontSize: 42, color: "rgba(255,255,255,0.5)", margin: 0, fontWeight: 400 }}>
                                    But managing
                                </h2>
                                <h2 style={{ fontSize: 56, color: "#FFFF", margin: "10px 0 0 0", fontWeight: 700, textShadow: "0 0 30px rgba(255,255,255,0.3)" }}>
                                    shouldn’t be this hard.
                                </h2>
                            </div>


                            {/* Final Stack Glow (Collapse Impact) */}
                            {collapseProgress > 0.9 && (
                                <div style={{
                                    position: "absolute", left: "50%", top: "50%",
                                    width: 140, height: 90, marginLeft: -70, marginTop: -45,
                                    background: "rgba(255,255,255,0.1)",
                                    boxShadow: "0 0 80px rgba(167,139,250,0.6)",
                                    borderRadius: 8,
                                    opacity: interpolate(collapseProgress, [0.9, 1], [0, 1]),
                                    transform: "scale(1.1)"
                                }} />
                            )}
                        </div>
                    );
                })()}

                {/* ========== SIMPLE VIGNETTE ========== */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(6,6,10,0.8) 100%)",
                        pointerEvents: "none",
                    }}
                />
            </div >
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
    // ============ SCENE 2: FUSEPLANE REVEAL ============
    const renderScene2 = () => {
        const fadeIn = interpolate(frame, [scene2Start, scene2Start + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(frame, [scene2End - 20, scene2End], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: fadeIn * fadeOut }}>
                <div style={{
                    width: 300, height: 180,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 50px rgba(167,139,250,0.15)"
                }}>
                    <span style={{ fontSize: 48, fontWeight: 700, color: "#FFF", letterSpacing: -1 }}>Fuseplane</span>
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
    // Disable global network lines for scene 2 (has its own grid)
    const networkIntensity = currentScene >= 2 && currentScene !== 3 && currentScene !== 2 ? 1 : currentScene === 3 ? 0.15 : 0;

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
