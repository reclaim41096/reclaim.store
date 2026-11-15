'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuLayoutDashboard, LuMenu, LuPackage, LuX } from 'react-icons/lu';
import { SignOutButton } from './SignOutButton';
import { Logo } from '../Logo';

const LINKS = [
  { href: '/admin', label: 'Dashboard', Icon: LuLayoutDashboard },
  { href: '/admin/products', label: 'Products', Icon: LuPackage },
];

export function AdminSidebar({ email }: { email: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer whenever the route changes
  useEffect(() => setOpen(false), [pathname]);

  const brand = (
    <div className="flex items-center gap-2.5">
      <Logo height={30} />
      <span className="rounded-full bg-brand-tint px-2 py-0.5 font-nav text-[11px] tracking-wide text-brand-dark">Admin</span>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-brand-border bg-white px-4 md:hidden">
        {brand}
        <button type="button" aria-label="Open menu" onClick={() => setOpen(true)} className="flex p-2">
          <LuMenu size={24} />
        </button>
      </div>

      {/* Backdrop (mobile) */}
      {open && (
        <div className="fixed inset-0 z-40 bg-ink/40 md:hidden" onClick={() => setOpen(false)} aria-hidden />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col gap-1 border-r border-brand-border bg-white p-4 transition-transform duration-200 md:static md:z-auto md:w-60 md:flex-none md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between p-2.5">
          {brand}
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="flex p-1 md:hidden">
            <LuX size={22} />
          </button>
        </div>

        {LINKS.map(({ href, label, Icon }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 font-nav text-[15px] tracking-wide ${
                active ? 'bg-brand text-white' : 'text-ink-muted hover:bg-brand-tint hover:text-ink'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}

        <div className="mt-auto flex flex-col gap-3 border-t border-brand-border pt-4">
          {email && (
            <div className="flex items-center gap-2.5 px-2.5 text-[13px]">
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-tint text-sm font-bold text-brand-dark">
                {email[0]?.toUpperCase()}
              </div>
              <div className="truncate text-ink-light">{email}</div>
            </div>
          )}
          <SignOutButton />
        </div>
      </aside>
    </>
  );
}
