import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen bg-[#FCF5F3] font-sans text-ink">
      <AdminSidebar email={user?.email ?? null} />
      <main className="min-w-0 flex-1 p-8 md:p-10">{children}</main>
    </div>
  );
}
