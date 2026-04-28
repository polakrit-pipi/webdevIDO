'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Upload, Trash2, X, Check } from 'lucide-react';
import api from '@/lib/api';

interface Collection { id: number; Image: { url: string } | null; createdAt: string; }

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    setUploading(true);
    try {
      const { data } = await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange(data.url);
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); } finally { setUploading(false); }
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

  return (
    <div>
      {value && (
        <img src={`${apiBase}${value}`} alt="" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8, marginBottom: 8, border: '1px solid var(--border)' }} />
      )}
      <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
        <Upload size={13} /> {uploading ? 'Uploading…' : 'Upload Image'}
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </label>
      {value && (
        <input className="form-input" style={{ marginTop: 8, fontSize: 12 }} value={value}
          onChange={e => onChange(e.target.value)} placeholder="or paste URL" />
      )}
      {!value && (
        <input className="form-input" style={{ marginTop: 8, fontSize: 12 }} value={value}
          onChange={e => onChange(e.target.value)} placeholder="or paste image URL" />
      )}
    </div>
  );
}

export { ImageUploader };

export default function CollectionsPage() {
  const [items, setItems] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [editing, setEditing] = useState<Collection | null>(null);
  const [saving, setSaving] = useState(false);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

  function load() { api.get('/collections').then(r => setItems(r.data)).finally(() => setLoading(false)); }
  useEffect(() => { load(); }, []);

  function openNew() { setEditing(null); setImgUrl(''); setModal(true); }
  function openEdit(c: Collection) { setEditing(c); setImgUrl(c.Image?.url ?? ''); setModal(true); }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = { Image: imgUrl ? { url: imgUrl } : null };
      if (editing) { await api.put(`/collections/${editing.id}`, payload); toast.success('Updated'); }
      else { await api.post('/collections', payload); toast.success('Created'); }
      setModal(false); load();
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  }

  async function remove(id: number) {
    if (!confirm('Delete this collection?')) return;
    try { await api.delete(`/collections/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Collections</h1>
        <button className="btn btn-primary" onClick={openNew}><Plus size={15} /> Add Collection</button>
      </div>
      <div className="page-body">
        <div className="card">
          {loading ? <div className="spinner" /> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Image</th><th>Created</th><th>Actions</th></tr></thead>
                <tbody>
                  {items.length === 0
                    ? <tr><td colSpan={3} className="empty-state">No collections yet</td></tr>
                    : items.map(c => (
                      <tr key={c.id}>
                        <td>
                          {c.Image?.url
                            ? <img src={`${apiBase}${c.Image.url}`} alt="" style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                            : <span className="text-muted">—</span>}
                        </td>
                        <td className="text-muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td><div className="flex gap-2">
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>Edit</button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => remove(c.id)}><Trash2 size={14} /></button>
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
              <span className="modal-title">{editing ? 'Edit Collection' : 'New Collection'}</span>
              <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setModal(false)}><X size={15} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Collection Image</label>
                <ImageUploader value={imgUrl} onChange={setImgUrl} />
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
