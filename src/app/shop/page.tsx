import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductListing } from '@/components/ProductListing';
import { getActiveProducts } from '@/lib/queries';

export const revalidate = 60;

export const metadata = {
  title: 'Cleaning Products — Reclaim',
};

export default async function ShopPage() {
  const products = await getActiveProducts();
  const cleaning = products.filter((p) => p.category.section.slug === 'cleaning');

  return (
    <>
      <Header />
      <ProductListing title="Cleaning Products" active="cleaning" products={cleaning} />
      <Footer />
    </>
  );
}
