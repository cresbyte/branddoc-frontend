"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

interface ForgotPasswordProps {
  onBack: () => void;
}

export function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  if (sent) {
    return (
      <>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Check your email</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 32, lineHeight: 1.6 }}>
          We've sent a password reset link to <strong style={{ color: "#111827" }}>{email}</strong>.
        </p>
        <button
          onClick={onBack}
          style={{
            width: "100%", height: 44, borderRadius: 8, border: "none",
            background: "#0F172A", color: "#fff",
            fontSize: 14, fontWeight: 600, cursor: "pointer"
          }}
        >
          Back to sign in
        </button>
      </>
    );
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Reset password</h1>
      <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 32, lineHeight: 1.6 }}>
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Work email"
          style={{
            width: "100%", height: 44, borderRadius: 8, border: "1.2px solid #E5E7EB",
            padding: "0 14px", fontSize: 14, background: "#fff", marginBottom: 16,
            outline: "none"
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%", height: 44, borderRadius: 8, border: "none",
            background: email ? "#0F172A" : "#94A3B8", color: "#fff",
            fontSize: 14, fontWeight: 600, cursor: email ? "pointer" : "default"
          }}
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <div style={{ marginTop: 24 }}>
        <button onClick={onBack} style={{ 
          background: "none", border: "none", color: "#111827", 
          fontSize: 13.5, cursor: "pointer", fontWeight: 600,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6, margin: "0 auto"
        }}>
           <ArrowLeft size={16} /> Back to sign in
        </button>
      </div>
    </>
  );
}
