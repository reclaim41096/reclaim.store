'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { LuImagePlus, LuLoader, LuStar, LuX } from 'react-icons/lu';
import { createClient } from '@/lib/supabase/client';
import { processProductImage } from '@/lib/image-processing';

const BUCKET = 'product-images';

export async function uploadProcessedImage(file: File): Promise<string> {
  const processed = await processProductImage(file);
  const supabase = createClient();
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, processed, {
    contentType: 'image/jpeg',
    cacheControl: '31536000',
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Gallery uploader. First image = cover photo shown on cards. */
export function ImageUploader({ images, onChange }: { images: string[]; onChange: (urls: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    const added: string[] = [];
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        added.push(await uploadProcessedImage(file));
      }
      onChange([...images, ...added]);
    } catch (e: any) {
      if (added.length) onChange([...images, ...added]);
      setError(e?.message ?? 'Upload failed.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const makeCover = (url: string) => onChange([url, ...images.filter((u) => u !== url)]);
  const remove = (url: string) => onChange(images.filter((u) => u !== url));

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {images.map((url, i) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-brand-border bg-white">
            <Image src={url} alt="" fill sizes="140px" className="object-contain p-1.5" />
            {i === 0 && (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                Cover
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-white/90 p-1">
              {i !== 0 ? (
                <button type="button" onClick={() => makeCover(url)} aria-label="Make cover" className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-brand-tint hover:text-brand">
                  <LuStar size={15} />
                </button>
              ) : (
                <span />
              )}
              <button type="button" onClick={() => remove(url)} aria-label="Remove image" className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-brand-tint hover:text-[#C13C3C]">
                <LuX size={15} />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-brand-border text-[12px] font-semibold text-ink-muted hover:border-brand hover:bg-brand-tint hover:text-brand disabled:opacity-60"
        >
          {busy ? <LuLoader size={22} className="animate-spin" /> : <LuImagePlus size={22} />}
          {busy ? 'Processing…' : 'Upload'}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
      <p className="mt-3 text-xs text-ink-faint">
        Any photo works: it&apos;s automatically cropped, placed on a white background and resized to the same square shot
        size. The first image is the cover.
      </p>
      {error && <p className="mt-2 text-sm text-[#C13C3C]">{error}</p>}
    </div>
  );
}
