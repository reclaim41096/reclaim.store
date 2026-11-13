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
      <div className="rounded-2xl border border-brand-border bg-white p-8 text-center">
        <h3 className="mb-2 text-lg font-bold">Message sent</h3>
        <p className="text-sm text-ink-muted">
          Thanks for reaching out — we&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-brand-border bg-white p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Your full name"
          />
        </Field>
        <Field label="Phone (optional)">
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="080xxxxxxxx"
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Subject (optional)">
            <input
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              placeholder="Wholesale enquiry, order question, etc."
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Message">
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="How can we help?"
              rows={5}
            />
          </Field>
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
        className="self-start rounded-full bg-brand px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark disabled:bg-ink-faint"
      >
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1.5 text-[13px] font-semibold">{label}</label>
      <div className="[&>input]:w-full [&>input]:rounded-lg [&>input]:border [&>input]:border-brand-border [&>input]:px-3.5 [&>input]:py-3 [&>input]:text-sm [&>textarea]:w-full [&>textarea]:rounded-lg [&>textarea]:border [&>textarea]:border-brand-border [&>textarea]:px-3.5 [&>textarea]:py-3 [&>textarea]:text-sm [&>textarea]:resize-none">
        {children}
      </div>
    </div>
  );
}
