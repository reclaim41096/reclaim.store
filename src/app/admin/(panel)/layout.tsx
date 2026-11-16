import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The status column may not exist yet (migration not run) — just show no badge then.
  const { count: unreadCount } = await supabase
    .from('contact_messages')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new');

  return (
    <div className="flex min-h-screen flex-col bg-brand-surface md:flex-row font-sans text-ink">
      <AdminSidebar email={user?.email ?? null} unreadMessages={unreadCount ?? 0} />
      <main className="min-w-0 flex-1 p-4 pt-[4.5rem] sm:p-6 sm:pt-[5rem] md:p-10">{children}</main>
    </div>
  );
}
