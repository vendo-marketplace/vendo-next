import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import faviconIco from "@/assets/icons/favicon.ico";
import favicon16 from "@/assets/icons/favicon-16x16.png";
import favicon32 from "@/assets/icons/favicon-32x32.png";
import "./globals.css";
import type { ReactNode } from "react";
import Providers from "@/providers/Providers";

const mazzardH = localFont({
  variable: "--font-mazzard",
  display: "swap",
  src: [
    {
      path: "../assets/fonts/mazzard/MazzardH-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/mazzard/MazzardH-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/mazzard/MazzardH-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/mazzard/MazzardH-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: {
    default: "Vendo",
    template: "%s | Vendo",
  },
  description: "Vendo — your marketplace",
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: faviconIco.src, sizes: "any" },
      { url: favicon16.src, sizes: "16x16", type: "image/png" },
      { url: favicon32.src, sizes: "32x32", type: "image/png" },
    ],
    shortcut: faviconIco.src,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#282929" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="uk" className={mazzardH.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <Providers>
          <div className="bg-red-300 w-full max-w-360 flex flex-col mx-auto h-full flex-1">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
