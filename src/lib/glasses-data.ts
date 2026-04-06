export interface GlassesModel {
  id: string;
  name: string;
  brand: string;
  category: "classic" | "aviator" | "round" | "cat-eye" | "sport" | "browline" | "oversized" | "custom";
  price: string;
  color: string;
  imageUrl: string;       // HD photo for gallery display
  svgDataUrl: string;     // Transparent SVG for face overlay
}

function createSvgDataUrl(svgContent: string): string {
  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
}

// ─── SVG Overlays (transparent, for face rendering) ───

const svgWayfarer = createSvgDataUrl(`<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wl" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(20,20,20,0.82)"/>
      <stop offset="100%" stop-color="rgba(50,50,50,0.72)"/>
    </linearGradient>
    <filter id="ws"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.4)"/></filter>
  </defs>
  <path d="M15,30 L15,65 Q15,75 25,75 L105,75 Q115,75 115,65 L115,30 Q115,20 105,20 L80,20 Q70,20 68,25 Q65,30 60,30 L25,30 Q15,30 15,30Z" fill="none" stroke="#111" stroke-width="5" stroke-linejoin="round"/>
  <path d="M19,34 L19,63 Q19,71 27,71 L103,71 Q111,71 111,63 L111,34 Q111,24 103,24 L82,24 Q74,24 72,28 Q68,34 60,34 L27,34 Q19,34 19,34Z" fill="url(#wl)" filter="url(#ws)"/>
  <path d="M125,30 L125,65 Q125,75 135,75 L215,75 Q225,75 225,65 L225,30 Q225,20 215,20 L190,20 Q180,20 178,25 Q175,30 170,30 L135,30 Q125,30 125,30Z" fill="none" stroke="#111" stroke-width="5" stroke-linejoin="round"/>
  <path d="M129,34 L129,63 Q129,71 137,71 L213,71 Q221,71 221,63 L221,34 Q221,24 213,24 L192,24 Q184,24 182,28 Q178,34 170,34 L137,34 Q129,34 129,34Z" fill="url(#wl)" filter="url(#ws)"/>
  <path d="M115,34 Q120,28 125,34" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
  <path d="M15,31 Q5,26 0,20" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
  <path d="M225,31 Q235,26 240,20" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
  <path d="M28,40 L62,40 L58,43 L28,43Z" fill="rgba(255,255,255,0.18)" opacity="0.7"/>
  <path d="M138,40 L172,40 L168,43 L138,43Z" fill="rgba(255,255,255,0.18)" opacity="0.7"/>
</svg>`);

const svgAviator = createSvgDataUrl(`<svg viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="al" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(30,20,10,0.7)"/>
      <stop offset="50%" stop-color="rgba(60,40,20,0.6)"/>
      <stop offset="100%" stop-color="rgba(30,20,10,0.7)"/>
    </linearGradient>
    <linearGradient id="gf" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#B8860B"/><stop offset="50%" stop-color="#FFD700"/><stop offset="100%" stop-color="#B8860B"/>
    </linearGradient>
    <filter id="as"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/></filter>
  </defs>
  <path d="M10,28 Q10,15 30,12 Q60,8 95,15 Q120,20 120,40 Q120,65 90,75 Q60,82 30,75 Q10,70 10,55Z" fill="none" stroke="url(#gf)" stroke-width="3"/>
  <path d="M14,32 Q14,19 32,16 Q60,12 93,19 Q116,24 116,40 Q116,62 88,72 Q60,78 32,72 Q14,67 14,55Z" fill="url(#al)" filter="url(#as)"/>
  <path d="M140,28 Q140,15 160,12 Q190,8 225,15 Q250,20 250,40 Q250,65 220,75 Q190,82 160,75 Q140,70 140,55Z" fill="none" stroke="url(#gf)" stroke-width="3"/>
  <path d="M144,32 Q144,19 162,16 Q190,12 223,19 Q246,24 246,40 Q246,62 218,72 Q190,78 162,72 Q144,67 144,55Z" fill="url(#al)" filter="url(#as)"/>
  <path d="M120,27 Q130,19 140,27" fill="none" stroke="url(#gf)" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="115" cy="56" rx="4" ry="7" fill="url(#gf)"/>
  <ellipse cx="145" cy="56" rx="4" ry="7" fill="url(#gf)"/>
  <path d="M10,24 Q0,19 0,11" fill="none" stroke="url(#gf)" stroke-width="3" stroke-linecap="round"/>
  <path d="M250,24 Q260,19 260,11" fill="none" stroke="url(#gf)" stroke-width="3" stroke-linecap="round"/>
  <path d="M38,24 L82,18 Q88,18 88,21 L38,27Z" fill="rgba(255,255,255,0.12)" opacity="0.6"/>
  <path d="M168,24 L212,18 Q218,18 218,21 L168,27Z" fill="rgba(255,255,255,0.12)" opacity="0.6"/>
</svg>`);

