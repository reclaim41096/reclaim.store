'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuLayoutDashboard, LuMenu, LuPackage, LuX } from 'react-icons/lu';
import { SignOutButton } from './SignOutButton';

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
    <div className="flex items-baseline gap-2">
      <span className="font-wordmark text-2xl text-brand">Reclaim</span>
      <span className="text-xs font-medium text-ink-faint">Admin</span>
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
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold ${
                active ? 'bg-ink text-white' : 'text-[#4E5B55] hover:bg-[#FBE8E6] hover:text-ink'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}

        <div className="mt-auto flex flex-col gap-3 border-t border-[#EEF2F0] pt-4">
          {email && (
            <div className="flex items-center gap-2.5 px-2.5 text-[13px]">
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-tint text-sm font-bold text-brand">
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
