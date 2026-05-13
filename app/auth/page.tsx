"use client";

import React, { useState } from "react";
import { AuthLayout } from "./components/AuthLayout";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { ForgotPassword } from "./components/ForgotPassword";

type AuthState = "signin" | "signup" | "forgot";

export default function AuthPage() {
  const [state, setState] = useState<AuthState>("signin");

  const handleSuccess = () => {
    // Redirect to dashboard on success
    window.location.href = "/dashboard";
  };

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
