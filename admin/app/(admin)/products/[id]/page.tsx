'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import api from '@/lib/api';

interface Variant {
  id: number; sku: string; color: string | null; size: string | null;
  stockqty: number | null; pricing: string; salePricing: number | null;
}
interface Product {
  id: number; ProductName: string; recomended: boolean; description: any;
  publishedAt: string | null; categoryId: number | null;
  cat_pro: { id: number; categoryName: string } | null;
  variants: Variant[];
}
interface Category { id: number; categoryName: string; }

let keyC = 0;
interface EditVariant extends Variant { _key: number; _new?: boolean; }

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [variants, setVariants] = useState<EditVariant[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ProductName: '', categoryId: '', recomended: false, description: '' });

  useEffect(() => {
    Promise.all([api.get(`/products/${id}`), api.get('/categories')]).then(([pr, cr]) => {
      const p: Product = pr.data;
      setProduct(p);
      setForm({
        ProductName: p.ProductName,
        categoryId: p.categoryId?.toString() ?? '',
        recomended: p.recomended,
        description: typeof p.description === 'string' ? p.description : '',
      });
      setVariants(p.variants.map(v => ({ ...v, _key: ++keyC })));
      setCats(cr.data);
    });
  }, [id]);

  function setField(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); }

  function setVField(key: number, k: string, v: string) {
    setVariants(vs => vs.map(v2 => v2._key === key ? { ...v2, [k]: v } : v2));
  }

  function addVariant() {
    setVariants(vs => [...vs, {
      id: -1, _key: ++keyC, _new: true,
      sku: '', color: '', size: '', stockqty: 0, pricing: '0', salePricing: null,
    }]);
  }

  async function deleteVariant(v: EditVariant) {
    if (v._new) { setVariants(vs => vs.filter(x => x._key !== v._key)); return; }
    if (!confirm('Delete this variant?')) return;
    try {
      await api.delete(`/variants/${v.id}`);
      setVariants(vs => vs.filter(x => x._key !== v._key));
      toast.success('Variant deleted');
    } catch { toast.error('Failed to delete variant'); }
  }

  async function save() {
    setSaving(true);
    try {
      // Update product core fields
      await api.put(`/products/${id}`, {
        ...form,
        categoryId: form.categoryId || null,
      });

      // For each variant: create if new, update if existing
      for (const v of variants) {
        const payload = {
          sku: v.sku, color: v.color || null, size: v.size || null,
          stockqty: Number(v.stockqty ?? 0),
          pricing: Number(v.pricing ?? 0),
          salePricing: v.salePricing ? Number(v.salePricing) : null,
        };
        if (v._new) {
          await api.post(`/products/${id}/variants`, payload);
        } else {
          await api.put(`/variants/${v.id}`, payload);
        }
      }

      toast.success('Product updated!');
      router.push('/products');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (!product) return <div className="spinner" />;

  return (
    <>
      <div className="page-header">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="btn btn-secondary btn-sm btn-icon"><ArrowLeft size={15} /></button>
          <h1 className="page-title">Edit: {product.ProductName}</h1>
        </div>
        <button id="update-product-btn" className="btn btn-primary" onClick={save} disabled={saving}>
          <Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="page-body" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header"><span className="card-title">Product Info</span></div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input className="form-input" value={form.ProductName} onChange={e => setField('ProductName', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setField('description', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Variants</span>
              <button className="btn btn-secondary btn-sm" onClick={addVariant}><Plus size={14} /> Add Variant</button>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 100px 100px 36px', gap: '6px 8px', marginBottom: 8 }}>
                {['SKU *', 'Color', 'Size', 'Stock', 'Price ฿', 'Sale ฿', ''].map((h, i) => (
                  <span key={i} style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--txt-muted)' }}>{h}</span>
                ))}
              </div>
              {variants.map(v => (
                <div key={v._key} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 100px 100px 36px', gap: '6px 8px', marginBottom: 8 }}>
                  <input className="form-input" value={v.sku} onChange={e => setVField(v._key, 'sku', e.target.value)} style={{ fontSize: 13 }} />
                  <input className="form-input" value={v.color ?? ''} onChange={e => setVField(v._key, 'color', e.target.value)} style={{ fontSize: 13 }} />
                  <input className="form-input" value={v.size ?? ''} onChange={e => setVField(v._key, 'size', e.target.value)} style={{ fontSize: 13 }} />
                  <input className="form-input" type="number" value={v.stockqty ?? 0} onChange={e => setVField(v._key, 'stockqty', e.target.value)} style={{ fontSize: 13 }} />
                  <input className="form-input" type="number" value={v.pricing} onChange={e => setVField(v._key, 'pricing', e.target.value)} style={{ fontSize: 13 }} />
                  <input className="form-input" type="number" value={v.salePricing ?? ''} onChange={e => setVField(v._key, 'salePricing', e.target.value)} placeholder="—" style={{ fontSize: 13 }} />
                  <button className="btn btn-danger btn-icon" onClick={() => deleteVariant(v)}><Trash2 size={14} /></button>
                </div>
              ))}
              {variants.length === 0 && <p className="text-muted" style={{ fontSize: 13 }}>No variants yet. Add one above.</p>}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-header"><span className="card-title">Organization</span></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.categoryId} onChange={e => setField('categoryId', e.target.value)}>
                <option value="">— No category —</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" checked={form.recomended} onChange={e => setField('recomended', e.target.checked)} />
                Mark as Featured
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
