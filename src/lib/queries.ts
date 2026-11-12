import { createClient } from '@/lib/supabase/server';

export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  base_price: number;
  status: 'active' | 'draft' | 'out_of_stock';
  category: { slug: string; name: string; section: { slug: string; name: string } };
  variant_count: number;
  price_range: { min: number; max: number } | null;
};

export async function getSectionsWithCategories() {
  const supabase = createClient();
  const { data: sections } = await supabase
    .from('sections')
    .select('id, slug, name, position, categories(id, slug, name, description, position)')
    .order('position');

  return (sections ?? []).map((s) => ({
    ...s,
    categories: (s.categories ?? []).sort((a, b) => a.position - b.position),
  }));
}

export async function getActiveProducts(sectionSlug?: string) {
  const supabase = createClient();
  let query = supabase
    .from('products')
    .select(
      `id, slug, name, base_price, status,
       category:categories!inner(slug, name, section:sections!inner(slug, name)),
       product_variants(id, price)`,
    )
    .in('status', ['active', 'draft', 'out_of_stock']);

  if (sectionSlug) {
    query = query.eq('category.section.slug', sectionSlug);
  }

  const { data } = await query;

  return (data ?? []).map((p: any) => {
    const prices: number[] = (p.product_variants ?? []).map((v: any) => Number(v.price));
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      base_price: Number(p.base_price),
      status: p.status,
      category: p.category,
      variant_count: prices.length,
      price_range: prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : null,
    } satisfies ProductSummary;
  });
}

export async function getProductBySlug(slug: string) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from('products')
    .select(
      `*, category:categories(slug, name, section:sections(slug, name)),
       product_options(id, name, position, product_option_values(id, value, position)),
       product_variants(id, sku, price, stock, variant_option_values(option_value_id))`,
    )
    .eq('slug', slug)
    .maybeSingle();

  return product;
}

export async function getRelatedProducts(categorySlug: string, excludeSlug: string, limit = 4) {
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select('id, slug, name, base_price, category:categories!inner(slug)')
    .eq('category.slug', categorySlug)
    .neq('slug', excludeSlug)
    .limit(limit);

  return data ?? [];
}
