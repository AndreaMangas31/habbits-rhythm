"use client";

import { useTranslation } from "@languager-ai/sdk/react";
import { useCallback } from "react";

/**
 * Flowhabit content is authored in Spanish. The SDK React helper otherwise
 * assumes English when no source language is supplied.
 */
export function useAppTranslation() {
  const { t: sdkTranslate, ...translation } = useTranslation();

  const t = useCallback(
    (text: string) => sdkTranslate(text, "es"),
    [sdkTranslate],
  );

  return { ...translation, t };
}
