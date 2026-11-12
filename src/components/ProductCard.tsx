import Link from 'next/link';
import { formatNaira } from '@/lib/format';
import { CategoryIcon } from './CategoryIcon';
import type { ProductSummary } from '@/lib/queries';

export function ProductCard({ product }: { product: ProductSummary }) {
  const price = product.price_range
    ? product.price_range.min === product.price_range.max
      ? formatNaira(product.price_range.min)
      : `${formatNaira(product.price_range.min)} – ${formatNaira(product.price_range.max)}`
    : formatNaira(product.base_price);

  const tint = product.category.section.slug === 'beverages' ? 'bg-gold-tint' : 'bg-brand-tint';
  const iconColor = product.category.section.slug === 'beverages' ? '#A6760A' : '#E31E24';

  return (
    <Link
      href={`/product/${product.slug}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-white transition hover:shadow-md"
    >
      <div className={`relative flex aspect-square items-center justify-center ${tint}`}>
        {product.status === 'out_of_stock' && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-[#FDE4E4] px-2.5 py-1 text-[11px] font-bold text-[#C13C3C]">
            Out of stock
          </span>
        )}
        {product.status === 'draft' && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-[#F1F0E8] px-2.5 py-1 text-[11px] font-bold text-ink-light">
            Coming soon
          </span>
        )}
        <CategoryIcon slug={product.category.slug} size={56} color={iconColor} />
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: iconColor }}>
          {product.category.name}
        </span>
        <div className="text-[15px] font-bold">{product.name}</div>
        {product.variant_count > 0 && (
          <div className="text-[11px] text-ink-light">{product.variant_count} variants</div>
        )}
        <div className="mt-0.5 font-bold">{price}</div>
      </div>
    </Link>
  );
}
