"use client";

import { useState, useRef, useCallback } from "react";
import { type GlassesModel, defaultGlasses, GLASSES_CATEGORIES } from "@/lib/glasses-data";
import { removeBackground } from "@/lib/image-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Check,
  ImageIcon,
  Trash2,
  X,
  Sparkles,
  Glasses,
  Plane,
  Circle,
  Cat,
  Zap,
  Minimize2,
  Maximize2,
  LayoutGrid,
  Loader2,
  Wand2,
  AlertCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const categoryIcons: Record<string, React.ReactNode> = {
  LayoutGrid: <LayoutGrid className="w-3.5 h-3.5" />,
  Glasses: <Glasses className="w-3.5 h-3.5" />,
  Plane: <Plane className="w-3.5 h-3.5" />,
  Circle: <Circle className="w-3.5 h-3.5" />,
  Cat: <Cat className="w-3.5 h-3.5" />,
  Zap: <Zap className="w-3.5 h-3.5" />,
  Minimize2: <Minimize2 className="w-3.5 h-3.5" />,
  Maximize2: <Maximize2 className="w-3.5 h-3.5" />,
};

interface GlassesGalleryProps {
  selectedGlasses: GlassesModel | null;
  onSelect: (glasses: GlassesModel | null) => void;
  customGlassesUrl: string | null;
  onCustomGlassesChange: (url: string | null) => void;
}

