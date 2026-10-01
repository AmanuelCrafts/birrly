import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Birrly — Earn Birr",
  description: "Birrly is a Telegram Mini App for earning rewards and points through activities.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0a0f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`} suppressHydrationWarning>
      <head>
        {/* Telegram Mini Apps SDK */}
        <script src="https://telegram.org/js/telegram-web-app.js" />
        {/* Monetag SDK — loaded client-side only */}
        <script
          src="https://libtl.com/sdk.js"
          data-zone="11920150"
          data-sdk="show_11920150"
          async
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
