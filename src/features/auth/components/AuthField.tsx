"use client";

import { forwardRef, useState } from "react";
import { useTranslations } from "next-intl";
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
    const t = useTranslations("auth");
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
            "group relative flex items-center gap-3 rounded-[var(--design-radius-md)] border bg-[var(--design-canvas)] px-3 transition-all duration-200",
            "border-[var(--design-hairline)] hover:border-[var(--design-primary)]/40",
            "focus-within:border-[var(--design-primary)] focus-within:ring-2 focus-within:ring-[var(--design-primary)]/25",
            error &&
              "border-[var(--design-error)]/70 focus-within:border-[var(--design-error)] focus-within:ring-[var(--design-error)]/20",
          )}
        >
          <span
            className="flex shrink-0 text-[var(--design-primary)]"
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
              "h-11 min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-[var(--design-ink)] outline-none placeholder:text-[var(--design-muted-soft)]",
              isPassword && "pe-10",
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="absolute end-3 cursor-pointer rounded-md p-1 text-[var(--design-muted)] transition-colors hover:text-[var(--design-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--design-primary)]"
              aria-label={visible ? t("hidePassword") : t("showPassword")}
              aria-pressed={visible}
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
      </div>
    );
  },
);
