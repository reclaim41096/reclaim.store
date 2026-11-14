/**
 * Browser-side product photo normaliser.
 * Every upload becomes a square 1200x1200 JPEG on a pure white background with the product
 * cropped tight and centred at a consistent size, whatever the original colour/aspect ratio.
 *
 * Background removal: we sample the border of the photo, treat the dominant border colour as the
 * background and flood-fill inwards from the edges (tolerating soft gradients/shadows). This works
 * for plain studio / solid-colour backgrounds. Busy, multi-colour backgrounds are left as-is
 * (the photo is still cropped and placed on white).
 */
const OUT = 1200;
const FILL = 0.86; // product occupies 86% of the canvas, so every shot has the same visual size
const TOLERANCE = 38; // colour distance from the background reference
const STEP = 9; // max colour change between neighbouring pixels (follows gradients)

function dist(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
  const dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

async function loadBitmap(file: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file);
    } catch {
      /* fall through to <img> */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Could not read that image.'));
      img.src = url;
    });
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}

export async function processProductImage(file: Blob): Promise<Blob> {
  const bmp = await loadBitmap(file);
  const srcW = 'naturalWidth' in bmp ? bmp.naturalWidth : bmp.width;
  const srcH = 'naturalHeight' in bmp ? bmp.naturalHeight : bmp.height;

  // Work at a capped size so big phone photos stay fast
  const scale = Math.min(1, 1400 / Math.max(srcW, srcH));
  const w = Math.max(1, Math.round(srcW * scale));
  const h = Math.max(1, Math.round(srcH * scale));

  const work = document.createElement('canvas');
  work.width = w;
  work.height = h;
  const wctx = work.getContext('2d', { willReadFrequently: true })!;
  wctx.fillStyle = '#fff'; // transparent PNGs land on white
  wctx.fillRect(0, 0, w, h);
  wctx.drawImage(bmp as CanvasImageSource, 0, 0, w, h);

  const img = wctx.getImageData(0, 0, w, h);
  const d = img.data;

  // 1. background reference = average colour of the border ring
  let br = 0, bg = 0, bb = 0, n = 0;
  const sample = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    br += d[i]; bg += d[i + 1]; bb += d[i + 2]; n += 1;
  };
  for (let x = 0; x < w; x += 2) { sample(x, 0); sample(x, h - 1); }
  for (let y = 0; y < h; y += 2) { sample(0, y); sample(w - 1, y); }
  br /= n; bg /= n; bb /= n;

  // Is the border reasonably uniform? (otherwise don't try to cut anything out)
  let spread = 0;
  const probe = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    spread += dist(d[i], d[i + 1], d[i + 2], br, bg, bb);
  };
  let probes = 0;
  for (let x = 0; x < w; x += 4) { probe(x, 0); probe(x, h - 1); probes += 2; }
  for (let y = 0; y < h; y += 4) { probe(0, y); probe(w - 1, y); probes += 2; }
  const uniform = spread / probes < 40;

  // 2. flood fill from the edges
  const isBg = new Uint8Array(w * h);
  if (uniform) {
    const stack: number[] = [];
    const push = (x: number, y: number) => {
      const p = y * w + x;
      if (!isBg[p]) {
        const i = p * 4;
        if (dist(d[i], d[i + 1], d[i + 2], br, bg, bb) < TOLERANCE) {
          isBg[p] = 1;
          stack.push(p);
        }
      }
    };
    for (let x = 0; x < w; x += 1) { push(x, 0); push(x, h - 1); }
    for (let y = 0; y < h; y += 1) { push(0, y); push(w - 1, y); }
    while (stack.length) {
      const p = stack.pop()!;
      const x = p % w, y = (p - x) / w;
      const i = p * 4;
      const neighbours: [number, number][] = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
      for (const [nx, ny] of neighbours) {
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const np = ny * w + nx;
        if (isBg[np]) continue;
        const ni = np * 4;
        const toRef = dist(d[ni], d[ni + 1], d[ni + 2], br, bg, bb);
        const toPrev = dist(d[ni], d[ni + 1], d[ni + 2], d[i], d[i + 1], d[i + 2]);
        if (toRef < TOLERANCE || (toPrev < STEP && toRef < TOLERANCE * 2.4)) {
          isBg[np] = 1;
          stack.push(np);
        }
      }
    }
    // Safety: if nearly everything (or nothing) was removed, the detection was wrong → keep photo as is
    let removed = 0;
    for (let p = 0; p < isBg.length; p += 1) removed += isBg[p];
    const ratio = removed / isBg.length;
    if (ratio > 0.97) isBg.fill(0);
  }

  // 3. paint background white, find the product bounding box
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let p = 0; p < isBg.length; p += 1) {
    const i = p * 4;
    if (isBg[p]) {
      d[i] = 255; d[i + 1] = 255; d[i + 2] = 255;
      continue;
    }
    // near-white pixels count as background for cropping purposes
    if (d[i] > 244 && d[i + 1] > 244 && d[i + 2] > 244) continue;
    const x = p % w, y = (p - x) / w;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  if (maxX < 0) { minX = 0; minY = 0; maxX = w - 1; maxY = h - 1; }
  wctx.putImageData(img, 0, 0);

  // 4. crop tight, scale to a fixed visual size, centre on a white square
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const s = Math.min((OUT * FILL) / cropW, (OUT * FILL) / cropH);
  const dw = Math.round(cropW * s);
  const dh = Math.round(cropH * s);

  const out = document.createElement('canvas');
  out.width = OUT;
  out.height = OUT;
  const octx = out.getContext('2d')!;
  octx.fillStyle = '#fff';
  octx.fillRect(0, 0, OUT, OUT);
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(work, minX, minY, cropW, cropH, Math.round((OUT - dw) / 2), Math.round((OUT - dh) / 2), dw, dh);

  return await new Promise<Blob>((resolve, reject) =>
    out.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process image.'))), 'image/jpeg', 0.9),
  );
}
