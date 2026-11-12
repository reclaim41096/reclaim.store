import type { Metadata } from 'next';
import { CartProvider } from '@/components/CartProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Reclaim — Cleaner spaces, fresher living',
  description:
    'Reclaim cleaning products and beverages: hand wash, air freshener, glass cleaner, multipurpose cleaner, toilet & bathroom solutions, and natural honey.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
