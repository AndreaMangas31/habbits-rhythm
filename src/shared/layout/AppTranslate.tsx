"use client";

import { useTranslation } from "@languager-ai/sdk/react";
import { useEffect } from "react";

type AppTranslateProps = {
  children: string;
  fallback?: React.ReactNode;
};

/**
 * Starts SDK translation after render, avoiding provider state updates while a
 * child component is rendering. Flowhabit strings are authored in Spanish.
 */
export function Translate({ children, fallback }: AppTranslateProps) {
  const { t, language, hasTranslation } = useTranslation();
  const translated = hasTranslation(children, "es");

  useEffect(() => {
    if (!translated) {
      t(children, "es");
    }
  }, [children, language, t, translated]);

  if (!translated) {
    return <>{fallback ?? children}</>;
  }

  return <>{t(children, "es")}</>;
}
