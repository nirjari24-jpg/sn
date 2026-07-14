import React from "react";
import { motion } from "framer-motion";

export default function ProgressRing({
  percentage = 0,
  size = 120,
  strokeWidth = 8,
  glow = true
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Progress Fill */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          strokeLinecap="round"
          style={
            glow
              ? {
                  filter: "drop-shadow(0 0 6px rgba(139, 92, 246, 0.5))"
                }
              : {}
          }
        />
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" /> {/* purple-500 */}
            <stop offset="100%" stopColor="#3b82f6" /> {/* blue-500 */}
          </linearGradient>
        </defs>
      </svg>
      {/* Center Label */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white tracking-tight">
          {Math.round(percentage)}%
        </span>
        <span className="text-[9px] uppercase tracking-wider font-semibold text-gray-500 mt-0.5">
          Progress
        </span>
      </div>
    </div>
  );
}
