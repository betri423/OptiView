import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white`}
      >
        {children}
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
