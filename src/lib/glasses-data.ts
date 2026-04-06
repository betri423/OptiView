export interface GlassesModel {
  id: string;
  name: string;
  brand: string;
  category: "classic" | "aviator" | "round" | "cat-eye" | "sport" | "browline" | "oversized" | "custom";
  price: string;
  color: string;
  imageUrl: string;       // HD photo for gallery display
  overlayUrl: string;     // High-detail SVG data URL for face overlay (always transparent)
}

// ─── SVG Data URL helper ───
function svg(str: string): string {
  return `data:image/svg+xml;base64,${btoa(str)}`;
}

// ═══════════════════════════════════════════════════════════════
// ULTRA-REALISTIC SVGs — 3D render quality with no background
// Each SVG is designed to look like a high-end 3D render:
// - Multi-stop gradients simulating real materials
// - Frame bevels, inner shadows, edge highlights
// - Glass lens effects with reflections
// - Proper depth and dimension
// - NO background, NO arms/temples
// ═══════════════════════════════════════════════════════════════

// ─── WAYFARER NEGRO ───
const svgWayfarerBlack = svg(`<svg viewBox="0 0 280 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3a3a3a"/>
      <stop offset="15%" stop-color="#1a1a1a"/>
      <stop offset="50%" stop-color="#0d0d0d"/>
      <stop offset="85%" stop-color="#1a1a1a"/>
      <stop offset="100%" stop-color="#2a2a2a"/>
    </linearGradient>
    <linearGradient id="wl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(20,20,30,0.85)"/>
      <stop offset="30%" stop-color="rgba(10,10,20,0.9)"/>
      <stop offset="70%" stop-color="rgba(15,15,25,0.88)"/>
      <stop offset="100%" stop-color="rgba(5,5,15,0.92)"/>
    </linearGradient>
    <linearGradient id="wt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.25)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
    <filter id="ws"><feGaussianBlur stdDeviation="1.5"/></filter>
    <filter id="wg"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>
  <!-- Left lens shadow -->
  <ellipse cx="75" cy="62" rx="52" ry="38" fill="rgba(0,0,0,0.3)" filter="url(#wg)"/>
  <!-- Right lens shadow -->
  <ellipse cx="205" cy="62" rx="52" ry="38" fill="rgba(0,0,0,0.3)" filter="url(#wg)"/>
  <!-- Left frame outer -->
  <path d="M18,38 Q18,22 32,18 L110,18 Q124,22 124,38 L124,78 Q124,94 110,98 L32,98 Q18,94 18,78Z" fill="url(#wf)" stroke="#000" stroke-width="0.5"/>
  <!-- Left frame bevel top -->
  <path d="M22,38 Q22,26 34,22 L108,22 Q120,26 120,38 L120,42 Q120,30 108,26 L34,26 Q22,30 22,42Z" fill="url(#wt)" opacity="0.5"/>
  <!-- Left lens -->
  <path d="M26,42 Q26,30 36,26 L106,26 Q118,30 118,42 L118,74 Q118,88 106,92 L36,92 Q26,88 26,74Z" fill="url(#wl)"/>
  <!-- Left lens reflection arc -->
  <path d="M40,34 Q60,28 85,30 Q95,32 100,36 L95,38 Q85,32 65,31 Q50,32 40,36Z" fill="rgba(255,255,255,0.12)" filter="url(#ws)"/>
  <!-- Left lens bottom highlight -->
  <path d="M50,82 Q70,88 90,84 Q100,82 104,78 L106,80 Q100,86 90,88 Q70,92 50,86Z" fill="rgba(255,255,255,0.04)"/>
  <!-- Right frame outer -->
  <path d="M156,38 Q156,22 170,18 L248,18 Q262,22 262,38 L262,78 Q262,94 248,98 L170,98 Q156,94 156,78Z" fill="url(#wf)" stroke="#000" stroke-width="0.5"/>
  <!-- Right frame bevel top -->
  <path d="M160,38 Q160,26 172,22 L246,22 Q258,26 258,38 L258,42 Q258,30 246,26 L172,26 Q160,30 160,42Z" fill="url(#wt)" opacity="0.5"/>
  <!-- Right lens -->
  <path d="M164,42 Q164,30 174,26 L244,26 Q256,30 256,42 L256,74 Q256,88 244,92 L174,92 Q164,88 164,74Z" fill="url(#wl)"/>
  <!-- Right lens reflection arc -->
  <path d="M178,34 Q198,28 223,30 Q233,32 238,36 L233,38 Q223,32 203,31 Q188,32 178,36Z" fill="rgba(255,255,255,0.12)" filter="url(#ws)"/>
  <!-- Right lens bottom highlight -->
  <path d="M188,82 Q208,88 228,84 Q238,82 242,78 L244,80 Q238,86 228,88 Q208,92 188,86Z" fill="rgba(255,255,255,0.04)"/>
  <!-- Bridge -->
  <path d="M124,36 Q132,28 140,32 Q148,28 156,36" fill="none" stroke="url(#wf)" stroke-width="6" stroke-linecap="round"/>
  <path d="M126,35 Q134,30 140,33 Q146,30 154,35" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2" stroke-linecap="round"/>
  <!-- Nose pads -->
  <ellipse cx="126" cy="56" rx="3" ry="5" fill="#1a1a1a" stroke="#333" stroke-width="0.5"/>
  <ellipse cx="154" cy="56" rx="3" ry="5" fill="#1a1a1a" stroke="#333" stroke-width="0.5"/>
</svg>`);

