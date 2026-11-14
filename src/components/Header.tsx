'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LuMenu, LuShoppingCart, LuX } from 'react-icons/lu';
import { useCart } from './CartProvider';
import { Logo } from './Logo';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative border-b border-brand-border px-5 py-4 md:px-12 md:py-5">
      <div className="flex items-center justify-between gap-4">
        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-ink hover:text-brand">
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="logo-link flex items-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
          onClick={() => setOpen(false)}
        >
          <Logo height={40} />
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/cart" aria-label="Cart" className="relative flex p-2">
            <LuShoppingCart size={22} className="text-ink" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/shop"
            className="hidden rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark sm:block"
          >
            Shop Now
          </Link>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex p-2 md:hidden"
          >
            {open ? <LuX size={24} /> : <LuMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="absolute inset-x-0 top-full z-40 flex flex-col border-b border-brand-border bg-white px-5 pb-5 pt-2 shadow-lg md:hidden">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-brand-border/60 py-3.5 text-[15px] font-semibold text-ink"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/shop"
            onClick={() => setOpen(false)}
            className="mt-4 rounded-full bg-brand py-3 text-center text-[15px] font-semibold text-white"
          >
            Shop Now
          </Link>
        </nav>
      )}
    </header>
  );
}
