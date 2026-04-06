export interface GlassesModel {
  id: string;
  name: string;
  brand: string;
  category: "classic" | "aviator" | "round" | "cat-eye" | "sport" | "browline" | "oversized" | "custom";
  price: string;
  color: string;
  svgDataUrl: string;
}

function createSvgDataUrl(svgContent: string): string {
  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
}

// Classic Wayfarer - Black
const wayfarerBlack = createSvgDataUrl(`<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lens1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(20,20,20,0.85)"/>
      <stop offset="100%" style="stop-color:rgba(40,40,40,0.75)"/>
    </linearGradient>
    <filter id="shadow1"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.3"/></filter>
  </defs>
  <!-- Left frame -->
  <path d="M15,30 L15,65 Q15,75 25,75 L105,75 Q115,75 115,65 L115,30 Q115,20 105,20 L80,20 Q70,20 68,25 Q65,30 60,30 L25,30 Q15,30 15,30 Z" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="round" filter="url(#shadow1)"/>
  <path d="M19,34 L19,63 Q19,71 27,71 L103,71 Q111,71 111,63 L111,34 Q111,24 103,24 L82,24 Q74,24 72,28 Q68,34 60,34 L27,34 Q19,34 19,34 Z" fill="url(#lens1)"/>
  <!-- Right frame -->
  <path d="M125,30 L125,65 Q125,75 135,75 L215,75 Q225,75 225,65 L225,30 Q225,20 215,20 L190,20 Q180,20 178,25 Q175,30 170,30 L135,30 Q125,30 125,30 Z" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="round" filter="url(#shadow1)"/>
  <path d="M129,34 L129,63 Q129,71 137,71 L213,71 Q221,71 221,63 L221,34 Q221,24 213,24 L192,24 Q184,24 182,28 Q178,34 170,34 L137,34 Q129,34 129,34 Z" fill="url(#lens1)"/>
  <!-- Bridge -->
  <path d="M115,35 Q120,30 125,35" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"/>
  <!-- Temples -->
  <path d="M15,32 Q5,28 0,22" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"/>
  <path d="M225,32 Q235,28 240,22" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"/>
  <!-- Shine -->
  <path d="M30,40 L60,40 L55,42 L30,42 Z" fill="rgba(255,255,255,0.15)"/>
  <path d="M140,40 L170,40 L165,42 L140,42 Z" fill="rgba(255,255,255,0.15)"/>
</svg>`);

// Classic Wayfarer - Tortoise
const wayfarerTortoise = createSvgDataUrl(`<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lens2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(60,30,10,0.8)"/>
      <stop offset="100%" style="stop-color:rgba(90,50,20,0.7)"/>
    </linearGradient>
    <linearGradient id="frame2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#8B4513"/>
      <stop offset="30%" style="stop-color:#D2691E"/>
      <stop offset="60%" style="stop-color:#8B4513"/>
      <stop offset="100%" style="stop-color:#A0522D"/>
    </linearGradient>
  </defs>
  <path d="M15,30 L15,65 Q15,75 25,75 L105,75 Q115,75 115,65 L115,30 Q115,20 105,20 L80,20 Q70,20 68,25 Q65,30 60,30 L25,30 Q15,30 15,30 Z" fill="none" stroke="url(#frame2)" stroke-width="5" stroke-linejoin="round"/>
  <path d="M19,34 L19,63 Q19,71 27,71 L103,71 Q111,71 111,63 L111,34 Q111,24 103,24 L82,24 Q74,24 72,28 Q68,34 60,34 L27,34 Q19,34 19,34 Z" fill="url(#lens2)"/>
  <path d="M125,30 L125,65 Q125,75 135,75 L215,75 Q225,75 225,65 L225,30 Q225,20 215,20 L190,20 Q180,20 178,25 Q175,30 170,30 L135,30 Q125,30 125,30 Z" fill="none" stroke="url(#frame2)" stroke-width="5" stroke-linejoin="round"/>
  <path d="M129,34 L129,63 Q129,71 137,71 L213,71 Q221,71 221,63 L221,34 Q221,24 213,24 L192,24 Q184,24 182,28 Q178,34 170,34 L137,34 Q129,34 129,34 Z" fill="url(#lens2)"/>
  <path d="M115,35 Q120,30 125,35" fill="none" stroke="#8B4513" stroke-width="5" stroke-linecap="round"/>
  <path d="M15,32 Q5,28 0,22" fill="none" stroke="#8B4513" stroke-width="5" stroke-linecap="round"/>
  <path d="M225,32 Q235,28 240,22" fill="none" stroke="#8B4513" stroke-width="5" stroke-linecap="round"/>
</svg>`);

