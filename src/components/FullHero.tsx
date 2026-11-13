'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Slide = { src: string; name: string };

export function FullHero({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4200);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="relative h-[560px] w-full overflow-hidden bg-ink md:h-[640px]">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Image
            src={slide.src}
            alt={slide.name}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-16">
        <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-semibold tracking-wide text-white backdrop-blur-sm">
          New &middot; Nationwide delivery
        </span>
        <h1 className="max-w-xl font-display text-[44px] font-extrabold leading-[1.04] tracking-tight text-white md:text-[58px]">
          Cleaner spaces.
          <br />
          Fresher living.
        </h1>
        <p className="mt-5 max-w-[460px] text-[17px] leading-relaxed text-white/80">
          Reliable, affordable products for your home, office or business — from hand wash to air
          fresheners, and natural honey from our beverages line.
        </p>
        <div className="mt-8 flex flex-wrap gap-3.5">
          <Link
            href="/shop"
            className="rounded-full bg-brand px-7 py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark"
          >
            Shop Products
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/40 px-7 py-3.5 text-[15px] font-semibold text-white hover:border-white hover:bg-white/10"
          >
            Wholesale Enquiries
          </Link>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              aria-label={`Show ${slide.name}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
