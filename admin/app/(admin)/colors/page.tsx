'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Save, Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';

interface ColorRecord { id: number; color: any; }

export default function ColorsPage() {
  const [items, setItems] = useState<ColorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [editMap, setEditMap] = useState<Record<number, string>>({});

  function load() {
    api.get('/colors').then(r => {
      setItems(r.data);
      const m: Record<number, string> = {};
      r.data.forEach((c: ColorRecord) => { m[c.id] = JSON.stringify(c.color ?? {}, null, 2); });
      setEditMap(m);
    }).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function save(id: number) {
    setSaving(id);
    try {
      const parsed = JSON.parse(editMap[id]);
      await api.put(`/colors/${id}`, { color: parsed });
      toast.success('Theme colors saved!');
    } catch (e: any) {
      if (e instanceof SyntaxError) toast.error('Invalid JSON');
      else toast.error('Failed to save');
    } finally { setSaving(null); }
  }

  if (loading) return <div className="spinner" />;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Theme Colors</h1>
      </div>
      <div className="page-body">
        {items.length === 0 ? (
          <div className="card">
            <div className="empty-state">No color config found in the database.</div>
          </div>
        ) : items.map(c => (
          <div key={c.id} className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <span className="card-title">Color Config #{c.id}</span>
              <button className="btn btn-primary btn-sm" onClick={() => save(c.id)} disabled={saving === c.id}>
                <Save size={14} /> {saving === c.id ? 'Saving…' : 'Save'}
              </button>
            </div>
            <div className="card-body">
              <p className="text-muted" style={{ fontSize: 12, marginBottom: 12 }}>
                Edit the JSON color configuration for your storefront theme.
              </p>
              <textarea
                className="form-textarea"
                style={{ fontFamily: 'monospace', fontSize: 13, minHeight: 300 }}
                value={editMap[c.id] ?? ''}
                onChange={e => setEditMap(m => ({ ...m, [c.id]: e.target.value }))}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
