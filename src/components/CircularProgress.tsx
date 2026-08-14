import React from 'react';
import { motion } from 'motion/react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  subLabel?: string;
  animate?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 190,
  strokeWidth = 14,
  label,
  subLabel,
  animate = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Arc stroke offset calculation
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg] transform">
        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EEF2FF"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="transition-all duration-500"
        />
        {/* Active Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#4338CA"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-4xl font-extrabold tracking-tight text-indigo-700 font-['Plus_Jakarta_Sans',sans-serif]"
        >
          {percentage}%
        </motion.span>
        {label && <span className="text-xs font-semibold text-slate-500 mt-0.5">{label}</span>}
        {subLabel && <span className="text-[11px] text-slate-400">{subLabel}</span>}
      </div>
    </div>
  );
};
