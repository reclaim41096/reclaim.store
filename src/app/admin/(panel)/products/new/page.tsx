import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ProductForm, type Category } from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, section:sections(name)')
    .order('position');

  const categoryOptions: Category[] = (categories ?? []).map((c: any) => ({
    id: c.id,
    name: c.name,
    sectionName: c.section?.name ?? '',
  }));

  return (
    <>
      <div className="mb-2 text-[13px] text-ink-faint">
        <Link href="/admin/products" className="text-ink-faint">
          Products
        </Link>{' '}
        / Add Product
      </div>
      <h1 className="mb-6 font-display text-2xl font-bold">Add Product</h1>
      <ProductForm categories={categoryOptions} />
    </>
  );
}
