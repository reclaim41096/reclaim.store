'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Slide = { src: string; name: string };

export function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3200);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-brand-border bg-white">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Image src={slide.src} alt={slide.name} fill sizes="(min-width: 768px) 440px, 90vw" className="object-contain p-8" />
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            aria-label={`Show ${slide.name}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-5 bg-brand' : 'w-1.5 bg-brand-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