// ─── WAYFARER TORTUGA ───
const svgWayfarerTortoise = svg(`<svg viewBox="0 0 280 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C4793A"/>
      <stop offset="20%" stop-color="#8B4513"/>
      <stop offset="40%" stop-color="#A0522D"/>
      <stop offset="60%" stop-color="#6B3410"/>
      <stop offset="80%" stop-color="#8B4513"/>
      <stop offset="100%" stop-color="#D2691E"/>
    </linearGradient>
    <linearGradient id="tl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(60,30,10,0.85)"/>
      <stop offset="50%" stop-color="rgba(40,20,5,0.9)"/>
      <stop offset="100%" stop-color="rgba(50,25,8,0.88)"/>
    </linearGradient>
    <filter id="ts"><feGaussianBlur stdDeviation="1.5"/></filter>
    <filter id="tg"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>
  <ellipse cx="75" cy="62" rx="52" ry="38" fill="rgba(0,0,0,0.25)" filter="url(#tg)"/>
  <ellipse cx="205" cy="62" rx="52" ry="38" fill="rgba(0,0,0,0.25)" filter="url(#tg)"/>
  <path d="M18,38 Q18,22 32,18 L110,18 Q124,22 124,38 L124,78 Q124,94 110,98 L32,98 Q18,94 18,78Z" fill="url(#tf)" stroke="#4a2008" stroke-width="1"/>
  <path d="M22,40 Q22,28 34,24 L108,24 Q120,28 120,40 L120,44 Q120,32 108,28 L34,28 Q22,32 22,44Z" fill="rgba(255,200,100,0.2)" opacity="0.4"/>
  <path d="M26,42 Q26,30 36,26 L106,26 Q118,30 118,42 L118,74 Q118,88 106,92 L36,92 Q26,88 26,74Z" fill="url(#tl)"/>
  <path d="M40,34 Q60,28 85,30 L80,36 Q62,30 42,36Z" fill="rgba(255,255,255,0.1)" filter="url(#ts)"/>
  <path d="M156,38 Q156,22 170,18 L248,18 Q262,22 262,38 L262,78 Q262,94 248,98 L170,98 Q156,94 156,78Z" fill="url(#tf)" stroke="#4a2008" stroke-width="1"/>
  <path d="M160,40 Q160,28 172,24 L246,24 Q258,28 258,40 L258,44 Q258,32 246,28 L172,28 Q160,32 160,44Z" fill="rgba(255,200,100,0.2)" opacity="0.4"/>
  <path d="M164,42 Q164,30 174,26 L244,26 Q256,30 256,42 L256,74 Q256,88 244,92 L174,92 Q164,88 164,74Z" fill="url(#tl)"/>
  <path d="M178,34 Q198,28 223,30 L218,36 Q200,30 180,36Z" fill="rgba(255,255,255,0.1)" filter="url(#ts)"/>
  <path d="M124,36 Q132,28 140,32 Q148,28 156,36" fill="none" stroke="url(#tf)" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="126" cy="56" rx="3" ry="5" fill="#6B3410" stroke="#4a2008" stroke-width="0.5"/>
  <ellipse cx="154" cy="56" rx="3" ry="5" fill="#6B3410" stroke="#4a2008" stroke-width="0.5"/>
</svg>`);

