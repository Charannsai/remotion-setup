import React from "react";
import { useCurrentFrame } from "remotion";

type CardType = "server" | "git" | "keys" | "chart" | "logs" | "error" | "retry" | "hosting";

export const MicroCard: React.FC<{
    type: CardType;
    title: string;
    opacity: number;
}> = ({ type, title, opacity }) => {
    const frame = useCurrentFrame();

    const renderContent = () => {
        switch (type) {
            case "server":
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#10B981", transform: `rotate(${frame * 10}deg)` }} />
                            <span style={{ fontSize: 10, color: "#10B981" }}>Deploying...</span>
                        </div>
                        <div style={{ height: 4, width: "60%", background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
                            <div style={{ height: "100%", width: `${(frame % 60) * 1.6}%`, background: "#10B981", borderRadius: 2 }} />
                        </div>
                        <div style={{ fontSize: 8, fontFamily: "monospace", color: "#666" }}>
                            {`> apt-get update`}
                        </div>
                    </div>
                );
            case "git":
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2"><circle cx="6" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" /><path d="M6 9v9" /><path d="M6 9a9 9 0 0 1 9-9" /></svg>
                            <span style={{ fontSize: 10, color: "#6366F1" }}>main</span>
                        </div>
                        {[1, 2].map(i => (
                            <div key={i} style={{ display: "flex", gap: 4, alignItems: "center", opacity: 0.6 }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#666" }} />
                                <div style={{ width: "80%", height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 1 }} />
                            </div>
                        ))}
                    </div>
                );
            case "keys":
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                            <span style={{ fontSize: 10, color: "#F59E0B" }}>Env: Prod</span>
                        </div>
                        <div style={{ background: "rgba(0,0,0,0.3)", padding: "4px 6px", borderRadius: 4, fontFamily: "monospace", fontSize: 10, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#FFF" }} />
                            ********
                        </div>
                    </div>
                );
            case "chart":
                return (
                    <div style={{ position: "relative", height: 30, display: "flex", alignItems: "flex-end", gap: 2 }}>
                        {[0.3, 0.5, 0.8, 0.4, 0.6, 0.9, 0.7].map((h, i) => {
                            const activeH = h + Math.sin(frame * 0.1 + i) * 0.1;
                            return (
                                <div key={i} style={{ width: 4, height: `${activeH * 100}%`, background: "#3B82F6", borderRadius: 1, opacity: 0.8 }} />
                            );
                        })}
                    </div>
                );
            case "logs":
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 3, overflow: "hidden", height: 32 }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{ fontSize: 7, fontFamily: "monospace", color: i === 2 ? "#EF4444" : "#666", transform: `translateY(-${(frame % 40) * 0.5}px)` }}>
                                {i === 2 ? "[ERR] Connection timeout" : `[INFO] Request id:${1000 + i}`}
                            </div>
                        ))}
                    </div>
                );
            default:
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ height: 4, width: "80%", background: "rgba(255,255,255,0.1)", borderRadius: 2 }} />
                        <div style={{ height: 4, width: "60%", background: "rgba(255,255,255,0.1)", borderRadius: 2 }} />
                    </div>
                );
        }
    };

    return (
        <div style={{
            width: 140, height: 90,
            background: "linear-gradient(135deg, rgba(25,25,30,0.9) 0%, rgba(15,15,20,0.95) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            padding: 12,
            display: "flex", flexDirection: "column", gap: 8,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.03)",
            opacity
        }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.9)", letterSpacing: "0.02em" }}>
                {title}
            </div>
            {renderContent()}
        </div>
    );
};
