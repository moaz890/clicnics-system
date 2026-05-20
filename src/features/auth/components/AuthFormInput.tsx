"use client";

import { forwardRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  type LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type AuthFormInputIcon = "user" | "email" | "password";

const iconMap: Record<AuthFormInputIcon, LucideIcon> = {
  user: User,
  email: Mail,
  password: Lock,
};

interface AuthFormInputProps
  extends Omit<React.ComponentProps<typeof Input>, "type"> {
  icon?: AuthFormInputIcon;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
}

export const AuthFormInput = forwardRef<HTMLInputElement, AuthFormInputProps>(
  function AuthFormInput(
    { icon = "email", type = "text", className, placeholder, ...props },
    ref,
  ) {
    const t = useTranslations("auth");
    const [visible, setVisible] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && visible ? "text" : type;
    const Icon = iconMap[icon] ?? Mail;

    return (
      <div className="relative">
        <span
          className="pointer-events-none absolute start-3 top-1/2 z-10 -translate-y-1/2 text-primary"
          aria-hidden
        >
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
        <Input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          className={cn(
            "h-11 rounded-xl cursor-text border-border bg-card ps-10 text-popover-foreground shadow-none focus-visible:border-teal-700 focus-visible:ring-teal-700/25",
            isPassword && "pe-10",
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute end-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:text-popover-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-label={visible ? t("hidePassword") : t("showPassword")}
            aria-pressed={visible}
          >
            {visible ? (
              <EyeOff className="size-4" strokeWidth={1.75} />
            ) : (
              <Eye className="size-4" strokeWidth={1.75} />
            )}
          </button>
        )}
      </div>
    );
  },
);
