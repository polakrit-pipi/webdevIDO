'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Check, Upload } from 'lucide-react';
import api from '@/lib/api';

interface NewProduct {
  id: number; title: string | null; description: string | null;
  Image: { url: string } | null; createdAt: string;
  product: { id: number; ProductName: string } | null;
}
interface Product { id: number; ProductName: string; }

export default function NewProductsPage() {
  const [items, setItems] = useState<NewProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<NewProduct | null>(null);
  const [form, setForm] = useState({ title: '', description: '', productId: '', imgUrl: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

  function load() {
    Promise.all([api.get('/new-products'), api.get('/products')]).then(([nr, pr]) => {
      setItems(nr.data); setProducts(pr.data);
    }).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openNew() { setEditing(null); setForm({ title: '', description: '', productId: '', imgUrl: '' }); setModal(true); }
  function openEdit(np: NewProduct) {
    setEditing(np);
    setForm({ title: np.title ?? '', description: np.description ?? '', productId: np.product?.id?.toString() ?? '', imgUrl: np.Image?.url ?? '' });
    setModal(true);
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    setUploading(true);
    try {
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(f => ({ ...f, imgUrl: data.url })); toast.success('Uploaded');
    } catch { toast.error('Upload failed'); } finally { setUploading(false); }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        title: form.title || null,
        description: form.description || null,
        productId: form.productId ? parseInt(form.productId) : null,
        Image: form.imgUrl ? { url: form.imgUrl } : null,
      };
      if (editing) { await api.put(`/new-products/${editing.id}`, payload); toast.success('Updated'); }
      else { await api.post('/new-products', payload); toast.success('Created'); }
      setModal(false); load();
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function remove(id: number) {
    if (!confirm('Delete this featured item?')) return;
    try { await api.delete(`/new-products/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">New Arrivals</h1>
        <button className="btn btn-primary" onClick={openNew}><Plus size={15} /> Add</button>
      </div>
      <div className="page-body">
        <div className="card">
          {loading ? <div className="spinner" /> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Image</th><th>Title</th><th>Linked Product</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {items.length === 0
                    ? <tr><td colSpan={5} className="empty-state">No featured items yet</td></tr>
                    : items.map(np => (
                      <tr key={np.id}>
                        <td>
                          {np.Image?.url
                            ? <img src={`${apiBase}${np.Image.url}`} alt="" style={{ width: 60, height: 44, objectFit: 'cover', borderRadius: 6 }} />
                            : <span className="text-muted">—</span>}
                        </td>
                        <td style={{ fontWeight: 600 }}>{np.title ?? '—'}</td>
                        <td className="text-muted">{np.product?.ProductName ?? '—'}</td>
                        <td className="text-muted">{new Date(np.createdAt).toLocaleDateString()}</td>
                        <td><div className="flex gap-2">
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(np)}><Pencil size={14} /></button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => remove(np.id)}><Trash2 size={14} /></button>
                        </div></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Featured Item' : 'New Featured Item'}</span>
              <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setModal(false)}><X size={15} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="New Arrival" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Link to Product</label>
                <select className="form-select" value={form.productId} onChange={e => setForm(f => ({ ...f, productId: e.target.value }))}>
                  <option value="">— No product —</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.ProductName}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Image</label>
                {form.imgUrl && <img src={`${apiBase}${form.imgUrl}`} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />}
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', marginBottom: 8 }}>
                  <Upload size={13} /> {uploading ? 'Uploading…' : 'Upload Image'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={uploadFile} />
                </label>
                <input className="form-input" value={form.imgUrl} onChange={e => setForm(f => ({ ...f, imgUrl: e.target.value }))} placeholder="or paste URL" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}><Check size={14} /> {saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
