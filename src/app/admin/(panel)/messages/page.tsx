'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  LuArrowLeft,
  LuCheck,
  LuMail,
  LuPhone,
  LuSearch,
  LuTrash2,
  LuTriangleAlert,
} from 'react-icons/lu';
import { FaWhatsapp } from 'react-icons/fa6';

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
  status: string;
};

type Customer = {
  email: string;
  name: string;
  phone: string | null;
  messages: Message[];
  newCount: number;
  latest: Message;
};

function groupByCustomer(rows: Message[]): Customer[] {
  const byEmail = new Map<string, Message[]>();
  for (const row of rows) {
    const list = byEmail.get(row.email) ?? [];
    list.push(row);
    byEmail.set(row.email, list);
  }
  const customers: Customer[] = [];
  for (const [email, messages] of byEmail) {
    const sorted = [...messages].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    const latest = sorted[0];
    const phone = sorted.find((m) => m.phone)?.phone ?? null;
    customers.push({
      email,
      name: latest.name,
      phone,
      messages: sorted,
      newCount: sorted.filter((m) => m.status === 'new').length,
      latest,
    });
  }
  return customers.sort((a, b) => +new Date(b.latest.created_at) - +new Date(a.latest.created_at));
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fullDate(iso: string) {
  return new Date(iso).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function AdminMessagesPage() {
  const [rows, setRows] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [missingColumn, setMissingColumn] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'replied'>('all');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('contact_messages')
      .select('id, name, email, phone, subject, message, created_at, status')
      .order('created_at', { ascending: false });

    if (error) {
      // The status column may not exist yet if the SQL migration hasn't been run.
      if (error.message.includes('status')) {
        setMissingColumn(true);
        const retry = await supabase
          .from('contact_messages')
          .select('id, name, email, phone, subject, message, created_at')
          .order('created_at', { ascending: false });
        setRows(((retry.data ?? []) as any[]).map((r) => ({ ...r, status: 'new' })));
      }
      setLoading(false);
      return;
    }
    setRows((data ?? []) as Message[]);
    setLoading(false);
  }

  const customers = useMemo(() => groupByCustomer(rows), [rows]);

  const filtered = useMemo(() => {
    let list = customers;
    if (filter === 'new') list = list.filter((c) => c.newCount > 0);
    if (filter === 'replied') list = list.filter((c) => c.latest.status === 'replied');
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone ?? '').includes(q),
      );
    }
    return list;
  }, [customers, filter, search]);

  const selected = customers.find((c) => c.email === selectedEmail) ?? null;
  const totalNew = customers.reduce((sum, c) => sum + c.newCount, 0);

  async function openCustomer(c: Customer) {
    setSelectedEmail(c.email);
    if (c.newCount === 0 || missingColumn) return;
    const supabase = createClient();
    const ids = c.messages.filter((m) => m.status === 'new').map((m) => m.id);
    if (ids.length === 0) return;
    await supabase.from('contact_messages').update({ status: 'read' }).in('id', ids);
    setRows((prev) => prev.map((m) => (ids.includes(m.id) ? { ...m, status: 'read' } : m)));
  }

  async function markReplied(c: Customer) {
    if (missingColumn) return;
    const supabase = createClient();
    const ids = c.messages.filter((m) => m.status !== 'replied').map((m) => m.id);
    if (ids.length === 0) return;
    await supabase.from('contact_messages').update({ status: 'replied' }).in('id', ids);
    setRows((prev) => prev.map((m) => (ids.includes(m.id) ? { ...m, status: 'replied' } : m)));
  }

  async function deleteCustomer(c: Customer) {
    if (!confirm(`Delete all ${c.messages.length} message(s) from ${c.name}? This cannot be undone.`)) return;
    const supabase = createClient();
    const ids = c.messages.map((m) => m.id);
    await supabase.from('contact_messages').delete().in('id', ids);
    setRows((prev) => prev.filter((m) => !ids.includes(m.id)));
    setSelectedEmail(null);
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 md:mb-6 md:gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold md:text-2xl md:font-bold">Messages</h1>
          <div className="mt-0.5 text-[12px] text-ink-faint md:mt-1 md:text-[13px]">
            {customers.length} {customers.length === 1 ? 'customer' : 'customers'}
            {totalNew > 0 ? ` · ${totalNew} new` : ''}
          </div>
        </div>
      </div>

      {missingColumn && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-gold/40 bg-gold-tint px-4 py-3 text-[13px] text-gold-dark">
          <LuTriangleAlert size={18} className="mt-0.5 flex-none" />
          <p>
            Run the status/security SQL in Supabase to unlock read/replied tracking. Messages still show below, just
            without that extra detail for now.
          </p>
        </div>
      )}

      <div className="flex min-h-0 flex-1 gap-5 lg:h-[calc(100vh-11rem)]">
        {/* LIST */}
        <div
          className={`flex min-w-0 flex-1 flex-col rounded-2xl border border-brand-border bg-white lg:max-w-[380px] lg:flex-none ${
            selected ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="flex flex-none flex-col gap-3 border-b border-brand-border p-3.5">
            <div className="relative">
              <LuSearch size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email or phone"
                className="w-full rounded-lg border border-brand-border py-2.5 pl-9 pr-3 text-sm"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'new', 'replied'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-semibold capitalize ${
                    filter === f ? 'bg-brand text-white' : 'bg-brand-tint text-brand-dark hover:bg-brand/20'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {loading && <p className="p-5 text-center text-sm text-ink-faint">Loading…</p>}
            {!loading && filtered.length === 0 && (
              <p className="p-5 text-center text-sm text-ink-faint">No messages yet.</p>
            )}
            {filtered.map((c) => (
              <button
                key={c.email}
                type="button"
                onClick={() => openCustomer(c)}
                className={`flex w-full flex-col gap-1 border-b border-brand-border px-4 py-3.5 text-left hover:bg-brand-tint ${
                  selectedEmail === c.email ? 'bg-brand-tint' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">{c.name}</span>
                  <span className="flex-none text-[11px] text-ink-faint">{timeAgo(c.latest.created_at)}</span>
                </div>
                <p className="truncate text-xs text-ink-faint">{c.latest.subject || c.latest.message}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  {c.newCount > 0 && (
                    <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                      {c.newCount} new
                    </span>
                  )}
                  {c.latest.status === 'replied' && (
                    <span className="rounded-full bg-success-tint px-2 py-0.5 text-[10px] font-bold text-success">
                      Replied
                    </span>
                  )}
                  {c.messages.length > 1 && (
                    <span className="text-[10px] text-ink-faint">{c.messages.length} messages</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* DETAIL */}
        <div
          className={`min-h-0 min-w-0 flex-1 flex-col rounded-2xl border border-brand-border bg-white ${
            selected ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {!selected ? (
            <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-ink-faint">
              Select a customer to read their messages.
            </div>
          ) : (
            <>
              <div className="flex flex-none items-center justify-between gap-3 border-b border-brand-border p-4">
                <div className="flex min-w-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEmail(null)}
                    aria-label="All customers"
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-ink-muted hover:bg-brand-tint lg:hidden"
                  >
                    <LuArrowLeft size={18} />
                  </button>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{selected.name}</div>
                    <div className="truncate text-xs text-ink-faint">{selected.email}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteCustomer(selected)}
                  aria-label="Delete conversation"
                  className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-ink-faint hover:bg-danger-tint hover:text-danger"
                >
                  <LuTrash2 size={16} />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-3">
                  {selected.messages.map((m) => (
                    <div key={m.id} className="rounded-xl border border-brand-border bg-brand-surface p-3.5">
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        {m.subject ? <span className="text-sm font-semibold">{m.subject}</span> : <span />}
                        <span className="flex-none text-[11px] text-ink-faint">{fullDate(m.created_at)}</span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-ink-muted">{m.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-none flex-wrap gap-2 border-t border-brand-border p-4">
                {selected.phone && (
                  <a
                    href={`tel:${selected.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border px-3.5 py-2 text-[13px] font-semibold text-ink-muted hover:bg-brand-tint"
                  >
                    <LuPhone size={15} /> Call
                  </a>
                )}
                {selected.phone && (
                  <a
                    href={`https://wa.me/${selected.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hi ${selected.name}, thanks for reaching out to Reclaim! `,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-whatsapp px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-whatsapp-dark"
                  >
                    <FaWhatsapp size={15} /> WhatsApp
                  </a>
                )}
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(
                    selected.latest.subject ? `Re: ${selected.latest.subject}` : 'Re: your message to Reclaim',
                  )}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border px-3.5 py-2 text-[13px] font-semibold text-ink-muted hover:bg-brand-tint"
                >
                  <LuMail size={15} /> Email reply
                </a>
                <button
                  type="button"
                  onClick={() => markReplied(selected)}
                  disabled={selected.latest.status === 'replied'}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-brand-dark disabled:bg-ink-faint"
                >
                  <LuCheck size={15} /> Mark as replied
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