// Aviator - Gold
const aviatorGold = createSvgDataUrl(`<svg viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="avi-lens" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(30,20,10,0.75)"/>
      <stop offset="50%" style="stop-color:rgba(60,40,20,0.65)"/>
      <stop offset="100%" style="stop-color:rgba(30,20,10,0.75)"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#B8860B"/>
      <stop offset="50%" style="stop-color:#FFD700"/>
      <stop offset="100%" style="stop-color:#B8860B"/>
    </linearGradient>
  </defs>
  <!-- Left lens (teardrop) -->
  <path d="M10,28 Q10,15 30,12 Q60,8 95,15 Q120,20 120,40 Q120,65 90,75 Q60,82 30,75 Q10,70 10,55 Z" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
  <path d="M14,32 Q14,19 32,16 Q60,12 93,19 Q116,24 116,40 Q116,62 88,72 Q60,78 32,72 Q14,67 14,55 Z" fill="url(#avi-lens)"/>
  <!-- Right lens (teardrop) -->
  <path d="M140,28 Q140,15 160,12 Q190,8 225,15 Q250,20 250,40 Q250,65 220,75 Q190,82 160,75 Q140,70 140,55 Z" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
  <path d="M144,32 Q144,19 162,16 Q190,12 223,19 Q246,24 246,40 Q246,62 218,72 Q190,78 162,72 Q144,67 144,55 Z" fill="url(#avi-lens)"/>
  <!-- Bridge -->
  <path d="M120,28 Q130,20 140,28" fill="none" stroke="url(#gold)" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Nose pads -->
  <ellipse cx="115" cy="55" rx="4" ry="6" fill="url(#gold)"/>
  <ellipse cx="145" cy="55" rx="4" ry="6" fill="url(#gold)"/>
  <!-- Temples -->
  <path d="M10,25 Q0,20 0,12" fill="none" stroke="url(#gold)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M250,25 Q260,20 260,12" fill="none" stroke="url(#gold)" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Shine -->
  <path d="M40,25 L80,20 Q85,20 85,22 L40,27 Z" fill="rgba(255,255,255,0.12)"/>
  <path d="M170,25 L210,20 Q215,20 215,22 L170,27 Z" fill="rgba(255,255,255,0.12)"/>
</svg>`);

// Aviator - Silver
const aviatorSilver = createSvgDataUrl(`<svg viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="avi-silver-lens" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(40,40,50,0.8)"/>
      <stop offset="50%" style="stop-color:rgba(60,60,70,0.7)"/>
      <stop offset="100%" style="stop-color:rgba(40,40,50,0.8)"/>
    </linearGradient>
    <linearGradient id="silver" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#808080"/>
      <stop offset="50%" style="stop-color:#C0C0C0"/>
      <stop offset="100%" style="stop-color:#808080"/>
    </linearGradient>
  </defs>
  <path d="M10,28 Q10,15 30,12 Q60,8 95,15 Q120,20 120,40 Q120,65 90,75 Q60,82 30,75 Q10,70 10,55 Z" fill="none" stroke="url(#silver)" stroke-width="2.5"/>
  <path d="M14,32 Q14,19 32,16 Q60,12 93,19 Q116,24 116,40 Q116,62 88,72 Q60,78 32,72 Q14,67 14,55 Z" fill="url(#avi-silver-lens)"/>
  <path d="M140,28 Q140,15 160,12 Q190,8 225,15 Q250,20 250,40 Q250,65 220,75 Q190,82 160,75 Q140,70 140,55 Z" fill="none" stroke="url(#silver)" stroke-width="2.5"/>
  <path d="M144,32 Q144,19 162,16 Q190,12 223,19 Q246,24 246,40 Q246,62 218,72 Q190,78 162,72 Q144,67 144,55 Z" fill="url(#avi-silver-lens)"/>
  <path d="M120,28 Q130,20 140,28" fill="none" stroke="url(#silver)" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="115" cy="55" rx="4" ry="6" fill="url(#silver)"/>
  <ellipse cx="145" cy="55" rx="4" ry="6" fill="url(#silver)"/>
  <path d="M10,25 Q0,20 0,12" fill="none" stroke="url(#silver)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M250,25 Q260,20 260,12" fill="none" stroke="url(#silver)" stroke-width="2.5" stroke-linecap="round"/>
</svg>`);

