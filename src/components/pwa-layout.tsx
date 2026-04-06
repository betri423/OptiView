"use client";

import { useServiceWorker } from "@/hooks/use-service-worker";
import { PWAInstallBanner } from "@/components/pwa-install";

export function PWALayout({ children }: { children: React.ReactNode }) {
  useServiceWorker();

  return (
    <>
      {children}
      <PWAInstallBanner />
    </>
  );
}
