'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus('error');
      return;
    }
    setStatus('submitting');
    const supabase = createClient();
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject || null,
      message: form.message,
    });
    if (error) {
      setStatus('error');
      return;
    }
    setStatus('done');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-brand-border bg-white p-8">
        <h3 className="mb-2 font-display text-xl font-bold">Message sent</h3>
        <p className="text-sm text-ink-muted">
          Thanks for reaching out — we&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <UnderlineField label="Your Name">
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Full name"
          />
        </UnderlineField>
        <UnderlineField label="Phone Number (optional)">
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="080xxxxxxxx"
          />
        </UnderlineField>
        <div className="sm:col-span-2">
          <UnderlineField label="Email Address">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
            />
          </UnderlineField>
        </div>
        <div className="sm:col-span-2">
          <UnderlineField label="Subject (optional)">
            <input
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              placeholder="Wholesale enquiry, order question, etc."
            />
          </UnderlineField>
        </div>
        <div className="sm:col-span-2">
          <UnderlineField label="Message">
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="How can we help?"
              rows={4}
            />
          </UnderlineField>
        </div>
      </div>

      {status === 'error' && (
        <p className="text-sm text-[#C13C3C]">
          Please fill in your name, email and message, then try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="group flex w-fit items-center gap-2.5 rounded-full bg-brand px-7 py-4 text-[15px] font-semibold text-white hover:bg-brand-dark disabled:bg-ink-faint"
      >
        {status === 'submitting' ? 'Sending…' : 'Leave us a Message'}
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </button>
    </form>
  );
}

function UnderlineField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-ink-light">
        {label}
      </label>
      <div className="[&>input]:w-full [&>input]:border-b-2 [&>input]:border-brand-border [&>input]:bg-transparent [&>input]:pb-3 [&>input]:text-[15px] [&>input]:outline-none [&>input]:transition-colors [&>input]:focus:border-brand [&>textarea]:w-full [&>textarea]:resize-none [&>textarea]:border-b-2 [&>textarea]:border-brand-border [&>textarea]:bg-transparent [&>textarea]:pb-3 [&>textarea]:text-[15px] [&>textarea]:outline-none [&>textarea]:transition-colors [&>textarea]:focus:border-brand">
        {children}
      </div>
    </div>
  );
}
