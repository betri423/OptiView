"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useFaceDetection, drawGlassesOnCanvas, type FaceData } from "@/hooks/use-face-detection";
import type { GlassesModel } from "@/lib/glasses-data";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Download, Loader2, Maximize2 } from "lucide-react";
import { toast } from "sonner";

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
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const faceRef = useRef<FaceData | null>(null);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [mirror, setMirror] = useState(true);

  const { isLoading: modelLoading, isReady: modelReady, loadModel, error: modelError } =
    useFaceDetection({
      videoRef,
      enabled: cameraActive && modelReady,
      onFaceDetected: (face) => {
        faceRef.current = face;
      },
      onFaceLost: () => {
        faceRef.current = null;
      },
    });

  // Load glasses image when selection changes
  useEffect(() => {
    const url = customGlassesUrl || selectedGlasses?.svgDataUrl || null;
    if (!url) {
      glassesImgRef.current = null;
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      glassesImgRef.current = img;
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
        // The face landmarks are in video coordinate space (0-1 range)
        // We need to scale to canvas size
        ctx.save();
        if (mirror) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        drawGlassesOnCanvas(
          ctx,
          face as any,
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
  }, [cameraActive, mirror, scaleX, scaleY]);

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
      drawGlassesOnCanvas(
        tempCtx,
        face as any,
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
  }, [mirror, scaleX, scaleY]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
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
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Loading states */}
      {!cameraActive && !cameraLoading && !modelLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-10">
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
            <Camera className="w-10 h-10 text-white/30" />
          </div>
          <h3 className="text-white/70 text-lg font-medium mb-2">
            Probador Virtual
          </h3>
          <p className="text-white/40 text-sm mb-8 text-center max-w-xs">
            Activa la cámara para probarte los anteojos en tiempo real
          </p>
          <Button
            onClick={startCamera}
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 rounded-full shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40 hover:scale-105"
          >
            <Camera className="w-5 h-5 mr-2" />
            Activar Cámara
          </Button>
        </div>
      )}

      {(cameraLoading || modelLoading) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-10">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
          <p className="text-white/60 text-sm">
            {modelLoading
              ? "Cargando modelo de detección facial..."
              : "Iniciando cámara..."}
          </p>
        </div>
      )}

      {/* Model error */}
      {modelError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-10">
          <p className="text-red-400 text-sm mb-4">{modelError}</p>
          <Button
            onClick={loadModel}
            variant="outline"
            className="border-white/20 text-white/70"
          >
            Reintentar
          </Button>
        </div>
      )}

      {/* Active camera controls */}
      {cameraActive && (
        <>
          {/* Face detection indicator */}
          <div className="absolute top-4 left-4 z-20">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md transition-all duration-300 ${
                faceRef.current
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-white/10 text-white/50 border border-white/10"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  faceRef.current
                    ? "bg-emerald-400 animate-pulse"
                    : "bg-white/30"
                }`}
              />
              {faceRef.current ? "Rostro detectado" : "Buscando rostro..."}
            </div>
          </div>

          {/* Mirror toggle */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMirror(!mirror)}
              className="bg-white/10 hover:bg-white/20 text-white/70 backdrop-blur-md rounded-full w-9 h-9 border border-white/10"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Selected glasses indicator */}
          {selectedGlasses && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
              <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white/80 text-sm font-medium border border-white/10">
                {selectedGlasses.brand} · {selectedGlasses.name}
              </div>
            </div>
          )}

          {/* Bottom controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            <Button
              onClick={stopCamera}
              variant="ghost"
              size="icon"
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 backdrop-blur-md rounded-full w-12 h-12 border border-red-500/20"
            >
              <CameraOff className="w-5 h-5" />
            </Button>
            <Button
              onClick={takeScreenshot}
              disabled={!selectedGlasses && !customGlassesUrl}
              variant="ghost"
              size="icon"
              className="bg-white/10 hover:bg-white/20 text-white/70 backdrop-blur-md rounded-full w-14 h-14 border-2 border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110"
            >
              <Download className="w-5 h-5" />
            </Button>
            <div className="flex flex-col items-center gap-1">
              <span className="text-white/40 text-[10px]">Escala</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setScaleX(Math.max(0.5, scaleX - 0.05))}
                  className="bg-white/10 hover:bg-white/20 text-white/60 rounded-full w-8 h-8 text-xs border border-white/10"
                >
                  −
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setScaleX(Math.min(1.5, scaleX + 0.05))}
                  className="bg-white/10 hover:bg-white/20 text-white/60 rounded-full w-8 h-8 text-xs border border-white/10"
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