// Round - John Lennon
const roundLennon = createSvgDataUrl(`<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="round-lens" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(20,10,5,0.7)"/>
      <stop offset="100%" style="stop-color:rgba(50,25,10,0.6)"/>
    </linearGradient>
  </defs>
  <circle cx="65" cy="50" r="35" fill="none" stroke="#1a1a1a" stroke-width="3"/>
  <circle cx="65" cy="50" r="32" fill="url(#round-lens)"/>
  <circle cx="175" cy="50" r="35" fill="none" stroke="#1a1a1a" stroke-width="3"/>
  <circle cx="175" cy="50" r="32" fill="url(#round-lens)"/>
  <path d="M100,45 Q120,38 140,45" fill="none" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/>
  <path d="M30,42 Q20,38 10,32" fill="none" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/>
  <path d="M210,42 Q220,38 230,32" fill="none" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/>
  <path d="M40,38 L70,36 L68,40 L38,42 Z" fill="rgba(255,255,255,0.1)"/>
  <path d="M150,38 L180,36 L178,40 L148,42 Z" fill="rgba(255,255,255,0.1)"/>
</svg>`);

// Round - Gold Rim
const roundGold = createSvgDataUrl(`<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="round-gold-lens" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(20,15,5,0.65)"/>
      <stop offset="100%" style="stop-color:rgba(40,30,10,0.55)"/>
    </linearGradient>
    <linearGradient id="gold2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#B8860B"/>
      <stop offset="50%" style="stop-color:#DAA520"/>
      <stop offset="100%" style="stop-color:#B8860B"/>
    </linearGradient>
  </defs>
  <circle cx="65" cy="50" r="35" fill="none" stroke="url(#gold2)" stroke-width="2.5"/>
  <circle cx="65" cy="50" r="32.5" fill="url(#round-gold-lens)"/>
  <circle cx="175" cy="50" r="35" fill="none" stroke="url(#gold2)" stroke-width="2.5"/>
  <circle cx="175" cy="50" r="32.5" fill="url(#round-gold-lens)"/>
  <path d="M100,45 Q120,38 140,45" fill="none" stroke="url(#gold2)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M30,42 Q20,38 10,32" fill="none" stroke="url(#gold2)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M210,42 Q220,38 230,32" fill="none" stroke="url(#gold2)" stroke-width="2.5" stroke-linecap="round"/>
</svg>`);

