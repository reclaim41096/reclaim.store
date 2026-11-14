'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LuLock } from 'react-icons/lu';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FCF5F3] px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-brand-border bg-white p-6 sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-tint text-brand"><LuLock size={22} /></div>
          <span className="font-wordmark text-3xl text-brand">Reclaim</span>
          <div className="mt-1 text-sm text-ink-light">Admin sign in</div>
        </div>

        <div className="mb-4 flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-brand-border px-3.5 py-3 text-sm"
          />
        </div>
        <div className="mb-6 flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-brand-border px-3.5 py-3 text-sm"
          />
        </div>

        {error && <p className="mb-4 text-sm text-[#C13C3C]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand py-3 text-[15px] font-semibold text-white hover:bg-brand-dark disabled:bg-ink-faint"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
