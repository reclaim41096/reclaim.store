'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LuTrash2 } from 'react-icons/lu';

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from('products').delete().eq('id', productId);
    setBusy(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      aria-label="Delete"
      className="rounded-lg p-1.5 text-ink-light hover:bg-brand-tint hover:text-danger"
    >
      <LuTrash2 size={18} />
    </button>
  );
}
