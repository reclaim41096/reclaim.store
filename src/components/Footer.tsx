import Link from 'next/link';
import { LuMail, LuMapPin, LuPhone } from 'react-icons/lu';
import { Logo } from './Logo';

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="font-nav text-[19px] tracking-wide text-brand">{children}</div>
      <div className="mt-1.5 h-[3px] w-9 rounded-full bg-gradient-to-r from-brand to-gold" />
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="link-underline text-[14px] font-medium text-ink-muted hover:text-brand">
      {children}
    </Link>
  );
}

function ContactRow({ Icon, children, href }: { Icon: typeof LuPhone; children: React.ReactNode; href?: string }) {
  const body = (
    <>
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-brand-tint text-brand">
        <Icon size={17} />
      </span>
      <span className="min-w-0 break-words pt-1.5 text-[14px] font-medium leading-snug text-ink-muted">{children}</span>
    </>
  );
  return href ? (
    <a href={href} className="flex items-start gap-3 hover:text-brand">
      {body}
    </a>
  ) : (
    <div className="flex items-start gap-3">{body}</div>
  );
}

export function Footer() {
  return (
    <footer className="bg-brand-surface px-4 pb-8 pt-12 sm:px-6 md:px-12 md:pt-16">
      <div className="rounded-[2rem] border border-brand-border bg-white p-7 shadow-[0_20px_50px_-30px_rgba(227,30,36,0.35)] md:p-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.5fr]">
          <div>
            <Logo height={34} />
            <p className="mt-4 max-w-[260px] text-[14px] font-medium leading-relaxed text-ink-light">
              Your trusted partner in cleanliness and freshness.
            </p>
          </div>

          <div>
            <FooterHeading>Shop</FooterHeading>
            <div className="flex flex-col gap-2.5">
              <FooterLink href="/shop">Hand Wash</FooterLink>
              <FooterLink href="/shop">Air Freshener</FooterLink>
              <FooterLink href="/shop">Glass Cleaner</FooterLink>
              <FooterLink href="/shop">Multipurpose Cleaner</FooterLink>
              <FooterLink href="/beverages">Honey</FooterLink>
            </div>
          </div>

          <div>
            <FooterHeading>Company</FooterHeading>
            <div className="flex flex-col gap-2.5">
              <FooterLink href="/about">About Reclaim</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/cart">Your Cart</FooterLink>
            </div>
          </div>

          <div>
            <FooterHeading>Get in touch</FooterHeading>
            <div className="flex flex-col gap-3.5">
              <ContactRow Icon={LuPhone} href="tel:+2347079969990">
                +234 707 996 9990
              </ContactRow>
              <ContactRow Icon={LuMail} href="mailto:reclaim41096@gmail.com">
                reclaim41096@gmail.com
              </ContactRow>
              <ContactRow Icon={LuMapPin}>
                4 Modupe Johnson Crescent, off Adeniran Ogunsanya, by Pollaris Bank, Surulere, Lagos
              </ContactRow>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <p className="rounded-full border border-brand-border bg-white px-5 py-2.5 text-center text-xs font-semibold text-ink-light shadow-sm">
          © {new Date().getFullYear()} Reclaim Cleaning Products &amp; Beverages. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
