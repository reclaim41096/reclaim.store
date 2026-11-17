'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export function FullHero({ videoSrc, posterSrc }: { videoSrc: string; posterSrc?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mobile browsers (iOS Safari in particular) pause a backgrounded <video>
  // and don't resume it on their own even with `loop` set — the clip stays
  // frozen until the user manually taps play again. Explicitly resume it
  // whenever the tab/app becomes visible again, and treat any unexpected
  // pause (while the page itself is visible) as something to recover from too.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.play().catch(() => {
        // Autoplay can be rejected if nothing has synced yet — ignore, it'll
        // resume on the next visibility/interaction event.
      });
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay();
    };
    const handlePause = () => {
      if (document.visibilityState === 'visible') tryPlay();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pageshow', tryPlay);
    window.addEventListener('focus', tryPlay);
    video.addEventListener('pause', handlePause);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', tryPlay);
      window.removeEventListener('focus', tryPlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  return (
    <section className="relative flex min-h-[420px] w-full items-center overflow-hidden bg-ink py-12 md:h-[640px] md:py-0">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

      <div className="relative z-10 flex w-full flex-col justify-center px-6 md:px-16">
        <h1 style={{ ['--rise-delay' as string]: '100ms' }} className="rise-in max-w-xl font-display text-[34px] font-bold leading-[1.06] tracking-tight text-white md:text-[58px] md:font-extrabold">
          Cleaner spaces.
          <br />
          Fresher living.
        </h1>
        <p style={{ ['--rise-delay' as string]: '220ms' }} className="rise-in mt-4 max-w-[460px] text-[15px] leading-relaxed text-white/80 md:mt-5 md:text-[17px]">
          Hand wash, air fresheners, glass and multipurpose cleaners, plus natural Tissa honey.
          Made in Lagos, delivered nationwide.
        </p>
      </div>

      <div
        style={{ ['--rise-delay' as string]: '340ms' }}
        className="rise-in absolute bottom-6 right-6 z-10 md:bottom-10 md:right-16"
      >
        <Link
          href="/shop"
          className="inline-block rounded-full bg-brand px-8 py-4 text-[16px] md:px-10 md:py-5 md:text-[18px] font-semibold text-white hover:bg-brand-dark"
        >
          Shop Products
        </Link>
      </div>
    </section>
  );
}
