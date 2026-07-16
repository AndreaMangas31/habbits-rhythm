import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-hover": "rgb(var(--color-surface-hover) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        info: "rgb(var(--color-info) / <alpha-value>)",
        "habit-1": "rgb(var(--color-habit-1) / <alpha-value>)",
        "habit-2": "rgb(var(--color-habit-2) / <alpha-value>)",
        "habit-3": "rgb(var(--color-habit-3) / <alpha-value>)",
        "habit-4": "rgb(var(--color-habit-4) / <alpha-value>)",
        "habit-5": "rgb(var(--color-habit-5) / <alpha-value>)",
        "habit-6": "rgb(var(--color-habit-6) / <alpha-value>)",
        "habit-7": "rgb(var(--color-habit-7) / <alpha-value>)",
        "habit-8": "rgb(var(--color-habit-8) / <alpha-value>)",
      },
      borderRadius: {
        card: "var(--radius-card)",
      },
      boxShadow: {
        card: "0 8px 24px rgba(26, 26, 46, 0.08)",
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "var(--font-geist-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
};

export default config;
