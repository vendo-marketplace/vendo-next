import favicon16 from "@/assets/favicons/favicon-16x16.png";
import favicon32 from "@/assets/favicons/favicon-32x32.png";
import faviconIco from "@/assets/favicons/favicon.ico";
import { routing } from "@/i18n/routing";
import Providers from "@/providers/Providers";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Montserrat, Montserrat_Alternates } from "next/font/google";
import type { ReactNode } from "react";
import "../globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const montserratAlternates = Montserrat_Alternates({
  variable: "--font-montserrat-alternates",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${montserrat.variable} ${montserratAlternates.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-surface-secondary text-text-primary antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="flex min-h-screen w-full flex-1 flex-col">
              {children}
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
