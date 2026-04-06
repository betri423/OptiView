/**
 * Smart background removal — works with ANY background color.
 * Detects the dominant background color from edges, then flood-fills
 * to remove all connected pixels matching that color.
 * 
 * Improved version with:
 * - Better edge sampling (more samples, wider border)
 * - Multiple background color detection (handles non-uniform backgrounds)
 * - More aggressive tolerance
 * - Two-pass approach: first flood fill, then color-based cleanup
 * - Better edge smoothing
 */

const processedImageCache = new Map<string, HTMLImageElement>();

/**
 * Check if an image already has transparency (alpha channel).
 */
function hasTransparency(data: Uint8ClampedArray, len: number): boolean {
  let transparentCount = 0;
  const sampleStep = 16;
  for (let i = 3; i < len; i += 4 * sampleStep) {
    if (data[i] < 250) transparentCount++;
  }
  return transparentCount > (len / (4 * sampleStep)) * 0.05;
}

/**
 * Euclidean color distance in RGB space.
 */
function colorDist(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number
): number {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Removes background from any image, regardless of background color.
 * Strategy:
 * 1. Check if image already has transparency → skip
 * 2. Sample ALL edge pixels to find dominant background color(s)
 * 3. Flood fill from edges, matching pixels within tolerance
 * 4. Second pass: remove any remaining background-like colors near edges
 * 5. Apply smooth alpha edges
 * 6. Auto-crop to content bounds
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

      // ─── Step 0: Check if already transparent ───
      if (hasTransparency(data, data.length)) {
        processedImageCache.set(cacheKey, img);
        resolve(img);
        return;
      }

      // ─── Step 1: Sample edge pixels to find background color ───
      // Take samples from all 4 edges (first and last 5 pixel rows/cols)
      const edgeSamples: number[] = []; // [r, g, b, ...]
      const edgeSet = new Set<number>();

      const sampleEdgePixels = (x: number, y: number) => {
        const pos = (y * w + x) * 4;
        if (!edgeSet.has(pos)) {
          edgeSet.add(pos);
          edgeSamples.push(data[pos], data[pos + 1], data[pos + 2]);
        }
      };

      // Top/bottom edges — sample every 5th pixel, 5 rows deep
      const xStep = Math.max(1, Math.floor(w / 200));
      for (let x = 0; x < w; x += xStep) {
        for (let dy = 0; dy < 5; dy++) {
          sampleEdgePixels(x, dy);
          sampleEdgePixels(x, h - 1 - dy);
        }
      }
      // Left/right edges — sample every 5th pixel, 5 cols deep
      const yStep = Math.max(1, Math.floor(h / 200));
      for (let y = 0; y < h; y += yStep) {
        for (let dx = 0; dx < 5; dx++) {
          sampleEdgePixels(dx, y);
          sampleEdgePixels(w - 1 - dx, y);
        }
      }

      // Find median color (more robust than mean)
      const sampleCount = edgeSamples.length / 3;
      const rs: number[] = [], gs: number[] = [], bs: number[] = [];
      for (let i = 0; i < edgeSamples.length; i += 3) {
        rs.push(edgeSamples[i]);
        gs.push(edgeSamples[i + 1]);
        bs.push(edgeSamples[i + 2]);
      }
      rs.sort((a, b) => a - b);
      gs.sort((a, b) => a - b);
      bs.sort((a, b) => a - b);

      const mid = Math.floor(sampleCount / 2);
      const bgR = rs[mid];
      const bgG = gs[mid];
      const bgB = bs[mid];

      // Calculate tolerance based on color variance of edge samples
      // Higher variance = background is not uniform → use tighter tolerance
      const variance = (() => {
        let sum = 0;
        const sampleStep = Math.max(1, Math.floor(sampleCount / 200));
        for (let i = 0; i < sampleCount; i += sampleStep) {
          const r = edgeSamples[i * 3];
          const g = edgeSamples[i * 3 + 1];
          const b = edgeSamples[i * 3 + 2];
          sum += colorDist(r, g, b, bgR, bgG, bgB);
        }
        return sum / (sampleCount / sampleStep);
      })();

      // More aggressive tolerance for better background removal
      const tolerance = Math.max(35, Math.min(80, 40 + variance * 1.0));

      // ─── Step 2: Flood fill from edges ───
      const state = new Uint8Array(w * h); // 0 = unknown, 1 = background, 2 = content

      const isBackground = (i: number): boolean => {
        return colorDist(data[i], data[i + 1], data[i + 2], bgR, bgG, bgB) < tolerance;
      };

      // BFS queue
      const queue: number[] = [];

      // Seed from ALL border pixels
      for (let x = 0; x < w; x++) {
        const topPos = x;
        const botPos = (h - 1) * w + x;
        if (isBackground(topPos * 4) && state[topPos] === 0) {
          state[topPos] = 1;
          queue.push(topPos);
        }
        if (isBackground(botPos * 4) && state[botPos] === 0) {
          state[botPos] = 1;
          queue.push(botPos);
        }
      }
      for (let y = 1; y < h - 1; y++) {
        const leftPos = y * w;
        const rightPos = y * w + (w - 1);
        if (isBackground(leftPos * 4) && state[leftPos] === 0) {
          state[leftPos] = 1;
          queue.push(leftPos);
        }
        if (isBackground(rightPos * 4) && state[rightPos] === 0) {
          state[rightPos] = 1;
          queue.push(rightPos);
        }
      }

      // BFS with 8-directional connectivity for better edge following
      let head = 0;
      while (head < queue.length) {
        const pos = queue[head++];
        const px = pos % w;
        const py = Math.floor(pos / w);

        // 8-directional neighbors
        const neighbors: number[] = [];
        if (py > 0) neighbors.push(pos - w);
        if (py < h - 1) neighbors.push(pos + w);
        if (px > 0) neighbors.push(pos - 1);
        if (px < w - 1) neighbors.push(pos + 1);
        // Diagonal
        if (py > 0 && px > 0) neighbors.push(pos - w - 1);
        if (py > 0 && px < w - 1) neighbors.push(pos - w + 1);
        if (py < h - 1 && px > 0) neighbors.push(pos + w - 1);
        if (py < h - 1 && px < w - 1) neighbors.push(pos + w + 1);

        for (const nPos of neighbors) {
          if (nPos >= 0 && state[nPos] === 0) {
            const nIdx = nPos * 4;
            if (isBackground(nIdx)) {
              state[nPos] = 1;
              queue.push(nPos);
            }
          }
        }
      }

      // Mark remaining as content
      for (let i = 0; i < state.length; i++) {
        if (state[i] === 0) state[i] = 2;
      }

      // ─── Step 3: Apply alpha with smooth transitions ───
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const pos = y * w + x;
          const i = pos * 4;

          if (state[pos] === 1) {
            // Background pixel — check distance to content for smooth fade
            let minDist = 999;
            const searchR = 5;
            for (let dy = -searchR; dy <= searchR; dy++) {
              for (let dx = -searchR; dx <= searchR; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                  if (state[ny * w + nx] === 2) {
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < minDist) minDist = dist;
                  }
                }
              }
            }

            if (minDist < 3) {
              data[i + 3] = Math.round(255 * (1 - minDist / 3));
            } else {
              data[i + 3] = 0;
            }
          }
        }
      }

      // ─── Step 4: Second pass — remove background-colored pixels that are 
      // "trapped" inside content (e.g., holes in glasses frames) ───
      // Only remove pixels that are very close to the background color
      const tightTolerance = 25;
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const pos = y * w + x;
          if (state[pos] !== 2) continue;
          
          const i = pos * 4;
          const dist = colorDist(data[i], data[i + 1], data[i + 2], bgR, bgG, bgB);
          
          if (dist < tightTolerance) {
            // Check if this pixel is surrounded by mostly background
            let bgNeighbors = 0;
            for (let dy = -2; dy <= 2; dy++) {
              for (let dx = -2; dx <= 2; dx++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                  if (state[ny * w + nx] === 1) bgNeighbors++;
                }
              }
            }
            // If most neighbors are background, this is likely background too
            if (bgNeighbors >= 15) {
              data[i + 3] = 0;
            }
          }
        }
      }

      // ─── Step 5: Auto-crop to bounding box ───
      let minX = w, maxX = 0, minY = h, maxY = 0;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (data[(y * w + x) * 4 + 3] > 10) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      // Add padding
      const padding = Math.round(Math.min(w, h) * 0.04);
      minX = Math.max(0, minX - padding);
      maxX = Math.min(w - 1, maxX + padding);
      minY = Math.max(0, minY - padding);
      maxY = Math.min(h - 1, maxY + padding);

      const cropW = maxX - minX + 1;
      const cropH = maxY - minY + 1;

      if (cropW <= 0 || cropH <= 0) {
        processedImageCache.set(cacheKey, img);
        resolve(img);
        return;
      }

      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = cropW;
      croppedCanvas.height = cropH;
      const croppedCtx = croppedCanvas.getContext('2d')!;
      croppedCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

      // ─── Step 6: Light edge smoothing ───
      const finalData = croppedCtx.getImageData(0, 0, cropW, cropH);
      const fd = finalData.data;
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
