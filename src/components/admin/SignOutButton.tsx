'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LuLogOut } from 'react-icons/lu';

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
      className="flex items-center gap-3 rounded-lg px-4 py-2 text-left text-sm font-semibold text-danger hover:bg-danger-tint"
    >
      <LuLogOut size={18} />
      Sign out
    </button>
  );
}
