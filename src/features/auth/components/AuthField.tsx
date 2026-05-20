"use client";

import { forwardRef, useState } from "react";
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
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  function AuthField(
    {
      label,
      icon = "email",
      error,
      type = "text",
      className,
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
      <div className="space-y-1.5">
        <label htmlFor={fieldId} className="sr-only">
          {label}
        </label>
        <div
          className={cn(
            "group relative flex items-center gap-3 rounded-xl border bg-white px-3 transition-all duration-200",
            "border-[#e5e2dc] hover:border-[var(--auth-teal)]/40",
            "focus-within:border-[var(--auth-teal)] focus-within:ring-2 focus-within:ring-[var(--auth-teal)]/25",
            error &&
              "border-red-400/70 focus-within:border-red-500 focus-within:ring-red-500/20",
          )}
        >
          <span
            className="flex shrink-0 text-[var(--auth-teal)]"
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
              "h-11 min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-[var(--auth-navy)] outline-none placeholder:text-[#9ca3af]",
              isPassword && "pe-10",
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="absolute end-3 cursor-pointer rounded-md p-1 text-[#6b7280] transition-colors hover:text-[var(--auth-navy)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--auth-teal)]"
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
            className="ps-1 text-xs text-red-600"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