// Cat Eye
const catEyeBlack = createSvgDataUrl(`<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cat-lens" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(15,15,15,0.8)"/>
      <stop offset="100%" style="stop-color:rgba(35,35,35,0.7)"/>
    </linearGradient>
  </defs>
  <!-- Left frame (cat eye - upswept outer edge) -->
  <path d="M10,50 Q8,30 20,20 Q35,10 55,12 Q80,15 100,25 Q110,30 110,45 Q110,65 90,72 Q65,78 40,72 Q15,68 10,50 Z" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="round"/>
  <path d="M14,50 Q12,32 24,24 Q38,15 56,16 Q78,19 98,28 Q106,32 106,45 Q106,62 88,68 Q65,74 42,68 Q19,64 14,50 Z" fill="url(#cat-lens)"/>
  <!-- Right frame -->
  <path d="M130,50 Q128,30 140,20 Q155,10 175,12 Q200,15 220,25 Q230,30 230,45 Q230,65 210,72 Q185,78 160,72 Q135,68 130,50 Z" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="round"/>
  <path d="M134,50 Q132,32 144,24 Q158,15 176,16 Q198,19 218,28 Q226,32 226,45 Q226,62 208,68 Q185,74 162,68 Q139,64 134,50 Z" fill="url(#cat-lens)"/>
  <path d="M110,38 Q120,32 130,38" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"/>
  <path d="M10,35 Q2,25 0,15" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"/>
  <path d="M230,35 Q238,25 240,15" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"/>
  <path d="M30,35 L55,28 L52,32 L28,38 Z" fill="rgba(255,255,255,0.12)"/>
  <path d="M150,35 L175,28 L172,32 L148,38 Z" fill="rgba(255,255,255,0.12)"/>
</svg>`);

// Cat Eye - Red
const catEyeRed = createSvgDataUrl(`<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cat-red-lens" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(60,0,0,0.75)"/>
      <stop offset="100%" style="stop-color:rgba(100,0,0,0.65)"/>
    </linearGradient>
    <linearGradient id="red-frame" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#8B0000"/>
      <stop offset="50%" style="stop-color:#DC143C"/>
      <stop offset="100%" style="stop-color:#8B0000"/>
    </linearGradient>
  </defs>
  <path d="M10,50 Q8,30 20,20 Q35,10 55,12 Q80,15 100,25 Q110,30 110,45 Q110,65 90,72 Q65,78 40,72 Q15,68 10,50 Z" fill="none" stroke="url(#red-frame)" stroke-width="4" stroke-linejoin="round"/>
  <path d="M14,50 Q12,32 24,24 Q38,15 56,16 Q78,19 98,28 Q106,32 106,45 Q106,62 88,68 Q65,74 42,68 Q19,64 14,50 Z" fill="url(#cat-red-lens)"/>
  <path d="M130,50 Q128,30 140,20 Q155,10 175,12 Q200,15 220,25 Q230,30 230,45 Q230,65 210,72 Q185,78 160,72 Q135,68 130,50 Z" fill="none" stroke="url(#red-frame)" stroke-width="4" stroke-linejoin="round"/>
  <path d="M134,50 Q132,32 144,24 Q158,15 176,16 Q198,19 218,28 Q226,32 226,45 Q226,62 208,68 Q185,74 162,68 Q139,64 134,50 Z" fill="url(#cat-red-lens)"/>
  <path d="M110,38 Q120,32 130,38" fill="none" stroke="url(#red-frame)" stroke-width="4" stroke-linecap="round"/>
  <path d="M10,35 Q2,25 0,15" fill="none" stroke="url(#red-frame)" stroke-width="4" stroke-linecap="round"/>
  <path d="M230,35 Q238,25 240,15" fill="none" stroke="url(#red-frame)" stroke-width="4" stroke-linecap="round"/>
</svg>`);

