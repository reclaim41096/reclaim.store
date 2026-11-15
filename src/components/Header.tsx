'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuChevronRight, LuMenu, LuX } from 'react-icons/lu';
import { useCart } from './CartProvider';
import { CartIcon } from './CartIcon';
import { Logo } from './Logo';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  if (href === '/shop') return pathname.startsWith('/shop') || pathname.startsWith('/beverages') || pathname.startsWith('/product');
  return pathname.startsWith(href);
}

export function Header() {
  const { count } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [popKey, setPopKey] = useState(0);
  const prevCount = useRef(count);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Re-trigger the badge pop whenever the count changes
  useEffect(() => {
    if (prevCount.current !== count) setPopKey((k) => k + 1);
    prevCount.current = count;
  }, [count]);

  return (
    <header
      className={`sticky top-0 z-40 border-b px-5 py-3.5 backdrop-blur-md transition-shadow duration-200 lg:px-12 lg:py-4 ${
        scrolled ? 'border-brand-border bg-white/90 shadow-[0_6px_24px_-12px_rgba(227,30,36,0.25)]' : 'border-brand-border bg-white/80'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Desktop nav: pill container, Lilita One */}
        <nav className="hidden items-center gap-1 rounded-full border border-brand-border bg-brand-tint/60 p-1.5 lg:flex">
          {NAV.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-5 py-2 font-nav text-[15px] tracking-wide ${
                  active
                    ? 'bg-brand text-white shadow-[0_4px_12px_-4px_rgba(227,30,36,0.6)]'
                    : 'text-ink hover:bg-white hover:text-brand'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          className="logo-link flex items-center lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
          onClick={() => setOpen(false)}
        >
          <Logo height={40} />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/cart"
            aria-label={`Cart${count ? `, ${count} items` : ''}`}
            className="cart-btn relative flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-border bg-white text-ink hover:border-brand hover:bg-brand-tint"
          >
            <CartIcon />
            {count > 0 && (
              <span
                key={popKey}
                className="badge-pop absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white ring-2 ring-white"
              >
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/shop"
            className="hidden rounded-full bg-brand px-5 py-2.5 font-nav text-[15px] tracking-wide text-white hover:bg-brand-dark sm:block"
          >
            Shop Now
          </Link>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-border bg-white lg:hidden"
          >
            {open ? <LuX size={22} /> : <LuMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile / tablet menu: dims the page; tap outside to close */}
      {open && (
        <>
          <div className="fixed inset-0 -z-10 bg-ink/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden />
          <nav className="absolute inset-x-0 top-full border-b border-brand-border bg-white px-4 pb-4 pt-2 shadow-lg lg:hidden">
            <div className="flex flex-col gap-1 rounded-2xl border border-brand-border bg-brand-surface p-1.5">
              {NAV.map((l) => {
                const active = isActive(pathname, l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 font-nav text-[15px] tracking-wide ${
                      active ? 'bg-brand text-white' : 'text-ink active:bg-brand-tint'
                    }`}
                  >
                    {l.label}
                    <LuChevronRight size={16} className={active ? 'text-white/80' : 'text-ink-faint'} />
                  </Link>
                );
              })}
            </div>
            <Link
              href="/shop"
              className="mt-3 block rounded-full bg-brand py-2.5 text-center font-nav text-[15px] tracking-wide text-white active:bg-brand-dark"
            >
              Shop Now
            </Link>
          </nav>
        </>
      )}
    </header>
  );
}
