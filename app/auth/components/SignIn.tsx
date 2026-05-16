"use client";

import React, { useState } from "react";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginWithEmail, loginWithGoogle } from "@/lib/auth";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/lib/AuthContext";
import { TextField } from "@/components/DesignSystem/TextField";
import { Button } from "@/components/DesignSystem/Button";

interface SignInProps {
  onSignUp: () => void;
  onForgot: () => void;
  onSuccess: () => void;
}

export function SignIn({ onSignUp, onForgot, onSuccess }: SignInProps) {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
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
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const user = await loginWithEmail(email, password);
      login(user);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
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
      setError(err instanceof Error ? err.message : "Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto animate-in fade-in duration-500">
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          Welcome back
        </h1>
        <p className="text-slate-500 text-base">
          Enter your details to access your account.
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
              onError={() => setError("Google sign in failed")}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
              text="continue_with"
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
              label="Email Address"
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
              Continue
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
            <div className="relative">
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 bottom-3 text-slate-400 hover:text-slate-900 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <div className="flex justify-end mt-2">
                <button
                    type="button"
                    onClick={onForgot}
                    className="text-xs font-bold text-slate-900 hover:underline"
                >
                    Forgot password?
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              loading={loading}
              disabled={!password}
              className="w-full"
            >
              Sign in
            </Button>
          </div>
        </form>
      )}

      {step === 1 && (
        <p className="mt-8 text-center text-slate-500 text-[15px]">
          Don't have an account?{" "}
          <button 
            onClick={onSignUp} 
            className="text-slate-900 font-bold hover:underline"
          >
            Sign up for free
          </button>
        </p>
      )}
    </div>
  );
}
