"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name ?? label;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-xl border bg-ink-800 px-4 py-3 text-sm text-white
            placeholder:text-white/30 outline-none transition-all duration-150
            focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20
            disabled:opacity-40
            ${error ? "border-red-500/50" : "border-white/10"}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs font-semibold text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
