import { Suspense } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductListing } from '@/components/ProductListing';
import { getActiveProducts } from '@/lib/queries';

export const revalidate = 60;

export const metadata = {
  title: 'Beverages — Reclaim',
};

export default async function BeveragesPage() {
  const products = await getActiveProducts();
  const beverages = products.filter((p) => p.category.section.slug === 'beverages');

  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <ProductListing title="Beverages" active="beverages" products={beverages} />
      </Suspense>
      <Footer />
    </>
  );
}