// Sport Wraparound
const sportWrap = createSvgDataUrl(`<svg viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sport-lens" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(10,10,10,0.85)"/>
      <stop offset="50%" style="stop-color:rgba(20,20,30,0.75)"/>
      <stop offset="100%" style="stop-color:rgba(10,10,10,0.85)"/>
    </linearGradient>
    <linearGradient id="sport-frame" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#222"/>
      <stop offset="50%" style="stop-color:#444"/>
      <stop offset="100%" style="stop-color:#222"/>
    </linearGradient>
  </defs>
  <!-- Continuous shield lens -->
  <path d="M5,30 Q5,10 30,8 Q80,4 130,8 Q180,4 230,8 Q255,10 255,30 Q255,70 220,80 Q180,88 130,85 Q80,88 40,80 Q5,70 5,30 Z" fill="none" stroke="url(#sport-frame)" stroke-width="4" stroke-linejoin="round"/>
  <path d="M9,32 Q9,14 32,12 Q80,8 130,12 Q180,8 228,12 Q251,14 251,32 Q251,67 218,76 Q180,84 130,81 Q80,84 42,76 Q9,67 9,32 Z" fill="url(#sport-lens)"/>
  <!-- Center bridge line -->
  <path d="M120,20 Q130,16 140,20" fill="none" stroke="url(#sport-frame)" stroke-width="3" stroke-linecap="round"/>
  <!-- Nose bridge -->
  <path d="M125,50 Q130,55 135,50" fill="none" stroke="url(#sport-frame)" stroke-width="2"/>
  <!-- Temples -->
  <path d="M5,25 Q-2,20 -5,12" fill="none" stroke="url(#sport-frame)" stroke-width="4" stroke-linecap="round"/>
  <path d="M255,25 Q262,20 265,12" fill="none" stroke="url(#sport-frame)" stroke-width="4" stroke-linecap="round"/>
  <!-- Shine -->
  <path d="M30,22 Q80,14 130,16 L130,20 Q80,18 30,26 Z" fill="rgba(255,255,255,0.1)"/>
</svg>`);

// Browline (Clubmaster style)
const browlineBlack = createSvgDataUrl(`<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brow-lens" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(20,20,20,0.6)"/>
      <stop offset="100%" style="stop-color:rgba(40,40,40,0.5)"/>
    </linearGradient>
  </defs>
  <!-- Left brow -->
  <path d="M5,22 L5,18 Q5,12 15,12 L105,12 Q115,12 115,18 L115,32 Q115,72 60,72 Q5,72 5,32 Z" fill="none" stroke="#1a1a1a" stroke-width="3.5"/>
  <path d="M9,22 L9,20 Q9,16 17,16 L103,16 Q111,16 111,20 L111,32 Q111,68 60,68 Q9,68 9,32 Z" fill="url(#brow-lens)"/>
  <!-- Left thick brow bar -->
  <rect x="5" y="8" width="110" height="14" rx="3" fill="#1a1a1a"/>
  <!-- Right brow -->
  <path d="M125,22 L125,18 Q125,12 135,12 L225,12 Q235,12 235,18 L235,32 Q235,72 180,72 Q125,72 125,32 Z" fill="none" stroke="#1a1a1a" stroke-width="3.5"/>
  <path d="M129,22 L129,20 Q129,16 137,16 L223,16 Q231,16 231,20 L231,32 Q231,68 180,68 Q129,68 129,32 Z" fill="url(#brow-lens)"/>
  <!-- Right thick brow bar -->
  <rect x="125" y="8" width="110" height="14" rx="3" fill="#1a1a1a"/>
  <!-- Bridge -->
  <path d="M115,15 Q120,10 125,15" fill="none" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/>
  <!-- Temples -->
  <line x1="5" y1="15" x2="0" y2="10" stroke="#1a1a1a" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="235" y1="15" x2="240" y2="10" stroke="#1a1a1a" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M20,28 L50,28 L48,32 L18,32 Z" fill="rgba(255,255,255,0.1)"/>
  <path d="M140,28 L170,28 L168,32 L138,32 Z" fill="rgba(255,255,255,0.1)"/>
</svg>`);

// Oversized - Black
const oversizedBlack = createSvgDataUrl(`<svg viewBox="0 0 260 110" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="over-lens" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(15,15,15,0.8)"/>
      <stop offset="100%" style="stop-color:rgba(30,30,30,0.7)"/>
    </linearGradient>
  </defs>
  <ellipse cx="70" cy="55" rx="65" ry="45" fill="none" stroke="#1a1a1a" stroke-width="4"/>
  <ellipse cx="70" cy="55" rx="62" ry="42" fill="url(#over-lens)"/>
  <ellipse cx="190" cy="55" rx="65" ry="45" fill="none" stroke="#1a1a1a" stroke-width="4"/>
  <ellipse cx="190" cy="55" rx="62" ry="42" fill="url(#over-lens)"/>
  <path d="M135,48 Q140,42 145,48" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"/>
  <path d="M5,40 Q0,35 0,25" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"/>
  <path d="M255,40 Q260,35 260,25" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="45" cy="40" rx="25" ry="15" fill="rgba(255,255,255,0.08)" transform="rotate(-10 45 40)"/>
  <ellipse cx="165" cy="40" rx="25" ry="15" fill="rgba(255,255,255,0.08)" transform="rotate(-10 165 40)"/>
</svg>`);

