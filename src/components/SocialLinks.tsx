import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6';

// Add each profile URL here once the accounts are live; icons turn into links automatically.
const SOCIALS = [
  { name: 'Instagram', Icon: FaInstagram, url: '' },
  { name: 'Facebook', Icon: FaFacebookF, url: '' },
  { name: 'X', Icon: FaXTwitter, url: '' },
  { name: 'TikTok', Icon: FaTiktok, url: '' },
];

const cls =
  'flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white/80 hover:border-white hover:bg-white hover:text-brand';

export function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-3">
      {SOCIALS.map(({ name, Icon, url }) =>
        url ? (
          <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name} className={cls}>
            <Icon size={18} />
          </a>
        ) : (
          <span key={name} role="img" aria-label={`${name} (coming soon)`} title={`${name} — coming soon`} className={cls}>
            <Icon size={18} />
          </span>
        ),
      )}
    </div>
  );
}
