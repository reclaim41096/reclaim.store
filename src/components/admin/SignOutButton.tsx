'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/admin/login');
        router.refresh();
      }}
      className="rounded-lg px-4 py-2 text-left text-sm font-semibold text-[#C13C3C] hover:bg-[#FDE4E4]"
    >
      Sign out
    </button>
  );
}
