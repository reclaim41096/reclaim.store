import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProductForm, type Category, type InitialProduct } from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: categories }, { data: product }] = await Promise.all([
    supabase.from('categories').select('id, name, section:sections(name)').order('position'),
    supabase
      .from('products')
      .select(
        `*, product_options(id, name, position, product_option_values(id, value, position)),
         product_variants(id, sku, price, stock, variant_option_values(option_value_id))`,
      )
      .eq('id', params.id)
      .maybeSingle(),
  ]);

  if (!product) notFound();

  const categoryOptions: Category[] = (categories ?? []).map((c: any) => ({
    id: c.id,
    name: c.name,
    sectionName: c.section?.name ?? '',
  }));

  const sortedOptions = (product.product_options ?? [])
    .slice()
    .sort((a: any, b: any) => a.position - b.position);

  // Map option_value_id -> { optionIndex, value } so we can rebuild each
  // variant's combo label in the same option order used for editing.
  const valueLookup = new Map<string, { optionIndex: number; value: string }>();
  sortedOptions.forEach((opt: any, optionIndex: number) => {
    (opt.product_option_values ?? [])
      .slice()
      .sort((a: any, b: any) => a.position - b.position)
      .forEach((v: any) => valueLookup.set(v.id, { optionIndex, value: v.value }));
  });

  const initial: InitialProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description ?? '',
    categoryId: product.category_id,
    skuPrefix: product.sku_prefix ?? '',
    basePrice: Number(product.base_price),
    wholesalePrice: product.wholesale_price != null ? Number(product.wholesale_price) : null,
    wholesaleAvailable: product.wholesale_available,
    status: product.status,
    weightG: product.weight_g,
    options: sortedOptions.map((opt: any) => ({
      name: opt.name,
      values: (opt.product_option_values ?? [])
        .slice()
        .sort((a: any, b: any) => a.position - b.position)
        .map((v: any) => v.value),
    })),
    variants: (product.product_variants ?? []).map((v: any) => {
      const entries = (v.variant_option_values ?? [])
        .map((vov: any) => valueLookup.get(vov.option_value_id))
        .filter(Boolean)
        .sort((a: any, b: any) => a.optionIndex - b.optionIndex);
      return {
        label: entries.map((e: any) => e.value).join(' / '),
        sku: v.sku,
        price: Number(v.price),
        stock: v.stock,
      };
    }),
  };

  return (
    <>
      <div className="mb-2 text-[13px] text-ink-faint">
        <Link href="/admin/products" className="text-ink-faint">
          Products
        </Link>{' '}
        / Edit Product
      </div>
      <h1 className="mb-6 font-display text-2xl font-bold">Edit Product</h1>
      <ProductForm categories={categoryOptions} initial={initial} />
    </>
  );
}
