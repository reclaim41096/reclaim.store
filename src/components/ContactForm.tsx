'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LuArrowRight } from 'react-icons/lu';

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
    <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-x-6 gap-y-10">
      {/* 01 — Name: wide, flush left */}
      <div className="col-span-12 sm:col-span-7">
        <NumberedField n="01" label="Your Name">
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Full name"
          />
        </NumberedField>
      </div>

      {/* 02 — Phone: narrow, pushed down + right */}
      <div className="col-span-12 sm:col-span-5 sm:mt-10">
        <NumberedField n="02" label="Phone Number (optional)">
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="080xxxxxxxx"
          />
        </NumberedField>
      </div>

      {/* 03 — Email: offset right, narrower */}
      <div className="col-span-12 sm:col-span-8 sm:col-start-5 sm:-mt-4">
        <NumberedField n="03" label="Email Address">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
          />
        </NumberedField>
      </div>

      {/* 04 — Subject: flush left, narrow */}
      <div className="col-span-12 sm:col-span-6 sm:mt-4">
        <NumberedField n="04" label="Subject (optional)">
          <input
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            placeholder="Wholesale, order, enquiry…"
          />
        </NumberedField>
      </div>

      {/* 05 — Message: full width */}
      <div className="col-span-12 sm:mt-6">
        <NumberedField n="05" label="Message">
          <textarea
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder="How can we help?"
            rows={4}
          />
        </NumberedField>
      </div>

      {status === 'error' && (
        <p className="col-span-12 text-sm text-[#C13C3C]">
          Please fill in your name, email and message, then try again.
        </p>
      )}

      <div className="col-span-12 mt-2">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="group flex w-fit items-center gap-2.5 rounded-full bg-brand px-7 py-4 text-[15px] font-semibold text-white hover:bg-brand-dark disabled:bg-ink-faint"
        >
          {status === 'submitting' ? 'Sending…' : 'Send to Reclaim'}
          <LuArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
}

function NumberedField({
  n,
  label,
  children,
}: {
  n: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col">
      <span className="pointer-events-none absolute -top-7 right-0 font-shout text-[13px] font-extrabold text-brand/25">
        {n}
      </span>
      <label className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-ink-light">
        {label}
      </label>
      <div className="[&>input]:w-full [&>input]:border-b-2 [&>input]:border-brand-border [&>input]:bg-transparent [&>input]:pb-3 [&>input]:text-[15px] [&>input]:outline-none [&>input]:transition-colors [&>input]:focus:border-brand [&>textarea]:w-full [&>textarea]:resize-none [&>textarea]:border-b-2 [&>textarea]:border-brand-border [&>textarea]:bg-transparent [&>textarea]:pb-3 [&>textarea]:text-[15px] [&>textarea]:outline-none [&>textarea]:transition-colors [&>textarea]:focus:border-brand">
        {children}
      </div>
    </div>
  );
}
