import Image from 'next/image';

// Cleaned, transparent logo (1000x337). Single source for the site, admin and favicon.
const ASPECT = 1000 / 337;

export function Logo({ height = 32 }: { height?: number }) {
  return (
    <Image
      src="/images/brand/reclaim-logo.png"
      alt="Reclaim"
      width={Math.round(height * ASPECT)}
      height={height}
      priority
      className="h-auto"
      style={{ height, width: 'auto' }}
    />
  );
}
