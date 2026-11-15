const STEPS = ['Cart', 'Checkout', 'Confirmation'];

/** Shared step indicator for cart / checkout / confirmation (always on one line). `current` is 1-based. */
export function CheckoutSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="flex flex-nowrap items-center justify-center gap-1.5 px-3 pb-1 pt-5 text-[11px] font-semibold sm:gap-3 sm:px-6 sm:pt-7 sm:text-[13px] md:px-12">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const state = n === current ? 'current' : n < current ? 'done' : 'todo';
        return (
          <li key={label} className="flex items-center gap-1.5 sm:gap-3">
            <span
              className={`flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 sm:gap-2 sm:px-3.5 sm:py-1.5 ${
                state === 'current'
                  ? 'bg-brand text-white'
                  : state === 'done'
                    ? 'bg-brand-tint text-brand-dark'
                    : 'border border-brand-border text-ink-faint'
              }`}
            >
              <span className="font-nav">{n}</span>
              {label}
            </span>
            {n < STEPS.length && <span className="h-px w-2.5 bg-brand-border sm:w-5" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