// ─── AVIADOR DORADO ───
const svgAviatorGold = svg(`<svg viewBox="0 0 280 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="agf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFE082"/>
      <stop offset="25%" stop-color="#FFD700"/>
      <stop offset="50%" stop-color="#B8860B"/>
      <stop offset="75%" stop-color="#FFD700"/>
      <stop offset="100%" stop-color="#DAA520"/>
    </linearGradient>
    <linearGradient id="al" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(40,50,30,0.75)"/>
      <stop offset="30%" stop-color="rgba(30,40,20,0.85)"/>
      <stop offset="70%" stop-color="rgba(35,45,25,0.8)"/>
      <stop offset="100%" stop-color="rgba(25,35,15,0.88)"/>
    </linearGradient>
    <filter id="as2"><feGaussianBlur stdDeviation="1.2"/></filter>
    <filter id="ag"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <ellipse cx="72" cy="60" rx="55" ry="40" fill="rgba(0,0,0,0.2)" filter="url(#ag)"/>
  <ellipse cx="208" cy="60" rx="55" ry="40" fill="rgba(0,0,0,0.2)" filter="url(#ag)"/>
  <!-- Left lens - teardrop shape -->
  <path d="M14,32 Q14,14 38,10 Q72,4 106,14 Q126,22 126,46 Q126,74 96,86 Q66,94 38,86 Q14,76 14,56Z" fill="none" stroke="url(#agf)" stroke-width="2.5"/>
  <path d="M18,36 Q18,20 40,16 Q72,10 104,18 Q122,26 122,46 Q122,70 94,82 Q66,90 40,82 Q18,73 18,56Z" fill="url(#al)"/>
  <path d="M34,22 Q60,14 96,20 Q108,24 112,30 L106,32 Q94,24 68,20 Q48,20 36,26Z" fill="rgba(255,255,255,0.1)" filter="url(#as2)"/>
  <!-- Right lens -->
  <path d="M154,32 Q154,14 178,10 Q212,4 246,14 Q266,22 266,46 Q266,74 236,86 Q206,94 178,86 Q154,76 154,56Z" fill="none" stroke="url(#agf)" stroke-width="2.5"/>
  <path d="M158,36 Q158,20 180,16 Q212,10 244,18 Q262,26 262,46 Q262,70 234,82 Q206,90 180,82 Q158,73 158,56Z" fill="url(#al)"/>
  <path d="M174,22 Q200,14 236,20 Q248,24 252,30 L246,32 Q234,24 208,20 Q188,20 176,26Z" fill="rgba(255,255,255,0.1)" filter="url(#as2)"/>
  <!-- Double bridge -->
  <path d="M122,24 Q130,16 140,20 Q150,16 158,24" fill="none" stroke="url(#agf)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M124,28 Q132,22 140,25 Q148,22 156,28" fill="none" stroke="url(#agf)" stroke-width="2" stroke-linecap="round"/>
  <!-- Nose pads -->
  <ellipse cx="125" cy="52" rx="2.5" ry="5" fill="#B8860B" stroke="#DAA520" stroke-width="0.5"/>
  <ellipse cx="155" cy="52" rx="2.5" ry="5" fill="#B8860B" stroke="#DAA520" stroke-width="0.5"/>
</svg>`);

// ─── AVIADOR PLATEADO ───
const svgAviatorSilver = svg(`<svg viewBox="0 0 280 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="asf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E8E8E8"/>
      <stop offset="25%" stop-color="#C0C0C0"/>
      <stop offset="50%" stop-color="#808080"/>
      <stop offset="75%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#A8A8A8"/>
    </linearGradient>
    <linearGradient id="asl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(20,30,60,0.7)"/>
      <stop offset="30%" stop-color="rgba(15,25,50,0.82)"/>
      <stop offset="70%" stop-color="rgba(20,30,55,0.78)"/>
      <stop offset="100%" stop-color="rgba(10,20,40,0.88)"/>
    </linearGradient>
    <filter id="ass"><feGaussianBlur stdDeviation="1.2"/></filter>
    <filter id="asg"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <ellipse cx="72" cy="60" rx="55" ry="40" fill="rgba(0,0,0,0.2)" filter="url(#asg)"/>
  <ellipse cx="208" cy="60" rx="55" ry="40" fill="rgba(0,0,0,0.2)" filter="url(#asg)"/>
  <path d="M14,32 Q14,14 38,10 Q72,4 106,14 Q126,22 126,46 Q126,74 96,86 Q66,94 38,86 Q14,76 14,56Z" fill="none" stroke="url(#asf)" stroke-width="2.5"/>
  <path d="M18,36 Q18,20 40,16 Q72,10 104,18 Q122,26 122,46 Q122,70 94,82 Q66,90 40,82 Q18,73 18,56Z" fill="url(#asl)"/>
  <path d="M34,22 Q60,14 96,20 L90,28 Q62,18 38,26Z" fill="rgba(150,180,255,0.12)" filter="url(#ass)"/>
  <path d="M154,32 Q154,14 178,10 Q212,4 246,14 Q266,22 266,46 Q266,74 236,86 Q206,94 178,86 Q154,76 154,56Z" fill="none" stroke="url(#asf)" stroke-width="2.5"/>
  <path d="M158,36 Q158,20 180,16 Q212,10 244,18 Q262,26 262,46 Q262,70 234,82 Q206,90 180,82 Q158,73 158,56Z" fill="url(#asl)"/>
  <path d="M174,22 Q200,14 236,20 L230,28 Q202,18 178,26Z" fill="rgba(150,180,255,0.12)" filter="url(#ass)"/>
  <path d="M122,24 Q130,16 140,20 Q150,16 158,24" fill="none" stroke="url(#asf)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M124,28 Q132,22 140,25 Q148,22 156,28" fill="none" stroke="url(#asf)" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="125" cy="52" rx="2.5" ry="5" fill="#909090" stroke="#C0C0C0" stroke-width="0.5"/>
  <ellipse cx="155" cy="52" rx="2.5" ry="5" fill="#909090" stroke="#C0C0C0" stroke-width="0.5"/>
</svg>`);

