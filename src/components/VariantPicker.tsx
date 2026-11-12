'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatNaira } from '@/lib/format';
import { useCart } from './CartProvider';

type OptionValue = { id: string; value: string };
type Option = { id: string; name: string; values: OptionValue[] };
type Variant = { id: string; sku: string | null; price: number; stock: number; optionValueIds: string[] };

export function VariantPicker({
  productSlug,
  productName,
  options,
  variants,
}: {
  productSlug: string;
  productName: string;
  options: Option[];
  variants: Variant[];
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const [selection, setSelection] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    options.forEach((opt) => {
      if (opt.values[0]) initial[opt.id] = opt.values[0].id;
    });
    return initial;
  });

  const selectedVariant = useMemo(() => {
    const selectedIds = Object.values(selection);
    return (
      variants.find((v) => {
        if (v.optionValueIds.length !== selectedIds.length) return false;
        return selectedIds.every((id) => v.optionValueIds.includes(id));
      }) ?? variants[0]
    );
  }, [selection, variants]);

  if (!selectedVariant) return null;

  const outOfStock = selectedVariant.stock <= 0;

  const handleAdd = () => {
    const label = options
      .map((opt) => {
        const valueId = selection[opt.id];
        const value = opt.values.find((v) => v.id === valueId);
        return value?.value;
      })
      .filter(Boolean)
      .join(' / ');

    addItem(
      {
        variantId: selectedVariant.id,
        productSlug,
        productName,
        variantLabel: label || null,
        unitPrice: selectedVariant.price,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex flex-col gap-5">
      {options.map((opt) => (
        <div key={opt.id}>
          <div className="mb-2.5 text-sm font-bold">
            {opt.name}:{' '}
            <span className="font-normal text-ink-muted">
              {opt.values.find((v) => v.id === selection[opt.id])?.value}
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {opt.values.map((val) => {
              const active = selection[opt.id] === val.id;
              return (
                <button
                  key={val.id}
                  onClick={() => setSelection((s) => ({ ...s, [opt.id]: val.id }))}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-semibold ${
                    active
                      ? 'border-brand bg-brand text-white'
                      : 'border-brand-border bg-white text-ink hover:border-brand'
                  }`}
                >
                  {val.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="text-2xl font-bold">{formatNaira(selectedVariant.price)}</div>

      <div className="flex items-center gap-4">
        <div className="flex items-center overflow-hidden rounded-full border border-brand-border">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-10 w-10 text-lg"
            aria-label="Decrease quantity"
          >
            –
          </button>
          <span className="w-9 text-center font-bold">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            className="h-10 w-10 text-lg"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="flex-1 rounded-full bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-ink-faint"
        >
          {outOfStock ? 'Out of stock' : added ? 'Added ✓' : `Add to Cart — ${formatNaira(selectedVariant.price * qty)}`}
        </button>
      </div>

      {!outOfStock && (
        <button
          onClick={() => {
            handleAdd();
            router.push('/cart');
          }}
          className="text-center text-[13px] font-semibold text-brand"
        >
          Buy now →
        </button>
      )}
    </div>
  );
}