export default function GlassesGallery({
  selectedGlasses,
  onSelect,
  customGlassesUrl,
  onCustomGlassesChange,
}: GlassesGalleryProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [customGlasses, setCustomGlasses] = useState<GlassesModel[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  // Separate custom glasses for display
  const filteredDefault =
    activeCategory === "all" || activeCategory === "custom"
      ? defaultGlasses.filter((g) => activeCategory === "all" ? true : false)
      : defaultGlasses.filter((g) => g.category === activeCategory);

  const filteredCustom =
    activeCategory === "all" || activeCategory === "custom"
      ? customGlasses
      : [];

  const processImageFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("La imagen no debe superar 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processImageFile(file);
    },
    [processImageFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processImageFile(file);
    },
    [processImageFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const finishUpload = useCallback((imageUrl: string, overlayUrl: string, name: string) => {
    const newGlasses: GlassesModel = {
      id: `custom-${Date.now()}`,
      name: name || "Personalizado",
      brand: "CUSTOM",
      category: "custom",
      price: "Custom",
      color: "#888",
      imageUrl,
      overlayUrl,
    };

    setCustomGlasses((prev) => [newGlasses, ...prev]);
    onSelect(newGlasses);
    onCustomGlassesChange(null);
    setPreviewUrl(null);
    setUploadName("");
    setUploadOpen(false);
    setActiveCategory("all");
    toast.success("✅ Anteojos agregados y seleccionados");
  }, [onSelect, onCustomGlassesChange]);

  const handleUpload = useCallback(async () => {
    if (!previewUrl) {
      toast.error("Selecciona una imagen primero");
      return;
    }

    setIsProcessing(true);
    setProcessingStep(1);

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = previewUrl;
      });

      // Try to remove background
      setProcessingStep(2);
      const processedImg = await removeBackground(img);
      setProcessingStep(3);

      // Validate processed image has content
      const testCanvas = document.createElement("canvas");
      testCanvas.width = processedImg.naturalWidth || processedImg.width;
      testCanvas.height = processedImg.naturalHeight || processedImg.height;
      const testCtx = testCanvas.getContext("2d");
      if (testCtx) {
        testCtx.drawImage(processedImg, 0, 0);
        const testData = testCtx.getImageData(0, 0, testCanvas.width, testCanvas.height).data;
        let hasContent = false;
        for (let i = 3; i < testData.length; i += 4) {
          if (testData[i] > 10) {
            hasContent = true;
            break;
          }
        }
        if (!hasContent) {
          // Processed image is empty, use original
          finishUpload(previewUrl, previewUrl, uploadName);
          return;
        }
      }

      finishUpload(processedImg.src, processedImg.src, uploadName);
    } catch (err) {
      console.error("Error processing image:", err);
      // Fallback: use original image without processing
      finishUpload(previewUrl, previewUrl, uploadName);
    } finally {
      setIsProcessing(false);
      setProcessingStep(0);
    }
  }, [previewUrl, uploadName, finishUpload]);

  const handleDeleteCustom = useCallback(
    (id: string) => {
      setCustomGlasses((prev) => prev.filter((g) => g.id !== id));
      if (selectedGlasses?.id === id) {
        onSelect(null);
      }
      toast.success("Anteojos eliminados");
    },
    [selectedGlasses, onSelect]
  );

  // Render a single glasses card
  const renderGlassesCard = (glasses: GlassesModel) => (
    <motion.div
      key={glasses.id}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={() => {
          onCustomGlassesChange(null);
          if (selectedGlasses?.id === glasses.id) {
            onSelect(null);
          } else {
            onSelect(glasses);
          }
        }}
        className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden transition-all duration-300 group border-2 ${
          selectedGlasses?.id === glasses.id
            ? "border-amber-500 shadow-lg shadow-amber-500/20"
            : "border-white/5 hover:border-white/15"
        } bg-white/[0.03]`}
      >
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <img
            src={glasses.imageUrl}
            alt={glasses.name}
            className="w-full h-full object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110 rounded"
          />
        </div>

        {selectedGlasses?.id === glasses.id && (
          <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
            <Check className="w-3.5 h-3.5 text-black" />
          </div>
        )}

        {glasses.category === "custom" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCustom(glasses.id);
            }}
            className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-3 h-3 text-white" />
          </button>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
          <p className="text-[10px] font-bold text-white/80 truncate">
            {glasses.brand}
          </p>
          <p className="text-[9px] text-white/50 truncate">
            {glasses.name}
          </p>
        </div>
      </button>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wider">
            Colección
          </h2>
          <div className="flex items-center gap-2">
            {customGlasses.length > 0 && (
              <Badge
                variant="secondary"
                className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs"
              >
                +{customGlasses.length} tuyos
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs"
            >
              {defaultGlasses.length + customGlasses.length} modelos
            </Badge>
          </div>
        </div>

        {/* Categories */}
        <ScrollArea orientation="horizontal" className="w-full -mx-4 px-4">
          <div className="flex gap-1.5 pb-2">
            {GLASSES_CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                variant="ghost"
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-3 py-1 h-7 text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-amber-500 text-black hover:bg-amber-500 shadow-md shadow-amber-500/20"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 border border-white/5"
                }`}
              >
                <span className="mr-1.5">{categoryIcons[cat.icon]}</span>
                {cat.label}
              </Button>
            ))}
            {customGlasses.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveCategory("custom")}
                className={`rounded-full px-3 py-1 h-7 text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  activeCategory === "custom"
                    ? "bg-emerald-500 text-black hover:bg-emerald-500 shadow-md shadow-emerald-500/20"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 border border-white/5"
                }`}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Mis anteojos
              </Button>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1 px-4 pb-4">
        {/* ─── CUSTOM GLASSES SECTION (always at top) ─── */}
        {(activeCategory === "all" || activeCategory === "custom") && customGlasses.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 rounded-full bg-emerald-400" />
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">
                Mis Anteojos
              </h3>
              <span className="text-[10px] text-white/30">({customGlasses.length})</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <AnimatePresence mode="popLayout">
                {filteredCustom.map(renderGlassesCard)}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ─── DEFAULT GLASSES SECTION ─── */}
        {activeCategory !== "custom" && (
          <div>
            {customGlasses.length > 0 && activeCategory === "all" && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 rounded-full bg-amber-400" />
                <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">
                  Catálogo
                </h3>
                <span className="text-[10px] text-white/30">({defaultGlasses.length})</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2.5">
              <AnimatePresence mode="popLayout">
                {filteredDefault.map(renderGlassesCard)}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Empty state for custom category */}
        {activeCategory === "custom" && customGlasses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="w-10 h-10 text-white/10 mb-3" />
            <p className="text-sm text-white/30">Aún no has subido anteojos</p>
            <p className="text-xs text-white/20 mt-1">Usa el botón de abajo para agregar</p>
          </div>
        )}
      </ScrollArea>

      {/* ═══ PROMINENT UPLOAD BUTTON — Fixed at bottom ═══ */}
      <div className="px-4 pb-4 pt-2 border-t border-white/[0.06] bg-gray-950/90 backdrop-blur-sm">
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-300 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] text-sm">
              <Upload className="w-5 h-5 mr-2.5" />
              Subir mis anteojos
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/10 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Subir Anteojos Personalizados
              </DialogTitle>
              <DialogDescription className="text-white/50">
                Sube una imagen de tus anteojos. El fondo se eliminará automáticamente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-white/70 text-sm">Nombre del modelo</Label>
                <Input
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="Ej: Mis anteojos favoritos"
                  className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50"
                />
              </div>
              <div>
                <Label className="text-white/70 text-sm flex items-center gap-2">
                  <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                  Imagen de anteojos
                  <span className="text-white/30 font-normal">(cualquier formato)</span>
                </Label>
                <div
                  onClick={() => !isProcessing && fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`mt-1.5 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    isDragOver
                      ? "border-amber-400 bg-amber-500/10"
                      : previewUrl
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-white/10 hover:border-amber-500/30 hover:bg-white/[0.03]"
                  }`}
                >
                  {previewUrl && !isProcessing ? (
                    <div className="relative flex flex-col items-center gap-3">
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-36 object-contain rounded-lg"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewUrl(null);
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition-colors"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Imagen lista — se eliminará el fondo al agregar</span>
                      </div>
                    </div>
                  ) : isProcessing ? (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <div className="relative">
                        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
                        <div className="absolute inset-0 w-10 h-10 rounded-full bg-amber-400/10 animate-ping" style={{ animationDuration: "2s" }} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-white/70 font-medium">
                          {processingStep === 1 && "Cargando imagen..."}
                          {processingStep === 2 && "Eliminando fondo..."}
                          {processingStep === 3 && "Finalizando..."}
                        </p>
                        <p className="text-xs text-white/30 mt-1">Procesando automáticamente</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-2">
                        <ImageIcon className="w-7 h-7 text-white/20" />
                      </div>
                      <p className="text-sm text-white/40 font-medium">
                        Arrastra tu imagen aquí
                      </p>
                      <p className="text-xs text-white/25 mt-1">
                        o haz clic para seleccionar archivo
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        {["PNG", "JPG", "WEBP", "SVG"].map((fmt) => (
                          <span
                            key={fmt}
                            className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-white/30 font-mono"
                          >
                            {fmt}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Tips */}
              <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-[11px] text-white/40 leading-relaxed">
                    <p className="text-white/60 font-medium mb-1">Consejos:</p>
                    <ul className="space-y-0.5 list-disc list-inside">
                      <li>Fondo blanco o claro funciona mejor</li>
                      <li>Vista frontal, sin patillas visibles</li>
                      <li>Los anteojos deben ser el único objeto</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadOpen(false);
                    setPreviewUrl(null);
                    setUploadName("");
                  }}
                  disabled={isProcessing}
                  className="flex-1 border-white/10 text-white/60 hover:bg-white/5"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!previewUrl || isProcessing}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold disabled:opacity-30"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Procesando...
                    </span>
                  ) : (
                    "Agregar anteojos"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
