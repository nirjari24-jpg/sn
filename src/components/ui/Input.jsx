import React from "react";
import clsx from "clsx";

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  className,
  required = false,
  ...props
}) {
  return (
    <div className={clsx("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
          {label} {required && <span className="text-violet-400">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={clsx(
          "w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-gray-500 transition-all duration-300 outline-hidden focus:bg-white/10",
          error
            ? "border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
            : "border-white/10 focus:border-violet-500/50 focus:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
        )}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400 pl-1 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
}
