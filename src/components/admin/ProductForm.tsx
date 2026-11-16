'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { LuImagePlus, LuLoader, LuPlus, LuX } from 'react-icons/lu';
import { ImageUploader, uploadProcessedImage } from './ImageUploader';

export type Category = { id: string; name: string; sectionName: string };
type OptionDraft = { id: string; name: string; valuesText: string };
type VariantRow = { label: string; sku: string; price: string; stock: string; imageUrl: string | null; priceUnit: string | null };

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
  images: string[];
  options: { name: string; values: string[] }[];
  variants: { label: string; sku: string | null; price: number; stock: number; imageUrl: string | null; priceUnit: string | null }[];
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function initialsOf(name: string) {
  return name
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 6);
}

function autoSku(prefix: string, label: string) {
  const p = prefix.trim().toUpperCase();
  const l = label.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return [p, l].filter(Boolean).join('-');
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
  const [images, setImages] = useState<string[]>(initial?.images ?? []);

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
          imageUrl: v.imageUrl,
          priceUnit: v.priceUnit,
        }))
      : [{ label: '', sku: '', price: initial ? String(initial.basePrice) : '', stock: '0', imageUrl: null, priceUnit: null }],
  );

  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
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
      const sharedUnit = prev.length > 0 && prev.every((r) => r.priceUnit === prev[0].priceUnit) ? prev[0].priceUnit : null;
      return labels.map(
        (label) =>
          byLabel.get(label) ?? { label, sku: '', price: basePrice || '0', stock: '0', imageUrl: null, priceUnit: sharedUnit },
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsSignature]);

  // "Price is per": one unit for all variants (the storefront shows 'Price per <unit>' when they all match)
  const commonUnit = variantRows.length > 0 && variantRows.every((r) => r.priceUnit === variantRows[0].priceUnit) ? (variantRows[0].priceUnit ?? '') : '';
  const setCommonUnit = (v: string) => setVariantRows((rows) => rows.map((r) => ({ ...r, priceUnit: v === '' ? null : v })));

  const addOption = () => setOptions((o) => [...o, { id: nextTempId(), name: '', valuesText: '' }]);
  const removeOption = (id: string) => setOptions((o) => o.filter((x) => x.id !== id));
  const updateOption = (id: string, patch: Partial<OptionDraft>) =>
    setOptions((o) => o.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const updateVariant = (label: string, patch: Partial<VariantRow>) =>
    setVariantRows((rows) => rows.map((r) => (r.label === label ? { ...r, ...patch } : r)));

  // Optional fields fall back to sensible automatic values
  const prefixForSku = skuPrefix.trim() || initialsOf(name);

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim() || !categoryId) {
      setError('Product name and category are required.');
      return;
    }
    const finalSlug = slug.trim() || slugify(name) || `product-${Date.now().toString(36)}`;
    const price = Number(basePrice);
    if (!Number.isFinite(price) || price < 0) {
      setError('Base price must be a valid number.');
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const productPayload = {
      name: name.trim(),
      slug: finalSlug,
      description: description.trim() || null,
      category_id: categoryId,
      sku_prefix: prefixForSku || null,
      base_price: price,
      wholesale_price: wholesalePrice ? Number(wholesalePrice) : null,
      wholesale_available: wholesaleAvailable,
      status,
      weight_g: weightG ? Number(weightG) : null,
      cover_image_url: images[0] ?? null,
    };

    let productId = initial?.id;

    if (isEdit && productId) {
      const { error: updateError } = await supabase.from('products').update(productPayload).eq('id', productId);
      if (updateError) {
        setError(updateError.code === '23505' ? 'Another product already uses this link. Change the slug slightly.' : updateError.message);
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
        setError(insertError?.code === '23505' ? 'Another product already uses this link. Change the slug slightly.' : (insertError?.message ?? 'Could not create product.'));
        setSaving(false);
        return;
      }
      productId = inserted.id;
    }

    // Photo gallery: rebuild from the form (first image is also the cover)
    await supabase.from('product_images').delete().eq('product_id', productId);
    if (images.length > 0) {
      await supabase
        .from('product_images')
        .insert(images.map((url, idx) => ({ product_id: productId as string, url, position: idx + 1 })));
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
          sku: row.sku.trim() || autoSku(prefixForSku, row.label) || null,
          price: Number(row.price) || price,
          stock: Number(row.stock) || 0,
          image_url: row.imageUrl,
          price_unit: row.priceUnit?.trim() || null,
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

  const setVariantImage = async (label: string, file: File | undefined) => {
    if (!file) return;
    setUploadingFor(label);
    try {
      const url = await uploadProcessedImage(file);
      updateVariant(label, { imageUrl: url });
    } catch (e: any) {
      setError(e?.message ?? 'Image upload failed.');
    } finally {
      setUploadingFor(null);
    }
  };

  return (
    <div className="pb-24">
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* ---------------- MAIN COLUMN ---------------- */}
        <div className="flex min-w-0 flex-col gap-5">
          <Card title="Basic information">
            <div className="flex flex-col gap-5">
              <Field label="Product name">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Antibacterial Hand Wash" />
              </Field>
              <Field
                label="URL slug"
                hint="Automatic: built from the product name, so you can leave it alone. It is the product's web address."
              >
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    setSlug(slugify(e.target.value));
                  }}
                />
                <span className="mt-1 block break-all text-xs text-ink-faint">
                  yoursite.com/product/<span className="font-semibold text-ink-muted">{slug || 'your-slug'}</span>
                </span>
              </Field>
              <Field label="Description" hint="Shown on the product page under the name. Say what it does, scents/sizes, how to use it.">
                <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card title="Photos">
            <ImageUploader images={images} onChange={setImages} />
          </Card>

          <Card title="Variants &amp; stock">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-ink-faint">
                Add an option (e.g. Fragrance or Size) and list its values separated by commas. A row is created for
                every combination.
              </p>
              <button
                type="button"
                onClick={addOption}
                className="inline-flex flex-none items-center justify-center gap-1.5 rounded-lg border border-brand/30 bg-brand-tint px-3.5 py-2 text-sm font-semibold text-brand-dark hover:bg-brand hover:text-white"
              >
                <LuPlus size={16} /> Add option
              </button>
            </div>

            <div className="mb-5 rounded-xl border border-brand-border bg-brand-surface p-3.5">
              <Field
                label="Fill all variants' unit (optional)"
                hint='Quickly sets "Unit" below for every variant at once — e.g. all "carton of 12". If different sizes sell in different carton counts (1L in cartons of 12, 4L in cartons of 4), leave this blank and set each variant&apos;s unit individually below.'
              >
                <input list="price-units" value={commonUnit} onChange={(e) => setCommonUnit(e.target.value)} placeholder="e.g. carton of 12, piece" />
                <datalist id="price-units">
                  <option value="carton of 4" />
                  <option value="carton of 6" />
                  <option value="carton of 12" />
                  <option value="piece" />
                  <option value="dozen" />
                  <option value="pack" />
                </datalist>
              </Field>
            </div>

            {options.length === 0 ? (
              <p className="mb-4 rounded-xl bg-brand-surface p-3.5 text-sm text-ink-faint">
                No options. This product has a single variant.
              </p>
            ) : (
              <div className="mb-5 flex flex-col gap-3">
                {options.map((opt) => (
                  <div key={opt.id} className="rounded-xl border border-brand-border p-3.5">
                    <div className="mb-2.5 flex items-center gap-2">
                      <input
                        value={opt.name}
                        onChange={(e) => updateOption(opt.id, { name: e.target.value })}
                        placeholder="Option name (e.g. Fragrance)"
                        className="min-w-0 flex-1 rounded-lg border border-brand-border px-3 py-2.5 text-sm font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(opt.id)}
                        aria-label="Remove option"
                        className="flex h-10 w-10 flex-none items-center justify-center rounded-lg text-ink-faint hover:bg-brand-tint hover:text-danger"
                      >
                        <LuX size={18} />
                      </button>
                    </div>
                    <input
                      value={opt.valuesText}
                      onChange={(e) => updateOption(opt.id, { valuesText: e.target.value })}
                      placeholder="Values, comma separated: Lemon, Lavender, Mixed Fruits"
                      className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {variantRows.map((row) => (
                <div key={row.label} className="rounded-xl border border-brand-border bg-brand-surface p-3.5">
                  <div className="mb-3 flex items-center gap-3">
                    <label className="relative flex h-14 w-14 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-brand-border bg-white text-ink-faint hover:border-brand hover:text-brand">
                      {uploadingFor === row.label ? (
                        <LuLoader size={18} className="animate-spin" />
                      ) : row.imageUrl ? (
                        <Image src={row.imageUrl} alt="" fill sizes="56px" className="object-contain p-1" />
                      ) : (
                        <LuImagePlus size={18} />
                      )}
                      <input type="file" accept="image/*" hidden onChange={(e) => { setVariantImage(row.label, e.target.files?.[0]); e.target.value = ''; }} />
                    </label>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold">{row.label || 'Default variant'}</div>
                      <div className="text-xs text-ink-faint">
                        {row.imageUrl ? (
                          <button type="button" className="font-semibold text-brand" onClick={() => updateVariant(row.label, { imageUrl: null })}>
                            Remove photo
                          </button>
                        ) : (
                          'Tap the square to add a photo for this variant'
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1.2fr_0.85fr_1fr_0.75fr]">
                    <Field label="SKU" className="col-span-2 sm:col-span-1">
                      <input
                        value={row.sku}
                        onChange={(e) => updateVariant(row.label, { sku: e.target.value })}
                        placeholder={autoSku(prefixForSku, row.label) || 'auto'}
                      />
                    </Field>
                    <Field label="Price (₦)">
                      <input inputMode="numeric" value={row.price} onChange={(e) => updateVariant(row.label, { price: e.target.value })} />
                    </Field>
                    <Field label="Unit" hint={row.priceUnit ? undefined : 'e.g. carton of 12'}>
                      <input
                        list="price-units"
                        value={row.priceUnit ?? ''}
                        onChange={(e) => updateVariant(row.label, { priceUnit: e.target.value || null })}
                        placeholder="carton of 12"
                      />
                    </Field>
                    <Field label="Stock">
                      <input inputMode="numeric" value={row.stock} onChange={(e) => updateVariant(row.label, { stock: e.target.value })} />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ---------------- SIDEBAR ---------------- */}
        <div className="flex min-w-0 flex-col gap-5">
          <Card title="Status">
            <Field label="Visibility">
              <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of stock</option>
              </select>
            </Field>
          </Card>

          <Card title="Organisation">
            <div className="flex flex-col gap-5">
              <Field label="Category">
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.sectionName} / {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="SKU prefix"
                hint="Optional. Leave blank and it is made from the product name. Variant SKUs are built from it (e.g. RHW-LEMON). Customers never see it."
              >
                <input value={skuPrefix} onChange={(e) => setSkuPrefix(e.target.value)} placeholder="Auto" />
              </Field>
            </div>
          </Card>

          <Card title="Pricing">
            <div className="flex flex-col gap-5">
              <Field label="Base price (₦)">
                <input inputMode="numeric" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="1500" />
              </Field>
              <Field label="Wholesale price (₦)">
                <input inputMode="numeric" value={wholesalePrice} onChange={(e) => setWholesalePrice(e.target.value)} placeholder="1200" />
              </Field>
              <label className="flex items-center gap-2.5 text-sm text-ink-muted">
                <input type="checkbox" className="h-4 w-4 accent-brand" checked={wholesaleAvailable} onChange={(e) => setWholesaleAvailable(e.target.checked)} />
                Available for wholesale
              </label>
            </div>
          </Card>

          <Card title="Shipping">
            <Field label="Weight (g)">
              <input inputMode="numeric" value={weightG} onChange={(e) => setWeightG(e.target.value)} placeholder="500" />
            </Field>
          </Card>
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-brand-border bg-white/95 px-4 py-3 backdrop-blur md:left-60 md:px-10">
        <div className="mx-auto flex max-w-[1200px] items-center gap-3">
          <p className="min-w-0 flex-1 truncate text-sm text-danger">{error}</p>
          <Link href="/admin/products" className="rounded-lg border border-brand-border px-4 py-2.5 text-sm font-semibold text-ink-muted hover:bg-brand-tint">
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:bg-ink-faint"
          >
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish product'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-brand-border bg-white p-4 sm:p-6">
      <h3 className="mb-4 text-[15px] font-semibold md:text-base md:font-bold" dangerouslySetInnerHTML={{ __html: title }} />
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  className = '',
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex min-w-0 flex-col gap-1.5 [&_input:not([type=checkbox])]:w-full [&_input]:min-w-0 [&_input]:rounded-lg [&_input:not([type=checkbox])]:border [&_input]:border-brand-border [&_input:not([type=checkbox])]:px-3.5 [&_input:not([type=checkbox])]:py-2.5 [&_input]:text-sm [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-brand-border [&_select]:px-3.5 [&_select]:py-2.5 [&_select]:text-sm [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-brand-border [&_textarea]:px-3.5 [&_textarea]:py-2.5 [&_textarea]:text-sm ${className}`}
    >
      <label className="text-[13px] font-semibold">{label}</label>
      {hint && <p className="-mt-0.5 text-xs leading-relaxed text-ink-faint">{hint}</p>}
      {children}
    </div>
  );
}
