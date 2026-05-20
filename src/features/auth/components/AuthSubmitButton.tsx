"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthSubmitButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}

/** DESIGN.md `button-primary`: coral bg + white label */
export function AuthSubmitButton({
  children,
  loading = false,
  className,
}: AuthSubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className={cn(
        "auth-shine relative mt-2 flex h-10 w-full cursor-pointer items-center justify-center rounded-[var(--design-radius-md)] text-sm font-medium shadow-sm",
        "bg-[var(--design-primary)] text-[var(--design-on-primary)]",
        "hover:bg-[var(--design-primary-active)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--design-primary)]",
        "disabled:cursor-not-allowed disabled:bg-[var(--design-primary-disabled)] disabled:text-[var(--design-muted)]",
        className,
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {children}
      </span>
    </motion.button>
  );
}
