"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { bannerTextMotion } from "@/features/auth/lib/auth-motion";

export function AuthBannerPanel() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");

  return (
    <section
      className="relative hidden min-h-[220px] shrink-0 overflow-hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-1/2 lg:flex-col"
      aria-label={t("bannerAria")}
    >
      <div className="absolute inset-0 bg-accent/30">
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 800 1200"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <defs>
            <linearGradient id="wave-mint" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b8e6d8" />
              <stop offset="100%" stopColor="#7ec8b8" />
            </linearGradient>
            <linearGradient id="wave-teal" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5db8a6" />
              <stop offset="100%" stopColor="#3d9a8a" />
            </linearGradient>
            <linearGradient id="wave-sand" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e8dfd0" />
              <stop offset="100%" stopColor="#d4c4b0" />
            </linearGradient>
          </defs>
          <path
            fill="url(#wave-mint)"
            d="M0,400 C200,280 400,520 600,380 C700,310 750,350 800,300 L800,1200 L0,1200 Z"
            opacity="0.85"
          />
          <path
            fill="url(#wave-teal)"
            d="M0,550 C180,450 350,620 550,480 C680,390 720,440 800,400 L800,1200 L0,1200 Z"
            opacity="0.7"
          />
          <path
            fill="url(#wave-sand)"
            d="M0,700 C220,600 420,780 620,640 C720,580 760,620 800,580 L800,1200 L0,1200 Z"
            opacity="0.55"
          />
          <ellipse cx="620" cy="200" rx="280" ry="200" fill="#b8e6d8" opacity="0.45" />
          <ellipse cx="180" cy="320" rx="220" ry="160" fill="#e8dfd0" opacity="0.5" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-10 py-16 text-center">
        <motion.p
          variants={bannerTextMotion}
          initial="hidden"
          animate="show"
          className="max-w-md text-pretty text-2xl font-semibold leading-snug tracking-tight text-popover-foreground md:text-3xl"
        >
          {t("bannerWelcome", { platformName: tCommon("appName") })}
        </motion.p>
      </div>
    </section>
  );
}
