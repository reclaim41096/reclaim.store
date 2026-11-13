'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';
import { Logo } from './Logo';

export function Header() {
  const { count } = useCart();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border px-6 py-5 md:px-12">
      <Link href="/" className="flex items-center">
        <Logo height={30} />
      </Link>
      <nav className="flex flex-wrap items-center gap-7">
        <Link href="/" className="text-sm font-medium text-ink hover:text-brand">
          Home
        </Link>
        <Link href="/shop" className="text-sm font-medium text-ink hover:text-brand">
          Cleaning
        </Link>
        <Link href="/shop#beverages" className="text-sm font-medium text-ink hover:text-brand">
          Beverages
        </Link>
        <Link href="/about" className="text-sm font-medium text-ink hover:text-brand">
          About
        </Link>
        <Link href="/contact" className="text-sm font-medium text-ink hover:text-brand">
          Contact
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/cart" aria-label="Cart" className="relative flex p-1.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"
              stroke="#221211"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="10" cy="21" r="1.4" fill="#221211" />
            <circle cx="18" cy="21" r="1.4" fill="#221211" />
          </svg>
          {count > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </Link>
        <Link
          href="/shop"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Shop Now
        </Link>
      </div>
    </header>
  );
}
