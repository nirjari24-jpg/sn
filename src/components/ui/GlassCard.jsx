import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function GlassCard({
  children,
  className,
  glow = "none", // purple, blue, none
  hover = false,
  onClick,
  ...props
}) {
  const CardComponent = onClick ? motion.div : "div";

  const glowStyles = {
    none: "",
    purple: "glow-purple bg-radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.05),transparent)",
    blue: "glow-blue bg-radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent)"
  };

  const interactiveProps = onClick
    ? {
        whileHover: { scale: 1.01 },
        whileTap: { scale: 0.99 },
        onClick,
        style: { cursor: "pointer" }
      }
    : {};

  return (
    <CardComponent
      className={clsx(
        "glass-panel rounded-2xl p-6 relative overflow-hidden",
        glowStyles[glow],
        hover && "glass-panel-hover",
        className
      )}
      {...interactiveProps}
      {...props}
    >
      {/* Dynamic top edge glow line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {children}
    </CardComponent>
  );
}
