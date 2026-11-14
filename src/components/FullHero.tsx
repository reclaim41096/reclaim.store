import Link from 'next/link';

export function FullHero({ videoSrc, posterSrc }: { videoSrc: string; posterSrc?: string }) {
  return (
    <section className="relative h-[560px] w-full overflow-hidden bg-ink md:h-[640px]">
      <video
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

      <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-16">
        <span className="rise-in mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-semibold tracking-wide text-white backdrop-blur-sm">
          Home &amp; business cleaning
        </span>
        <h1 style={{ ['--rise-delay' as string]: '100ms' }} className="rise-in max-w-xl font-display text-[34px] font-bold leading-[1.06] tracking-tight text-white md:text-[58px] md:font-extrabold">
          Cleaner spaces.
          <br />
          Fresher living.
        </h1>
        <p style={{ ['--rise-delay' as string]: '220ms' }} className="rise-in mt-4 max-w-[460px] text-[15px] leading-relaxed text-white/80 md:mt-5 md:text-[17px]">
          Hand wash, air fresheners, glass and multipurpose cleaners, plus natural Tissa honey.
          Made in Lagos, delivered nationwide.
        </p>
        <div style={{ ['--rise-delay' as string]: '340ms' }} className="rise-in mt-8 flex flex-wrap gap-3.5">
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
    </section>
  );
}
