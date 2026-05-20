"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AUTH_HERO_IMAGE, AUTH_HERO_IMAGE_FALLBACK } from "./auth-constants";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function AuthHeroPanel() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const [imageSrc, setImageSrc] = useState(AUTH_HERO_IMAGE);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-[280px] flex-1 overflow-hidden lg:min-h-0 lg:max-w-[55%]"
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 55vw"
        onError={() => setImageSrc(AUTH_HERO_IMAGE_FALLBACK)}
      />

      <div
        className="absolute inset-0 bg-gradient-to-br from-[color-mix(in_srgb,var(--design-accent-teal)_45%,transparent)] via-[color-mix(in_srgb,var(--design-primary)_25%,transparent)] to-[color-mix(in_srgb,var(--design-ink)_55%,transparent)]"
        aria-hidden
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--design-ink)_75%,transparent)] via-transparent to-transparent"
        aria-hidden
      />

      <div className="relative z-10 flex h-full min-h-[280px] flex-col justify-end p-8 pb-10 md:p-12 lg:min-h-0 lg:p-14">
        <motion.blockquote
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-lg text-pretty text-lg font-medium leading-relaxed text-[var(--design-on-primary)] drop-shadow-md md:text-xl lg:text-2xl"
        >
          {t("heroTagline", { platformName: tCommon("appName") })}
        </motion.blockquote>
      </div>
    </motion.section>
  );
}
