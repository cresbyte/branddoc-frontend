"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string | string[];
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, error, className, ...props }, ref) => {
    const errorText = Array.isArray(error) ? error[0] : error;

    return (
      <div className="w-full space-y-2 text-left">
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
        <div className="relative group">
          <select
            ref={ref}
            className={cn(
              "w-full h-11 rounded-[10px] border-[1.5px] bg-white px-3.5 pr-10 text-[15px] text-slate-900 transition-all outline-none appearance-none cursor-pointer",
              error
                ? "border-red-500 focus:ring-4 focus:ring-red-500/5"
                : "border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5",
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-slate-900 transition-colors">
            <ChevronDown size={18} />
          </div>
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

SelectField.displayName = "SelectField";
