import Image from 'next/image';

export function Logo({ height = 32, glossy = false }: { height?: number; glossy?: boolean }) {
  // Site asset 800x268 (~2.985); glossy asset 900x302 (~2.98)
  const width = Math.round(height * 2.985);
  return (
    <Image
      src={glossy ? '/images/brand/reclaim-logo-glossy.png' : '/images/brand/reclaim-logo.png'}
      alt="Reclaim"
      width={width}
      height={height}
      priority
      className="h-auto"
      style={{ height, width: 'auto' }}
    />
  );
}
