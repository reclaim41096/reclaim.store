import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CategoryIcon } from '@/components/CategoryIcon';
import { VariantPicker } from '@/components/VariantPicker';
import { getProductBySlug, getRelatedProducts } from '@/lib/queries';
import { formatNaira } from '@/lib/format';

export const revalidate = 60;

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const options = (product.product_options ?? [])
    .slice()
    .sort((a: any, b: any) => a.position - b.position)
    .map((opt: any) => ({
      id: opt.id,
      name: opt.name,
      values: (opt.product_option_values ?? [])
        .slice()
        .sort((a: any, b: any) => a.position - b.position)
        .map((v: any) => ({ id: v.id, value: v.value })),
    }));

  const variants = (product.product_variants ?? []).map((v: any) => ({
    id: v.id,
    sku: v.sku,
    price: Number(v.price),
    stock: v.stock,
    optionValueIds: (v.variant_option_values ?? []).map((vov: any) => vov.option_value_id),
  }));

  const related = await getRelatedProducts(product.category.slug, product.slug, 4);
  const iconColor = product.category.section.slug === 'beverages' ? '#A6760A' : '#E31E24';
  const tint = product.category.section.slug === 'beverages' ? 'bg-gold-tint' : 'bg-brand-tint';

  return (
    <>
      <Header />
      <div className="px-6 pt-6 text-[13px] text-ink-faint md:px-12">
        <Link href="/" className="text-ink-faint">
          Home
        </Link>{' '}
        /{' '}
        <Link href="/shop" className="text-ink-faint">
          Shop
        </Link>{' '}
        / {product.name}
      </div>

      <section className="flex flex-wrap gap-12 px-6 py-6 md:px-12">
        <div className={`flex aspect-square min-w-0 flex-1 basis-[440px] items-center justify-center rounded-2xl border border-brand-border ${tint}`}>
          <CategoryIcon slug={product.category.slug} size={140} color={iconColor} />
        </div>

        <div className="flex min-w-0 flex-1 basis-[420px] flex-col gap-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: iconColor }}>
              {product.category.name}
            </span>
            <h1 className="mt-1.5 font-display text-[30px] font-bold">{product.name}</h1>
          </div>

          <p className="text-sm leading-relaxed text-ink-muted">{product.description}</p>

          <div className="h-px bg-brand-border" />

          {variants.length > 0 ? (
            <VariantPicker
              productSlug={product.slug}
              productName={product.name}
              options={options}
              variants={variants}
            />
          ) : (
            <div className="text-2xl font-bold">{formatNaira(Number(product.base_price))}</div>
          )}

          <div className="mt-2 flex flex-wrap gap-5 rounded-2xl bg-[#FCF7F6] p-4">
            <span className="text-[13px] text-ink-muted">🚚 Fast delivery nationwide</span>
            <span className="text-[13px] text-ink-muted">✅ Safe, tested formula</span>
            {product.wholesale_available && (
              <span className="text-[13px] text-ink-muted">📦 Wholesale available</span>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-[#FCF7F6] px-6 py-16 md:px-12">
          <h2 className="mb-6 font-display text-2xl font-bold">You may also like</h2>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {related.map((p: any) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="overflow-hidden rounded-2xl border border-brand-border bg-white"
              >
                <div className="flex aspect-square items-center justify-center bg-brand-tint">
                  <CategoryIcon slug={product.category.slug} size={52} />
                </div>
                <div className="p-3.5">
                  <div className="text-sm font-bold">{p.name}</div>
                  <div className="mt-1 font-bold">{formatNaira(Number(p.base_price))}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
