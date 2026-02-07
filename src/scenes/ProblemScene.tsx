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


export const ProblemScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();
    const time = frame / fps;

    // ============ SCENE TIMING ============
    const scene1End = 420;  // Extended for Refined Card Sequence
    const scene2Start = 420;
    const scene2End = 540;
    const scene3Start = 540;
    const scene3End = 660;
    const scene4Start = 660;
    const scene4End = 860;
    const scene5Start = 860;
    const scene5End = 1080;

    const currentScene =
        frame < scene1End ? 1 :
            frame < scene2End ? 2 :
                frame < scene3End ? 3 :
                    frame < scene4End ? 4 : 5;

    // ============ WORD LAYOUT WITH RHYTHM ============
    // Variable timing: Hold → Slide → Lock → Micro pause

    const words = [
        // Row 1: "Modern Softwares Connect to" (Left -> Right)
        { text: "Modern", startFrame: 15, x: 0, y: 0, width: 210, holdExtra: 10 },
        { text: "Softwares", startFrame: 35, x: 220, y: 0, width: 270, holdExtra: 0 },
        { text: "Connect", startFrame: 55, x: 500, y: 0, width: 220, holdExtra: 0 },
        { text: "to", startFrame: 75, x: 730, y: 0, width: 60, holdExtra: 0 },

        // Row 2: "Dozens of" (Right -> Left Flow)
        // "Dozens" appears first (on the right)
        { text: "Dozens", startFrame: 90, x: 700, y: 120, width: 200, holdExtra: 0 },
        // "of" appears second (to the left of Dozens)
        { text: "of", startFrame: 105, x: 600, y: 120, width: 70, holdExtra: 0 },

        // Row 3: "APIs" (Left aligned relative to 'of')
        { text: "APIs", startFrame: 120, x: 600, y: 240, width: 180, holdExtra: 30 },
    ];

    // ============ CAMERA MOTION - GLIDING ON RAILS ============

    const getCameraMotion = () => {
        // Build keyframes with micro pauses (breathing room)
        const keyframes = [
            { frame: 0, x: 0, y: 0, z: 0 },
            { frame: 15, x: 0, y: 0, z: 0 },         // Hold Modern
            { frame: 35, x: 220, y: 0, z: 2 },       // Slide to Softwares
            { frame: 55, x: 500, y: 0, z: 0 },       // Slide to Connect
            { frame: 75, x: 730, y: 0, z: 2 },       // Slide to to

            // REVERSE MOTION for Row 2
            { frame: 90, x: 700, y: 120, z: 3 },     // Down/Left to Dozens (Right side)
            { frame: 105, x: 600, y: 120, z: 2 },    // Slide LEFT to of

            { frame: 120, x: 600, y: 240, z: 4 },    // Down to APIs
            { frame: 160, x: 600, y: 240, z: 0 },    // Lock
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
            const transitionStart = nextWord.startFrame - 15;
            const transitionEnd = nextWord.startFrame;

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
        // Fast lateral wipe transition (Right to Left camera pan effect)
        // At scene1End, the camera whips to the left, effectively sliding Scene 1 out to the right.
        const wipeProgress = interpolate(frame, [scene1End - 15, scene1End], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOutQuart });
        const sceneTranslateX = interpolate(wipeProgress, [0, 1], [0, -2000]); // Move scene wildly to the left
        const sceneOpacity = interpolate(wipeProgress, [0.8, 1], [1, 0]); // Fade out only at the very end of the wipe

        // Hide camera container as text drops (Legacy Logic check: adjust timings slightly earlier to match wipe?)
        // The text drop happens intra-scene, but the scene wipe is inter-scene.
        const cameraContainerOpacity = interpolate(
            frame,
            [120, 140],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
            <div style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                transform: `translateX(${sceneTranslateX}px)`,
                opacity: sceneOpacity,
                overflow: "hidden",
                background: "#05070F"
            }}>

                {/* ========== CINEMATIC BACKGROUND ========== */}
                {/* 1. Base Gradient: Deep Navy to Black */}
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        background: "radial-gradient(circle at 50% 50%, rgba(10, 25, 47, 0.4) 0%, rgba(5, 7, 15, 0) 70%)",
                    }}
                />

                {/* 2. Noise Overlay (Grain) */}
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        opacity: 0.03,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        pointerEvents: "none",
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
                {/* Refined Card Sequence: Text -> Zoom -> Burst -> Overwhelm -> Collapse */}
                {(() => {
                    const cardSeqStart = 150;
                    if (frame < cardSeqStart) return null;

                    const localFrame = frame - cardSeqStart;


                    // == 1. Camera Motion (Macro -> Wide) ==
                    // Start VERY close (Macro) on the text start position
                    // Ease out to full view
                    const zoomProgress = interpolate(localFrame, [50, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOutQuart });

                    // Combined motion variables
                    const cardScale = interpolate(zoomProgress, [0, 1], [2.2, 1.0]);
                    const cardTranslateX = interpolate(zoomProgress, [0, 1], [350, 0]);
                    const cardTranslateY = interpolate(zoomProgress, [0, 1], [80, 0]);
                    const cardRotateY = interpolate(zoomProgress, [0, 1], [-15, 0]);
                    const cardRotateX = interpolate(zoomProgress, [0, 1], [5, 0]);







                    // Legacy variable bridge (to avoid breaking JSX before update)
                    const globalScale = 1;
                    const translateX = cardTranslateX;
                    const translateY = cardTranslateY;
                    const rotateX = cardRotateX;
                    const rotateY = cardRotateY;
                    const entryScale = cardScale;


                    // == 2. Continuous Typewriter Logic ==
                    const fullText = "But Managing Integrations shouldn't be this hard.";

                    // Continuous typing from macro view (frame 0) through zoom out
                    const typeProgress = interpolate(localFrame, [0, 140], [0, fullText.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.linear });
                    const charIndex = Math.round(typeProgress);
                    const displayText = fullText.substring(0, charIndex);


                    const cursorBlink = localFrame % 35 < 18 ? 1 : 0;

                    // == 3. Dispersion Logic ==
                    const disperseProgress = interpolate(localFrame, [60, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutExpo });

                    // Collapse Phase (Fade out at end)
                    const collapseProgress = interpolate(localFrame, [200, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOutQuart });

                    // Premium Ring Layout for Dispersion
                    const dispersedPositions = [
                        { x: -450, y: -200, type: "server", title: "Server Setup" },
                        { x: 450, y: -200, type: "git", title: "Version Control" },
                        { x: -450, y: 200, type: "keys", title: "API Credentials" },
                        { x: 450, y: 200, type: "chart", title: "Observability" },
                        { x: 0, y: -380, type: "hosting", title: "Cloud Hosting" },
                        { x: 0, y: 380, type: "logs", title: "Active Logs" },
                        { x: -700, y: 0, type: "retry", title: "Retry Logic" },
                        { x: 700, y: 0, type: "error", title: "Error Boundaries" },
                    ];

                    return (
                        <div style={{
                            position: "absolute", inset: 0,
                            perspective: 2000, // Deep perspective
                            transform: `scale(${globalScale})`,
                            transformOrigin: "center center"
                        }}>

                            {/* PHASE 1: THE GLASSMORPHIC CARD */}
                            <div style={{
                                position: "absolute", left: "50%", top: "50%",
                                width: 540, height: 320, marginLeft: -270, marginTop: -160,
                                transform: `
                                    translateX(${translateX}px) 
                                    translateY(${translateY}px) 
                                    rotateX(${rotateX}deg) 
                                    rotateY(${rotateY}deg) 
                                    scale(${entryScale * (1 - disperseProgress * 0.2)})
                                `,
                                opacity: collapseProgress > 0.95 ? 0 : 1,
                                zIndex: 50,
                                transformStyle: "preserve-3d",
                            }}>
                                {/* Card Body */}
                                <div style={{
                                    width: "100%", height: "100%",
                                    borderRadius: 30,
                                    background: "rgba(255, 255, 255, 0.03)", // Lighter, cleaner glass
                                    backdropFilter: "blur(40px) saturate(120%)", // Crisp blur
                                    border: "1px solid rgba(255, 255, 255, 0.1)", // Crisper border
                                    boxShadow: `
                                        0 40px 80px -20px rgba(0,0,0,0.5), 
                                        0 0 0 1px rgba(255,255,255,0.05) inset
                                    `,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    overflow: "hidden",
                                    position: "relative"
                                }}>
                                    {/* Shimmer Effect */}
                                    <div style={{
                                        position: "absolute",
                                        top: 0, left: "-100%",
                                        width: "200%", height: "100%",
                                        background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 55%, transparent 60%)",
                                        transform: `translateX(${interpolate(localFrame, [0, 150], [0, 100], { extrapolateRight: "clamp" })}%)`,
                                        pointerEvents: "none"
                                    }} />
                                    {/* Inner Gradient Soft Touch */}
                                    <div style={{
                                        position: "absolute", inset: 0,
                                        background: "radial-gradient(circle at 10% 10%, rgba(255,255,255,0.03), transparent 60%)",
                                        pointerEvents: "none"
                                    }} />

                                    <div style={{ padding: 48, width: "100%", textAlign: "left", position: "relative", zIndex: 2 }}>
                                        <span style={{
                                            fontFamily,
                                            fontSize: 54, // Larger
                                            fontWeight: 600, // 600-700
                                            color: "rgba(255, 255, 255, 0.95)", // 95% opacity
                                            letterSpacing: "-0.04em", // Tightened
                                            lineHeight: 1.15,
                                            display: "inline",
                                        }}>
                                            {displayText}
                                            <span style={{
                                                opacity: cursorBlink,
                                                color: "#60A5FA", // Soft blue
                                                marginLeft: 4,
                                                display: "inline-block",
                                                width: 4,
                                                height: 54,
                                                background: "#60A5FA",
                                                verticalAlign: "bottom",
                                                borderRadius: 2,
                                                boxShadow: "0 0 12px rgba(96, 165, 250, 0.6)"
                                            }}></span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* PHASE 2: DISPERSED CARDS */}
                            {disperseProgress > 0.01 && dispersedPositions.map((pos, i) => {
                                const currentX = pos.x * disperseProgress;
                                const currentY = pos.y * disperseProgress;
                                const scale = interpolate(localFrame, [60, 90 + i * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutBack });

                                return (
                                    <div key={i} style={{
                                        position: "absolute",
                                        left: "50%", top: "50%",
                                        transform: `translate(${currentX}px, ${currentY}px) scale(${scale * (1 - collapseProgress)})`,
                                        zIndex: 10,
                                        opacity: collapseProgress > 0.9 ? 0 : 1
                                    }}>
                                        <div style={{ marginLeft: -120, marginTop: -80 }}>
                                            <MicroCard type={pos.type as any} title={pos.title} opacity={1} />
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    );
                })()}

                {/* ========== SIMPLE VIGNETTE ========== */}
                {/* ========== REMOVED VIGNETTE FOR CLEAN AESTHETIC ========== */}
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
