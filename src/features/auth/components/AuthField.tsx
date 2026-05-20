"use client";

import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type AuthFieldIcon = "user" | "email" | "password";

const iconMap: Record<AuthFieldIcon, LucideIcon> = {
  user: User,
  email: Mail,
  password: Lock,
};

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: AuthFieldIcon;
  error?: string;
  animationDelay?: number;
}

/** DESIGN.md `text-input` */
export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  function AuthField(
    {
      label,
      icon = "email",
      error,
      type = "text",
      className,
      animationDelay = 0,
      id,
      ...props
    },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && visible ? "text" : type;
    const Icon = iconMap[icon] ?? Mail;
    const fieldId = id ?? props.name;

    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: animationDelay,
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1] as const,
        }}
        className="space-y-1.5"
      >
        <label htmlFor={fieldId} className="sr-only">
          {label}
        </label>
        <div
          className={cn(
            "group relative flex items-center gap-3 rounded-[var(--design-radius-md)] border px-3 py-0 shadow-xs transition-all duration-200",
            "border-[var(--design-hairline)] bg-[var(--design-canvas)]",
            "hover:border-[var(--design-accent-teal)]/50 focus-within:border-[var(--design-primary)] focus-within:ring-2 focus-within:ring-[var(--design-primary)]/15",
            error &&
              "border-[var(--design-error)]/60 focus-within:ring-[var(--design-error)]/15",
          )}
        >
          <span
            className="flex shrink-0 text-[var(--design-primary)] opacity-90"
            aria-hidden
          >
            <Icon className="size-[18px]" strokeWidth={1.75} />
          </span>
          <input
            ref={ref}
            id={fieldId}
            type={inputType}
            placeholder={label}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={cn(
              "h-10 min-w-0 flex-1 border-0 bg-transparent py-2 text-base text-[var(--design-ink)] outline-none placeholder:text-[var(--design-muted-soft)] md:text-sm",
              isPassword && "pe-9",
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="absolute end-3 rounded-md p-1 text-[var(--design-muted)] transition-colors hover:text-[var(--design-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--design-primary)]"
              aria-label={visible ? "Hide password" : "Show password"}
            >
              {visible ? (
                <EyeOff className="size-[18px]" strokeWidth={1.75} />
              ) : (
                <Eye className="size-[18px]" strokeWidth={1.75} />
              )}
            </button>
          )}
        </div>
        {error && (
          <p
            id={`${fieldId}-error`}
            role="alert"
            className="ps-1 text-xs text-[var(--design-error)]"
          >
            {error}
          </p>
        )}
      </motion.div>
    );
  },
);
