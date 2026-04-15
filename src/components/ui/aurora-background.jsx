import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const AuroraBackground = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "relative min-h-screen flex flex-col bg-slate-900 overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Aurora gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/4 w-[80vw] h-[80vw] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(59,130,246,0.2) 40%, transparent 70%)",
          }}
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -30, 50, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-1/3 -right-1/4 w-[70vw] h-[70vw] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(139,92,246,0.2) 40%, transparent 70%)",
          }}
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -20, 0],
            scale: [1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/2 w-[50vw] h-[50vw] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 60%)",
          }}
          animate={{
            x: [0, 30, -60, 0],
            y: [0, -50, 20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      {children}
    </div>
  );
};

export default AuroraBackground;
