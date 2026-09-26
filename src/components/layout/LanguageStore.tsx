"use client";

import { useTranslation } from "@languager-ai/sdk/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { getStorageItem, setStorageItem } from "@/lib/storage";

export const SUPPORTED_LANGUAGES = ["es", "en", "fr", "de", "it"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_STORAGE_KEY = "flowhabit:language";
const DEFAULT_LANGUAGE: SupportedLanguage = "es";

type LanguageStoreValue = {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
};

const LanguageStoreContext = createContext<LanguageStoreValue | null>(null);

function isSupportedLanguage(value: string): value is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);
}

export function LanguageStoreProvider({ children }: { children: React.ReactNode }) {
  const { language, setLanguage: setSdkLanguage } = useTranslation();

  const setLanguage = useCallback(
    (nextLanguage: SupportedLanguage) => {
      setSdkLanguage(nextLanguage);
      setStorageItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    },
    [setSdkLanguage],
  );

  useEffect(() => {
    const storedLanguage = getStorageItem<string>(
      LANGUAGE_STORAGE_KEY,
      DEFAULT_LANGUAGE,
    );

    if (!isSupportedLanguage(storedLanguage)) return;

    // Languager applies defaultLanguage in its own mount effect. Deferring this
    // update until the effect queue is complete prevents it from overwriting
    // the saved preference during hydration.
    let isCancelled = false;
    queueMicrotask(() => {
      if (!isCancelled) {
        setSdkLanguage(storedLanguage);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [setSdkLanguage]);

  useEffect(() => {
    function syncLanguageFromAnotherTab(event: StorageEvent) {
      if (
        event.key !== LANGUAGE_STORAGE_KEY ||
        typeof event.newValue !== "string"
      ) {
        return;
      }

      try {
        const nextLanguage = JSON.parse(event.newValue);
        if (typeof nextLanguage === "string" && isSupportedLanguage(nextLanguage)) {
          setSdkLanguage(nextLanguage);
        }
      } catch {
        // Ignore malformed values from browser storage.
      }
    }

    window.addEventListener("storage", syncLanguageFromAnotherTab);
    return () => window.removeEventListener("storage", syncLanguageFromAnotherTab);
  }, [setSdkLanguage]);

  const value = useMemo<LanguageStoreValue>(
    () => ({
      language: isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE,
      setLanguage,
    }),
    [language, setLanguage],
  );

  return (
    <LanguageStoreContext.Provider value={value}>
      {children}
    </LanguageStoreContext.Provider>
  );
}

export function useLanguageStore() {
  const store = useContext(LanguageStoreContext);

  if (!store) {
    throw new Error("useLanguageStore must be used within LanguageStoreProvider.");
  }

  return store;
}
