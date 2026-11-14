import Link from 'next/link';
import { LuMail, LuMapPin, LuPhone } from 'react-icons/lu';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-brand-border bg-[#FCF5F3] px-6 py-12 md:px-12 md:py-14">
      <div className="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="mb-2.5">
            <Logo height={26} />
          </div>
          <p className="text-sm leading-relaxed text-ink-light">
            Your trusted partner in cleanliness and freshness.
          </p>
        </div>
        <div>
          <div className="mb-3 text-sm font-bold">Shop</div>
          <div className="flex flex-col gap-2 text-sm text-ink-light">
            <Link href="/shop">Hand Wash</Link>
            <Link href="/shop">Air Freshener</Link>
            <Link href="/shop">Glass Cleaner</Link>
            <Link href="/shop">Multipurpose Cleaner</Link>
            <Link href="/beverages">Honey</Link>
          </div>
        </div>
        <div>
          <div className="mb-3 text-sm font-bold">Company</div>
          <div className="flex flex-col gap-2 text-sm text-ink-light">
            <Link href="/about">About Reclaim</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <div className="mb-3 text-sm font-bold">Get in touch</div>
          <div className="flex flex-col gap-3 text-sm text-ink-light">
            <span className="flex items-start gap-2.5">
              <LuPhone size={16} className="mt-0.5 flex-none text-brand" />
              +234 707 996 9990
            </span>
            <span className="flex items-start gap-2.5 break-all">
              <LuMail size={16} className="mt-0.5 flex-none text-brand" />
              reclaim41096@gmail.com
            </span>
            <span className="flex items-start gap-2.5">
              <LuMapPin size={16} className="mt-0.5 flex-none text-brand" />
              4 Modupe Johnson Crescent, off Adeniran Ogunsanya, by Pollaris Bank, Surulere, Lagos
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-brand-border pt-5 text-center text-xs text-ink-faint">
        © {new Date().getFullYear()} Reclaim Cleaning Products &amp; Beverages. All rights reserved.
      </div>
    </footer>
  );
}
