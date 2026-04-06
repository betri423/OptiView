export interface GlassesModel {
  id: string;
  name: string;
  brand: string;
  category: "classic" | "aviator" | "round" | "cat-eye" | "sport" | "browline" | "oversized" | "custom";
  price: string;
  color: string;
  imageUrl: string;       // HD photo for gallery display
  overlayUrl: string;     // Transparent image for face overlay (AI-generated photorealistic)
}

// ─── Categories ───

export const GLASSES_CATEGORIES = [
  { id: "all", label: "Todos", icon: "LayoutGrid" },
  { id: "classic", label: "Clásicos", icon: "Glasses" },
  { id: "aviator", label: "Aviador", icon: "Plane" },
  { id: "round", label: "Redondos", icon: "Circle" },
  { id: "cat-eye", label: "Gato", icon: "Cat" },
  { id: "sport", label: "Deporte", icon: "Zap" },
  { id: "browline", label: "Browline", icon: "Minimize2" },
  { id: "oversized", label: "Oversize", icon: "Maximize2" },
] as const;

// ─── Collection ───

export const defaultGlasses: GlassesModel[] = [
  {
    id: "wayfarer-black",
    name: "Wayfarer Classic",
    brand: "OPTICA",
    category: "classic",
    price: "$89",
    color: "#1a1a1a",
    imageUrl: "/glasses/wayfarer-black.png",
    overlayUrl: "/glasses/wayfarer-black.png",
  },
  {
    id: "wayfarer-tortoise",
    name: "Wayfarer Tortuga",
    brand: "OPTICA",
    category: "classic",
    price: "$95",
    color: "#8B4513",
    imageUrl: "/glasses/wayfarer-tortoise.png",
    overlayUrl: "/glasses/wayfarer-tortoise.png",
  },
  {
    id: "aviator-gold",
    name: "Aviador Dorado",
    brand: "PREMIUM",
    category: "aviator",
    price: "$129",
    color: "#DAA520",
    imageUrl: "/glasses/aviator-gold.png",
    overlayUrl: "/glasses/aviator-gold.png",
  },
  {
    id: "aviator-silver",
    name: "Aviador Plateado",
    brand: "PREMIUM",
    category: "aviator",
    price: "$129",
    color: "#C0C0C0",
    imageUrl: "/glasses/aviator-silver.png",
    overlayUrl: "/glasses/aviator-silver.png",
  },
  {
    id: "round-lennon",
    name: "Round Vintage",
    brand: "RETRO",
    category: "round",
    price: "$79",
    color: "#1a1a1a",
    imageUrl: "/glasses/round-gold.png",
    overlayUrl: "/glasses/round-gold.png",
  },
  {
    id: "round-gold",
    name: "Round Dorado",
    brand: "RETRO",
    category: "round",
    price: "$99",
    color: "#DAA520",
    imageUrl: "/glasses/round-gold.png",
    overlayUrl: "/glasses/round-gold.png",
  },
  {
    id: "cateye-black",
    name: "Cat Eye Negro",
    brand: "FASHION",
    category: "cat-eye",
    price: "$109",
    color: "#1a1a1a",
    imageUrl: "/glasses/cateye-black.png",
    overlayUrl: "/glasses/cateye-black.png",
  },
  {
    id: "cateye-red",
    name: "Cat Eye Rojo",
    brand: "FASHION",
    category: "cat-eye",
    price: "$109",
    color: "#DC143C",
    imageUrl: "/glasses/cateye-red.png",
    overlayUrl: "/glasses/cateye-red.png",
  },
  {
    id: "sport-wrap",
    name: "Sport Shield",
    brand: "SPORT",
    category: "sport",
    price: "$149",
    color: "#333",
    imageUrl: "/glasses/sport-black.png",
    overlayUrl: "/glasses/sport-black.png",
  },
  {
    id: "browline-black",
    name: "Clubmaster",
    brand: "CLASSIC",
    category: "browline",
    price: "$99",
    color: "#1a1a1a",
    imageUrl: "/glasses/clubmaster-black.png",
    overlayUrl: "/glasses/clubmaster-black.png",
  },
  {
    id: "oversized-black",
    name: "Oversized Glam",
    brand: "FASHION",
    category: "oversized",
    price: "$119",
    color: "#1a1a1a",
    imageUrl: "/glasses/oversized-black.png",
    overlayUrl: "/glasses/oversized-black.png",
  },
  {
    id: "clear-frame",
    name: "Transparente",
    brand: "MODERN",
    category: "classic",
    price: "$89",
    color: "#b4b4b4",
    imageUrl: "/glasses/clear-frame.png",
    overlayUrl: "/glasses/clear-frame.png",
  },
  {
    id: "oversized-clear",
    name: "Oversized Crystal",
    brand: "FASHION",
    category: "oversized",
    price: "$115",
    color: "#e0d5c8",
    imageUrl: "/glasses/oversized-clear.png",
    overlayUrl: "/glasses/oversized-clear.png",
  },
];
