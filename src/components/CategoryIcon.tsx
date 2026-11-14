import type { IconType } from 'react-icons';
import { GiHoneyJar, GiLiquidSoap, GiWindow } from 'react-icons/gi';
import { LuSprayCan, LuToilet, LuDroplets } from 'react-icons/lu';

/**
 * Real-world icons per category (react-icons: Lucide + Game Icons sets).
 * "other-household" is the Reclaim catalog mark: a custom house + sparkle.
 */
const ICONS: Record<string, IconType> = {
  'hand-wash': GiLiquidSoap,
  'air-freshener': LuSprayCan,
  'glass-cleaner': GiWindow,
  'multipurpose-cleaner': LuDroplets,
  'toilet-bathroom': LuToilet,
  honey: GiHoneyJar,
};

type Props = { slug: string; size?: number; color?: string };

export function CategoryIcon({ slug, size = 24, color = '#E31E24' }: Props) {
  if (slug === 'other-household') return <CatalogIcon size={size} color={color} />;
  const Icon = ICONS[slug] ?? LuDroplets;
  return <Icon size={size} color={color} aria-hidden />;
}

/** Unique catalog icon: a home with a sparkle — "everything clean for your home". */
export function CatalogIcon({ size = 24, color = '#E31E24' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 11.2 12 3.5l9 7.7"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 10v9.2c0 .5.4.8.8.8h11.4c.4 0 .8-.3.8-.8V10"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9.2c.35 1.9 1.3 2.85 3.2 3.2-1.9.35-2.85 1.3-3.2 3.2-.35-1.9-1.3-2.85-3.2-3.2 1.9-.35 2.85-1.3 3.2-3.2Z"
        fill="#F2B705"
        stroke="#F2B705"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
