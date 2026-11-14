import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CategoryIcon } from '@/components/CategoryIcon';
import { VariantPicker } from '@/components/VariantPicker';
import { getProductBySlug, getRelatedProducts } from '@/lib/queries';
import { formatNaira } from '@/lib/format';
import { LuPackage, LuShieldCheck, LuTruck } from 'react-icons/lu';

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
    imageUrl: v.image_url ?? null,
    priceUnit: v.price_unit ?? null,
    optionValueIds: (v.variant_option_values ?? []).map((vov: any) => vov.option_value_id),
  }));

  const galleryImages = (product.product_images ?? [])
    .slice()
    .sort((a: any, b: any) => a.position - b.position)
    .map((pi: any) => pi.url as string);

  const related = await getRelatedProducts(product.category.slug, product.slug, 4);
  const isBeverage = product.category.section.slug === 'beverages';
  const iconColor = '#E31E24';
  const tint = 'bg-brand-tint';
  const shopHref = isBeverage ? '/beverages' : '/shop';

  return (
    <>
      <Header />
      <div className="px-6 pt-6 text-[13px] text-ink-faint md:px-12">
        <Link href="/" className="text-ink-faint">
          Home
        </Link>{' '}
        /{' '}
        <Link href={shopHref} className="text-ink-faint">
          {isBeverage ? 'Beverages' : 'Shop'}
        </Link>{' '}
        / {product.name}
      </div>

      <div className="px-6 pt-6 md:px-12">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: iconColor }}>
          {product.category.name}
        </span>
        <h1 className="mt-1.5 font-display text-[22px] font-semibold md:text-[30px] md:font-bold">{product.name}</h1>
      </div>

      <section className="flex flex-wrap gap-8 px-6 py-6 md:gap-12 md:px-12">
        {variants.length > 0 ? (
          <VariantPicker
            productSlug={product.slug}
            productName={product.name}
            categorySlug={product.category.slug}
            iconColor={iconColor}
            tintClass={tint}
            coverImage={product.cover_image_url ?? null}
            galleryImages={galleryImages}
            options={options}
            variants={variants}
          />
        ) : (
          <>
            <div className={`relative flex aspect-square min-w-0 flex-1 basis-full md:basis-[440px] items-center justify-center overflow-hidden rounded-2xl border border-brand-border ${tint}`}>
              {product.cover_image_url ? (
                <Image src={product.cover_image_url} alt={product.name} fill sizes="440px" className="object-contain p-6" />
              ) : (
                <CategoryIcon slug={product.category.slug} size={140} color={iconColor} />
              )}
            </div>
            <div className="flex min-w-0 flex-1 basis-full md:basis-[420px] flex-col gap-5">
              <div className="text-xl font-semibold md:text-2xl md:font-bold">{formatNaira(Number(product.base_price))}</div>
            </div>
          </>
        )}
      </section>

      <div className="px-6 pb-6 md:px-12">
        <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">{product.description}</p>

        <div className="mt-5 flex flex-wrap gap-5 rounded-2xl bg-[#FCF7F6] p-4 max-w-2xl">
          <span className="flex items-center gap-2 text-[13px] text-ink-muted"><LuTruck size={18} className="text-brand" /> Fast delivery nationwide</span>
          <span className="flex items-center gap-2 text-[13px] text-ink-muted"><LuShieldCheck size={18} className="text-brand" /> Safe, tested formula</span>
          {product.wholesale_available && (
            <span className="flex items-center gap-2 text-[13px] text-ink-muted"><LuPackage size={18} className="text-brand" /> Wholesale available</span>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="bg-[#FCF7F6] px-6 py-16 md:px-12">
          <h2 className="mb-5 font-display text-xl font-semibold md:mb-6 md:text-2xl md:font-bold">You may also like</h2>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {related.map((p: any) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="group overflow-hidden rounded-2xl border border-brand-border bg-white hover:border-brand/40 hover:shadow-[0_18px_40px_-22px_rgba(227,30,36,0.45)]"
              >
                <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-brand-tint">
                  {p.cover_image_url ? (
                    <Image src={p.cover_image_url} alt={p.name} fill sizes="200px" className="object-contain p-3 transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <CategoryIcon slug={product.category.slug} size={52} />
                  )}
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
