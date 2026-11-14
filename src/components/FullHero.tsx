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
        <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-semibold tracking-wide text-white backdrop-blur-sm">
          New &middot; Nationwide delivery
        </span>
        <h1 className="max-w-xl font-display text-[44px] font-extrabold leading-[1.04] tracking-tight text-white md:text-[58px]">
          Cleaner spaces.
          <br />
          Fresher living.
        </h1>
        <p className="mt-5 max-w-[460px] text-[17px] leading-relaxed text-white/80">
          Whether you are buying for personal use, your business or wholesale distribution,
          RECLAIM has cleaning solutions to meet your everyday needs.
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
    </section>
  );
}