// Clear/Transparent Frame
const clearFrame = createSvgDataUrl(`<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="clear-lens" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(200,220,255,0.15)"/>
      <stop offset="100%" style="stop-color:rgba(180,200,240,0.1)"/>
    </linearGradient>
  </defs>
  <path d="M15,28 L15,65 Q15,75 25,75 L105,75 Q115,75 115,65 L115,30 Q115,20 105,20 L25,20 Q15,20 15,28 Z" fill="none" stroke="rgba(180,180,180,0.9)" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M19,32 L19,63 Q19,71 27,71 L103,71 Q111,71 111,63 L111,32 Q111,24 103,24 L27,24 Q19,24 19,32 Z" fill="url(#clear-lens)"/>
  <path d="M125,28 L125,65 Q125,75 135,75 L215,75 Q225,75 225,65 L225,30 Q225,20 215,20 L135,20 Q125,20 125,28 Z" fill="none" stroke="rgba(180,180,180,0.9)" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M129,32 L129,63 Q129,71 137,71 L213,71 Q221,71 221,63 L221,32 Q221,24 213,24 L137,24 Q129,24 129,32 Z" fill="url(#clear-lens)"/>
  <path d="M115,35 Q120,30 125,35" fill="none" stroke="rgba(180,180,180,0.9)" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M15,25 Q5,20 0,14" fill="none" stroke="rgba(180,180,180,0.9)" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M225,25 Q235,20 240,14" fill="none" stroke="rgba(180,180,180,0.9)" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M30,38 L55,38 L53,42 L28,42 Z" fill="rgba(255,255,255,0.08)"/>
  <path d="M140,38 L165,38 L163,42 L138,42 Z" fill="rgba(255,255,255,0.08)"/>
</svg>`);

// Retro Thick - Blue
const retroBlue = createSvgDataUrl(`<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="retro-lens" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(0,30,60,0.7)"/>
      <stop offset="100%" style="stop-color:rgba(0,50,100,0.6)"/>
    </linearGradient>
    <linearGradient id="blue-frame" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#1e3a5f"/>
      <stop offset="50%" style="stop-color:#2a5a8f"/>
      <stop offset="100%" style="stop-color:#1e3a5f"/>
    </linearGradient>
  </defs>
  <rect x="10" y="20" width="105" height="58" rx="12" fill="none" stroke="url(#blue-frame)" stroke-width="6" stroke-linejoin="round"/>
  <rect x="16" y="26" width="93" height="46" rx="8" fill="url(#retro-lens)"/>
  <rect x="125" y="20" width="105" height="58" rx="12" fill="none" stroke="url(#blue-frame)" stroke-width="6" stroke-linejoin="round"/>
  <rect x="131" y="26" width="93" height="46" rx="8" fill="url(#retro-lens)"/>
  <path d="M115,38 Q120,32 125,38" fill="none" stroke="url(#blue-frame)" stroke-width="6" stroke-linecap="round"/>
  <path d="M10,30 Q2,25 0,18" fill="none" stroke="url(#blue-frame)" stroke-width="6" stroke-linecap="round"/>
  <path d="M230,30 Q238,25 240,18" fill="none" stroke="url(#blue-frame)" stroke-width="6" stroke-linecap="round"/>
</svg>`);

