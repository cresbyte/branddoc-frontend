"use client";

import React from "react";
import { FileText, Shield, Zap, Globe } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div style={{
      display: "flex", 
      height: "100vh", 
      width: "100vw", 
      overflow: "hidden",
      background: "#fff",
      fontFamily: "var(--font-sans), system-ui, sans-serif",
    }}>
      {/* ── Left Side: Auth Form ── */}
      <div style={{
        flex: "1", 
        display: "flex",
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center",
        padding: "40px", 
        position: "relative",
        zIndex: 10,
        boxShadow: "20px 0 50px rgba(0,0,0,0.02)",
      }}>
        <div style={{ maxWidth: 400, width: "100%" }}>
          {/* Logo */}
          <div style={{ marginBottom: 40, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, #0F172A 0%, #334155 100%)", 
              borderRadius: 10,
              boxShadow: "0 10px 20px rgba(15, 23, 42, 0.15)",
            }}>
              <FileText size={20} color="#fff" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.02em" }}>11docs</span>
          </div>

          <div style={{
            animation: "fadeIn 0.5s ease-out forwards",
          }}>
            {children}
          </div>
        </div>

        {/* Footer Links */}
        <div style={{
          position: "absolute", bottom: 40, left: 0, right: 0,
          display: "flex", justifyContent: "center", gap: 32,
          fontSize: 13, color: "#94A3B8", fontWeight: 500,
        }}>
          <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "#0F172A"} onMouseOut={(e) => e.currentTarget.style.color = "#94A3B8"}>Help Center</span>
          <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "#0F172A"} onMouseOut={(e) => e.currentTarget.style.color = "#94A3B8"}>Privacy</span>
          <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "#0F172A"} onMouseOut={(e) => e.currentTarget.style.color = "#94A3B8"}>Terms</span>
        </div>
      </div>

      {/* ── Right Side: Premium Visuals ── */}
      <div style={{
        flex: "1.2", 
        background: "#0F172A", 
        display: "flex",
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center",
        padding: "80px", 
        position: "relative", 
        overflow: "hidden",
      }}>
        {/* Animated Mesh Gradients */}
        <div style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "80%",
          height: "80%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)",
          filter: "blur(60px)",
          animation: "pulse 8s infinite alternate",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: "70%",
          height: "70%",
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0) 70%)",
          filter: "blur(60px)",
          animation: "pulse 10s infinite alternate-reverse",
        }} />

        <div style={{ position: "relative", zIndex: 5, maxWidth: 480 }}>
          <h2 style={{ 
            fontSize: 40, 
            fontWeight: 800, 
            color: "#F8FAFC", 
            lineHeight: 1.1, 
            marginBottom: 24,
            letterSpacing: "-0.03em"
          }}>
            Generate documents <span style={{ color: "#38BDF8" }}>instantly</span> with AI.
          </h2>
          <p style={{ fontSize: 18, color: "#94A3B8", lineHeight: 1.6, marginBottom: 48 }}>
            Streamline your workflow with our advanced document processing engine. Trusted by over 10,000 teams worldwide.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
             <Feature item={{ icon: <Shield size={20} />, title: "Secure by Design", desc: "Enterprise-grade encryption for all your data." }} />
             <Feature item={{ icon: <Zap size={20} />, title: "Lightning Fast", desc: "Get results in milliseconds, not minutes." }} />
             <Feature item={{ icon: <Globe size={20} />, title: "Global Scale", desc: "Deploy your documents anywhere in the world." }} />
          </div>
        </div>

        {/* Abstract Floating Elements */}
        <div style={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: 120,
          height: 160,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          backdropFilter: "blur(10px)",
          transform: "rotate(15deg)",
          animation: "float 6s ease-in-out infinite",
        }} />
        
        <div style={{
          position: "absolute",
          bottom: "15%",
          left: "5%",
          width: 180,
          height: 120,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 16,
          backdropFilter: "blur(5px)",
          transform: "rotate(-10deg)",
          animation: "float 8s ease-in-out infinite reverse",
        }} />

        <div style={{ position: "absolute", bottom: 60, left: 80, display: "flex", gap: 40, opacity: 0.4 }}>
           <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>STRIPE</span>
           <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>VERCEL</span>
           <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>AIRBNB</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          from { opacity: 0.5; transform: scale(1); }
          to   { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(15deg); }
          50% { transform: translateY(-20px) rotate(18deg); }
        }
      `}</style>
    </div>
  );
}

function Feature({ item }: { item: { icon: React.ReactNode, title: string, desc: string } }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ 
        width: 40, 
        height: 40, 
        borderRadius: 10, 
        background: "rgba(56, 189, 248, 0.1)", 
        color: "#38BDF8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {item.icon}
      </div>
      <div>
        <h4 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{item.title}</h4>
        <p style={{ color: "#64748B", fontSize: 13, lineHeight: 1.4 }}>{item.desc}</p>
      </div>
    </div>
  );
}
