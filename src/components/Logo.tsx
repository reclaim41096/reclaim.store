import Image from 'next/image';

export function Logo({ height = 32 }: { height?: number }) {
  // Source asset is 800x268 (aspect ratio ~2.985)
  const width = Math.round(height * 2.985);
  return (
    <Image
      src="/images/brand/reclaim-logo.png"
      alt="Reclaim"
      width={width}
      height={height}
      priority
      className="h-auto"
      style={{ height, width: 'auto' }}
    />
  );
}
