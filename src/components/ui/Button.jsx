import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary", // primary, secondary, glow, outline, danger
  className,
  disabled = false,
  ...props
}) {
  const baseStyles = "px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants = {
    primary: "bg-violet-600 hover:bg-violet-500 text-white border border-violet-500/20 shadow-[0_0_20px_rgba(124,58,237,0.3)]",
    secondary: "bg-white/10 hover:bg-white/15 text-white border border-white/5",
    glow: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_35px_rgba(124,58,237,0.6)] hover:scale-[1.02]",
    outline: "bg-transparent border border-white/10 hover:border-violet-500/40 hover:bg-violet-950/20 text-gray-300 hover:text-white",
    danger: "bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
