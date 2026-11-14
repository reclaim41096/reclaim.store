import Link from 'next/link';
import Image from 'next/image';
import { formatNaira } from '@/lib/format';
import { CategoryIcon } from './CategoryIcon';
import type { ProductSummary } from '@/lib/queries';
import { LuArrowUpRight } from 'react-icons/lu';

export function ProductCard({ product }: { product: ProductSummary }) {
  const price = product.price_range
    ? product.price_range.min === product.price_range.max
      ? formatNaira(product.price_range.min)
      : `${formatNaira(product.price_range.min)} – ${formatNaira(product.price_range.max)}`
    : formatNaira(product.base_price);
  const unitLabel = product.price_unit ? `Price per ${product.price_unit}` : '';


  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-white hover:border-brand/40 hover:shadow-[0_18px_40px_-22px_rgba(227,30,36,0.45)]"
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-brand-tint">
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
        {product.cover_image_url ? (
          <Image
            src={product.cover_image_url}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <CategoryIcon slug={product.category.slug} size={56} />
        )}
        <span className="absolute bottom-2.5 right-2.5 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-brand text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <LuArrowUpRight size={18} />
        </span>
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand">
          {product.category.name}
        </span>
        <div className="text-[15px] font-bold">{product.name}</div>
        {product.variant_count > 0 && (
          <div className="text-[11px] text-ink-light">{product.variant_count} variants</div>
        )}
        <div className="mt-0.5 font-bold">{price}</div>
        {unitLabel && (
          <span className="w-fit rounded-md bg-brand-tint px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-brand-dark">
            {unitLabel}
          </span>
        )}
      </div>
    </Link>
  );
}
