import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { PWALayout } from "@/components/pwa-layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f59e0b",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "OptiView — Probador Virtual de Anteojos",
  description:
    "Probador virtual de anteojos con inteligencia artificial. Pruébate cualquier modelo en tiempo real con tu cámara.",
  keywords: [
    "OptiView",
    "virtual try-on",
    "anteojos",
    "glasses",
    "probador virtual",
    "AI",
  ],
  authors: [{ name: "OptiView" }],
  openGraph: {
    title: "OptiView — Probador Virtual de Anteojos",
    description:
      "Probador virtual de anteojos con inteligencia artificial en tiempo real.",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OptiView",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192x192.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-status-bar" content="black-translucent" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white`}
      >
        <PWALayout>
          {children}
        </PWALayout>
        <Toaster
          theme="dark"
          position="bottom-center"
          toastOptions={{
            style: {
              background: "rgba(17, 17, 17, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  );
}
