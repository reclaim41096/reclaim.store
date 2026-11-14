const STEPS = ['Cart', 'Checkout', 'Confirmation'];

/** Shared step indicator for cart / checkout / confirmation. `current` is 1-based. */
export function CheckoutSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-6 pb-2 pt-7 text-[13px] font-semibold md:px-12">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const state = n === current ? 'current' : n < current ? 'done' : 'todo';
        return (
          <li key={label} className="flex items-center gap-3">
            <span
              className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 ${
                state === 'current'
                  ? 'bg-brand text-white'
                  : state === 'done'
                    ? 'bg-brand-tint text-brand'
                    : 'border border-brand-border text-ink-faint'
              }`}
            >
              <span className="font-nav">{n}</span>
              {label}
            </span>
            {n < STEPS.length && <span className="h-px w-5 bg-brand-border" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
