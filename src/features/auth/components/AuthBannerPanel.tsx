"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { bannerTextMotion } from "@/features/auth/lib/auth-motion";

export function AuthBannerPanel() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");

  return (
    <section
      className="relative hidden min-h-[220px] shrink-0 overflow-hidden bg-[var(--design-surface-soft)] lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-1/2 lg:flex-col"
      aria-label={t("bannerAria")}
    >
      <div className="absolute inset-0" aria-hidden>
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 800 1200"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="wave-soft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5f0e8" />
              <stop offset="100%" stopColor="#efe9de" />
            </linearGradient>
            <linearGradient id="wave-teal" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5db8a6" />
              <stop offset="100%" stopColor="#cc785c" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="wave-cream" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e8e0d2" />
              <stop offset="100%" stopColor="#faf9f5" />
            </linearGradient>
          </defs>
          <path
            fill="url(#wave-soft)"
            d="M0,400 C200,280 400,520 600,380 C700,310 750,350 800,300 L800,1200 L0,1200 Z"
            opacity="0.9"
          />
          <path
            fill="url(#wave-teal)"
            d="M0,550 C180,450 350,620 550,480 C680,390 720,440 800,400 L800,1200 L0,1200 Z"
            opacity="0.65"
          />
          <path
            fill="url(#wave-cream)"
            d="M0,700 C220,600 420,780 620,640 C720,580 760,620 800,580 L800,1200 L0,1200 Z"
            opacity="0.55"
          />
          <ellipse
            cx="620"
            cy="200"
            rx="280"
            ry="200"
            fill="#efe9de"
            opacity="0.5"
          />
          <ellipse
            cx="180"
            cy="320"
            rx="220"
            ry="160"
            fill="#e8e0d2"
            opacity="0.55"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-10 py-16 text-center">
        <motion.p
          variants={bannerTextMotion}
          initial="hidden"
          animate="show"
          className="max-w-md text-pretty text-2xl font-semibold leading-snug tracking-tight text-[var(--design-ink)] md:text-3xl"
        >
          {t("bannerWelcome", { platformName: tCommon("appName") })}
        </motion.p>
      </div>
    </section>
  );
}
