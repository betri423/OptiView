/**
 * Advanced background removal for glasses images.
 * Uses multi-pass processing: brightness thresholding, flood fill from edges,
 * and morphological operations for clean edges.
 */

const processedImageCache = new Map<string, HTMLImageElement>();

/**
 * Removes white/light background from an image.
 * Uses edge-flood approach: starts from image borders and removes
 * all connected light pixels, preserving the glasses content.
 */
export function removeBackground(img: HTMLImageElement): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const cacheKey = img.src;
    if (processedImageCache.has(cacheKey)) {
      resolve(processedImageCache.get(cacheKey)!);
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        reject(new Error('No canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      // ─── Helper: get pixel index ───
      const idx = (x: number, y: number) => (y * w + x) * 4;
      const getBrightness = (i: number) => {
        return data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      };
      const getSaturation = (i: number) => {
        const max = Math.max(data[i], data[i + 1], data[i + 2]);
        const min = Math.min(data[i], data[i + 1], data[i + 2]);
        return max - min;
      };

      // ─── Step 1: Mark all pixels as "unknown" ───
      // We'll use a visited array: 0 = unknown, 1 = background, 2 = content
      const state = new Uint8Array(w * h);

      // ─── Step 2: Flood fill from ALL edges to find background ───
      // A pixel is background if it's bright AND low saturation
      const isBackgroundPixel = (i: number): boolean => {
        const brightness = getBrightness(i);
        const saturation = getSaturation(i);
        return brightness > 200 && saturation < 40;
      };

      // BFS flood fill from borders
      const queue: number[] = [];
      
      // Add all border pixels that are background-like
      for (let x = 0; x < w; x++) {
        const topIdx = idx(x, 0);
        if (isBackgroundPixel(topIdx) && state[x] === 0) {
          state[x] = 1;
          queue.push(x); // x, y=0
        }
        const botIdx = idx(x, h - 1);
        const botPos = (h - 1) * w + x;
        if (isBackgroundPixel(botIdx) && state[botPos] === 0) {
          state[botPos] = 1;
          queue.push(botPos);
        }
      }
      for (let y = 0; y < h; y++) {
        const leftIdx = idx(0, y);
        const leftPos = y * w;
        if (isBackgroundPixel(leftIdx) && state[leftPos] === 0) {
          state[leftPos] = 1;
          queue.push(leftPos);
        }
        const rightIdx = idx(w - 1, y);
        const rightPos = y * w + (w - 1);
        if (isBackgroundPixel(rightIdx) && state[rightPos] === 0) {
          state[rightPos] = 1;
          queue.push(rightPos);
        }
      }

      // BFS
      let head = 0;
      while (head < queue.length) {
        const pos = queue[head++];
        const px = pos % w;
        const py = Math.floor(pos / w);
        
        // Check 4 neighbors
        const neighbors = [
          py > 0 ? pos - w : -1,     // up
          py < h - 1 ? pos + w : -1, // down
          px > 0 ? pos - 1 : -1,     // left
          px < w - 1 ? pos + 1 : -1, // right
        ];

        for (const nPos of neighbors) {
          if (nPos >= 0 && state[nPos] === 0) {
            const nIdx = nPos * 4;
            if (isBackgroundPixel(nIdx)) {
              state[nPos] = 1;
              queue.push(nPos);
            }
          }
        }
      }

      // ─── Step 3: Mark remaining unknowns as content ───
      for (let i = 0; i < state.length; i++) {
        if (state[i] === 0) state[i] = 2;
      }

      // ─── Step 4: Apply alpha with smooth transitions at edges ───
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const pos = y * w + x;
          const i = pos * 4;

          if (state[pos] === 1) {
            // Background pixel — check distance to nearest content
            // for smooth fade
            let minDistToContent = 999;
            const searchR = 5;
            for (let dy = -searchR; dy <= searchR; dy++) {
              for (let dx = -searchR; dx <= searchR; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                  if (state[ny * w + nx] === 2) {
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < minDistToContent) minDistToContent = dist;
                  }
                }
              }
            }
            
            // Fade over ~4 pixels from content edge
            if (minDistToContent < 4) {
              const fade = minDistToContent / 4;
              data[i + 3] = Math.round(255 * (1 - fade));
            } else {
              data[i + 3] = 0;
            }
          }
          // Content pixels keep full alpha
        }
      }

      // ─── Step 5: Auto-crop to bounding box ───
      let minX = w, maxX = 0, minY = h, maxY = 0;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (data[(y * w + x) * 4 + 3] > 5) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      // Add padding (3% of smallest dimension)
      const padding = Math.round(Math.min(w, h) * 0.03);
      minX = Math.max(0, minX - padding);
      maxX = Math.min(w - 1, maxX + padding);
      minY = Math.max(0, minY - padding);
      maxY = Math.min(h - 1, maxY + padding);

      const cropW = maxX - minX + 1;
      const cropH = maxY - minY + 1;

      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = cropW;
      croppedCanvas.height = cropH;
      const croppedCtx = croppedCanvas.getContext('2d')!;
      croppedCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

      // ─── Step 6: Final edge smoothing ───
      const finalData = croppedCtx.getImageData(0, 0, cropW, cropH);
      const fd = finalData.data;
      
      // Light alpha smoothing pass
      const alphaSmooth = new Uint8Array(cropW * cropH);
      for (let y = 1; y < cropH - 1; y++) {
        for (let x = 1; x < cropW - 1; x++) {
          let sum = 0, count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              sum += fd[((y + dy) * cropW + (x + dx)) * 4 + 3];
              count++;
            }
          }
          alphaSmooth[y * cropW + x] = Math.round(sum / count);
        }
      }
      
      // Apply smoothing only at edges
      for (let y = 1; y < cropH - 1; y++) {
        for (let x = 1; x < cropW - 1; x++) {
          const i = (y * cropW + x) * 4;
          const orig = fd[i + 3];
          if (orig > 10 && orig < 245) {
            fd[i + 3] = alphaSmooth[y * cropW + x];
          }
        }
      }
      
      croppedCtx.putImageData(finalData, 0, 0);

      const processedImg = new Image();
      processedImg.onload = () => {
        processedImageCache.set(cacheKey, processedImg);
        resolve(processedImg);
      };
      processedImg.onerror = reject;
      processedImg.src = croppedCanvas.toDataURL('image/png');
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Loads an image and removes its background.
 */
export async function loadTransparentImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = async () => {
      try {
        const transparent = await removeBackground(img);
        resolve(transparent);
      } catch {
        resolve(img);
      }
    };

    img.onerror = () => resolve(null);
    img.src = url;
  });
}