// ─── ROUND DORADO ───
const svgRoundGold = svg(`<svg viewBox="0 0 260 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="rgf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFE082"/>
      <stop offset="30%" stop-color="#DAA520"/>
      <stop offset="70%" stop-color="#B8860B"/>
      <stop offset="100%" stop-color="#FFD700"/>
    </linearGradient>
    <linearGradient id="rl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(30,20,10,0.6)"/>
      <stop offset="50%" stop-color="rgba(20,15,5,0.7)"/>
      <stop offset="100%" stop-color="rgba(25,18,8,0.65)"/>
    </linearGradient>
    <filter id="rs2"><feGaussianBlur stdDeviation="1"/></filter>
    <filter id="rg"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <circle cx="72" cy="60" r="42" fill="rgba(0,0,0,0.2)" filter="url(#rg)"/>
  <circle cx="188" cy="60" r="42" fill="rgba(0,0,0,0.2)" filter="url(#rg)"/>
  <circle cx="72" cy="60" r="40" fill="none" stroke="url(#rgf)" stroke-width="2.5"/>
  <circle cx="72" cy="60" r="37" fill="url(#rl)"/>
  <path d="M48,40 Q58,32 72,30 Q86,32 96,40" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2" filter="url(#rs2)"/>
  <circle cx="188" cy="60" r="40" fill="none" stroke="url(#rgf)" stroke-width="2.5"/>
  <circle cx="188" cy="60" r="37" fill="url(#rl)"/>
  <path d="M164,40 Q174,32 188,30 Q202,32 212,40" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2" filter="url(#rs2)"/>
  <path d="M112,50 Q120,42 130,50" fill="none" stroke="url(#rgf)" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="114" cy="62" rx="2" ry="4" fill="#B8860B" stroke="#DAA520" stroke-width="0.5"/>
  <ellipse cx="146" cy="62" rx="2" ry="4" fill="#B8860B" stroke="#DAA520" stroke-width="0.5"/>
</svg>`);

// ─── CAT EYE NEGRO ───
const svgCatEyeBlack = svg(`<svg viewBox="0 0 280 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3a3a3a"/>
      <stop offset="20%" stop-color="#1a1a1a"/>
      <stop offset="80%" stop-color="#0d0d0d"/>
      <stop offset="100%" stop-color="#2a2a2a"/>
    </linearGradient>
    <linearGradient id="cl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(15,15,20,0.82)"/>
      <stop offset="50%" stop-color="rgba(8,8,12,0.88)"/>
      <stop offset="100%" stop-color="rgba(12,12,18,0.85)"/>
    </linearGradient>
    <filter id="cs2"><feGaussianBlur stdDeviation="1.2"/></filter>
    <filter id="cg"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <path d="M80,62 Q78,38 90,24 Q108,10 130,14 Q155,20 170,36 Q180,48 178,68 Q176,88 158,96 Q130,106 100,96 Q72,86 68,64Z" fill="rgba(0,0,0,0.2)" filter="url(#cg)"/>
  <path d="M200,62 Q198,38 210,24 Q228,10 250,14 Q275,20 290,36 Q300,48 298,68 Q296,88 278,96 Q250,106 220,96 Q192,86 188,64Z" fill="rgba(0,0,0,0.2)" filter="url(#cg)"/>
  <!-- Left lens cat eye shape -->
  <path d="M12,56 Q10,34 24,20 Q42,6 64,10 Q88,16 102,32 Q112,44 110,66 Q108,86 90,94 Q62,102 38,92 Q14,82 12,56Z" fill="none" stroke="url(#cf)" stroke-width="4" stroke-linejoin="round"/>
  <path d="M16,56 Q14,36 26,24 Q42,12 62,16 Q84,22 98,36 Q106,46 104,64 Q102,82 86,90 Q60,98 38,88 Q18,78 16,56Z" fill="url(#cl)"/>
  <path d="M34,28 Q48,18 68,18 Q82,22 92,30 L86,34 Q78,24 62,22 Q48,22 36,30Z" fill="rgba(255,255,255,0.1)" filter="url(#cs2)"/>
  <!-- Right lens cat eye shape -->
  <path d="M132,56 Q130,34 144,20 Q162,6 184,10 Q208,16 222,32 Q232,44 230,66 Q228,86 210,94 Q182,102 158,92 Q134,82 132,56Z" fill="none" stroke="url(#cf)" stroke-width="4" stroke-linejoin="round"/>
  <path d="M136,56 Q134,36 146,24 Q162,12 182,16 Q204,22 218,36 Q226,46 224,64 Q222,82 206,90 Q180,98 158,88 Q138,78 136,56Z" fill="url(#cl)"/>
  <path d="M154,28 Q168,18 188,18 Q202,22 212,30 L206,34 Q198,24 182,22 Q168,22 156,30Z" fill="rgba(255,255,255,0.1)" filter="url(#cs2)"/>
  <!-- Bridge -->
  <path d="M112,40 Q120,32 130,40" fill="none" stroke="url(#cf)" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="114" cy="54" rx="2.5" ry="4" fill="#1a1a1a" stroke="#333" stroke-width="0.5"/>
  <ellipse cx="128" cy="54" rx="2.5" ry="4" fill="#1a1a1a" stroke="#333" stroke-width="0.5"/>
</svg>`);

