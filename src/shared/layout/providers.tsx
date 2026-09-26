"use client";

import { MantineProvider, createTheme } from "@mantine/core";
import type { MantineColorsTuple } from "@mantine/core";
import { LanguagerProvider } from "@languager-ai/sdk/react";
import { LanguageSelector } from "@/shared/layout/LanguageSelector";
import { LanguageStoreProvider } from "@/shared/layout/LanguageStore";

const primaryPalette: MantineColorsTuple = [
  "#f2f0ff",
  "#e7e2ff",
  "#cfc7ff",
  "#b6abff",
  "#9f92ff",
  "#8c7eff",
  "#7c6ef8",
  "#6d5ff3",
  "#5d4ce5",
  "#4b3ac6",
];

const successPalette: MantineColorsTuple = [
  "#e9f9ef",
  "#d6f3e1",
  "#aee8c6",
  "#86dcaa",
  "#62d290",
  "#49cb80",
  "#3bc675",
  "#2fbf71",
  "#22aa63",
  "#159252",
];

const warningPalette: MantineColorsTuple = [
  "#fff3e6",
  "#ffe6cd",
  "#ffc995",
  "#ffad5e",
  "#fb9939",
  "#f19a38",
  "#e88d26",
  "#d17918",
  "#b8650f",
  "#9a5007",
];

const infoPalette: MantineColorsTuple = [
  "#e9f2ff",
  "#d7e8ff",
  "#b0d0ff",
  "#88b9ff",
  "#66a5ff",
  "#4f96fb",
  "#448ef7",
  "#3f87f5",
  "#2d74db",
  "#1a60c1",
];

const theme = createTheme({
  primaryColor: "primary",
  defaultRadius: "lg",
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
  },
  fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  fontFamilyMonospace:
    "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  colors: {
    primary: primaryPalette,
    success: successPalette,
    warning: warningPalette,
    info: infoPalette,
  },
});

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <LanguagerProvider
      config={{
        apiKey: process.env.NEXT_PUBLIC_LANGUAGER_API_KEY ?? "",
        baseUrl:
          process.env.NEXT_PUBLIC_LANGUAGER_API_URL ??
          "https://api.languager.ai/v1",
        defaultSourceLang: "es",
        sessionEndpoint: "/api/languager/session",
      }}
      defaultLanguage="es"
      fallback={(text) => <span className="animate-pulse">{text}</span>}
    >
      <LanguageStoreProvider>
        <MantineProvider
          theme={theme}
          defaultColorScheme="light"
          forceColorScheme="light"
        >
          {children}
          <LanguageSelector />
        </MantineProvider>
      </LanguageStoreProvider>
    </LanguagerProvider>
  );
}
