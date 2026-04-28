'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import api from '@/lib/api';

interface Category {
  id: number; categoryName: string; type: string | null;
  categoryPic: { url: string } | null; publishedAt: string | null;
}

const TYPES = ['shirt', 'trouser', 'others'];

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ categoryName: '', type: '', categoryPic: '' });
  const [saving, setSaving] = useState(false);

  function load() {
    api.get('/categories').then(r => setItems(r.data)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setForm({ categoryName: '', type: '', categoryPic: '' });
    setModal(true);
  }

  function openEdit(c: Category) {
    setEditing(c);
    setForm({
      categoryName: c.categoryName,
      type: c.type ?? '',
      categoryPic: (c.categoryPic as any)?.url ?? '',
    });
    setModal(true);
  }

  async function handleSave() {
    if (!form.categoryName.trim()) { toast.error('Name required'); return; }
    setSaving(true);
    try {
      const payload = {
        categoryName: form.categoryName,
        type: form.type || null,
        categoryPic: form.categoryPic ? { url: form.categoryPic } : null,
      };
      if (editing) {
        await api.put(`/categories/${editing.id}`, payload);
        toast.success('Category updated');
      } else {
        await api.post('/categories', payload);
        toast.success('Category created');
      }
      setModal(false);
      load();
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  }

  async function remove(id: number, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <button id="add-category-btn" className="btn btn-primary" onClick={openNew}><Plus size={15} /> Add Category</button>
      </div>

      <div className="page-body">
        <div className="card">
          {loading ? <div className="spinner" /> : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Name</th><th>Type</th><th>Products</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr><td colSpan={5} className="empty-state">No categories yet</td></tr>
                  ) : items.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.categoryName}</td>
                      <td><span className="badge badge-info">{c.type ?? '—'}</span></td>
                      <td className="text-muted">—</td>
                      <td>{c.publishedAt ? <span className="badge badge-success">Published</span> : <span className="badge badge-gray">Draft</span>}</td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(c)}><Pencil size={14} /></button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => remove(c.id, c.categoryName)}><Trash2 size={14} /></button>
                        </div>
                      </td>
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
              <span className="modal-title">{editing ? 'Edit Category' : 'New Category'}</span>
              <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setModal(false)}><X size={15} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input id="category-name" className="form-input" value={form.categoryName} onChange={e => setForm(f => ({ ...f, categoryName: e.target.value }))} placeholder="e.g. Shirts" />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="">— Select type —</option>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input className="form-input" value={form.categoryPic} onChange={e => setForm(f => ({ ...f, categoryPic: e.target.value }))} placeholder="https://…" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button id="save-category-btn" className="btn btn-primary" onClick={handleSave} disabled={saving}><Check size={14} /> {saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