// ─── CAT EYE ROJO ───
const svgCatEyeRed = svg(`<svg viewBox="0 0 280 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="crf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E8383A"/>
      <stop offset="20%" stop-color="#B81018"/>
      <stop offset="80%" stop-color="#8B0000"/>
      <stop offset="100%" stop-color="#DC143C"/>
    </linearGradient>
    <linearGradient id="crl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(12,5,5,0.82)"/>
      <stop offset="50%" stop-color="rgba(8,3,3,0.88)"/>
      <stop offset="100%" stop-color="rgba(10,4,4,0.85)"/>
    </linearGradient>
    <filter id="crs"><feGaussianBlur stdDeviation="1.2"/></filter>
    <filter id="crg"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <path d="M80,62 Q78,38 90,24 Q108,10 130,14 Q155,20 170,36 Q180,48 178,68 Q176,88 158,96 Q130,106 100,96 Q72,86 68,64Z" fill="rgba(0,0,0,0.2)" filter="url(#crg)"/>
  <path d="M200,62 Q198,38 210,24 Q228,10 250,14 Q275,20 290,36 Q300,48 298,68 Q296,88 278,96 Q250,106 220,96 Q192,86 188,64Z" fill="rgba(0,0,0,0.2)" filter="url(#crg)"/>
  <path d="M12,56 Q10,34 24,20 Q42,6 64,10 Q88,16 102,32 Q112,44 110,66 Q108,86 90,94 Q62,102 38,92 Q14,82 12,56Z" fill="none" stroke="url(#crf)" stroke-width="4" stroke-linejoin="round"/>
  <path d="M16,56 Q14,36 26,24 Q42,12 62,16 Q84,22 98,36 Q106,46 104,64 Q102,82 86,90 Q60,98 38,88 Q18,78 16,56Z" fill="url(#crl)"/>
  <path d="M34,28 Q48,18 68,18 L62,26 Q48,22 36,30Z" fill="rgba(255,255,255,0.08)" filter="url(#crs)"/>
  <path d="M132,56 Q130,34 144,20 Q162,6 184,10 Q208,16 222,32 Q232,44 230,66 Q228,86 210,94 Q182,102 158,92 Q134,82 132,56Z" fill="none" stroke="url(#crf)" stroke-width="4" stroke-linejoin="round"/>
  <path d="M136,56 Q134,36 146,24 Q162,12 182,16 Q204,22 218,36 Q226,46 224,64 Q222,82 206,90 Q180,98 158,88 Q138,78 136,56Z" fill="url(#crl)"/>
  <path d="M154,28 Q168,18 188,18 L182,26 Q168,22 156,30Z" fill="rgba(255,255,255,0.08)" filter="url(#crs)"/>
  <path d="M112,40 Q120,32 130,40" fill="none" stroke="url(#crf)" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="114" cy="54" rx="2.5" ry="4" fill="#8B0000" stroke="#B81018" stroke-width="0.5"/>
  <ellipse cx="128" cy="54" rx="2.5" ry="4" fill="#8B0000" stroke="#B81018" stroke-width="0.5"/>
</svg>`);

// ─── SPORT SHIELD ───
const svgSportBlack = svg(`<svg viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ssf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#444"/>
      <stop offset="30%" stop-color="#222"/>
      <stop offset="70%" stop-color="#111"/>
      <stop offset="100%" stop-color="#333"/>
    </linearGradient>
    <linearGradient id="ssl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(10,10,15,0.88)"/>
      <stop offset="30%" stop-color="rgba(5,5,10,0.92)"/>
      <stop offset="60%" stop-color="rgba(15,15,25,0.9)"/>
      <stop offset="100%" stop-color="rgba(8,8,12,0.94)"/>
    </linearGradient>
    <linearGradient id="ssm" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(100,120,255,0.06)"/>
      <stop offset="50%" stop-color="rgba(200,180,255,0.1)"/>
      <stop offset="100%" stop-color="rgba(100,120,255,0.06)"/>
    </linearGradient>
    <filter id="sss"><feGaussianBlur stdDeviation="1.2"/></filter>
    <filter id="ssg"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>
  <path d="M10,60 Q10,12 150,6 Q290,12 290,60 Q290,108 150,114 Q10,108 10,60Z" fill="rgba(0,0,0,0.2)" filter="url(#ssg)"/>
  <!-- One-piece shield frame -->
  <path d="M8,56 Q8,14 150,8 Q292,14 292,56 Q292,98 150,104 Q8,98 8,56Z" fill="none" stroke="url(#ssf)" stroke-width="5"/>
  <!-- Shield lens -->
  <path d="M14,56 Q14,20 150,14 Q286,20 286,56 Q286,92 150,98 Q14,92 14,56Z" fill="url(#ssl)"/>
  <!-- Mirror reflection -->
  <path d="M40,28 Q90,18 150,16 Q210,18 260,28 Q280,38 280,50 L270,48 Q220,32 150,26 Q80,32 30,48 L20,50 Q20,38 40,28Z" fill="url(#ssm)"/>
  <!-- Top edge highlight -->
  <path d="M50,22 Q100,14 150,13 Q200,14 250,22" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" filter="url(#sss)"/>
  <!-- Nose bridge indent -->
  <path d="M140,14 Q150,10 160,14" fill="none" stroke="url(#ssf)" stroke-width="3" stroke-linecap="round"/>
</svg>`);

