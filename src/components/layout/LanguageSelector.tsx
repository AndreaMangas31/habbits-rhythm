"use client";

import { IconLanguage, IconLoader2 } from "@tabler/icons-react";
import { useTranslation } from "@languager-ai/sdk/react";
import { useEffect } from "react";
import {
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
  useLanguageStore,
} from "@/components/layout/LanguageStore";

const languageLabels: Record<SupportedLanguage, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
};

export function LanguageSelector() {
  const { isTranslating } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <label className="fixed right-4 top-4 z-50 inline-flex items-center gap-2 rounded-xl border border-foreground/10 bg-surface/95 px-3 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur sm:right-6 sm:top-6">
      <IconLanguage className="h-4 w-4 text-primary" aria-hidden="true" />
      <span className="sr-only">Seleccionar idioma</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as SupportedLanguage)}
        aria-label="Seleccionar idioma"
        disabled={isTranslating}
        className="cursor-pointer bg-transparent outline-none disabled:cursor-wait"
      >
        {SUPPORTED_LANGUAGES.map((item) => (
          <option key={item} value={item}>
            {languageLabels[item]}
          </option>
        ))}
      </select>
      <span
        aria-live="polite"
        className={isTranslating ? "inline-flex items-center gap-1 text-xs text-primary" : "sr-only"}
      >
        <IconLoader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        Traduciendo…
      </span>
    </label>
  );
}
