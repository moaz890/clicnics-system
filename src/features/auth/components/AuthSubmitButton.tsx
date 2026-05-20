"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buttonMotion, staggerItem } from "@/features/auth/lib/auth-motion";

interface AuthSubmitButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export function AuthSubmitButton({
  children,
  loading = false,
  className,
}: AuthSubmitButtonProps) {
  return (
    <motion.div variants={staggerItem}>
      <motion.div
        {...(loading ? {} : buttonMotion)}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
      >
        <Button
          type="submit"
          disabled={loading}
          className={cn(
            "h-11 w-full cursor-pointer rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm hover:bg-[var(--design-primary-active)]",
            className,
          )}
        >
          {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {children}
        </Button>
      </motion.div>
    </motion.div>
  );
}
