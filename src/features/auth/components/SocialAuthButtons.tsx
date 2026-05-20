"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

/** DESIGN.md `button-icon-circular` */
export function SocialAuthButtons() {
  const t = useTranslations("auth");

  const handleSocial = () => {
    toast.info(t("socialComingSoon"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.45 }}
      className="mt-8 space-y-4"
    >
      <p className="text-center text-sm text-[var(--design-muted)]">
        {t("orLoginWith")}
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={handleSocial}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-[var(--design-hairline)] bg-[var(--design-canvas)] text-[var(--design-ink)] shadow-xs transition-all hover:scale-105 hover:border-[var(--design-primary)]/40 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--design-primary)]"
          aria-label="Log in with Google"
        >
          <GoogleIcon className="size-5" />
        </button>
        <button
          type="button"
          onClick={handleSocial}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-[var(--design-hairline)] bg-[var(--design-ink)] text-[var(--design-on-primary)] shadow-xs transition-all hover:scale-105 hover:bg-[var(--design-body-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--design-primary)]"
          aria-label="Log in with Apple"
        >
          <AppleIcon className="size-5" />
        </button>
      </div>
    </motion.div>
  );
}
