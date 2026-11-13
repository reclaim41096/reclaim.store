'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatNaira } from '@/lib/format';
import { useCart } from './CartProvider';
import { CategoryIcon } from './CategoryIcon';

type OptionValue = { id: string; value: string };
type Option = { id: string; name: string; values: OptionValue[] };
type Variant = {
  id: string;
  sku: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  optionValueIds: string[];
};

export function VariantPicker({
  productSlug,
  productName,
  categorySlug,
  iconColor,
  tintClass,
  coverImage,
  galleryImages,
  options,
  variants,
}: {
  productSlug: string;
  productName: string;
  categorySlug: string;
  iconColor: string;
  tintClass: string;
  coverImage: string | null;
  galleryImages: string[];
  options: Option[];
  variants: Variant[];
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [manualImage, setManualImage] = useState<string | null>(null);

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

  const displayImage = manualImage ?? selectedVariant?.imageUrl ?? coverImage;
  const thumbs = [coverImage, ...galleryImages].filter((u, i, arr): u is string => !!u && arr.indexOf(u) === i);

  return (
    <>
      <div className="flex min-w-0 flex-1 basis-[440px] flex-col gap-3">
        <div className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-brand-border ${tintClass}`}>
          {displayImage ? (
            <Image src={displayImage} alt={productName} fill sizes="(min-width: 768px) 440px, 90vw" className="object-contain p-6" />
          ) : (
            <CategoryIcon slug={categorySlug} size={140} color={iconColor} />
          )}
        </div>
        {thumbs.length > 1 && (
          <div className="flex gap-2.5">
            {thumbs.map((url) => (
              <button
                key={url}
                onClick={() => setManualImage(url)}
                className={`relative h-16 w-16 overflow-hidden rounded-lg border ${
                  displayImage === url ? 'border-brand' : 'border-brand-border'
                }`}
              >
                <Image src={url} alt="" fill sizes="64px" className="object-contain p-1" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 basis-[420px] flex-col gap-5">
        {!selectedVariant ? null : (
          <>
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
                        onClick={() => {
                          setSelection((s) => ({ ...s, [opt.id]: val.id }));
                          setManualImage(null);
                        }}
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
                onClick={() => handleAdd()}
                disabled={selectedVariant.stock <= 0}
                className="flex-1 rounded-full bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-ink-faint"
              >
                {selectedVariant.stock <= 0
                  ? 'Out of stock'
                  : added
                    ? 'Added ✓'
                    : `Add to Cart — ${formatNaira(selectedVariant.price * qty)}`}
              </button>
            </div>

            {selectedVariant.stock > 0 && (
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
          </>
        )}
      </div>
    </>
  );

  function handleAdd() {
    if (!selectedVariant) return;
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
  }
}
