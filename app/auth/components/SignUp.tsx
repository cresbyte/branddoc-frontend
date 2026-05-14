"use client";

import React, { useState } from "react";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { registerWithEmail, loginWithGoogle } from "@/lib/auth";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/lib/AuthContext";

interface SignUpProps {
  onSignIn: () => void;
  onForgot: () => void;
  onSuccess: () => void;
}

export function SignUp({ onSignIn, onForgot, onSuccess }: SignUpProps) {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !password) return;
    setLoading(true);
    setError("");
    try {
      const user = await registerWithEmail(email, name, password);
      login(user);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError("");
    try {
      const user = await loginWithGoogle(credentialResponse.credential);
      login(user);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ textAlign: "left", marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0F172A", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Create your account
        </h1>
        <p style={{ color: "#64748B", fontSize: 15 }}>
          Start your 14-day free trial today.
        </p>
      </div>

      {error && (
        <div style={{ 
          padding: "12px 16px", 
          background: "#FEF2F2", 
          border: "1px solid #FEE2E2", 
          borderRadius: 10, 
          color: "#B91C1C", 
          fontSize: 14, 
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
          {error}
        </div>
      )}

      {step === 1 ? (
        <>
          <div style={{ marginBottom: 24 }}>
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => setError("Google sign up failed")}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
              text="signup_with"
              shape="rectangular"
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: "#F1F5F9" }} />
            <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "#F1F5F9" }} />
          </div>

          <form onSubmit={handleContinue} style={{ textAlign: "left" }}>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="email" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 8 }}>
                Work Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  autoFocus
                  style={{
                    width: "100%", height: 48, borderRadius: 10, border: "1.5px solid #E2E8F0",
                    padding: "0 14px 0 44px", fontSize: 15, background: "#fff", transition: "all 0.2s",
                    outline: "none", boxSizing: "border-box", color: "#0F172A"
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = "1.5px solid #0F172A";
                    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(15, 23, 42, 0.05)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = "1.5px solid #E2E8F0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!email}
              style={{
                width: "100%", height: 48, borderRadius: 10, border: "none",
                background: email ? "#0F172A" : "#94A3B8", color: "#fff",
                fontSize: 16, fontWeight: 600, cursor: email ? "pointer" : "default",
                transition: "all 0.2s",
                boxShadow: email ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" : "none"
              }}
            >
              Get started
            </button>
          </form>
        </>
      ) : (
        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <div style={{ marginBottom: 24 }}>
            <button
              type="button"
              onClick={() => { setStep(1); setError(""); }}
              style={{
                background: "rgba(15, 23, 42, 0.05)", border: "none", color: "#475569",
                fontSize: 14, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 8, 
                padding: "6px 12px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(15, 23, 42, 0.08)"}
              onMouseOut={(e) => e.currentTarget.style.background = "rgba(15, 23, 42, 0.05)"}
            >
              <ArrowLeft size={14} /> {email}
            </button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label htmlFor="name" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 8 }}>
              Full Name
            </label>
            <div style={{ position: "relative" }}>
              <User size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                autoFocus
                style={{
                  width: "100%", height: 48, borderRadius: 10, border: "1.5px solid #E2E8F0",
                  padding: "0 14px 0 44px", fontSize: 15, background: "#fff", transition: "all 0.2s",
                  outline: "none", boxSizing: "border-box", color: "#0F172A"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1.5px solid #0F172A";
                  e.currentTarget.style.boxShadow = "0 0 0 4px rgba(15, 23, 42, 0.05)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1.5px solid #E2E8F0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label htmlFor="password" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 8 }}>
              Create Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%", height: 48, borderRadius: 10, border: "1.5px solid #E2E8F0",
                  padding: "0 44px 0 44px", fontSize: 15, background: "#fff", transition: "all 0.2s",
                  outline: "none", boxSizing: "border-box", color: "#0F172A"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1.5px solid #0F172A";
                  e.currentTarget.style.boxShadow = "0 0 0 4px rgba(15, 23, 42, 0.05)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1.5px solid #E2E8F0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", 
                  background: "none", border: "none", color: "#94A3B8", cursor: "pointer", padding: 0,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !name || !password}
            style={{
              width: "100%", height: 48, borderRadius: 10, border: "none",
              background: (name && password) ? "#0F172A" : "#94A3B8", color: "#fff",
              fontSize: 16, fontWeight: 600, cursor: (name && password) ? "pointer" : "default",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              boxShadow: (name && password) ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" : "none"
            }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Complete Sign Up"}
          </button>
          
          <p style={{ marginTop: 16, fontSize: 12, color: "#94A3B8", textAlign: "center", lineHeight: 1.5 }}>
            By creating an account, you agree to our <span style={{ textDecoration: "underline", cursor: "pointer" }}>Terms of Service</span> and <span style={{ textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>.
          </p>
        </form>
      )}

      {step === 1 && (
        <p style={{ marginTop: 32, fontSize: 15, color: "#64748B", textAlign: "center" }}>
          Already have an account?{" "}
          <button 
            onClick={onSignIn} 
            style={{ background: "none", border: "none", color: "#0F172A", fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 15 }}
          >
            Sign in
          </button>
        </p>
      )}
    </div>
  );
}