const svgRound = createSvgDataUrl(`<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="rl" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(20,15,5,0.6)"/><stop offset="100%" stop-color="rgba(45,30,10,0.5)"/>
    </linearGradient>
    <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#B8860B"/><stop offset="50%" stop-color="#DAA520"/><stop offset="100%" stop-color="#B8860B"/>
    </linearGradient>
    <filter id="rs"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/></filter>
  </defs>
  <circle cx="65" cy="50" r="36" fill="none" stroke="url(#rg)" stroke-width="3"/>
  <circle cx="65" cy="50" r="33" fill="url(#rl)" filter="url(#rs)"/>
  <circle cx="175" cy="50" r="36" fill="none" stroke="url(#rg)" stroke-width="3"/>
  <circle cx="175" cy="50" r="33" fill="url(#rl)" filter="url(#rs)"/>
  <path d="M101,44 Q120,36 139,44" fill="none" stroke="url(#rg)" stroke-width="3" stroke-linecap="round"/>
  <path d="M29,42 Q19,37 10,31" fill="none" stroke="url(#rg)" stroke-width="3" stroke-linecap="round"/>
  <path d="M211,42 Q221,37 230,31" fill="none" stroke="url(#rg)" stroke-width="3" stroke-linecap="round"/>
  <path d="M38,36 L72,34 L69,39 L36,40Z" fill="rgba(255,255,255,0.12)" opacity="0.6"/>
  <path d="M148,36 L182,34 L179,39 L146,40Z" fill="rgba(255,255,255,0.12)" opacity="0.6"/>
</svg>`);

const svgCatEye = createSvgDataUrl(`<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cl" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(15,15,15,0.78)"/><stop offset="100%" stop-color="rgba(40,40,40,0.68)"/>
    </linearGradient>
    <filter id="cs"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)"/></filter>
  </defs>
  <path d="M10,50 Q8,30 20,20 Q35,10 55,12 Q80,15 100,25 Q110,30 110,45 Q110,65 90,72 Q65,78 40,72 Q15,68 10,50Z" fill="none" stroke="#111" stroke-width="5" stroke-linejoin="round"/>
  <path d="M14,50 Q12,32 24,24 Q38,15 56,16 Q78,19 98,28 Q106,32 106,45 Q106,62 88,68 Q65,74 42,68 Q19,64 14,50Z" fill="url(#cl)" filter="url(#cs)"/>
  <path d="M130,50 Q128,30 140,20 Q155,10 175,12 Q200,15 220,25 Q230,30 230,45 Q230,65 210,72 Q185,78 160,72 Q135,68 130,50Z" fill="none" stroke="#111" stroke-width="5" stroke-linejoin="round"/>
  <path d="M134,50 Q132,32 144,24 Q158,15 176,16 Q198,19 218,28 Q226,32 226,45 Q226,62 208,68 Q185,74 162,68 Q139,64 134,50Z" fill="url(#cl)" filter="url(#cs)"/>
  <path d="M110,37 Q120,30 130,37" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
  <path d="M10,34 Q2,24 0,14" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
  <path d="M230,34 Q238,24 240,14" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
  <path d="M28,34 L56,26 L52,31 L26,37Z" fill="rgba(255,255,255,0.15)" opacity="0.6"/>
  <path d="M148,34 L176,26 L172,31 L146,37Z" fill="rgba(255,255,255,0.15)" opacity="0.6"/>
</svg>`);

const svgSport = createSvgDataUrl(`<svg viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sl" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(10,10,10,0.82)"/><stop offset="50%" stop-color="rgba(20,20,30,0.72)"/><stop offset="100%" stop-color="rgba(10,10,10,0.82)"/>
    </linearGradient>
    <filter id="ss"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)"/></filter>
  </defs>
  <path d="M5,30 Q5,10 30,8 Q80,4 130,8 Q180,4 230,8 Q255,10 255,30 Q255,70 220,80 Q180,88 130,85 Q80,88 40,80 Q5,70 5,30Z" fill="none" stroke="#222" stroke-width="5" stroke-linejoin="round"/>
  <path d="M9,32 Q9,14 32,12 Q80,8 130,12 Q180,8 228,12 Q251,14 251,32 Q251,67 218,76 Q180,84 130,81 Q80,84 42,76 Q9,67 9,32Z" fill="url(#sl)" filter="url(#ss)"/>
  <path d="M120,19 Q130,15 140,19" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round"/>
  <path d="M125,48 Q130,53 135,48" fill="none" stroke="#333" stroke-width="2"/>
  <path d="M5,24 Q-2,19 -5,11" fill="none" stroke="#222" stroke-width="5" stroke-linecap="round"/>
  <path d="M255,24 Q262,19 265,11" fill="none" stroke="#222" stroke-width="5" stroke-linecap="round"/>
  <path d="M28,21 Q80,12 130,15 L130,19 Q80,16 28,25Z" fill="rgba(255,255,255,0.1)" opacity="0.7"/>
</svg>`);

