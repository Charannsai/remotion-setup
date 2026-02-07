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
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#10B981", transform: `rotate(${frame * 8}deg)` }} />
                            <span style={{ fontSize: 13, color: "#10B981", fontWeight: 500 }}>Deploying...</span>
                        </div>
                        <div style={{ height: 6, width: "100%", background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${(frame % 90) * 1.5}%`, background: "#10B981", borderRadius: 3, boxShadow: "0 0 10px rgba(16,185,129,0.5)" }} />
                        </div>
                        <div style={{ fontSize: 11, fontFamily: "Menlo, monospace", color: "#94A3B8" }}>
                            {`> apt-get update && upgrade`}
                        </div>
                    </div>
                );
            case "git":
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2"><circle cx="6" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" /><path d="M6 9v9" /><path d="M6 9a9 9 0 0 1 9-9" /></svg>
                            <span style={{ fontSize: 13, color: "#818CF8", fontWeight: 500 }}>feat/optimize-api</span>
                        </div>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", opacity: 0.7 }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#475569" }} />
                                <div style={{ width: "85%", height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }} />
                            </div>
                        ))}
                    </div>
                );
            case "keys":
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                            <span style={{ fontSize: 13, color: "#FBBF24", fontWeight: 500 }}>Env: Production</span>
                        </div>
                        <div style={{ background: "rgba(0,0,0,0.4)", padding: "8px 10px", borderRadius: 6, fontFamily: "Menlo, monospace", fontSize: 11, color: "#94A3B8", display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFF", boxShadow: "0 0 5px white" }} />
                            sk_live_51Mz...
                        </div>
                    </div>
                );
            case "chart":
                return (
                    <div style={{ position: "relative", height: 50, display: "flex", alignItems: "flex-end", gap: 4 }}>
                        {[0.3, 0.5, 0.8, 0.4, 0.6, 0.9, 0.7, 0.5, 0.8, 0.6].map((h, i) => {
                            const activeH = h + Math.sin(frame * 0.1 + i) * 0.15;
                            return (
                                <div key={i} style={{ flex: 1, height: `${Math.min(activeH * 100, 100)}%`, background: i === 5 ? "#F43F5E" : "#3B82F6", borderRadius: 2, opacity: 0.9 }} />
                            );
                        })}
                    </div>
                );
            case "logs":
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 5, overflow: "hidden", height: 55 }}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} style={{ fontSize: 10, fontFamily: "Menlo, monospace", color: i === 2 ? "#EF4444" : "#64748B", transform: `translateY(-${(frame % 60) * 0.6}px)` }}>
                                {i === 2 ? "[ERR] Connection timeout (504)" : `[INFO] Request id:${1000 + i} processed`}
                            </div>
                        ))}
                    </div>
                );
            default:
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ height: 6, width: "80%", background: "rgba(255,255,255,0.1)", borderRadius: 3 }} />
                        <div style={{ height: 6, width: "60%", background: "rgba(255,255,255,0.1)", borderRadius: 3 }} />
                        <div style={{ height: 6, width: "70%", background: "rgba(255,255,255,0.1)", borderRadius: 3 }} />
                    </div>
                );
        }
    };

    return (
        <div style={{
            width: 240, height: 160,
            background: "linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.98) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: 20,
            display: "flex", flexDirection: "column", gap: 12,
            boxShadow: "0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            opacity
        }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.95)", letterSpacing: "-0.01em", fontFamily: "Inter, sans-serif" }}>
                {title}
            </div>
            {renderContent()}
        </div>
    );
};
