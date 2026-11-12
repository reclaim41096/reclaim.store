'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton } from './SignOutButton';

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
];

export function AdminSidebar({ email }: { email: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 flex-none flex-col gap-1 border-r border-brand-border bg-white p-4">
      <div className="mb-6 flex items-baseline gap-2 p-2.5">
        <span className="font-wordmark text-2xl text-brand">Reclaim</span>
        <span className="text-xs font-medium text-ink-faint">Admin</span>
      </div>

      {LINKS.map((link) => {
        const active = link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${
              active ? 'bg-ink text-white' : 'text-[#4E5B55] hover:bg-[#FBE8E6] hover:text-ink'
            }`}
          >
            {link.label}
          </Link>
        );
      })}

      <div className="mt-auto flex flex-col gap-3 border-t border-[#EEF2F0] pt-4">
        {email && (
          <div className="flex items-center gap-2.5 px-2.5 text-[13px]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-tint text-sm font-bold text-brand">
              {email[0]?.toUpperCase()}
            </div>
            <div className="truncate text-ink-light">{email}</div>
          </div>
        )}
        <SignOutButton />
      </div>
    </aside>
  );
}