const svgClubmaster = createSvgDataUrl(`<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bl" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(20,20,20,0.55)"/><stop offset="100%" stop-color="rgba(40,40,40,0.45)"/>
    </linearGradient>
    <filter id="bs"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)"/></filter>
  </defs>
  <path d="M5,22 L5,18 Q5,12 15,12 L105,12 Q115,12 115,18 L115,32 Q115,72 60,72 Q5,72 5,32Z" fill="none" stroke="#111" stroke-width="4"/>
  <path d="M9,22 L9,20 Q9,16 17,16 L103,16 Q111,16 111,20 L111,32 Q111,68 60,68 Q9,68 9,32Z" fill="url(#bl)" filter="url(#bs)"/>
  <rect x="5" y="7" width="110" height="15" rx="4" fill="#111"/>
  <path d="M125,22 L125,18 Q125,12 135,12 L225,12 Q235,12 235,18 L235,32 Q235,72 180,72 Q125,72 125,32Z" fill="none" stroke="#111" stroke-width="4"/>
  <path d="M129,22 L129,20 Q129,16 137,16 L223,16 Q231,16 231,20 L231,32 Q231,68 180,68 Q129,68 129,32Z" fill="url(#bl)" filter="url(#bs)"/>
  <rect x="125" y="7" width="110" height="15" rx="4" fill="#111"/>
  <path d="M115,14 Q120,9 125,14" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <line x1="5" y1="14" x2="0" y2="9" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <line x1="235" y1="14" x2="240" y2="9" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <path d="M18,28 L52,28 L49,32 L16,32Z" fill="rgba(255,255,255,0.12)" opacity="0.6"/>
  <path d="M138,28 L172,28 L169,32 L136,32Z" fill="rgba(255,255,255,0.12)" opacity="0.6"/>
</svg>`);

const svgTortoise = createSvgDataUrl(`<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tl" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(60,30,10,0.75)"/><stop offset="100%" stop-color="rgba(90,50,20,0.65)"/>
    </linearGradient>
    <linearGradient id="tf" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8B4513"/><stop offset="30%" stop-color="#D2691E"/><stop offset="60%" stop-color="#8B4513"/><stop offset="100%" stop-color="#A0522D"/>
    </linearGradient>
    <filter id="ts"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)"/></filter>
  </defs>
  <path d="M15,30 L15,65 Q15,75 25,75 L105,75 Q115,75 115,65 L115,30 Q115,20 105,20 L80,20 Q70,20 68,25 Q65,30 60,30 L25,30 Q15,30 15,30Z" fill="none" stroke="url(#tf)" stroke-width="6" stroke-linejoin="round"/>
  <path d="M19,34 L19,63 Q19,71 27,71 L103,71 Q111,71 111,63 L111,34 Q111,24 103,24 L82,24 Q74,24 72,28 Q68,34 60,34 L27,34 Q19,34 19,34Z" fill="url(#tl)" filter="url(#ts)"/>
  <path d="M125,30 L125,65 Q125,75 135,75 L215,75 Q225,75 225,65 L225,30 Q225,20 215,20 L190,20 Q180,20 178,25 Q175,30 170,30 L135,30 Q125,30 125,30Z" fill="none" stroke="url(#tf)" stroke-width="6" stroke-linejoin="round"/>
  <path d="M129,34 L129,63 Q129,71 137,71 L213,71 Q221,71 221,63 L221,34 Q221,24 213,24 L192,24 Q184,24 182,28 Q178,34 170,34 L137,34 Q129,34 129,34Z" fill="url(#tl)" filter="url(#ts)"/>
  <path d="M115,34 Q120,28 125,34" fill="none" stroke="#8B4513" stroke-width="6" stroke-linecap="round"/>
  <path d="M15,31 Q5,26 0,20" fill="none" stroke="#8B4513" stroke-width="6" stroke-linecap="round"/>
  <path d="M225,31 Q235,26 240,20" fill="none" stroke="#8B4513" stroke-width="6" stroke-linecap="round"/>
</svg>`);

