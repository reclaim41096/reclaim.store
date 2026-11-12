'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export type Category = { id: string; name: string; sectionName: string };
type OptionDraft = { id: string; name: string; valuesText: string };
type VariantRow = { label: string; sku: string; price: string; stock: string };

export type InitialProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  skuPrefix: string;
  basePrice: number;
  wholesalePrice: number | null;
  wholesaleAvailable: boolean;
  status: 'active' | 'draft' | 'out_of_stock';
  weightG: number | null;
  options: { name: string; values: string[] }[];
  variants: { label: string; sku: string | null; price: number; stock: number }[];
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function cartesian(lists: string[][]): string[][] {
  return lists.reduce<string[][]>((acc, list) => acc.flatMap((combo) => list.map((v) => [...combo, v])), [[]]);
}

let tempIdCounter = 0;
function nextTempId() {
  tempIdCounter += 1;
  return `tmp-${tempIdCounter}`;
}

export function ProductForm({ categories, initial }: { categories: Category[]; initial?: InitialProduct }) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [description, setDescription] = useState(initial?.description ?? '');
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? '');
  const [skuPrefix, setSkuPrefix] = useState(initial?.skuPrefix ?? '');
  const [basePrice, setBasePrice] = useState(initial ? String(initial.basePrice) : '');
  const [wholesalePrice, setWholesalePrice] = useState(
    initial?.wholesalePrice != null ? String(initial.wholesalePrice) : '',
  );
  const [wholesaleAvailable, setWholesaleAvailable] = useState(initial?.wholesaleAvailable ?? false);
  const [status, setStatus] = useState<'active' | 'draft' | 'out_of_stock'>(initial?.status ?? 'draft');
  const [weightG, setWeightG] = useState(initial?.weightG != null ? String(initial.weightG) : '');

  const [options, setOptions] = useState<OptionDraft[]>(
    (initial?.options ?? []).map((o) => ({ id: nextTempId(), name: o.name, valuesText: o.values.join(', ') })),
  );

  const [variantRows, setVariantRows] = useState<VariantRow[]>(
    initial && initial.variants.length > 0
      ? initial.variants.map((v) => ({
          label: v.label,
          sku: v.sku ?? '',
          price: String(v.price),
          stock: String(v.stock),
        }))
      : [{ label: '', sku: initial?.skuPrefix ?? '', price: initial ? String(initial.basePrice) : '', stock: '0' }],
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugEdited) setSlug(slugify(name));
  }, [name, slugEdited]);

  // Regenerate variant rows whenever option definitions change, preserving
  // price/sku/stock already entered for combos whose label is unchanged.
  const optionsSignature = JSON.stringify(options.map((o) => [o.name, o.valuesText]));
  useEffect(() => {
    const parsedOptions = options
      .map((o) => ({ name: o.name.trim(), values: o.valuesText.split(',').map((v) => v.trim()).filter(Boolean) }))
      .filter((o) => o.name && o.values.length > 0);

    const labels =
      parsedOptions.length === 0
        ? ['']
        : cartesian(parsedOptions.map((o) => o.values)).map((combo) => combo.join(' / '));

    setVariantRows((prev) => {
      const byLabel = new Map(prev.map((r) => [r.label, r]));
      return labels.map(
        (label) => byLabel.get(label) ?? { label, sku: '', price: basePrice || '0', stock: '0' },
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsSignature]);

  const addOption = () => setOptions((o) => [...o, { id: nextTempId(), name: '', valuesText: '' }]);
  const removeOption = (id: string) => setOptions((o) => o.filter((x) => x.id !== id));
  const updateOption = (id: string, patch: Partial<OptionDraft>) =>
    setOptions((o) => o.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const updateVariant = (label: string, patch: Partial<VariantRow>) =>
    setVariantRows((rows) => rows.map((r) => (r.label === label ? { ...r, ...patch } : r)));

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim() || !slug.trim() || !categoryId) {
      setError('Name, slug and category are required.');
      return;
    }
    const price = Number(basePrice);
    if (!Number.isFinite(price) || price < 0) {
      setError('Base price must be a valid number.');
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const productPayload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      category_id: categoryId,
      sku_prefix: skuPrefix.trim() || null,
      base_price: price,
      wholesale_price: wholesalePrice ? Number(wholesalePrice) : null,
      wholesale_available: wholesaleAvailable,
      status,
      weight_g: weightG ? Number(weightG) : null,
    };

    let productId = initial?.id;

    if (isEdit && productId) {
      const { error: updateError } = await supabase.from('products').update(productPayload).eq('id', productId);
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
      // Rebuild options/variants from the form state. order_items keep a text
      // snapshot of what was ordered, so deleting old variants doesn't lose
      // order history — it only detaches the FK (ON DELETE SET NULL).
      await supabase.from('product_variants').delete().eq('product_id', productId);
      await supabase.from('product_options').delete().eq('product_id', productId);
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from('products')
        .insert(productPayload)
        .select('id')
        .single();
      if (insertError || !inserted) {
        setError(insertError?.message ?? 'Could not create product.');
        setSaving(false);
        return;
      }
      productId = inserted.id;
    }

    const parsedOptions = options
      .map((o) => ({ name: o.name.trim(), values: o.valuesText.split(',').map((v) => v.trim()).filter(Boolean) }))
      .filter((o) => o.name && o.values.length > 0);

    const valueIdByOptionAndValue = new Map<string, string>();

    for (let i = 0; i < parsedOptions.length; i += 1) {
      const opt = parsedOptions[i];
      const { data: insertedOption, error: optionError } = await supabase
        .from('product_options')
        .insert({ product_id: productId, name: opt.name, position: i + 1 })
        .select('id')
        .single();
      if (optionError || !insertedOption) {
        setError(optionError?.message ?? 'Could not save option.');
        setSaving(false);
        return;
      }
      const { data: insertedValues, error: valuesError } = await supabase
        .from('product_option_values')
        .insert(opt.values.map((v, idx) => ({ option_id: insertedOption.id, value: v, position: idx + 1 })))
        .select('id, value');
      if (valuesError || !insertedValues) {
        setError(valuesError?.message ?? 'Could not save option values.');
        setSaving(false);
        return;
      }
      insertedValues.forEach((v) => valueIdByOptionAndValue.set(`${i}:${v.value}`, v.id));
    }

    for (const row of variantRows) {
      const comboValues = row.label ? row.label.split(' / ') : [];
      const { data: insertedVariant, error: variantError } = await supabase
        .from('product_variants')
        .insert({
          product_id: productId,
          sku: row.sku.trim() || null,
          price: Number(row.price) || price,
          stock: Number(row.stock) || 0,
        })
        .select('id')
        .single();
      if (variantError || !insertedVariant) {
        setError(variantError?.message ?? 'Could not save variant.');
        setSaving(false);
        return;
      }
      if (comboValues.length > 0 && comboValues.length === parsedOptions.length) {
        const links = comboValues
          .map((val, i) => valueIdByOptionAndValue.get(`${i}:${val}`))
          .filter((id): id is string => Boolean(id))
          .map((option_value_id) => ({ variant_id: insertedVariant.id, option_value_id }));
        if (links.length > 0) {
          await supabase.from('variant_option_values').insert(links);
        }
      }
    }

    setSaving(false);
    router.push('/admin/products');
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex min-w-0 flex-1 basis-[640px] flex-col gap-5">
        <Card title="Basic Information">
          <div className="flex flex-col gap-4">
            <LabeledField label="Product name">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Antibacterial Hand Wash" />
            </LabeledField>
            <LabeledField label="Slug">
              <input
                value={slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  setSlug(e.target.value);
                }}
              />
            </LabeledField>
            <LabeledField label="Description">
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </LabeledField>
            <div className="grid grid-cols-2 gap-4">
              <LabeledField label="Category">
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.sectionName} / {c.name}
                    </option>
                  ))}
                </select>
              </LabeledField>
              <LabeledField label="SKU prefix">
                <input value={skuPrefix} onChange={(e) => setSkuPrefix(e.target.value)} placeholder="e.g. RC-HW" />
              </LabeledField>
            </div>
          </div>
        </Card>

        <Card title="Variants">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs text-ink-faint">
              Add an option (e.g. Fragrance, Scent, Size) and list its values, comma separated.
            </span>
            <button onClick={addOption} className="text-sm font-semibold text-brand">
              + Add option
            </button>
          </div>

          <div className="my-4 flex flex-col gap-3">
            {options.map((opt) => (
              <div key={opt.id} className="rounded-xl border border-[#EEF2F0] p-4">
                <div className="mb-2.5 flex items-center gap-3">
                  <input
                    value={opt.name}
                    onChange={(e) => updateOption(opt.id, { name: e.target.value })}
                    placeholder="Option name (e.g. Fragrance)"
                    className="w-44 rounded-lg border border-brand-border px-3 py-2 text-sm font-semibold"
                  />
                  <span className="flex-1 text-xs text-ink-faint">Values (comma separated)</span>
                  <button onClick={() => removeOption(opt.id)} className="text-ink-faint hover:text-[#C13C3C]">
                    ✕
                  </button>
                </div>
                <input
                  value={opt.valuesText}
                  onChange={(e) => updateOption(opt.id, { valuesText: e.target.value })}
                  placeholder="e.g. Lemon, Lavender, Mixed Fruits"
                  className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm"
                />
              </div>
            ))}
            {options.length === 0 && (
              <p className="text-sm text-ink-faint">No options — this product has a single variant.</p>
            )}
          </div>

          <div className="h-px bg-[#EEF2F0]" />

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse">
              <thead>
                <tr className="text-left text-xs text-ink-faint">
                  <th className="p-2">Variant</th>
                  <th className="w-32 p-2">SKU</th>
                  <th className="w-28 p-2">Price (₦)</th>
                  <th className="w-24 p-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {variantRows.map((row) => (
                  <tr key={row.label} className="border-t border-[#EEF2F0]">
                    <td className="p-2 text-sm font-semibold">{row.label || 'Default'}</td>
                    <td className="p-2">
                      <input
                        value={row.sku}
                        onChange={(e) => updateVariant(row.label, { sku: e.target.value })}
                        className="w-full rounded-lg border border-brand-border px-2.5 py-2 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        value={row.price}
                        onChange={(e) => updateVariant(row.label, { price: e.target.value })}
                        className="w-full rounded-lg border border-brand-border px-2.5 py-2 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        value={row.stock}
                        onChange={(e) => updateVariant(row.label, { stock: e.target.value })}
                        className="w-full rounded-lg border border-brand-border px-2.5 py-2 text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="flex w-full flex-none flex-col gap-5 md:w-80">
        <Card title="Status">
          <LabeledField label="Visibility">
            <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
          </LabeledField>
        </Card>

        <Card title="Pricing Defaults">
          <div className="flex flex-col gap-3.5">
            <LabeledField label="Base price (₦)">
              <input value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="1500" />
            </LabeledField>
            <LabeledField label="Wholesale price (₦)">
              <input value={wholesalePrice} onChange={(e) => setWholesalePrice(e.target.value)} placeholder="1200" />
            </LabeledField>
            <label className="flex items-center gap-2 text-sm text-ink-muted">
              <input
                type="checkbox"
                checked={wholesaleAvailable}
                onChange={(e) => setWholesaleAvailable(e.target.checked)}
              />
              Available for wholesale
            </label>
          </div>
        </Card>

        <Card title="Shipping">
          <LabeledField label="Weight (g)">
            <input value={weightG} onChange={(e) => setWeightG(e.target.value)} placeholder="500" />
          </LabeledField>
        </Card>

        {error && <p className="text-sm text-[#C13C3C]">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:bg-ink-faint"
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish Product'}
        </button>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-brand-border bg-white p-6">
      <h3 className="mb-5 text-base font-bold">{title}</h3>
      {children}
    </div>
  );
}

function LabeledField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 [&_input]:rounded-lg [&_input]:border [&_input]:border-brand-border [&_input]:px-3.5 [&_input]:py-2.5 [&_input]:text-sm [&_select]:rounded-lg [&_select]:border [&_select]:border-brand-border [&_select]:px-3.5 [&_select]:py-2.5 [&_select]:text-sm [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-brand-border [&_textarea]:px-3.5 [&_textarea]:py-2.5 [&_textarea]:text-sm">
      <label className="text-[13px] font-semibold">{label}</label>
      {children}
    </div>
  );
}
