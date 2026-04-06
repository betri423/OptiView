"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import TryOnCamera from "@/components/tryon-camera";
import GlassesGallery from "@/components/glasses-gallery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type GlassesModel } from "@/lib/glasses-data";
import {
  Eye,
  Sparkles,
  Shield,
  Camera,
  Upload,
  Star,
  ChevronDown,
  Menu,
  X,
  Glasses,
  Zap,
  Smartphone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// ─── Animated counter component ───
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = target;
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / end));
    const increment = end > 0 ? 1 : -1;
    const timer = setInterval(() => {
      start += increment;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}{suffix}</span>;
}

// ─── Feature Card ───
function FeatureCard({
  icon,
  title,
  desc,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-amber-500/20 hover:bg-white/[0.05] transition-all duration-500"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/15 group-hover:scale-110 transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
        <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Star rating ───
function Stars() {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

// ─── Main Page ───
export default function Home() {
  const [selectedGlasses, setSelectedGlasses] = useState<GlassesModel | null>(null);
  const [customGlasses, setCustomGlasses] = useState<GlassesModel[]>([]);
  const [activeSection, setActiveSection] = useState<"tryon" | "features">("tryon");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHero, setShowHero] = useState(true);

  // Stable callbacks with refs — prevents stale closures in async child components
  const addCustomRef = useRef<(g: GlassesModel) => void>();
  const selectRef = useRef<(g: GlassesModel | null) => void>();
  const deleteCustomRef = useRef<(id: string) => void>();

  // Keep refs in sync with latest state setters
  useEffect(() => {
    addCustomRef.current = (g: GlassesModel) => setCustomGlasses((prev) => [g, ...prev]);
    selectRef.current = setSelectedGlasses;
    deleteCustomRef.current = (id: string) => {
      setCustomGlasses((prev) => prev.filter((g) => g.id !== id));
      setSelectedGlasses((cur) => (cur?.id === id ? null : cur));
    };
  });

  const handleStartTryOn = useCallback(() => {
    setShowHero(false);
    setActiveSection("tryon");
    setTimeout(() => {
      document.getElementById("tryon-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* ─── HEADER ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass bg-gray-950/70 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  OptiView
                </h1>
                <p className="text-[10px] text-white/30 -mt-0.5 tracking-widest uppercase hidden sm:block">
                  Virtual Try-On
                </p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={() => {
                  setActiveSection("tryon");
                  document.getElementById("tryon-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-white/50 hover:text-white hover:bg-white/5 rounded-full px-4 text-sm"
              >
                <Camera className="w-4 h-4 mr-2" />
                Probador
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setActiveSection("features");
                  document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-white/50 hover:text-white hover:bg-white/5 rounded-full px-4 text-sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Características
              </Button>
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="hidden sm:flex bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs gap-1"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En línea
              </Badge>
              <Button
                onClick={handleStartTryOn}
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold rounded-full px-5 shadow-lg shadow-amber-500/20 text-sm"
              >
                Probar Ahora
              </Button>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white/60"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/[0.06] bg-gray-950/95 backdrop-blur-lg"
            >
              <div className="px-4 py-3 space-y-1">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setActiveSection("tryon");
                    setShowHero(false);
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      document.getElementById("tryon-section")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="w-full justify-start text-white/60 hover:text-white rounded-lg"
                >
                  <Camera className="w-4 h-4 mr-3" />
                  Probador Virtual
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setActiveSection("features");
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="w-full justify-start text-white/60 hover:text-white rounded-lg"
                >
                  <Sparkles className="w-4 h-4 mr-3" />
                  Características
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── HERO SECTION ─── */}
      <AnimatePresence>
        {showHero && (
          <motion.section
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="relative pt-16"
          >
            <div className="relative min-h-[90vh] flex items-center overflow-hidden">
              {/* Background gradient effects */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/[0.03] rounded-full blur-3xl" />
              </div>

              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: "60px 60px",
                }}
              />

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  {/* Left - Text */}
                  <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center lg:text-left"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-medium text-amber-300">
                        Tecnología IA de última generación
                      </span>
                    </motion.div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
                      <span className="bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
                        Pruébate anteojos{" "}
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                        en tiempo real
                      </span>
                    </h2>

                    <p className="text-lg sm:text-xl text-white/40 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
                      La experiencia de probador virtual más avanzada. Solo enfoca tu rostro y
                      elige entre nuestra colección exclusiva de diseños.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <Button
                        onClick={handleStartTryOn}
                        size="lg"
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold px-8 py-6 rounded-2xl shadow-xl shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40 hover:scale-[1.02] text-base"
                      >
                        <Camera className="w-5 h-5 mr-2.5" />
                        Comenzar Probador
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          setShowHero(false);
                          setActiveSection("tryon");
                          setTimeout(() => {
                            document.getElementById("tryon-section")?.scrollIntoView({ behavior: "smooth" });
                          }, 100);
                        }}
                        className="border-white/10 text-white/60 hover:bg-white/5 hover:text-white rounded-2xl px-8 py-6 text-base"
                      >
                        <Glasses className="w-5 h-5 mr-2.5" />
                        Ver Colección
                      </Button>
                    </div>

                    {/* Social proof */}
                    <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                      <div className="flex -space-x-3">
                        {["bg-gradient-to-br from-pink-400 to-rose-500", "bg-gradient-to-br from-sky-400 to-blue-500", "bg-gradient-to-br from-emerald-400 to-green-500", "bg-gradient-to-br from-violet-400 to-purple-500"].map((bg, i) => (
                          <div
                            key={i}
                            className={`w-10 h-10 rounded-full ${bg} border-2 border-gray-950 flex items-center justify-center text-xs font-bold text-white`}
                          >
                            {["AM", "LR", "SP", "JG"][i]}
                          </div>
                        ))}
                      </div>
                      <div className="text-center sm:text-left">
                        <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                          <Stars />
                          <span className="text-sm font-semibold text-white/80">4.9</span>
                        </div>
                        <p className="text-xs text-white/30 mt-0.5">
                          +2,400 usuarios satisfechos
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right - Hero visual */}
                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="relative hidden lg:block"
                  >
                    <div className="relative">
                      {/* Glow */}
                      <div className="absolute -inset-10 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-3xl blur-2xl" />
                      
                      {/* Main card */}
                      <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl">
                        <img
                          src="/hero-glasses.jpg"
                          alt="Virtual try-on preview"
                          className="w-full h-[500px] object-cover"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent" />
                        
                        {/* Floating badge */}
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-2xl p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
                                <Glasses className="w-7 h-7 text-amber-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-semibold text-sm">Detección Facial IA</p>
                                <p className="text-white/40 text-xs mt-0.5">Posicionamiento preciso en tiempo real</p>
                              </div>
                              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Floating elements */}
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 backdrop-blur-xl flex items-center justify-center shadow-xl"
                      >
                        <Zap className="w-7 h-7 text-amber-400" />
                      </motion.div>

                      <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -bottom-4 -left-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/20 backdrop-blur-xl flex items-center justify-center shadow-xl"
                      >
                        <Shield className="w-6 h-6 text-emerald-400" />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
              >
                <span className="text-xs text-white/20 tracking-widest uppercase">Scroll</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ChevronDown className="w-4 h-4 text-white/20" />
                </motion.div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ─── MAIN TRY-ON SECTION ─── */}
      <section id="tryon-section" className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-medium text-amber-300 tracking-wide">
                Probador Virtual
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Tu espejo inteligente
              </span>
            </h2>
            <p className="text-white/30 text-sm mt-2 max-w-md mx-auto">
              Activa la cámara, elige un modelo y visualízate al instante
            </p>
          </motion.div>

          {/* Main content: Camera + Gallery */}
          <div className="grid lg:grid-cols-5 gap-6 items-start">
            {/* Camera Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3"
            >
              <TryOnCamera
                selectedGlasses={selectedGlasses}
              />

              {/* Quick tips */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { icon: <Camera className="w-4 h-4" />, label: "Enfoca tu rostro" },
                  { icon: <Glasses className="w-4 h-4" />, label: "Elige un modelo" },
                  { icon: <Smartphone className="w-4 h-4" />, label: "Captura la foto" },
                ].map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div className="text-amber-400/60">{tip.icon}</div>
                    <span className="text-[11px] text-white/30 font-medium">{tip.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Gallery Area */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden h-[600px] lg:h-[calc(100vh-7rem)]">
                <GlassesGallery
                  selectedGlasses={selectedGlasses}
                  onSelect={selectRef}
                  customGlasses={customGlasses}
                  onAddCustom={addCustomRef}
                  onDeleteCustom={deleteCustomRef}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="py-20 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 14, suffix: "+", label: "Modelos de anteojos" },
              { value: 99, suffix: "%", label: "Precisión de detección" },
              { value: 30, suffix: "fps", label: "Rendimiento en tiempo real" },
              { value: 2400, suffix: "+", label: "Usuarios activos" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
              >
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-xs text-white/30 mt-2 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features-section" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-medium text-amber-300 tracking-wide">
                Tecnología Premium
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                ¿Por qué elegir OptiView?
              </span>
            </h2>
            <p className="text-white/30 text-base max-w-lg mx-auto">
              La combinación perfecta de inteligencia artificial y diseño de moda para una
              experiencia de prueba virtual incomparable.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={<Eye className="w-6 h-6 text-amber-400" />}
              title="Detección Facial IA"
              desc="MediaPipe Face Mesh con 468 puntos de referencia para un posicionamiento milimétrico de los anteojos sobre tu rostro."
              delay={0}
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-amber-400" />}
              title="Tiempo Real 30fps"
              desc="Procesamiento fluido sin retardos. Los anteojos se mueven contigo de forma natural y precisa."
              delay={0.1}
            />
            <FeatureCard
              icon={<Glasses className="w-6 h-6 text-amber-400" />}
              title="14+ Modelos Exclusivos"
              desc="Colección curada con los estilos más populares: wayfarer, aviador, redondo, cat eye y más."
              delay={0.2}
            />
            <FeatureCard
              icon={<Upload className="w-6 h-6 text-amber-400" />}
              title="Sube tus Anteojos"
              desc="Importa imágenes de tus propios modelos con fondo transparente y pruébatelos al instante."
              delay={0.3}
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-amber-400" />}
              title="100% Privado"
              desc="Todo el procesamiento se realiza localmente en tu dispositivo. Ninguna foto se envía a servidores."
              delay={0.4}
            />
            <FeatureCard
              icon={<Camera className="w-6 h-6 text-amber-400" />}
              title="Captura y Comparte"
              desc="Toma fotos con los anteojos puestos y descárgalas para compartir con amigos o familiares."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent" />
            <div className="absolute inset-0 border border-amber-500/10 rounded-3xl" />

            <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-500/30"
              >
                <Eye className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  ¿Listo para probarte tus anteojos ideales?
                </span>
              </h2>
              <p className="text-white/40 text-lg max-w-lg mx-auto mb-10">
                Activa la cámara ahora y descubre cómo te quedan nuestros modelos más exclusivos.
              </p>

              <Button
                onClick={handleStartTryOn}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold px-10 py-7 rounded-2xl shadow-xl shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40 hover:scale-[1.02] text-lg"
              >
                <Camera className="w-6 h-6 mr-2.5" />
                Ir al Probador
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/[0.06] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/80">OptiView</p>
                <p className="text-[10px] text-white/30">Virtual Try-On Technology</p>
              </div>
            </div>

            <p className="text-xs text-white/20">
              &copy; {new Date().getFullYear()} OptiView. Todos los derechos reservados.
              Hecho con IA y pasión.
            </p>

            <div className="flex items-center gap-4">
              <span className="text-xs text-white/20">Privacidad</span>
              <span className="text-xs text-white/20">Términos</span>
              <span className="text-xs text-white/20">Contacto</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
