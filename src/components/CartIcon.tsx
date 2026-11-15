/**
 * Reclaim cart mark: a soft shopping bag whose face is three cleaning bubbles.
 * Strokes use currentColor; the bubbles are brand red and animate on hover (see globals.css).
 */
export function CartIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
      {/* handle */}
      <path d="M9.5 10.5V9a4.5 4.5 0 0 1 9 0v1.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      {/* bag body, with a scalloped (wavy) top edge */}
      <path
        d="M4.6 10.6c0-.5.4-.9.9-.9h17c.5 0 .9.4.9.9l1 12.2c.1 1.1-.8 2-1.9 2H5.5c-1.1 0-2-.9-1.9-2l1-12.2Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      {/* bubbles */}
      <circle className="bubble-a" cx="10.2" cy="17.6" r="1.9" fill="var(--c-brand)" />
      <circle className="bubble-b" cx="15.2" cy="20.4" r="1.4" fill="var(--c-brand)" />
      <circle className="bubble-c" cx="18.4" cy="16.2" r="1.1" fill="var(--c-gold)" />
    </svg>
  );
}
