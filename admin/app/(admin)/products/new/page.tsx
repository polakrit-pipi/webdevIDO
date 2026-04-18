'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Trash2, ArrowLeft, Upload, X } from 'lucide-react';
import api from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

interface Category { id: number; categoryName: string; }
interface Variant {
  _key: number;
  sku: string; color: string; size: string;
  stockqty: string; pricing: string; salePricing: string;
  imageUrl: string; // uploaded image URL path e.g. /uploads/xxx.jpg
  uploading: boolean;
}

let keyCounter = 0;
function newVariant(): Variant {
  return { _key: ++keyCounter, sku: '', color: '', size: '', stockqty: '0', pricing: '0', salePricing: '', imageUrl: '', uploading: false };
}

export default function NewProductPage() {
  const router = useRouter();
  const [cats, setCats] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ProductName: '', categoryId: '', recomended: false, description: '' });
  const [variants, setVariants] = useState<Variant[]>([newVariant()]);

  useEffect(() => {
    api.get('/categories').then(r => setCats(r.data));
  }, []);

  function setField(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); }

  function setVariant(key: number, k: string, v: any) {
    setVariants(vs => vs.map(v2 => v2._key === key ? { ...v2, [k]: v } : v2));
  }

  async function uploadImage(key: number, file: File) {
    setVariant(key, 'uploading', true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      const res = await fetch(`${API_BASE}/api/admin/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setVariant(key, 'imageUrl', data.url);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setVariant(key, 'uploading', false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.ProductName.trim()) { toast.error('Product name is required'); return; }
    const invalidVariant = variants.find(v => !v.sku.trim());
    if (invalidVariant) { toast.error('Every variant needs a SKU'); return; }

    setSaving(true);
    try {
      await api.post('/products', {
        ...form,
        variants: variants.map(({ _key, imageUrl, uploading, ...v }) => ({
          ...v,
          // Store image as array of {url} objects to match frontend expectations
          Image: imageUrl ? [{ url: imageUrl }] : null,
        })),
      });
      toast.success('Product created!');
      router.push('/products');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message ?? 'Failed to create product');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="btn btn-secondary btn-sm btn-icon"><ArrowLeft size={15} /></button>
          <h1 className="page-title">New Product</h1>
        </div>
        <button id="save-product-btn" className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save Product'}
        </button>
      </div>

      <div className="page-body">
        <form onSubmit={save} style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Basic info */}
            <div className="card">
              <div className="card-header"><span className="card-title">Product Info</span></div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input id="field-name" className="form-input" value={form.ProductName}
                    onChange={e => setField('ProductName', e.target.value)} placeholder="e.g. Classic Oxford Shirt" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" value={form.description}
                    onChange={e => setField('description', e.target.value)} placeholder="Product description…" />
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Variants</span>
                <button type="button" className="btn btn-secondary btn-sm"
                  onClick={() => setVariants(vs => [...vs, newVariant()])}>
                  <Plus size={14} /> Add Variant
                </button>
              </div>
              <div className="card-body">
                {variants.map(v => (
                  <div key={v._key} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 100px 100px 36px', gap: '6px 8px', alignItems: 'center', marginBottom: 10 }}>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--txt-muted)', display: 'block', marginBottom: 4 }}>SKU *</span>
                        <input className="form-input" value={v.sku} onChange={e => setVariant(v._key, 'sku', e.target.value)} placeholder="SKU-001" style={{ fontSize: 13 }} />
                      </div>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--txt-muted)', display: 'block', marginBottom: 4 }}>Color</span>
                        <input className="form-input" value={v.color} onChange={e => setVariant(v._key, 'color', e.target.value)} placeholder="Black" style={{ fontSize: 13 }} />
                      </div>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--txt-muted)', display: 'block', marginBottom: 4 }}>Size</span>
                        <input className="form-input" value={v.size} onChange={e => setVariant(v._key, 'size', e.target.value)} placeholder="M" style={{ fontSize: 13 }} />
                      </div>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--txt-muted)', display: 'block', marginBottom: 4 }}>Stock</span>
                        <input className="form-input" type="number" value={v.stockqty} onChange={e => setVariant(v._key, 'stockqty', e.target.value)} style={{ fontSize: 13 }} />
                      </div>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--txt-muted)', display: 'block', marginBottom: 4 }}>Price ฿</span>
                        <input className="form-input" type="number" value={v.pricing} onChange={e => setVariant(v._key, 'pricing', e.target.value)} style={{ fontSize: 13 }} />
                      </div>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--txt-muted)', display: 'block', marginBottom: 4 }}>Sale ฿</span>
                        <input className="form-input" type="number" value={v.salePricing} onChange={e => setVariant(v._key, 'salePricing', e.target.value)} placeholder="—" style={{ fontSize: 13 }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                        <button type="button" className="btn btn-danger btn-icon"
                          onClick={() => setVariants(vs => vs.filter(x => x._key !== v._key))}
                          disabled={variants.length === 1}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Image upload */}
                    <div style={{ marginTop: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--txt-muted)', display: 'block', marginBottom: 6 }}>Variant Image</span>
                      {v.imageUrl ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={`${API_BASE}${v.imageUrl}`} alt="variant" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setVariant(v._key, 'imageUrl', '')}>
                            <X size={13} /> Remove
                          </button>
                        </div>
                      ) : (
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '6px 12px', border: '1px dashed var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--txt-muted)' }}>
                          {v.uploading ? 'Uploading…' : <><Upload size={14} /> Upload Image</>}
                          <input type="file" accept="image/*" style={{ display: 'none' }} disabled={v.uploading}
                            onChange={e => { if (e.target.files?.[0]) uploadImage(v._key, e.target.files[0]); }} />
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
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
                    Mark as Featured / Recommended
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
