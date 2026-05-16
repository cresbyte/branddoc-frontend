"use client";

import React, { useState } from "react";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { registerWithEmail, loginWithGoogle } from "@/lib/auth";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/lib/AuthContext";
import { TextField } from "@/components/DesignSystem/TextField";
import { Button } from "@/components/DesignSystem/Button";

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
    <div className="w-full max-w-sm mx-auto animate-in fade-in duration-500">
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          Create your account
        </h1>
        <p className="text-slate-500 text-base">
          Start your 14-day free trial today.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-[10px] text-red-600 text-sm mb-6 flex items-center gap-3 animate-in shake-in duration-300">
          {error}
        </div>
      )}

      {step === 1 ? (
        <div className="space-y-6">
          <div className="w-full overflow-hidden rounded-[10px] border border-slate-200">
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

          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <form onSubmit={handleContinue} className="space-y-5">
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
            <Button
              type="submit"
              disabled={!email}
              className="w-full"
            >
              Get started
            </Button>
          </form>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div>
            <button
              type="button"
              onClick={() => { setStep(1); setError(""); }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100/50 hover:bg-slate-100 rounded-lg text-slate-600 text-sm font-medium transition-colors"
            >
              <ArrowLeft size={14} /> {email}
            </button>
          </div>

          <div className="space-y-5">
            <TextField
              label="Full Name"
              type="text"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              autoFocus
              required
            />

            <div className="relative">
              <TextField
                label="Create Password"
                type={showPassword ? "text" : "password"}
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 bottom-3 text-slate-400 hover:text-slate-900 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={!name || !password}
              className="w-full"
            >
              Complete Sign Up
            </Button>

            <p className="px-4 text-[11px] text-slate-400 text-center leading-relaxed font-medium">
              By creating an account, you agree to our{" "}
              <button type="button" className="underline hover:text-slate-600">Terms</button>{" "}
              and{" "}
              <button type="button" className="underline hover:text-slate-600">Privacy Policy</button>.
            </p>
          </div>
        </form>
      )}

      {step === 1 && (
        <p className="mt-10 text-center text-slate-500 text-[15px]">
          Already have an account?{" "}
          <button 
            onClick={onSignIn} 
            className="text-slate-900 font-bold hover:underline"
          >
            Sign in
          </button>
        </p>
      )}
    </div>
  );
}
