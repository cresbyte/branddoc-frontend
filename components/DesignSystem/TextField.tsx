"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | string[];
  icon?: LucideIcon;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, icon: Icon, className, ...props }, ref) => {
    const errorText = Array.isArray(error) ? error[0] : error;

    return (
      <div className="w-full space-y-2 text-left">
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
        <div className="relative group">
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
              <Icon size={18} />
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full h-11 rounded-medium border-[1.5px] bg-white px-3.5 text-[15px] text-slate-900 transition-all outline-none",
              Icon ? "pl-11" : "pl-3.5",
              error
                ? "border-red-500 focus:ring-4 focus:ring-red-500/5"
                : "border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5",
              "placeholder:text-slate-400",
              className
            )}
            {...props}
          />
        </div>
        {errorText && (
          <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
            {errorText}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