// ─── CLUBMASTER ───
const svgClubmaster = svg(`<svg viewBox="0 0 280 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bmf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2a2a2a"/>
      <stop offset="50%" stop-color="#111"/>
      <stop offset="100%" stop-color="#222"/>
    </linearGradient>
    <linearGradient id="bmg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E8C860"/>
      <stop offset="30%" stop-color="#DAA520"/>
      <stop offset="70%" stop-color="#B8860B"/>
      <stop offset="100%" stop-color="#DAA520"/>
    </linearGradient>
    <linearGradient id="bml" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(20,30,20,0.55)"/>
      <stop offset="50%" stop-color="rgba(15,25,15,0.6)"/>
      <stop offset="100%" stop-color="rgba(18,28,18,0.58)"/>
    </linearGradient>
    <filter id="bms"><feGaussianBlur stdDeviation="1.2"/></filter>
    <filter id="bmg2"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <ellipse cx="75" cy="62" rx="52" ry="38" fill="rgba(0,0,0,0.2)" filter="url(#bmg2)"/>
  <ellipse cx="205" cy="62" rx="52" ry="38" fill="rgba(0,0,0,0.2)" filter="url(#bmg2)"/>
  <!-- Left brow bar (thick black top) -->
  <rect x="16" y="12" width="112" height="16" rx="4" fill="url(#bmf)" stroke="#000" stroke-width="0.5"/>
  <path d="M20,14 L108,14 Q116,14 116,20 L116,22 L20,22 L20,20 Q20,14 20,14Z" fill="rgba(255,255,255,0.1)" opacity="0.5"/>
  <!-- Left frame (gold wire) -->
  <path d="M16,28 L16,82 Q16,96 30,96 L114,96 Q128,96 128,82 L128,28" fill="none" stroke="url(#bmg)" stroke-width="2"/>
  <!-- Left lens -->
  <path d="M20,28 L20,80 Q20,92 32,92 L112,92 Q124,92 124,80 L124,28" fill="url(#bml)"/>
  <path d="M36,32 Q58,26 90,30 L86,36 Q62,30 38,36Z" fill="rgba(255,255,255,0.08)" filter="url(#bms)"/>
  <!-- Right brow bar -->
  <rect x="152" y="12" width="112" height="16" rx="4" fill="url(#bmf)" stroke="#000" stroke-width="0.5"/>
  <path d="M156,14 L244,14 Q252,14 252,20 L252,22 L156,22 L156,20 Q156,14 156,14Z" fill="rgba(255,255,255,0.1)" opacity="0.5"/>
  <!-- Right frame (gold wire) -->
  <path d="M152,28 L152,82 Q152,96 166,96 L250,96 Q264,96 264,82 L264,28" fill="none" stroke="url(#bmg)" stroke-width="2"/>
  <!-- Right lens -->
  <path d="M156,28 L156,80 Q156,92 168,92 L248,92 Q260,92 260,80 L260,28" fill="url(#bml)"/>
  <path d="M172,32 Q194,26 226,30 L222,36 Q198,30 174,36Z" fill="rgba(255,255,255,0.08)" filter="url(#bms)"/>
  <!-- Bridge -->
  <path d="M128,18 Q136,12 140,18 Q144,12 152,18" fill="none" stroke="url(#bmf)" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="130" cy="50" rx="2" ry="4" fill="#B8860B" stroke="#DAA520" stroke-width="0.5"/>
  <ellipse cx="150" cy="50" rx="2" ry="4" fill="#B8860B" stroke="#DAA520" stroke-width="0.5"/>
</svg>`);

