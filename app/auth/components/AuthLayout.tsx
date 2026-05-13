"use client";

import React from "react";
import { FileText } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div style={{
      display: "flex", height: "100vh", width: "100vw", overflow: "hidden",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* ── Left Side: Auth Form ── */}
      <div style={{
        flex: "1", background: "#fff", display: "flex", 
        flexDirection: "column", justifyContent: "center", alignItems: "center",
        padding: "40px", position: "relative"
      }}>
        <div style={{ maxWidth: 360, width: "100%", textAlign: "center" }}>
          {/* Logo */}
          <div style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}>
             <div style={{
                width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
                background: "#0F172A", borderRadius: 12
             }}>
                <FileText size={24} color="#fff" />
             </div>
          </div>

          {children}
        </div>

        {/* Footer Links */}
        <div style={{ 
            position: "absolute", bottom: 32, left: 0, right: 0, 
            display: "flex", justifyContent: "center", gap: 24,
            fontSize: 12.5, color: "#9CA3AF", fontWeight: 500
        }}>
            <span style={{ cursor: "pointer" }}>Terms</span>
            <span style={{ cursor: "pointer" }}>Security</span>
            <span style={{ cursor: "pointer" }}>Contact us</span>
        </div>
      </div>

      {/* ── Right Side: Abstract Visuals ── */}
      <div style={{
        flex: "1", background: "#E8F5F5", display: "flex", 
        flexDirection: "column", justifyContent: "center", alignItems: "center",
        padding: "60px", position: "relative", overflow: "hidden"
      }}>
        {/* Abstract floating panels */}
        <div style={{ position: "relative", width: 400, height: 400, transform: "perspective(1000px) rotateX(10deg)" }}>
           {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{
                position: "absolute",
                top: 50 + i * 15,
                left: 50 + i * 40,
                width: 140,
                height: 240,
                background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 100%)",
                borderRadius: 8,
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                border: "1px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(4px)",
                zIndex: i,
                animation: `floatCards ${4 + i * 0.5}s ease-in-out infinite alternate`
              }} />
           ))}
        </div>

        {/* Social Proof */}
        <div style={{ position: "absolute", bottom: 60, width: "100%", textAlign: "center" }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: "#455A64", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 32 }}>Trusted by leading companies</p>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 48, opacity: 0.8 }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: "#1B263B", letterSpacing: "0.05em" }}>BILT</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: "#000", fontFamily: "serif" }}>SoFi</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#2E2E2E", letterSpacing: "0.1em" }}>FIGURE</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#374151" }}>FLEXCAR</span>
            </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes floatCards {
          from { transform: translateY(0) rotate(0deg); }
          to { transform: translateY(-15px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
}
