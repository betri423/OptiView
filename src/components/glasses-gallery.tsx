"use client";

import { useState, useRef, useCallback } from "react";
import { type GlassesModel, defaultGlasses, GLASSES_CATEGORIES } from "@/lib/glasses-data";
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

  const allGlasses = [...defaultGlasses, ...customGlasses];

  const filteredGlasses =
    activeCategory === "all"
      ? allGlasses
      : allGlasses.filter((g) => g.category === activeCategory);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Por favor selecciona una imagen válida");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no debe superar 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setPreviewUrl(url);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleUpload = useCallback(() => {
    if (!previewUrl) {
      toast.error("Selecciona una imagen primero");
      return;
    }

    const newGlasses: GlassesModel = {
      id: `custom-${Date.now()}`,
      name: uploadName || "Personalizado",
      brand: "CUSTOM",
      category: "custom",
      price: "Custom",
      color: "#888",
      imageUrl: previewUrl,
      svgDataUrl: previewUrl,
    };

    setCustomGlasses((prev) => [...prev, newGlasses]);
    setPreviewUrl(null);
    setUploadName("");
    setUploadOpen(false);
    toast.success("Anteojos personalizados agregados");
  }, [previewUrl, uploadName]);

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

  const handleRemoveCustomActive = useCallback(() => {
    onCustomGlassesChange(null);
  }, [onCustomGlassesChange]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wider">
            Colección
          </h2>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs"
            >
              {allGlasses.length} modelos
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
          </div>
        </ScrollArea>
      </div>

      {/* Glasses Grid */}
      <ScrollArea className="flex-1 px-4 pb-4">
        <div className="grid grid-cols-2 gap-2.5">
          <AnimatePresence mode="popLayout">
            {filteredGlasses.map((glasses) => (
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
                  {/* Glasses Preview — use HD photo for gallery, SVG fallback for custom */}
                  <div className="absolute inset-0 flex items-center justify-center p-2">
                    <img
                      src={glasses.imageUrl || glasses.svgDataUrl}
                      alt={glasses.name}
                      className="w-full h-full object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110 rounded"
                    />
                  </div>

                  {/* Selected indicator */}
                  {selectedGlasses?.id === glasses.id && (
                    <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
                      <Check className="w-3.5 h-3.5 text-black" />
                    </div>
                  )}

                  {/* Delete custom */}
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

                  {/* Info overlay */}
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
            ))}
          </AnimatePresence>
        </div>

        {/* Upload area */}
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <button className="w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-dashed border-white/10 hover:border-amber-500/30 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 flex flex-col items-center justify-center gap-2 group mt-1">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
                <Upload className="w-5 h-5 text-white/30 group-hover:text-amber-400 transition-colors" />
              </div>
              <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors">
                Subir anteojos
              </span>
              <span className="text-[10px] text-white/20">PNG transparente</span>
            </button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/10 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Subir Anteojos Personalizados
              </DialogTitle>
              <DialogDescription className="text-white/50">
                Sube una imagen PNG con fondo transparente de tus anteojos
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
                <Label className="text-white/70 text-sm">Imagen (PNG con fondo transparente)</Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1.5 border-2 border-dashed border-white/10 hover:border-amber-500/30 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/[0.03]"
                >
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-32 object-contain"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewUrl(null);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-10 h-10 text-white/20 mb-2" />
                      <p className="text-sm text-white/40">
                        Haz clic para seleccionar
                      </p>
                      <p className="text-xs text-white/20 mt-1">
                        Máximo 5MB
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/webp,image/svg+xml"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadOpen(false);
                    setPreviewUrl(null);
                    setUploadName("");
                  }}
                  className="flex-1 border-white/10 text-white/60 hover:bg-white/5"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!previewUrl}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold disabled:opacity-30"
                >
                  Agregar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Custom active indicator */}
        {customGlassesUrl && (
          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 rounded bg-white/10 flex items-center justify-center overflow-hidden">
                  <img
                    src={customGlassesUrl}
                    alt="Custom"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs text-amber-300 font-medium">
                  Anteojos personalizados
                </span>
              </div>
              <button
                onClick={handleRemoveCustomActive}
                className="text-amber-400/60 hover:text-amber-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
