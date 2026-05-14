"use client";

import React, { useState } from "react";
import { AuthLayout } from "./components/AuthLayout";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { ForgotPassword } from "./components/ForgotPassword";
import { useAuth } from "@/lib/AuthContext";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type AuthState = "signin" | "signup" | "forgot";

export default function AuthPage() {
  const [state, setState] = useState<AuthState>("signin");
  const { loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  const handleSuccess = () => {
    // Redirect to dashboard on success
    window.location.href = "/dashboard";
  };

  if (loading || user) {
    return (
      <div style={{ height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={40} className="animate-spin" color="#0F172A" />
      </div>
    );
  }

  return (
    <AuthLayout>
      {state === "signin" && (
        <SignIn 
          onSignUp={() => setState("signup")} 
          onForgot={() => setState("forgot")} 
          onSuccess={handleSuccess}
        />
      )}

      {state === "signup" && (
        <SignUp 
          onSignIn={() => setState("signin")} 
          onForgot={() => setState("forgot")}
          onSuccess={handleSuccess}
        />
      )}

      {state === "forgot" && (
        <ForgotPassword 
          onBack={() => setState("signin")} 
        />
      )}
    </AuthLayout>
  );
}
