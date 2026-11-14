'use client';

import { useRouter } from 'next/navigation';
import { LuArrowLeft } from 'react-icons/lu';

/** Mobile-only back button, sits right under the header line. */
export function BackBar({ fallback = '/shop', label = 'Back' }: { fallback?: string; label?: string }) {
  const router = useRouter();
  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push(fallback);
  };
  return (
    <div className="px-4 pt-3 md:hidden">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-white py-1.5 pl-2.5 pr-4 text-[13px] font-semibold text-ink active:bg-brand-tint"
      >
        <LuArrowLeft size={16} className="text-brand" />
        {label}
      </button>
    </div>
  );
}