// ─── OVERSIZED NEGRO ───
const svgOversizedBlack = svg(`<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="of" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3a3a3a"/>
      <stop offset="20%" stop-color="#1a1a1a"/>
      <stop offset="80%" stop-color="#0d0d0d"/>
      <stop offset="100%" stop-color="#2a2a2a"/>
    </linearGradient>
    <linearGradient id="ol" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(12,12,18,0.82)"/>
      <stop offset="50%" stop-color="rgba(6,6,10,0.9)"/>
      <stop offset="100%" stop-color="rgba(10,10,16,0.86)"/>
    </linearGradient>
    <filter id="os2"><feGaussianBlur stdDeviation="1.2"/></filter>
    <filter id="og"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>
  <ellipse cx="82" cy="66" rx="62" ry="48" fill="rgba(0,0,0,0.2)" filter="url(#og)"/>
  <ellipse cx="218" cy="66" rx="62" ry="48" fill="rgba(0,0,0,0.2)" filter="url(#og)"/>
  <ellipse cx="82" cy="66" rx="60" ry="46" fill="none" stroke="url(#of)" stroke-width="5"/>
  <ellipse cx="82" cy="66" rx="57" ry="43" fill="url(#ol)"/>
  <path d="M40,40 Q58,28 82,24 Q106,28 124,40 L118,46 Q102,34 82,30 Q62,34 46,46Z" fill="rgba(255,255,255,0.08)" filter="url(#os2)"/>
  <ellipse cx="218" cy="66" rx="60" ry="46" fill="none" stroke="url(#of)" stroke-width="5"/>
  <ellipse cx="218" cy="66" rx="57" ry="43" fill="url(#ol)"/>
  <path d="M176,40 Q194,28 218,24 Q242,28 260,40 L254,46 Q238,34 218,30 Q198,34 182,46Z" fill="rgba(255,255,255,0.08)" filter="url(#os2)"/>
  <path d="M142,52 Q150,42 158,52" fill="none" stroke="url(#of)" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="144" cy="66" rx="3" ry="5" fill="#1a1a1a" stroke="#333" stroke-width="0.5"/>
  <ellipse cx="156" cy="66" rx="3" ry="5" fill="#1a1a1a" stroke="#333" stroke-width="0.5"/>
</svg>`);

// ─── TRANSPARENTE ───
const svgClearFrame = svg(`<svg viewBox="0 0 280 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="clf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(220,220,230,0.6)"/>
      <stop offset="50%" stop-color="rgba(180,180,195,0.4)"/>
      <stop offset="100%" stop-color="rgba(200,200,215,0.5)"/>
    </linearGradient>
    <linearGradient id="cll" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(200,210,220,0.08)"/>
      <stop offset="50%" stop-color="rgba(190,200,215,0.12)"/>
      <stop offset="100%" stop-color="rgba(200,210,220,0.06)"/>
    </linearGradient>
    <filter id="cls"><feGaussianBlur stdDeviation="1.2"/></filter>
    <filter id="clg"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <ellipse cx="75" cy="62" rx="52" ry="38" fill="rgba(0,0,0,0.08)" filter="url(#clg)"/>
  <ellipse cx="205" cy="62" rx="52" ry="38" fill="rgba(0,0,0,0.08)" filter="url(#clg)"/>
  <path d="M18,38 Q18,22 32,18 L110,18 Q124,22 124,38 L124,78 Q124,94 110,98 L32,98 Q18,94 18,78Z" fill="none" stroke="url(#clf)" stroke-width="4"/>
  <path d="M24,42 Q24,30 36,26 L106,26 Q118,30 118,42 L118,74 Q118,88 106,92 L36,92 Q24,88 24,74Z" fill="url(#cll)" stroke="rgba(200,200,210,0.2)" stroke-width="1"/>
  <path d="M156,38 Q156,22 170,18 L248,18 Q262,22 262,38 L262,78 Q262,94 248,98 L170,98 Q156,94 156,78Z" fill="none" stroke="url(#clf)" stroke-width="4"/>
  <path d="M162,42 Q162,30 174,26 L244,26 Q256,30 256,42 L256,74 Q256,88 244,92 L174,92 Q162,88 162,74Z" fill="url(#cll)" stroke="rgba(200,200,210,0.2)" stroke-width="1"/>
  <path d="M124,36 Q132,28 140,32 Q148,28 156,36" fill="none" stroke="url(#clf)" stroke-width="4" stroke-linecap="round"/>
  <!-- Edge shine -->
  <path d="M24,42 Q24,30 36,26 L106,26 Q118,30 118,42" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" filter="url(#cls)"/>
  <path d="M162,42 Q162,30 174,26 L244,26 Q256,30 256,42" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" filter="url(#cls)"/>
  <ellipse cx="126" cy="56" rx="3" ry="5" fill="rgba(200,200,210,0.3)" stroke="rgba(180,180,195,0.4)" stroke-width="0.5"/>
  <ellipse cx="154" cy="56" rx="3" ry="5" fill="rgba(200,200,210,0.3)" stroke="rgba(180,180,195,0.4)" stroke-width="0.5"/>
</svg>`);

