"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  // These are computed once — no state needed
  const isStandalone = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone: boolean }).standalone === true
    );
  }, []);

  const isIOS = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream: boolean }).MSStream
    );
  }, []);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Listen for successful install
    const installedHandler = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  }, [deferredPrompt]);

  const canInstall = !isStandalone && !!deferredPrompt;
  const showIOSHint = !isStandalone && isIOS;

  return { install, canInstall, showIOSHint, isStandalone, isIOS };
}

export function PWAInstallBanner() {
  const { install, canInstall, showIOSHint, isStandalone } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if already dismissed, already standalone, or not installable
  const showBanner = !dismissed && !isStandalone && (canInstall || showIOSHint);

  const handleInstall = async () => {
    await install();
    setDismissed(true);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-md"
      >
        <div className="relative rounded-2xl bg-gray-900/95 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                {showIOSHint ? (
                  <Smartphone className="w-6 h-6 text-white" />
                ) : (
                  <Download className="w-6 h-6 text-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white">
                  {showIOSHint ? "Instalar OptiView" : "Instala la app"}
                </h3>
                <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
                  {showIOSHint
                    ? "Toca el botón compartir y selecciona \"Agregar a pantalla de inicio\""
                    : "Agrega OptiView a tu pantalla de inicio para una experiencia rápida y sin navegador."}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={() => setDismissed(true)}
                className="flex-shrink-0 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white/40" />
              </button>
            </div>

            {/* Install button (Android/Desktop only) */}
            {!showIOSHint && (
              <Button
                onClick={handleInstall}
                className="w-full mt-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold rounded-xl h-10 text-sm shadow-lg shadow-amber-500/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Instalar ahora
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