const svgOversized = createSvgDataUrl(`<svg viewBox="0 0 260 110" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ol" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(15,15,15,0.78)"/><stop offset="100%" stop-color="rgba(30,30,30,0.68)"/>
    </linearGradient>
    <filter id="os"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)"/></filter>
  </defs>
  <ellipse cx="70" cy="55" rx="65" ry="45" fill="none" stroke="#111" stroke-width="5"/>
  <ellipse cx="70" cy="55" rx="62" ry="42" fill="url(#ol)" filter="url(#os)"/>
  <ellipse cx="190" cy="55" rx="65" ry="45" fill="none" stroke="#111" stroke-width="5"/>
  <ellipse cx="190" cy="55" rx="62" ry="42" fill="url(#ol)" filter="url(#os)"/>
  <path d="M135,47 Q140,40 145,47" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
  <path d="M5,39 Q0,34 0,24" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
  <path d="M255,39 Q260,34 260,24" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="45" cy="38" rx="26" ry="14" fill="rgba(255,255,255,0.1)" opacity="0.5" transform="rotate(-10 45 38)"/>
  <ellipse cx="165" cy="38" rx="26" ry="14" fill="rgba(255,255,255,0.1)" opacity="0.5" transform="rotate(-10 165 38)"/>
</svg>`);

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
    svgDataUrl: svgWayfarer,
  },
  {
    id: "wayfarer-tortoise",
    name: "Wayfarer Tortuga",
    brand: "OPTICA",
    category: "classic",
    price: "$95",
    color: "#8B4513",
    imageUrl: "/glasses/wayfarer-tortoise.png",
    svgDataUrl: svgTortoise,
  },
  {
    id: "aviator-gold",
    name: "Aviador Dorado",
    brand: "PREMIUM",
    category: "aviator",
    price: "$129",
    color: "#DAA520",
    imageUrl: "/glasses/aviator-gold.png",
    svgDataUrl: svgAviator,
  },
  {
    id: "aviator-silver",
    name: "Aviador Plateado",
    brand: "PREMIUM",
    category: "aviator",
    price: "$129",
    color: "#C0C0C0",
    imageUrl: "/glasses/aviator-gold.png",
    svgDataUrl: svgAviator,
  },
  {
    id: "round-lennon",
    name: "Round Vintage",
    brand: "RETRO",
    category: "round",
    price: "$79",
    color: "#1a1a1a",
    imageUrl: "/glasses/round-gold.png",
    svgDataUrl: svgRound,
  },
  {
    id: "round-gold",
    name: "Round Dorado",
    brand: "RETRO",
    category: "round",
    price: "$99",
    color: "#DAA520",
    imageUrl: "/glasses/round-gold.png",
    svgDataUrl: svgRound,
  },
  {
    id: "cateye-black",
    name: "Cat Eye Negro",
    brand: "FASHION",
    category: "cat-eye",
    price: "$109",
    color: "#1a1a1a",
    imageUrl: "/glasses/cateye-black.png",
    svgDataUrl: svgCatEye,
  },
  {
    id: "cateye-red",
    name: "Cat Eye Rojo",
    brand: "FASHION",
    category: "cat-eye",
    price: "$109",
    color: "#DC143C",
    imageUrl: "/glasses/cateye-black.png",
    svgDataUrl: svgCatEye,
  },
  {
    id: "sport-wrap",
    name: "Sport Shield",
    brand: "SPORT",
    category: "sport",
    price: "$149",
    color: "#333",
    imageUrl: "/glasses/sport-black.png",
    svgDataUrl: svgSport,
  },
  {
    id: "browline-black",
    name: "Clubmaster",
    brand: "CLASSIC",
    category: "browline",
    price: "$99",
    color: "#1a1a1a",
    imageUrl: "/glasses/clubmaster-black.png",
    svgDataUrl: svgClubmaster,
  },
  {
    id: "oversized-black",
    name: "Oversized Glam",
    brand: "FASHION",
    category: "oversized",
    price: "$119",
    color: "#1a1a1a",
    imageUrl: "/glasses/oversized-clear.png",
    svgDataUrl: svgOversized,
  },
  {
    id: "clear-frame",
    name: "Transparente",
    brand: "MODERN",
    category: "classic",
    price: "$89",
    color: "#b4b4b4",
    imageUrl: "/glasses/oversized-clear.png",
    svgDataUrl: svgWayfarer,
  },
];
