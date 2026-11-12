const ICONS: Record<string, JSX.Element> = {
  'hand-wash': (
    <path d="M9 12V7a3 3 0 1 1 6 0v5M5 12h14v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6Z" />
  ),
  'air-freshener': <path d="M12 2c2 3 5 7 5 11a5 5 0 1 1-10 0c0-4 3-8 5-11Z" />,
  'glass-cleaner': <path d="M5 4h14v16H5V4ZM9 4v16M15 4v16" />,
  'multipurpose-cleaner': <path d="M4 7h16M4 12h16M4 17h10" />,
  'toilet-bathroom': <path d="M7 3h10l1 6a6 6 0 0 1-12 0l1-6ZM12 15v6" />,
  'other-household': (
    <path d="M4 4h7v7H4V4ZM13 4h7v7h-7V4ZM4 13h7v7H4v-7ZM13 13h7v7h-7v-7Z" />
  ),
  honey: <path d="M8 3h8l1 4H7l1-4ZM7 7h10l-1 13a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2L7 7Z" />,
};

const FALLBACK = <circle cx="12" cy="12" r="8" />;

export function CategoryIcon({
  slug,
  size = 24,
  color = '#E31E24',
}: {
  slug: string;
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round">
      {ICONS[slug] ?? FALLBACK}
    </svg>
  );
}
