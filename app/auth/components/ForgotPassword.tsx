"use client";

import React, { useState } from "react";
import { ArrowLeft, Mail, Lock, KeyRound, CheckCircle2, Loader2 } from "lucide-react";
import { sendResetCode, verifyResetCode, resetPassword } from "@/lib/auth";

interface ForgotPasswordProps {
  onBack: () => void;
}

type Step = "email" | "code" | "newPassword" | "done";

export function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await sendResetCode(email);
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      await verifyResetCode(email, code);
      setStep("newPassword");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await resetPassword(email, code, newPassword);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  const inputContainerStyle: React.CSSProperties = {
    marginBottom: 20,
    textAlign: "left"
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 8
  };

  const inputStyle = (isActive: boolean): React.CSSProperties => ({
    width: "100%", height: 48, borderRadius: 10, border: isActive ? "1.5px solid #0F172A" : "1.5px solid #E2E8F0",
    padding: "0 14px 0 44px", fontSize: 15, background: "#fff", transition: "all 0.2s",
    outline: "none", boxSizing: "border-box", color: "#0F172A",
    boxShadow: isActive ? "0 0 0 4px rgba(15, 23, 42, 0.05)" : "none"
  });

  const primaryBtn = (enabled: boolean): React.CSSProperties => ({
    width: "100%", height: 48, borderRadius: 10, border: "none",
    background: enabled ? "#0F172A" : "#94A3B8", color: "#fff",
    fontSize: 16, fontWeight: 600, cursor: enabled ? "pointer" : "default",
    transition: "all 0.2s",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    boxShadow: enabled ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" : "none",
    opacity: loading ? 0.7 : 1,
  });

  if (step === "done") {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ 
          width: 64, height: 64, borderRadius: "50%", background: "#F0FDF4", color: "#16A34A", 
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" 
        }}>
          <CheckCircle2 size={32} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0F172A", marginBottom: 12, letterSpacing: "-0.02em" }}>Password updated!</h1>
        <p style={{ fontSize: 15, color: "#64748B", marginBottom: 32, lineHeight: 1.6 }}>
          Your password has been reset successfully. You can now sign in with your new credentials.
        </p>
        <button onClick={onBack} style={primaryBtn(true)}>Back to sign in</button>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <div style={{ textAlign: "left", marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0F172A", marginBottom: 8, letterSpacing: "-0.02em" }}>
          {step === "email" ? "Reset password" : step === "code" ? "Enter code" : "New password"}
        </h1>
        <p style={{ color: "#64748B", fontSize: 15 }}>
          {step === "email" ? "Enter your email to receive a reset code." : 
           step === "code" ? `We sent a code to ${email}` : 
           "Choose a strong new password."}
        </p>
      </div>

      {error && (
        <div style={{ 
          padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FEE2E2", borderRadius: 10, 
          color: "#B91C1C", fontSize: 14, marginBottom: 24
        }}>
          {error}
        </div>
      )}

      {step === "email" && (
        <form onSubmit={handleSendCode}>
          <div style={inputContainerStyle}>
            <label htmlFor="email" style={labelStyle}>Work Email</label>
            <div style={{ position: "relative" }}>
              <Mail size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                autoFocus
                style={inputStyle(false)}
                onFocus={(e) => {
                  Object.assign(e.currentTarget.style, inputStyle(true));
                }}
                onBlur={(e) => {
                  Object.assign(e.currentTarget.style, inputStyle(false));
                }}
              />
            </div>
          </div>
          <button type="submit" disabled={loading || !email} style={primaryBtn(!!email)}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Send reset code"}
          </button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={handleVerifyCode}>
          <div style={inputContainerStyle}>
            <label htmlFor="code" style={labelStyle}>6-digit code</label>
            <div style={{ position: "relative" }}>
              <KeyRound size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000 000"
                autoFocus
                maxLength={6}
                style={{
                  ...inputStyle(false),
                  fontSize: 20, fontWeight: 700, letterSpacing: "0.2em", paddingLeft: 44
                }}
                onFocus={(e) => {
                   Object.assign(e.currentTarget.style, inputStyle(true));
                   e.currentTarget.style.letterSpacing = "0.2em";
                   e.currentTarget.style.paddingLeft = "44px";
                }}
                onBlur={(e) => {
                  Object.assign(e.currentTarget.style, inputStyle(false));
                  e.currentTarget.style.letterSpacing = "0.2em";
                  e.currentTarget.style.paddingLeft = "44px";
                }}
              />
            </div>
          </div>
          <button type="submit" disabled={loading || code.length !== 6} style={primaryBtn(code.length === 6)}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Verify code"}
          </button>
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <button
              type="button"
              onClick={() => { setStep("email"); setError(""); }}
              style={{ background: "none", border: "none", color: "#64748B", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              Try a different email
            </button>
          </div>
        </form>
      )}

      {step === "newPassword" && (
        <form onSubmit={handleResetPassword}>
          <div style={inputContainerStyle}>
            <label htmlFor="newPassword" style={labelStyle}>New Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                style={inputStyle(false)}
                onFocus={(e) => Object.assign(e.currentTarget.style, inputStyle(true))}
                onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle(false))}
              />
            </div>
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="confirmPassword" style={labelStyle}>Confirm New Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle(false)}
                onFocus={(e) => Object.assign(e.currentTarget.style, inputStyle(true))}
                onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle(false))}
              />
            </div>
          </div>
          <button type="submit" disabled={loading || !newPassword || newPassword !== confirmPassword} style={primaryBtn(!!(newPassword && newPassword === confirmPassword))}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Reset password"}
          </button>
        </form>
      )}

      <div style={{ marginTop: 32, textAlign: "center" }}>
          <button
            onClick={onBack}
            style={{
              background: "none", border: "none", color: "#0F172A",
              fontSize: 14, cursor: "pointer", fontWeight: 700,
              display: "inline-flex", alignItems: "center", gap: 8,
            }}
          >
            <ArrowLeft size={16} /> Back to sign in
          </button>
        </div>

    </div>
  );
}
