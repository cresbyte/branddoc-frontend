"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string | string[];
}

export const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, error, className, ...props }, ref) => {
    const errorText = Array.isArray(error) ? error[0] : error;

    return (
      <div className="w-full space-y-2 text-left">
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
        <textarea
          ref={ref}
          className={cn(
            "w-full rounded-medium border-[1.5px] bg-white px-3.5 py-3 text-[15px] text-slate-900 transition-all outline-none resize-none",
            error
              ? "border-red-500 focus:ring-4 focus:ring-red-500/5"
              : "border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5",
            "placeholder:text-slate-400",
            className
          )}
          {...props}
        />
        {errorText && (
          <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
            {errorText}
          </p>
        )}
      </div>
    );
  }
);

TextAreaField.displayName = "TextAreaField";
