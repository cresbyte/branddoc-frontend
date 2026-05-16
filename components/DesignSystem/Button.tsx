"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[10px] text-sm font-semibold transition-all focus:outline-none focus:ring-4 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm focus:ring-slate-900/10",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-100",
        success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm focus:ring-emerald-600/10",
        error: "bg-red-600 text-white hover:bg-red-700 shadow-sm focus:ring-red-600/10",
        ghost: "text-slate-600 hover:bg-slate-100",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-13 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: LucideIcon;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, icon: Icon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : Icon && <Icon size={18} />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
