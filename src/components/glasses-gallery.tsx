"use client";

import { useState, useRef, useCallback } from "react";
import { type GlassesModel, defaultGlasses, GLASSES_CATEGORIES } from "@/lib/glasses-data";
import { removeBackgroundToBlob } from "@/lib/image-utils";
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
  customGlasses: GlassesModel[];
  onAddCustom: (glasses: GlassesModel) => void;
  onDeleteCustom: (id: string) => void;
}

export default function GlassesGallery({
  selectedGlasses,
  onSelect,
  customGlasses,
  onAddCustom,
  onDeleteCustom,
}: GlassesGalleryProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const pendingFileRef = useRef<File | null>(null);

  // ─── Filtering ───
  const filteredDefault =
    activeCategory === "all" || activeCategory === "custom"
      ? defaultGlasses
      : defaultGlasses.filter((g) => g.category === activeCategory);

  const filteredCustom =
    activeCategory === "all" || activeCategory === "custom"
      ? customGlasses
      : [];

  // ─── File handling ───
  const processImageFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("La imagen no debe superar 10MB");
      return;
    }
    pendingFileRef.current = file;
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

  // ─── Upload handler ───
  // Key design: ONLY adds to gallery, does NOT auto-select.
  // This prevents cascading re-renders between camera and gallery.
  const handleUpload = useCallback(async () => {
    const file = pendingFileRef.current;
    const currentName = uploadName;

    if (!previewUrl || !file) {
      toast.error("Selecciona una imagen primero");
      return;
    }

    setIsProcessing(true);
    setProcessingStep(1);

    try {
      // Load image from file
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("No se pudo cargar la imagen"));
        img.src = objectUrl;
      });

      // Remove background → get Blob
      setProcessingStep(2);
      const blob = await removeBackgroundToBlob(img);
      URL.revokeObjectURL(objectUrl);

      // Create Blob URL for the processed image
      const blobUrl = URL.createObjectURL(blob);
      setProcessingStep(3);

      // Create glasses model
      const newGlasses: GlassesModel = {
        id: `custom-${Date.now()}`,
        name: currentName || "Personalizado",
        brand: "CUSTOM",
        category: "custom" as const,
        price: "Custom",
        color: "#888",
        imageUrl: blobUrl,
        overlayUrl: blobUrl,
      };

      console.log("[Gallery] Upload complete:", newGlasses.id, blobUrl);

      // ─── Add to parent state ONLY (no auto-select) ───
      onAddCustom(newGlasses);

      // Reset form state
      setPreviewUrl(null);
      setUploadName("");
      setUploadOpen(false);
      pendingFileRef.current = null;
      // Keep current category — don't change it

      toast.success("✅ Anteojos guardados en la galería");
    } catch (err) {
      console.error("[Gallery] Error processing image:", err);

      // Fallback: use original without BG removal
      const fallbackBlob = new Blob([await file.arrayBuffer()], { type: file.type });
      const fallbackUrl = URL.createObjectURL(fallbackBlob);

      const newGlasses: GlassesModel = {
        id: `custom-${Date.now()}`,
        name: currentName || "Personalizado",
        brand: "CUSTOM",
        category: "custom" as const,
        price: "Custom",
        color: "#888",
        imageUrl: fallbackUrl,
        overlayUrl: fallbackUrl,
      };

      onAddCustom(newGlasses);
      setPreviewUrl(null);
      setUploadName("");
      setUploadOpen(false);
      pendingFileRef.current = null;

      toast.success("Anteojos guardados (sin eliminación de fondo)");
    } finally {
      setIsProcessing(false);
      setProcessingStep(0);
    }
  }, [previewUrl, uploadName, onAddCustom]);

  // ─── Render a glasses card (NO framer-motion — pure CSS) ───
  const renderGlassesCard = (glasses: GlassesModel) => {
    const isSelected = selectedGlasses?.id === glasses.id;
    const isCustom = glasses.category === "custom";

    return (
      <div
        key={glasses.id}
        className="transition-all duration-200"
      >
        <button
          onClick={() => {
            if (isSelected) {
              onSelect(null);
            } else {
              onSelect(glasses);
            }
          }}
          className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden transition-all duration-200 group border-2 ${
            isSelected
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

          {/* Selected indicator */}
          {isSelected && (
            <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
              <Check className="w-3.5 h-3.5 text-black" />
            </div>
          )}

          {/* Delete button for custom glasses */}
          {isCustom && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (glasses.imageUrl.startsWith("blob:")) {
                  URL.revokeObjectURL(glasses.imageUrl);
                }
                onDeleteCustom(glasses.id);
                toast.success("Anteojos eliminados");
              }}
              className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3 h-3 text-white" />
            </button>
          )}

          {/* Label */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
            <p className="text-[10px] font-bold text-white/80 truncate">
              {glasses.brand}
            </p>
            <p className="text-[9px] text-white/50 truncate">
              {glasses.name}
            </p>
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* ─── Header ─── */}
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

        {/* Category buttons */}
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

      {/* ─── Scrollable glasses grid ─── */}
      <ScrollArea className="flex-1 px-4 pb-4">
        {/* Custom glasses section */}
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
              {filteredCustom.map(renderGlassesCard)}
            </div>
          </div>
        )}

        {/* Default glasses section */}
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
              {filteredDefault.map(renderGlassesCard)}
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

      {/* ─── Upload button fixed at bottom ─── */}
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
                            pendingFileRef.current = null;
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition-colors"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Imagen lista — fondo se eliminará al agregar</span>
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
                    pendingFileRef.current = null;
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
                    "Guardar en galería"
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
