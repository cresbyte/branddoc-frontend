"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

interface SignUpProps {
  onSignIn: () => void;
  onForgot: () => void;
  onSuccess: () => void;
}

export function SignUp({ onSignIn, onForgot, onSuccess }: SignUpProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !password) return;
    setLoading(true);
    setTimeout(onSuccess, 1000);
  };

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 32 }}>Create your account</h1>

      {step === 1 ? (
        <>
          <button style={{
            width: "100%", height: 44, borderRadius: 8, border: "1.2px solid #E5E7EB",
            background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            fontSize: 14, fontWeight: 600, color: "#1F2937", cursor: "pointer", marginBottom: 24
          }}>
            <GoogleIcon /> Sign up with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1.2, background: "#F3F4F6" }} />
            <span style={{ fontSize: 13, color: "#9CA3AF" }}>or</span>
            <div style={{ flex: 1, height: 1.2, background: "#F3F4F6" }} />
          </div>

          <form onSubmit={handleContinue} style={{ textAlign: "left" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Work email"
              autoFocus
              style={{
                width: "100%", height: 44, borderRadius: 8, border: "1.2px solid #E5E7EB",
                padding: "0 14px", fontSize: 14, background: "#fff", marginBottom: 12,
                outline: "none"
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%", height: 44, borderRadius: 8, border: "none",
                background: email ? "#0F172A" : "#94A3B8", color: "#fff",
                fontSize: 14, fontWeight: 600, cursor: email ? "pointer" : "default"
              }}
            >
              Continue
            </button>
            <div style={{ marginTop: 16, textAlign: "center" }}>
                <button 
                    type="button" 
                    onClick={onForgot} 
                    style={{ background: "none", border: "none", color: "#6B7280", fontSize: 13, cursor: "pointer" }}
                >
                    Forgot password?
                </button>
            </div>
          </form>
        </>
      ) : (
        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <div style={{ marginBottom: 20 }}>
             <button 
                onClick={() => setStep(1)} 
                style={{ 
                    background: "none", border: "none", color: "#6B7280", 
                    fontSize: 13, display: "flex", alignItems: "center", gap: 6,
                    padding: 0, cursor: "pointer"
                }}
             >
                <ArrowLeft size={14} /> {email}
             </button>
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            autoFocus
            style={{
              width: "100%", height: 44, borderRadius: 8, border: "1.2px solid #E5E7EB",
              padding: "0 14px", fontSize: 14, background: "#fff", marginBottom: 12,
              outline: "none"
            }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create Password"
            style={{
              width: "100%", height: 44, borderRadius: 8, border: "1.2px solid #E5E7EB",
              padding: "0 14px", fontSize: 14, background: "#fff", marginBottom: 12,
              outline: "none"
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", height: 44, borderRadius: 8, border: "none",
              background: (name && password) ? "#0F172A" : "#94A3B8", color: "#fff",
              fontSize: 14, fontWeight: 600, cursor: (name && password) ? "pointer" : "default"
            }}
          >
            {loading ? "Creating account..." : "Complete Sign Up"}
          </button>
        </form>
      )}

      {step === 1 && (
        <p style={{ marginTop: 24, fontSize: 13.5, color: "#6B7280" }}>
            Already have an account? <span onClick={onSignIn} style={{ color: "#111827", fontWeight: 600, cursor: "pointer" }}>Sign in</span>
        </p>
      )}
    </>
  );
}
