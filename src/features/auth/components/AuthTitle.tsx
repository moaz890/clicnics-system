"use client";

import { Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

interface AuthTitleProps {
  children: React.ReactNode;
  subtitle?: string;
}

/** DESIGN.md display-sm / title + body subtitle */
export function AuthTitle({ children, subtitle }: AuthTitleProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      className="mb-8 space-y-2"
    >
      <h1
        className={cn(
          playfair.className,
          "text-pretty text-3xl font-medium tracking-tight text-[var(--design-ink)] sm:text-[1.75rem]",
        )}
      >
        {children}
      </h1>
      {subtitle && (
        <p className="text-[15px] text-[var(--design-body)]">{subtitle}</p>
      )}
    </motion.header>
  );
}
