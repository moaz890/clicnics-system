"use client";

import { motion } from "framer-motion";
import { formPanelMotion } from "@/features/auth/lib/auth-motion";

interface AuthFormPanelProps {
  children: React.ReactNode;
}

export function AuthFormPanel({ children }: AuthFormPanelProps) {
  return (
    <motion.main
      initial={formPanelMotion.initial}
      animate={formPanelMotion.animate}
      className="flex w-full flex-1 flex-col justify-center bg-[var(--design-canvas)] px-6 py-10 sm:px-10 md:px-12 lg:w-1/2 lg:px-16 lg:py-12"
    >
      <div className="mx-auto w-full max-w-md">{children}</div>
    </motion.main>
  );
}