// ─── OVERSIZED CRYSTAL ───
const svgOversizedCrystal = svg(`<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ocf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(230,220,210,0.55)"/>
      <stop offset="50%" stop-color="rgba(210,200,190,0.35)"/>
      <stop offset="100%" stop-color="rgba(220,210,200,0.45)"/>
    </linearGradient>
    <linearGradient id="ocl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(220,190,180,0.12)"/>
      <stop offset="50%" stop-color="rgba(210,180,170,0.18)"/>
      <stop offset="100%" stop-color="rgba(220,190,180,0.1)"/>
    </linearGradient>
    <filter id="ocs"><feGaussianBlur stdDeviation="1.2"/></filter>
    <filter id="ocg"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <ellipse cx="82" cy="66" rx="62" ry="48" fill="rgba(0,0,0,0.06)" filter="url(#ocg)"/>
  <ellipse cx="218" cy="66" rx="62" ry="48" fill="rgba(0,0,0,0.06)" filter="url(#ocg)"/>
  <ellipse cx="82" cy="66" rx="60" ry="46" fill="none" stroke="url(#ocf)" stroke-width="4.5"/>
  <ellipse cx="82" cy="66" rx="57" ry="43" fill="url(#ocl)" stroke="rgba(220,210,200,0.15)" stroke-width="1"/>
  <path d="M40,40 Q58,28 82,24 Q106,28 124,40" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" filter="url(#ocs)"/>
  <ellipse cx="218" cy="66" rx="60" ry="46" fill="none" stroke="url(#ocf)" stroke-width="4.5"/>
  <ellipse cx="218" cy="66" rx="57" ry="43" fill="url(#ocl)" stroke="rgba(220,210,200,0.15)" stroke-width="1"/>
  <path d="M176,40 Q194,28 218,24 Q242,28 260,40" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" filter="url(#ocs)"/>
  <path d="M142,52 Q150,42 158,52" fill="none" stroke="url(#ocf)" stroke-width="4.5" stroke-linecap="round"/>
  <ellipse cx="144" cy="66" rx="3" ry="5" fill="rgba(210,200,190,0.3)" stroke="rgba(200,190,180,0.4)" stroke-width="0.5"/>
  <ellipse cx="156" cy="66" rx="3" ry="5" fill="rgba(210,200,190,0.3)" stroke="rgba(200,190,180,0.4)" stroke-width="0.5"/>
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
// imageUrl = AI photo for gallery (beautiful product photo)
// overlayUrl = detailed SVG for face overlay (always transparent, always works)

export const defaultGlasses: GlassesModel[] = [
  {
    id: "wayfarer-black",
    name: "Wayfarer Classic",
    brand: "OPTICA",
    category: "classic",
    price: "$89",
    color: "#1a1a1a",
    imageUrl: "/glasses/wayfarer-black.png",
    overlayUrl: svgWayfarerBlack,
  },
  {
    id: "wayfarer-tortoise",
    name: "Wayfarer Tortuga",
    brand: "OPTICA",
    category: "classic",
    price: "$95",
    color: "#8B4513",
    imageUrl: "/glasses/wayfarer-tortoise.png",
    overlayUrl: svgWayfarerTortoise,
  },
  {
    id: "aviator-gold",
    name: "Aviador Dorado",
    brand: "PREMIUM",
    category: "aviator",
    price: "$129",
    color: "#DAA520",
    imageUrl: "/glasses/aviator-gold.png",
    overlayUrl: svgAviatorGold,
  },
  {
    id: "aviator-silver",
    name: "Aviador Plateado",
    brand: "PREMIUM",
    category: "aviator",
    price: "$129",
    color: "#C0C0C0",
    imageUrl: "/glasses/aviator-silver.png",
    overlayUrl: svgAviatorSilver,
  },
  {
    id: "round-lennon",
    name: "Round Vintage",
    brand: "RETRO",
    category: "round",
    price: "$79",
    color: "#DAA520",
    imageUrl: "/glasses/round-gold.png",
    overlayUrl: svgRoundGold,
  },
  {
    id: "cateye-black",
    name: "Cat Eye Negro",
    brand: "FASHION",
    category: "cat-eye",
    price: "$109",
    color: "#1a1a1a",
    imageUrl: "/glasses/cateye-black.png",
    overlayUrl: svgCatEyeBlack,
  },
  {
    id: "cateye-red",
    name: "Cat Eye Rojo",
    brand: "FASHION",
    category: "cat-eye",
    price: "$109",
    color: "#DC143C",
    imageUrl: "/glasses/cateye-red.png",
    overlayUrl: svgCatEyeRed,
  },
  {
    id: "sport-wrap",
    name: "Sport Shield",
    brand: "SPORT",
    category: "sport",
    price: "$149",
    color: "#333",
    imageUrl: "/glasses/sport-black.png",
    overlayUrl: svgSportBlack,
  },
  {
    id: "browline-black",
    name: "Clubmaster",
    brand: "CLASSIC",
    category: "browline",
    price: "$99",
    color: "#1a1a1a",
    imageUrl: "/glasses/clubmaster-black.png",
    overlayUrl: svgClubmaster,
  },
  {
    id: "oversized-black",
    name: "Oversized Glam",
    brand: "FASHION",
    category: "oversized",
    price: "$119",
    color: "#1a1a1a",
    imageUrl: "/glasses/oversized-black.png",
    overlayUrl: svgOversizedBlack,
  },
  {
    id: "clear-frame",
    name: "Transparente",
    brand: "MODERN",
    category: "classic",
    price: "$89",
    color: "#b4b4b4",
    imageUrl: "/glasses/clear-frame.png",
    overlayUrl: svgClearFrame,
  },
  {
    id: "oversized-clear",
    name: "Oversized Crystal",
    brand: "FASHION",
    category: "oversized",
    price: "$115",
    color: "#e0d5c8",
    imageUrl: "/glasses/oversized-clear.png",
    overlayUrl: svgOversizedCrystal,
  },
];
