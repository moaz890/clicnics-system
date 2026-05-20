"use client";

import { motion } from "framer-motion";
import { staggerItem } from "@/features/auth/lib/auth-motion";

interface AuthTitleProps {
  children: React.ReactNode;
  subtitle?: string;
}

export function AuthTitle({ children, subtitle }: AuthTitleProps) {
  return (
    <motion.header variants={staggerItem} className="mb-8 space-y-2">
      <h1 className="text-pretty text-2xl font-bold tracking-tight text-popover-foreground sm:text-[1.75rem]">
        {children}
      </h1>
      {subtitle && (
        <p className="text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
      )}
    </motion.header>
  );
}
