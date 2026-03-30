'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, X, Check, Upload } from 'lucide-react';
import api from '@/lib/api';

interface Banner { id: number; Image: { url: string } | null; createdAt: string; }

export default function BannersPage() {
  const [items, setItems] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [imgUrl, setImgUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

  function load() { api.get('/banners').then(r => setItems(r.data)).finally(() => setLoading(false)); }
  useEffect(() => { load(); }, []);

  function openNew() { setEditing(null); setImgUrl(''); setModal(true); }
  function openEdit(b: Banner) { setEditing(b); setImgUrl(b.Image?.url ?? ''); setModal(true); }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const form = new FormData(); form.append('file', file);
    setUploading(true);
    try {
      const { data } = await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImgUrl(data.url); toast.success('Uploaded');
    } catch { toast.error('Upload failed'); } finally { setUploading(false); }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = { Image: imgUrl ? { url: imgUrl } : null };
      if (editing) { await api.put(`/banners/${editing.id}`, payload); toast.success('Updated'); }
      else { await api.post('/banners', payload); toast.success('Created'); }
      setModal(false); load();
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function remove(id: number) {
    if (!confirm('Delete banner?')) return;
    try { await api.delete(`/banners/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Banners</h1>
        <button className="btn btn-primary" onClick={openNew}><Plus size={15} /> Add Banner</button>
      </div>
      <div className="page-body">
        <div className="card">
          {loading ? <div className="spinner" /> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Preview</th><th>Created</th><th>Actions</th></tr></thead>
                <tbody>
                  {items.length === 0
                    ? <tr><td colSpan={3} className="empty-state">No banners</td></tr>
                    : items.map(b => (
                      <tr key={b.id}>
                        <td>
                          {b.Image?.url
                            ? <img src={`${apiBase}${b.Image.url}`} alt="" style={{ width: 120, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                            : <span className="text-muted">No image</span>}
                        </td>
                        <td className="text-muted">{new Date(b.createdAt).toLocaleDateString()}</td>
                        <td><div className="flex gap-2">
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(b)}>Edit</button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => remove(b.id)}><Trash2 size={14} /></button>
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
              <span className="modal-title">{editing ? 'Edit Banner' : 'New Banner'}</span>
              <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setModal(false)}><X size={15} /></button>
            </div>
            <div className="modal-body">
              {imgUrl && <img src={`${apiBase}${imgUrl}`} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />}
              <div className="form-group">
                <label className="form-label">Upload Banner Image</label>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', marginBottom: 10 }}>
                  <Upload size={13} /> {uploading ? 'Uploading…' : 'Choose File'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={uploadFile} />
                </label>
                <input className="form-input" value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="or paste image URL" />
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
