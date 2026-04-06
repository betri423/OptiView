"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  useFaceDetection,
  drawGlassesOnCanvas,
  type FaceData,
} from "@/hooks/use-face-detection";
import type { GlassesModel } from "@/lib/glasses-data";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Camera,
  CameraOff,
  Download,
  Loader2,
  Maximize2,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  MoveVertical,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface TryOnCameraProps {
  selectedGlasses: GlassesModel | null;
  customGlassesUrl: string | null;
}

export default function TryOnCamera({
  selectedGlasses,
  customGlassesUrl,
}: TryOnCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const glassesImgRef = useRef<HTMLImageElement | null>(null);
  const faceRef = useRef<FaceData | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [offsetY, setOffsetY] = useState(0);
  const [mirror, setMirror] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const { isLoading: modelLoading, isReady: modelReady, loadModel, error: modelError } =
    useFaceDetection({
      videoRef,
      enabled: cameraActive,
      onFaceDetected: (face) => {
        faceRef.current = face;
        setFaceDetected(true);
      },
      onFaceLost: () => {
        faceRef.current = null;
        setFaceDetected(false);
      },
    });

  // Load glasses SVG overlay — SVGs are always transparent, no processing needed
  useEffect(() => {
    const url = customGlassesUrl || selectedGlasses?.overlayUrl || null;
    if (!url) {
      glassesImgRef.current = null;
      return;
    }

    setImageLoading(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      glassesImgRef.current = img;
      setImageLoading(false);
    };
    img.onerror = () => {
      setImageLoading(false);
    };
    img.src = url;
  }, [selectedGlasses, customGlassesUrl]);

  // Render loop for drawing glasses overlay
  useEffect(() => {
    if (!cameraActive) return;

    const render = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Match canvas to video display size
      const rect = video.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw glasses if face is detected and glasses are selected
      const face = faceRef.current;
      if (face && glassesImgRef.current) {
        ctx.save();
        if (mirror) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }

        // Apply vertical offset
        const adjustedFace = { ...face, centerY: face.centerY + offsetY };

        drawGlassesOnCanvas(
          ctx,
          adjustedFace as any,
          glassesImgRef.current,
          canvas.width,
          canvas.height,
          scaleX,
          scaleY
        );
        ctx.restore();
      }

      requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [cameraActive, mirror, scaleX, scaleY, offsetY]);

  const startCamera = useCallback(async () => {
    setCameraLoading(true);
    try {
      if (!modelReady) {
        await loadModel();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }
      setCameraActive(true);
      toast.success("Cámara activada");
    } catch (err) {
      console.error("Camera error:", err);
      toast.error("No se pudo acceder a la cámara. Verifica los permisos.");
    } finally {
      setCameraLoading(false);
    }
  }, [modelReady, loadModel]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    const video = videoRef.current;
    if (video) {
      video.srcObject = null;
    }
    setCameraActive(false);
    faceRef.current = null;
    setFaceDetected(false);
  }, []);

  const takeScreenshot = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Create a temporary canvas to composite video + glasses
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    // Draw video frame (mirrored)
    tempCtx.save();
    if (mirror) {
      tempCtx.translate(tempCanvas.width, 0);
      tempCtx.scale(-1, 1);
    }
    tempCtx.drawImage(video, 0, 0);
    tempCtx.restore();

    // Draw glasses overlay
    const face = faceRef.current;
    if (face && glassesImgRef.current) {
      tempCtx.save();
      if (mirror) {
        tempCtx.translate(tempCanvas.width, 0);
        tempCtx.scale(-1, 1);
      }
      const adjustedFace = { ...face, centerY: face.centerY + offsetY };
      drawGlassesOnCanvas(
        tempCtx,
        adjustedFace as any,
        glassesImgRef.current,
        tempCanvas.width,
        tempCanvas.height,
        scaleX,
        scaleY
      );
      tempCtx.restore();
    }

    // Download
    const link = document.createElement("a");
    link.download = `optiview-${Date.now()}.png`;
    link.href = tempCanvas.toDataURL("image/png");
    link.click();
    toast.success("Foto guardada");
  }, [mirror, scaleX, scaleY, offsetY]);

  const resetAdjustments = useCallback(() => {
    setScaleX(1);
    setScaleY(1);
    setOffsetY(0);
    toast.success("Ajustes reiniciados");
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/[0.08] group">
      {/* Video element */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover ${
          mirror ? "-scale-x-100" : ""
        }`}
        playsInline
        muted
      />

      {/* Canvas overlay for glasses */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Image loading indicator */}
      {imageLoading && cameraActive && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 backdrop-blur-xl border border-amber-500/25">
            <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />
            <span className="text-xs text-amber-300 font-medium">Cargando modelo...</span>
          </div>
        </div>
      )}

      {/* ─── Idle State ─── */}
      {!cameraActive && !cameraLoading && !modelLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-800 z-20">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative mb-8"
            >
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20 backdrop-blur-sm">
                <Camera className="w-12 h-12 text-amber-400/80" />
              </div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2"
              >
                <div className="w-10 h-1 rounded-full bg-amber-500/30" />
              </motion.div>
            </motion.div>

            <h3 className="text-white/80 text-xl font-semibold mb-2 tracking-tight">
              Probador Virtual
            </h3>
            <p className="text-white/30 text-sm mb-8 text-center max-w-xs leading-relaxed">
              Activa la cámara para probarte los anteojos en tiempo real con
              inteligencia artificial
            </p>

            <Button
              onClick={startCamera}
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold px-10 py-6 rounded-2xl shadow-xl shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40 hover:scale-105 text-base"
            >
              <Camera className="w-5 h-5 mr-2.5" />
              Activar Cámara
            </Button>
          </div>
        </div>
      )}

      {/* ─── Loading State ─── */}
      {(cameraLoading || modelLoading) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-800 z-20">
          <div className="relative">
            <Loader2 className="w-14 h-14 text-amber-500 animate-spin" />
            <div className="absolute inset-0 w-14 h-14 rounded-full bg-amber-500/10 animate-ping" style={{ animationDuration: "2s" }} />
          </div>
          <p className="text-white/50 text-sm mt-6 font-medium">
            {modelLoading
              ? "Cargando modelo de IA facial..."
              : "Iniciando cámara..."}
          </p>
          <p className="text-white/20 text-xs mt-2">Esto puede tomar unos segundos</p>
        </div>
      )}

      {/* ─── Error State ─── */}
      {modelError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-800 z-20">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
            <CameraOff className="w-7 h-7 text-red-400" />
          </div>
          <p className="text-red-300 text-sm mb-4 text-center max-w-xs">{modelError}</p>
          <Button
            onClick={loadModel}
            variant="outline"
            className="border-white/20 text-white/60 hover:bg-white/5 rounded-xl"
          >
            Reintentar
          </Button>
        </div>
      )}

      {/* ─── Active Camera UI ─── */}
      {cameraActive && (
        <>
          {/* Face detection indicator */}
          <div className="absolute top-3 left-3 z-30">
            <motion.div
              layout
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl transition-all duration-500 ${
                faceDetected
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
                  : "bg-white/5 text-white/40 border border-white/[0.06]"
              }`}
            >
              <motion.div
                animate={faceDetected ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.4 }}
                className={`w-2 h-2 rounded-full ${
                  faceDetected
                    ? "bg-emerald-400 shadow-lg shadow-emerald-400/50"
                    : "bg-white/20"
                }`}
              />
              <AnimatePresence mode="wait">
                <motion.span
                  key={faceDetected ? "detected" : "searching"}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {faceDetected ? "Rostro detectado" : "Buscando rostro..."}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Top right controls */}
          <div className="absolute top-3 right-3 z-30 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMirror(!mirror)}
              className="bg-white/5 hover:bg-white/10 text-white/50 backdrop-blur-xl rounded-full w-9 h-9 border border-white/[0.06]"
              title="Espejar"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowControls(!showControls)}
              className="bg-white/5 hover:bg-white/10 text-white/50 backdrop-blur-xl rounded-full w-9 h-9 border border-white/[0.06]"
              title="Ajustes"
            >
              <MoveVertical className="w-4 h-4" />
            </Button>
          </div>

          {/* Selected glasses name */}
          {selectedGlasses && cameraActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-30"
            >
              <div className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-xl text-white/70 text-xs font-medium border border-white/[0.08]">
                <span className="text-amber-400 font-semibold">{selectedGlasses.brand}</span>
                {" · "}
                {selectedGlasses.name}
                <span className="text-white/30 ml-2">{selectedGlasses.price}</span>
              </div>
            </motion.div>
          )}

          {/* Adjustment controls panel */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute top-14 right-3 z-30 w-52 rounded-xl bg-black/60 backdrop-blur-xl border border-white/[0.08] p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">
                    Ajustes
                  </span>
                  <button
                    onClick={resetAdjustments}
                    className="text-white/30 hover:text-white/60 transition-colors"
                    title="Reiniciar"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Width scale */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-white/40">Ancho</span>
                    <span className="text-[11px] text-white/60 font-mono">{scaleX.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[scaleX]}
                    onValueChange={([v]) => setScaleX(v)}
                    min={0.5}
                    max={1.5}
                    step={0.01}
                    className="w-full"
                  />
                </div>

                {/* Height scale */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-white/40">Alto</span>
                    <span className="text-[11px] text-white/60 font-mono">{scaleY.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[scaleY]}
                    onValueChange={([v]) => setScaleY(v)}
                    min={0.5}
                    max={1.5}
                    step={0.01}
                    className="w-full"
                  />
                </div>

                {/* Vertical offset */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-white/40">Posición vertical</span>
                    <span className="text-[11px] text-white/60 font-mono">{offsetY.toFixed(3)}</span>
                  </div>
                  <Slider
                    value={[offsetY]}
                    onValueChange={([v]) => setOffsetY(v)}
                    min={-0.05}
                    max={0.05}
                    step={0.001}
                    className="w-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom controls */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.08]">
              {/* Stop camera */}
              <Button
                onClick={stopCamera}
                variant="ghost"
                size="icon"
                className="bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-xl w-11 h-11 border border-red-500/10 transition-colors"
                title="Detener cámara"
              >
                <CameraOff className="w-4.5 h-4.5" />
              </Button>

              {/* Screenshot */}
              <Button
                onClick={takeScreenshot}
                disabled={!selectedGlasses && !customGlassesUrl}
                variant="ghost"
                size="icon"
                className={`rounded-xl w-14 h-14 border-2 transition-all duration-300 ${
                  selectedGlasses || customGlassesUrl
                    ? "bg-white/10 hover:bg-white/20 text-white/80 border-white/20 hover:scale-105 active:scale-95"
                    : "bg-white/[0.03] text-white/20 border-white/[0.06] cursor-not-allowed"
                }`}
                title="Capturar foto"
              >
                <Download className="w-5 h-5" />
              </Button>

              {/* Quick scale buttons */}
              <div className="flex flex-col items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setScaleX(Math.min(1.5, scaleX + 0.05))}
                  className="bg-white/5 hover:bg-white/10 text-white/50 rounded-lg w-8 h-7 border border-white/[0.06] text-base"
                  title="Aumentar tamaño"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <span className="text-[9px] text-white/20 font-mono">
                  {(scaleX * 100).toFixed(0)}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setScaleX(Math.max(0.5, scaleX - 0.05))}
                  className="bg-white/5 hover:bg-white/10 text-white/50 rounded-lg w-8 h-7 border border-white/[0.06] text-base"
                  title="Reducir tamaño"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
