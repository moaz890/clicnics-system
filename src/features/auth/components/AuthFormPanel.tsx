"use client";

import { motion } from "framer-motion";

interface AuthFormPanelProps {
  children: React.ReactNode;
}

/** DESIGN.md canvas / surface-soft form panel */
export function AuthFormPanel({ children }: AuthFormPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
      className="flex w-full flex-1 flex-col justify-center bg-[var(--design-canvas)] px-6 py-10 sm:px-10 md:px-14 lg:max-w-[45%] lg:px-16"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 15% 0%, color-mix(in srgb, var(--design-accent-teal) 18%, transparent), transparent 55%), radial-gradient(ellipse at 85% 100%, color-mix(in srgb, var(--design-primary) 12%, transparent), transparent 50%)",
      }}
    >
      <div className="mx-auto w-full max-w-md">{children}</div>
    </motion.div>
  );
}