// Geometric Hexagonal
const hexFrame = createSvgDataUrl(`<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hex-lens" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(10,10,10,0.75)"/>
      <stop offset="100%" style="stop-color:rgba(30,30,30,0.65)"/>
    </linearGradient>
  </defs>
  <polygon points="65,12 110,22 110,65 95,82 35,82 20,65 20,22" fill="none" stroke="#333" stroke-width="3" stroke-linejoin="round"/>
  <polygon points="65,16 107,25 107,63 93,79 37,79 23,63 23,25" fill="url(#hex-lens)"/>
  <polygon points="175,12 220,22 220,65 205,82 145,82 130,65 130,22" fill="none" stroke="#333" stroke-width="3" stroke-linejoin="round"/>
  <polygon points="175,16 217,25 217,63 203,79 147,79 133,63 133,25" fill="url(#hex-lens)"/>
  <path d="M110,35 Q117,30 130,35" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round"/>
  <path d="M20,28 Q10,24 0,18" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round"/>
  <path d="M220,28 Q230,24 240,18" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round"/>
</svg>`);

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

export const defaultGlasses: GlassesModel[] = [
  {
    id: "wayfarer-black",
    name: "Wayfarer Classic",
    brand: "OPTICA",
    category: "classic",
    price: "$89",
    color: "#1a1a1a",
    svgDataUrl: wayfarerBlack,
  },
  {
    id: "wayfarer-tortoise",
    name: "Wayfarer Tortuga",
    brand: "OPTICA",
    category: "classic",
    price: "$95",
    color: "#8B4513",
    svgDataUrl: wayfarerTortoise,
  },
  {
    id: "aviator-gold",
    name: "Aviador Dorado",
    brand: "PREMIUM",
    category: "aviator",
    price: "$129",
    color: "#DAA520",
    svgDataUrl: aviatorGold,
  },
  {
    id: "aviator-silver",
    name: "Aviador Plateado",
    brand: "PREMIUM",
    category: "aviator",
    price: "$129",
    color: "#C0C0C0",
    svgDataUrl: aviatorSilver,
  },
  {
    id: "round-lennon",
    name: "Round Vintage",
    brand: "RETRO",
    category: "round",
    price: "$79",
    color: "#1a1a1a",
    svgDataUrl: roundLennon,
  },
  {
    id: "round-gold",
    name: "Round Dorado",
    brand: "RETRO",
    category: "round",
    price: "$99",
    color: "#DAA520",
    svgDataUrl: roundGold,
  },
  {
    id: "cateye-black",
    name: "Cat Eye Negro",
    brand: "FASHION",
    category: "cat-eye",
    price: "$109",
    color: "#1a1a1a",
    svgDataUrl: catEyeBlack,
  },
  {
    id: "cateye-red",
    name: "Cat Eye Rojo",
    brand: "FASHION",
    category: "cat-eye",
    price: "$109",
    color: "#DC143C",
    svgDataUrl: catEyeRed,
  },
  {
    id: "sport-wrap",
    name: "Sport Shield",
    brand: "SPORT",
    category: "sport",
    price: "$149",
    color: "#333",
    svgDataUrl: sportWrap,
  },
  {
    id: "browline-black",
    name: "Clubmaster",
    brand: "CLASSIC",
    category: "browline",
    price: "$99",
    color: "#1a1a1a",
    svgDataUrl: browlineBlack,
  },
  {
    id: "oversized-black",
    name: "Oversized Glam",
    brand: "FASHION",
    category: "oversized",
    price: "$119",
    color: "#1a1a1a",
    svgDataUrl: oversizedBlack,
  },
  {
    id: "clear-frame",
    name: "Transparente",
    brand: "MODERN",
    category: "classic",
    price: "$89",
    color: "#b4b4b4",
    svgDataUrl: clearFrame,
  },
  {
    id: "retro-blue",
    name: "Retro Azul",
    brand: "TREND",
    category: "classic",
    price: "$99",
    color: "#2a5a8f",
    svgDataUrl: retroBlue,
  },
  {
    id: "hex-frame",
    name: "Geométrico",
    brand: "DESIGN",
    category: "classic",
    price: "$109",
    color: "#333",
    svgDataUrl: hexFrame,
  },
];
