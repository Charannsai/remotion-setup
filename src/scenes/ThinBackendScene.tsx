import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import {
    ParallaxBackground,
    PremiumParticles,
    CinematicVignette,
    springConfigs,
    GlowOrb,
    LiquidShape,
} from "../components/PremiumEffects";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "600", "700", "800"],
    subsets: ["latin"],
});

// SCENE 2 — THIN BACKEND PAIN
// Visual: Server boxes multiply, infra stacking, cost meter ticking, latency spinner, dev facepalm
// Motion: Parallax camera pan, morphing diagrams, wobbling elements, half-cut UI cards

export const ThinBackendScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Camera sweep pan
    const cameraPanX = interpolate(frame, [0, 180], [100, -100], {
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
    });

    const cameraPanY = interpolate(frame, [0, 180], [-30, 30], {
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
    });

    // Multiplying servers
    const servers = Array.from({ length: 15 }, (_, i) => ({
        x: 15 + (i % 5) * 17,
        y: 30 + Math.floor(i / 5) * 18,
        delay: 15 + i * 6,
    }));

    // Cost meter animation
    const costProgress = spring({
        frame: frame - 40,
        fps,
        config: springConfigs.gentle,
        durationInFrames: 80,
    });

    const costValue = interpolate(costProgress, [0, 1], [0, 2847], {
        extrapolateRight: "clamp",
    });

    // Latency spinner
    const latencyRotation = (frame / fps) * 360;

    // Dev facepalm
    const devProgress = spring({
        frame: frame - 80,
        fps,
        config: springConfigs.bouncy,
    });

    // Infrastructure stack wobble
    const wobblePhase = (frame / fps) * 4;

    // Half-cut cards sliding
    const card1Progress = spring({
        frame: frame - 100,
        fps,
        config: springConfigs.liquid,
    });

    const card2Progress = spring({
        frame: frame - 115,
        fps,
        config: springConfigs.liquid,
    });

    const card3Progress = spring({
        frame: frame - 130,
        fps,
        config: springConfigs.liquid,
    });

    const card4Progress = spring({
        frame: frame - 145,
        fps,
        config: springConfigs.liquid,
    });

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#0a0a15" accentColor="#FF6B35" />
            <PremiumParticles count={35} color="#FF6B35" />

            <GlowOrb x={70} y={30} size={350} color="#FF6B35" delay={10} intensity={0.35} />
            <GlowOrb x={30} y={70} size={300} color="#FF4444" delay={20} intensity={0.25} />

            {/* Decorative liquid shapes for chaos */}
            <LiquidShape size={150} color="#FF6B35" x={10} y={20} delay={30} />
            <LiquidShape size={100} color="#FF4444" x={90} y={80} delay={40} />

            {/* Main container with camera sweep */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) translate(${cameraPanX}px, ${cameraPanY}px)`,
                    width: "100%",
                    height: "100%",
                }}
            >
                {/* Multiplying server boxes */}
                {servers.map((server, i) => {
                    const serverProgress = spring({
                        frame: frame - server.delay,
                        fps,
                        config: { damping: 12, stiffness: 150 },
                    });

                    const scale = interpolate(serverProgress, [0, 1], [0, 1], {
                        extrapolateRight: "clamp",
                    });

                    // Wobble effect
                    const wobbleX = Math.sin(wobblePhase + i * 0.5) * 5;
                    const wobbleY = Math.cos(wobblePhase + i * 0.7) * 3;
                    const wobbleRotation = Math.sin(wobblePhase + i * 0.3) * 5;

                    return (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                left: `${server.x}%`,
                                top: `${server.y}%`,
                                transform: `translate(-50%, -50%) scale(${scale}) translate(${wobbleX}px, ${wobbleY}px) rotate(${wobbleRotation}deg)`,
                                width: 80,
                                height: 60,
                                background: "linear-gradient(180deg, #2a2a3e 0%, #1a1a28 100%)",
                                borderRadius: 8,
                                border: "1px solid rgba(255,107,53,0.3)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 ${20 * scale}px rgba(255,107,53,0.2)`,
                            }}
                        >
                            <div style={{ fontSize: 20 }}>🖥️</div>
                            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                                server-{i + 1}
                            </div>
                        </div>
                    );
                })}

                {/* Cost meter - prominent */}
                <div
                    style={{
                        position: "absolute",
                        right: "8%",
                        top: "15%",
                        transform: `scale(${interpolate(costProgress, [0, 1], [0.5, 1], { extrapolateRight: "clamp" })})`,
                        opacity: costProgress,
                    }}
                >
                    <div
                        style={{
                            background: "linear-gradient(135deg, rgba(255,68,68,0.15) 0%, rgba(255,68,68,0.05) 100%)",
                            border: "1px solid rgba(255,68,68,0.4)",
                            borderRadius: 16,
                            padding: "25px 35px",
                            textAlign: "center",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                        }}
                    >
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 10, letterSpacing: 2 }}>
                            MONTHLY INFRASTRUCTURE
                        </div>
                        <div
                            style={{
                                fontSize: 52,
                                fontWeight: 800,
                                color: "#FF4444",
                                textShadow: "0 0 40px rgba(255,68,68,0.6)",
                            }}
                        >
                            ${Math.floor(costValue).toLocaleString()}
                        </div>
                        <div
                            style={{
                                width: "100%",
                                height: 6,
                                background: "rgba(255,68,68,0.2)",
                                borderRadius: 3,
                                marginTop: 15,
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    width: `${(costValue / 2847) * 100}%`,
                                    height: "100%",
                                    background: "linear-gradient(90deg, #FF6B35, #FF4444)",
                                    boxShadow: "0 0 15px rgba(255,68,68,0.8)",
                                }}
                            />
                        </div>
                        <div style={{ fontSize: 10, color: "#FF4444", marginTop: 8 }}>
                            ↑ 340% over budget
                        </div>
                    </div>
                </div>

                {/* Latency spinner */}
                <div
                    style={{
                        position: "absolute",
                        right: "8%",
                        top: "55%",
                        opacity: costProgress,
                    }}
                >
                    <div
                        style={{
                            background: "rgba(255,165,0,0.1)",
                            border: "1px solid rgba(255,165,0,0.4)",
                            borderRadius: 16,
                            padding: 20,
                            textAlign: "center",
                        }}
                    >
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 10, letterSpacing: 2 }}>
                            AVG LATENCY
                        </div>
                        <div style={{ position: "relative", width: 70, height: 70, margin: "0 auto" }}>
                            <svg width="70" height="70" viewBox="0 0 70 70">
                                <circle cx="35" cy="35" r="30" fill="none" stroke="rgba(255,165,0,0.2)" strokeWidth="5" />
                                <circle
                                    cx="35"
                                    cy="35"
                                    r="30"
                                    fill="none"
                                    stroke="#FFA500"
                                    strokeWidth="5"
                                    strokeDasharray="60 140"
                                    strokeLinecap="round"
                                    transform={`rotate(${latencyRotation} 35 35)`}
                                    style={{ filter: "drop-shadow(0 0 6px #FFA500)" }}
                                />
                            </svg>
                        </div>
                        <div style={{ fontSize: 24, color: "#FFA500", marginTop: 10, fontWeight: 700 }}>
                            1,247ms
                        </div>
                    </div>
                </div>

                {/* Dev facepalm */}
                <div
                    style={{
                        position: "absolute",
                        left: "10%",
                        bottom: "20%",
                        transform: `scale(${devProgress}) rotate(${interpolate(devProgress, [0, 1], [-20, 0], { extrapolateRight: "clamp" })}deg)`,
                        opacity: devProgress,
                    }}
                >
                    <div style={{ fontSize: 100, filter: "drop-shadow(0 0 30px rgba(255,255,255,0.2))" }}>
                        🤦‍♂️
                    </div>
                </div>
            </div>

            {/* Half-cut kinetic text cards */}
            <div
                style={{
                    position: "absolute",
                    bottom: 50,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    gap: 20,
                    overflow: "hidden",
                }}
            >
                {[
                    { text: "Thin backends.", progress: card1Progress, color: "#FF6B35" },
                    { text: "More infra.", progress: card2Progress, color: "#FFA500" },
                    { text: "More bugs.", progress: card3Progress, color: "#FF4444" },
                    { text: "More cost.", progress: card4Progress, color: "#FF0000" },
                ].map((card, i) => (
                    <div
                        key={i}
                        style={{
                            transform: `translateY(${interpolate(card.progress, [0, 1], [150, 0], { extrapolateRight: "clamp" })}px) rotate(${interpolate(card.progress, [0, 1], [10, 0], { extrapolateRight: "clamp" })}deg)`,
                            opacity: card.progress,
                            padding: "15px 30px",
                            background: `linear-gradient(135deg, ${card.color}20 0%, ${card.color}05 100%)`,
                            border: `2px solid ${card.color}50`,
                            borderRadius: 12,
                            // Half-cut effect - clip at bottom
                            clipPath: `inset(0 0 ${interpolate(card.progress, [0, 0.5, 1], [50, 20, 0])}% 0)`,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 26,
                                fontWeight: 700,
                                color: card.color,
                                textShadow: `0 0 20px ${card.color}60`,
                            }}
                        >
                            {card.text}
                        </span>
                    </div>
                ))}
            </div>

            <CinematicVignette intensity={0.85} />
        </AbsoluteFill>
    );
};
