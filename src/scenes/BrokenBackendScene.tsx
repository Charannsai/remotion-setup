import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from "remotion";
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import {
    ParallaxBackground,
    PremiumParticles,
    CinematicVignette,
    CameraPush,
    springConfigs,
    GlowOrb,
    LiquidShape,
    BezierLine,
} from "../components/PremiumEffects";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "600", "700", "800"],
    subsets: ["latin"],
});

// Scene 2 — The Broken Backend Reality
// Visual: Messy backend diagram, multiplying servers, cost meter, latency spinner
// Motion: Fluid morphing diagrams, Soft depth-of-field, Parallax camera pan

export const BrokenBackendScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Title animation
    const titleProgress = spring({
        frame,
        fps,
        config: springConfigs.ultraSmooth,
    });

    // Server boxes multiply
    const servers = [
        { x: 25, y: 35, delay: 20 },
        { x: 35, y: 35, delay: 30 },
        { x: 45, y: 35, delay: 40 },
        { x: 55, y: 35, delay: 50 },
        { x: 65, y: 35, delay: 60 },
        { x: 75, y: 35, delay: 70 },
        { x: 30, y: 50, delay: 80 },
        { x: 50, y: 50, delay: 90 },
        { x: 70, y: 50, delay: 100 },
    ];

    // APIs connected
    const apis = [
        { name: "OpenAI", x: 20, y: 70, color: "#10a37f" },
        { name: "Stripe", x: 40, y: 70, color: "#635bff" },
        { name: "Twilio", x: 60, y: 70, color: "#f22f46" },
        { name: "AWS S3", x: 80, y: 70, color: "#ff9900" },
    ];

    // Cost meter animation
    const costProgress = spring({
        frame: frame - 100,
        fps,
        config: springConfigs.gentle,
        durationInFrames: 60,
    });

    const costValue = interpolate(costProgress, [0, 1], [0, 847], {
        extrapolateRight: "clamp",
    });

    // Latency animation
    const latencyRotation = (frame / fps) * 180;

    // Developer frustration
    const devProgress = spring({
        frame: frame - 60,
        fps,
        config: springConfigs.bouncy,
    });

    // Text animations
    const text1Progress = spring({
        frame: frame - 120,
        fps,
        config: springConfigs.ultraSmooth,
    });

    const text2Progress = spring({
        frame: frame - 140,
        fps,
        config: springConfigs.ultraSmooth,
    });

    return (
        <AbsoluteFill style={{ fontFamily }}>
            <ParallaxBackground baseColor="#0a0a12" accentColor="#FF6B35" />
            <PremiumParticles count={40} color="#FF6B35" />

            <CameraPush intensity={0.04} delay={0}>
                {/* Background chaos elements */}
                <LiquidShape size={200} color="#FF6B35" x={15} y={25} delay={10} />
                <LiquidShape size={150} color="#FF4444" x={85} y={30} delay={20} />

                {/* Title */}
                <div
                    style={{
                        position: "absolute",
                        top: 50,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        opacity: titleProgress,
                        transform: `translateY(${interpolate(titleProgress, [0, 1], [-30, 0], { extrapolateRight: "clamp" })}px)`,
                    }}
                >
                    <span style={{ fontSize: 38, fontWeight: 700, color: "#ffffff" }}>
                        The{" "}
                        <span
                            style={{
                                background: "linear-gradient(135deg, #FF6B35 0%, #FF4444 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Broken Backend
                        </span>{" "}
                        Reality
                    </span>
                </div>

                {/* Server chaos visualization */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 120,
                        bottom: 200,
                    }}
                >
                    {/* Connection lines - chaotic */}
                    {servers.slice(0, 5).map((server, i) => (
                        <BezierLine
                            key={`line-${i}`}
                            start={{ x: server.x, y: 25 }}
                            end={{ x: apis[Math.min(i, apis.length - 1)].x, y: 60 }}
                            color="#FF6B35"
                            delay={server.delay + 20}
                            strokeWidth={1.5}
                        />
                    ))}

                    {/* Server boxes */}
                    {servers.map((server, i) => {
                        const serverProgress = spring({
                            frame: frame - server.delay,
                            fps,
                            config: springConfigs.bouncy,
                        });

                        const scale = interpolate(serverProgress, [0, 1], [0, 1], {
                            extrapolateRight: "clamp",
                        });

                        const wobble = Math.sin((frame / fps) * 3 + i) * 3;

                        return (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    left: `${server.x}%`,
                                    top: `${server.y}%`,
                                    transform: `translate(-50%, -50%) scale(${scale}) rotate(${wobble}deg)`,
                                    width: 70,
                                    height: 50,
                                    background: "linear-gradient(180deg, #2a2a3e 0%, #1a1a28 100%)",
                                    borderRadius: 8,
                                    border: "1px solid rgba(255,107,53,0.3)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 4,
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                                }}
                            >
                                <div style={{ fontSize: 16 }}>🖥️</div>
                                <div
                                    style={{
                                        fontSize: 8,
                                        color: "rgba(255,255,255,0.5)",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    server-{i + 1}
                                </div>
                            </div>
                        );
                    })}

                    {/* API boxes */}
                    {apis.map((api, i) => {
                        const apiProgress = spring({
                            frame: frame - 40 - i * 10,
                            fps,
                            config: springConfigs.liquid,
                        });

                        const scale = interpolate(apiProgress, [0, 1], [0.5, 1], {
                            extrapolateRight: "clamp",
                        });

                        return (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    left: `${api.x}%`,
                                    top: `${api.y}%`,
                                    transform: `translate(-50%, -50%) scale(${scale})`,
                                    padding: "10px 20px",
                                    background: `${api.color}20`,
                                    border: `1px solid ${api.color}50`,
                                    borderRadius: 10,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: api.color,
                                        boxShadow: `0 0 10px ${api.color}`,
                                    }}
                                />
                                <span style={{ color: api.color, fontSize: 14, fontWeight: 600 }}>
                                    {api.name}
                                </span>
                            </div>
                        );
                    })}

                    {/* Developer scratching head */}
                    <div
                        style={{
                            position: "absolute",
                            left: 50,
                            top: "50%",
                            transform: `translateY(-50%) scale(${devProgress})`,
                            opacity: devProgress,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 60,
                                filter: "drop-shadow(0 0 20px rgba(255,255,255,0.2))",
                            }}
                        >
                            🤦‍♂️
                        </div>
                    </div>

                    {/* Cost meter */}
                    <div
                        style={{
                            position: "absolute",
                            right: 80,
                            top: 20,
                            opacity: costProgress,
                            transform: `scale(${interpolate(costProgress, [0, 1], [0.8, 1], { extrapolateRight: "clamp" })})`,
                        }}
                    >
                        <div
                            style={{
                                background: "rgba(255,68,68,0.1)",
                                border: "1px solid rgba(255,68,68,0.3)",
                                borderRadius: 12,
                                padding: 20,
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                                MONTHLY COST
                            </div>
                            <div
                                style={{
                                    fontSize: 36,
                                    fontWeight: 800,
                                    color: "#FF4444",
                                    textShadow: "0 0 30px rgba(255,68,68,0.5)",
                                }}
                            >
                                ${Math.floor(costValue)}
                            </div>
                            <div
                                style={{
                                    width: 60,
                                    height: 4,
                                    background: "rgba(255,68,68,0.2)",
                                    borderRadius: 2,
                                    margin: "10px auto 0",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        width: `${(costValue / 847) * 100}%`,
                                        height: "100%",
                                        background: "#FF4444",
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Latency spinner */}
                    <div
                        style={{
                            position: "absolute",
                            right: 80,
                            bottom: 40,
                            opacity: costProgress,
                        }}
                    >
                        <div
                            style={{
                                background: "rgba(255,165,0,0.1)",
                                border: "1px solid rgba(255,165,0,0.3)",
                                borderRadius: 12,
                                padding: 20,
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                                LATENCY
                            </div>
                            <div style={{ position: "relative", width: 50, height: 50, margin: "0 auto" }}>
                                <svg width="50" height="50" viewBox="0 0 50 50">
                                    <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,165,0,0.2)" strokeWidth="4" />
                                    <circle
                                        cx="25"
                                        cy="25"
                                        r="20"
                                        fill="none"
                                        stroke="#FFA500"
                                        strokeWidth="4"
                                        strokeDasharray="40 100"
                                        strokeLinecap="round"
                                        transform={`rotate(${latencyRotation} 25 25)`}
                                    />
                                </svg>
                            </div>
                            <div style={{ fontSize: 14, color: "#FFA500", marginTop: 8, fontWeight: 600 }}>
                                847ms
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom text */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 70,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            fontSize: 28,
                            fontWeight: 600,
                            color: "#ffffff",
                            opacity: text1Progress,
                            transform: `translateY(${interpolate(text1Progress, [0, 1], [20, 0], { extrapolateRight: "clamp" })}px)`,
                            marginBottom: 12,
                        }}
                    >
                        Developers build thin backends{" "}
                        <span style={{ color: "rgba(255,255,255,0.5)" }}>just to hide secrets.</span>
                    </div>
                    <div
                        style={{
                            fontSize: 22,
                            color: "#FF6B35",
                            opacity: text2Progress,
                            transform: `translateY(${interpolate(text2Progress, [0, 1], [20, 0], { extrapolateRight: "clamp" })}px)`,
                        }}
                    >
                        More infra. More bugs. More cost.
                    </div>
                </div>
            </CameraPush>

            <CinematicVignette intensity={0.85} />
        </AbsoluteFill>
    );
};
