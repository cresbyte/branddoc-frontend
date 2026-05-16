"use client";

import React, { useState } from "react";
import { ArrowLeft, Mail, Lock, KeyRound, CheckCircle2 } from "lucide-react";
import { sendResetCode, verifyResetCode, resetPassword } from "@/lib/auth";
import { TextField } from "@/components/DesignSystem/TextField";
import { Button } from "@/components/DesignSystem/Button";

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

  if (step === "done") {
    return (
      <div className="text-center animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Password updated!</h1>
        <p className="text-slate-500 text-base mb-8 leading-relaxed">
          Your password has been reset successfully. You can now sign in with your new credentials.
        </p>
        <Button onClick={onBack} className="w-full">Back to sign in</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto animate-in fade-in duration-500">
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight line-clamp-1">
          {step === "email" ? "Reset password" : step === "code" ? "Enter code" : "New password"}
        </h1>
        <p className="text-slate-500 text-base">
          {step === "email" ? "Enter your email to receive a reset code." : 
           step === "code" ? `We sent a code to ${email}` : 
           "Choose a strong new password."}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-[10px] text-red-600 text-sm mb-6 flex items-center gap-3">
          {error}
        </div>
      )}

      {step === "email" && (
        <form onSubmit={handleSendCode} className="space-y-6">
          <TextField
            label="Work Email"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            autoFocus
            required
          />
          <Button type="submit" loading={loading} disabled={!email} className="w-full">
            Send reset code
          </Button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={handleVerifyCode} className="space-y-6">
          <TextField
            label="6-digit code"
            type="text"
            icon={KeyRound}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000 000"
            autoFocus
            maxLength={6}
            className="text-center text-xl font-bold tracking-[0.3em]"
            required
          />
          <Button type="submit" loading={loading} disabled={code.length !== 6} className="w-full">
            Verify code
          </Button>
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => { setStep("email"); setError(""); }}
              className="text-slate-500 text-sm font-semibold hover:text-slate-900 transition-colors"
            >
              Try a different email
            </button>
          </div>
        </form>
      )}

      {step === "newPassword" && (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <TextField
            label="New Password"
            type="password"
            icon={Lock}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            autoFocus
            required
          />
          <TextField
            label="Confirm New Password"
            type="password"
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button type="submit" loading={loading} disabled={!newPassword || newPassword !== confirmPassword} className="w-full">
            Reset password
          </Button>
        </form>
      )}

      <div className="mt-8 text-center border-t border-slate-100 pt-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-900 font-bold hover:gap-3 transition-all"
          >
            <ArrowLeft size={16} /> Back to sign in
          </button>
        </div>

    </div>
  );
}
