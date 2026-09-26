import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";
import { Providers } from "@/shared/layout/providers";

export const metadata: Metadata = {
  title: "Flowhabit",
  description:
    "Flowhabit is a portfolio habit tracker app with rich mock data and a production-ready frontend architecture.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Flowhabit",
    description:
      "A habit tracker portfolio project focused on consistency, streaks, and progress insights.",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Flowhabit Open Graph placeholder image",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground font-sans">
        {/* TODO: Add custom not-found.tsx when core flows are implemented. */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
