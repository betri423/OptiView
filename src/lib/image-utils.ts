/**
 * Image utility functions for processing glasses images
 * Removes white/light backgrounds, auto-crops to content bounds,
 * and applies edge softening for realistic blending
 */

// Cache for processed images to avoid re-processing
const processedImageCache = new Map<string, HTMLImageElement>();

/**
 * Removes white/light background from an image using pixel analysis.
 * Then auto-crops to the bounding box of non-transparent content.
 * Returns a new HTMLImageElement with transparent background.
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
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      // ─── Pass 1: Background removal using luminance + saturation ───
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        const saturation = maxC - minC;

        // Background detection: bright + low saturation = likely white background
        if (brightness > 220 && saturation < 30) {
          const fadeStart = 210;
          const fadeEnd = 245;
          let alpha = 1;
          if (brightness > fadeEnd) {
            alpha = 0;
          } else if (brightness > fadeStart) {
            const t = (brightness - fadeStart) / (fadeEnd - fadeStart);
            alpha = 1 - t;
          }
          data[i + 3] = Math.round(data[i + 3] * alpha);
        }

        // Very light gray with almost no color
        if (brightness > 245 && saturation < 15) {
          data[i + 3] = 0;
        }
      }

      // ─── Pass 2: Edge smoothing — box blur on alpha channel ───
      const alphaData = new Uint8Array(w * h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          alphaData[y * w + x] = data[(y * w + x) * 4 + 3];
        }
      }

      // 3x3 box blur on alpha
      const smoothed = new Uint8Array(w * h);
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          let sum = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              sum += alphaData[(y + dy) * w + (x + dx)];
            }
          }
          smoothed[y * w + x] = Math.round(sum / 9);
        }
      }

      // Write smoothed alpha, only at edges
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = (y * w + x) * 4;
          const origAlpha = data[idx + 3];
          const smoothAlpha = smoothed[y * w + x];

          if (origAlpha > 0 && origAlpha < 255) {
            data[idx + 3] = smoothAlpha;
          } else if (origAlpha === 255) {
            // Near an edge? Blend slightly
            let minNeighbor = 255;
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const na = alphaData[(y + dy) * w + (x + dx)];
                if (na < minNeighbor) minNeighbor = na;
              }
            }
            if (minNeighbor < 200) {
              data[idx + 3] = Math.min(255, smoothAlpha + 10);
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // ─── Pass 3: Auto-crop to content bounding box ───
      // Find bounding box of non-transparent pixels
      let minX = w, maxX = 0, minY = h, maxY = 0;
      let hasContent = false;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const alpha = data[(y * w + x) * 4 + 3];
          if (alpha > 10) {
            hasContent = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (!hasContent) {
        reject(new Error('No content found after background removal'));
        return;
      }

      // Add small padding around the content
      const padding = Math.round(Math.min(w, h) * 0.02);
      minX = Math.max(0, minX - padding);
      maxX = Math.min(w - 1, maxX + padding);
      minY = Math.max(0, minY - padding);
      maxY = Math.min(h - 1, maxY + padding);

      const cropW = maxX - minX + 1;
      const cropH = maxY - minY + 1;

      // Create cropped canvas
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = cropW;
      croppedCanvas.height = cropH;
      const croppedCtx = croppedCanvas.getContext('2d')!;
      croppedCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

      // Convert to image
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
 * Loads an image from a URL and processes it to remove the background.
 * Returns a transparent-background HTMLImageElement ready for canvas overlay.
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
        // If background removal fails, use original
        resolve(img);
      }
    };

    img.onerror = () => {
      resolve(null);
    };

    img.src = url;
  });
}
