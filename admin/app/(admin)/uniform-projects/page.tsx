'use client';
import { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Search, Star, X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

// ─── Types ───────────────────────────────────────────────
interface UniformProject {
  id: number;
  title: string;
  clientName?: string;
  category: string;
  description?: string;
  coverImage?: string;
  images?: { url: string }[];
  tags?: string[];
  quantity?: number;
  material?: string;
  featured: boolean;
  publishedAt?: string;
  createdAt: string;
}

const CATEGORIES = ['Work Uniform', 'School', 'Hotel', 'Sport', 'Corporate', 'Restaurant', 'Medical', 'Other'];

const CATEGORY_COLORS: Record<string, string> = {
  'Work Uniform': '#6366f1',
  'School': '#0ea5e9',
  'Hotel': '#c9a84c',
  'Sport': '#22c55e',
  'Corporate': '#8b5cf6',
  'Restaurant': '#f59e0b',
  'Medical': '#ec4899',
  'Other': '#64748b',
};

// ─── Empty Form ──────────────────────────────────────────
const emptyForm = {
  title: '',
  clientName: '',
  category: 'Work Uniform',
  description: '',
  coverImage: '',
  images: '',       // comma-separated URLs
  tags: '',         // comma-separated tags
  quantity: '',
  material: '',
  featured: false,
  publishedAt: '',
};

// ─── Main Page ───────────────────────────────────────────
export default function UniformProjectsPage() {
  const [projects, setProjects] = useState<UniformProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UniformProject | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadProjects(); }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      const { data } = await api.get('/uniform-projects');
      setProjects(data.projects ?? []);
    } catch {
      toast.error('Failed to load uniform projects');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(p: UniformProject) {
    setEditing(p);
    setForm({
      title: p.title,
      clientName: p.clientName ?? '',
      category: p.category,
      description: p.description ?? '',
      coverImage: p.coverImage ?? '',
      images: Array.isArray(p.images) ? p.images.map(i => i.url).join(', ') : '',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
      quantity: p.quantity?.toString() ?? '',
      material: p.material ?? '',
      featured: p.featured,
      publishedAt: p.publishedAt ? p.publishedAt.slice(0, 10) : '',
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) { toast.error('กรุณาใส่ชื่อโปรเจกต์'); return; }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        clientName: form.clientName.trim() || null,
        category: form.category,
        description: form.description.trim() || null,
        coverImage: form.coverImage.trim() || null,
        images: form.images
          ? form.images.split(',').map(u => ({ url: u.trim() })).filter(u => u.url)
          : [],
        tags: form.tags
          ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
          : [],
        quantity: form.quantity ? parseInt(form.quantity, 10) : null,
        material: form.material.trim() || null,
        featured: form.featured,
        publishedAt: form.publishedAt || null,
      };

      if (editing) {
        await api.put(`/uniform-projects/${editing.id}`, payload);
        toast.success('อัปเดตผลงานเรียบร้อย');
      } else {
        await api.post('/uniform-projects', payload);
        toast.success('เพิ่มผลงานเรียบร้อย');
      }
      setModalOpen(false);
      loadProjects();
    } catch {
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`ลบผลงาน "${title}" ใช่หรือไม่?`)) return;
    try {
      await api.delete(`/uniform-projects/${id}`);
      toast.success('ลบผลงานเรียบร้อย');
      loadProjects();
    } catch {
      toast.error('ไม่สามารถลบได้');
    }
  }

  async function handleUploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const url = data.url;
      setForm(f => ({ ...f, coverImage: url }));
      toast.success('อัปโหลดรูปสำเร็จ');
    } catch {
      toast.error('อัปโหลดล้มเหลว');
    } finally {
      setUploading(false);
    }
  }

  // Filtered list
  const filtered = projects.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.clientName ?? '').toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || p.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <>
      {/* ─── Page Header ──────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #c9a84c, #e8c060)',
              borderRadius: '8px',
              width: '28px',
              height: '28px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}>✦</span>
            Uniform Projects
          </h1>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>IDEA BY IDO — Portfolio Management</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd} style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c060)', color: '#0a0f1e', border: 'none' }}>
          <Plus size={15} /> เพิ่มผลงานใหม่
        </button>
      </div>

      {/* ─── Page Body ────────────────────────────────────── */}
      <div className="page-body">
        {/* Toolbar */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body">
            <div className="toolbar">
              <div className="search-wrap">
                <Search size={14} />
                <input
                  className="search-input"
                  placeholder="ค้นหาชื่อโปรเจกต์ หรือชื่อลูกค้า..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: 160 }}
                value={filterCat}
                onChange={e => setFilterCat(e.target.value)}
              >
                <option value="">ทุกประเภท</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Summary badges */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {[
            { label: 'ทั้งหมด', value: projects.length, color: '#6366f1', bg: '#ede9fe' },
            { label: 'Featured', value: projects.filter(p => p.featured).length, color: '#c9a84c', bg: '#fef9c3' },
            { label: 'Published', value: projects.filter(p => p.publishedAt).length, color: '#22c55e', bg: '#dcfce7' },
          ].map(stat => (
            <div key={stat.label} style={{ background: stat.bg, borderRadius: '10px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: stat.color, fontWeight: 700, fontSize: '20px' }}>{stat.value}</span>
              <span style={{ color: stat.color, fontSize: '12px', fontWeight: 500 }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card">
          <div className="table-wrap">
            {loading ? (
              <div className="spinner" />
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏭</div>
                <div>{search || filterCat ? 'ไม่พบผลงานที่ค้นหา' : 'ยังไม่มีผลงาน — กดเพิ่มผลงานใหม่'}</div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>รูปภาพ</th>
                    <th>ชื่อโปรเจกต์</th>
                    <th>ลูกค้า</th>
                    <th>ประเภท</th>
                    <th>จำนวน</th>
                    <th>Featured</th>
                    <th>Status</th>
                    <th>วันที่</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id}>
                      {/* Cover thumb */}
                      <td>
                        <div
                          style={{
                            width: '52px',
                            height: '40px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            background: p.coverImage ? 'transparent' : `${CATEGORY_COLORS[p.category] ?? '#64748b'}22`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            flexShrink: 0,
                          }}
                        >
                          {p.coverImage ? (
                            <img src={p.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : '🏭'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{p.title}</div>
                        {Array.isArray(p.tags) && p.tags.length > 0 && (
                          <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                            {p.tags.slice(0, 2).map(t => (
                              <span key={t} style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '4px', padding: '1px 6px', fontSize: '11px' }}>
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td style={{ color: '#64748b', fontSize: 13 }}>{p.clientName ?? '—'}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: `${CATEGORY_COLORS[p.category] ?? '#64748b'}22`,
                            color: CATEGORY_COLORS[p.category] ?? '#64748b',
                          }}
                        >
                          {p.category}
                        </span>
                      </td>
                      <td style={{ color: '#64748b', fontSize: 13 }}>
                        {p.quantity ? `${p.quantity.toLocaleString()} ชิ้น` : '—'}
                      </td>
                      <td>
                        {p.featured && <Star size={16} style={{ color: '#c9a84c', fill: '#c9a84c' }} />}
                      </td>
                      <td>
                        {p.publishedAt ? (
                          <span className="badge badge-success">Published</span>
                        ) : (
                          <span className="badge badge-gray">Draft</span>
                        )}
                      </td>
                      <td style={{ color: '#64748b', fontSize: 12 }}>
                        {new Date(p.createdAt).toLocaleDateString('th-TH')}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-secondary btn-sm btn-icon" title="แก้ไข" onClick={() => openEdit(p)}>
                            <Pencil size={13} />
                          </button>
                          <button className="btn btn-danger btn-sm btn-icon" title="ลบ" onClick={() => handleDelete(p.id, p.title)}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ─── Modal ────────────────────────────────────────── */}
      {modalOpen && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="modal" style={{ maxWidth: '680px' }}>
            {/* Header */}
            <div className="modal-header">
              <div>
                <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #c9a84c, #e8c060)',
                    borderRadius: '6px',
                    width: '22px',
                    height: '22px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                  }}>✦</span>
                  {editing ? 'แก้ไขผลงาน' : 'เพิ่มผลงานใหม่'}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>IDEA BY IDO Uniform Portfolio</div>
              </div>
              <button className="btn btn-secondary btn-icon" onClick={() => setModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                {/* ── ชื่อโปรเจกต์ */}
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">ชื่อโปรเจกต์ <span style={{ color: 'red' }}>*</span></label>
                  <input
                    className="form-input"
                    placeholder="เช่น ยูนิฟอร์มบริษัท ABC"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  />
                </div>

                {/* ── ชื่อลูกค้า */}
                <div className="form-group">
                  <label className="form-label">ชื่อลูกค้า / หน่วยงาน</label>
                  <input
                    className="form-input"
                    placeholder="เช่น บริษัท ABC จำกัด"
                    value={form.clientName}
                    onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
                  />
                </div>

                {/* ── ประเภท */}
                <div className="form-group">
                  <label className="form-label">ประเภทยูนิฟอร์ม <span style={{ color: 'red' }}>*</span></label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* ── รายละเอียด */}
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">รายละเอียดผลงาน</label>
                  <textarea
                    className="form-textarea"
                    placeholder="รายละเอียดกระบวนการผลิต ความพิเศษของผลงาน..."
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                {/* ── Cover Image */}
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">รูปภาพหลัก (Cover)</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <input
                      className="form-input"
                      placeholder="URL รูปภาพ หรืออัปโหลด →"
                      value={form.coverImage}
                      onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
                      style={{ flex: 1 }}
                    />
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUploadCover} />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      style={{ flexShrink: 0 }}
                    >
                      <Upload size={14} /> {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
                    </button>
                  </div>
                  {form.coverImage && (
                    <img
                      src={form.coverImage}
                      alt="cover preview"
                      style={{ marginTop: '8px', width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                  )}
                </div>

                {/* ── Images */}
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">รูปภาพเพิ่มเติม</label>
                  <textarea
                    className="form-textarea"
                    placeholder="วาง URL รูปภาพ คั่นด้วย comma: url1, url2, url3"
                    value={form.images}
                    onChange={e => setForm(f => ({ ...f, images: e.target.value }))}
                    rows={2}
                  />
                  <div className="form-error" style={{ color: '#64748b' }}>คั่นด้วย comma ระหว่าง URL</div>
                </div>

                {/* ── จำนวน / วัสดุ */}
                <div className="form-group">
                  <label className="form-label">จำนวนผลิต (ชิ้น)</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="500"
                    value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">วัสดุ / ผ้าที่ใช้</label>
                  <input
                    className="form-input"
                    placeholder="เช่น Polyester 100%"
                    value={form.material}
                    onChange={e => setForm(f => ({ ...f, material: e.target.value }))}
                  />
                </div>

                {/* ── Tags */}
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Tags</label>
                  <input
                    className="form-input"
                    placeholder="คั่นด้วย comma: polyester, custom-logo, 500pcs"
                    value={form.tags}
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  />
                </div>

                {/* ── Featured + Published */}
                <div className="form-group">
                  <label className="form-label">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                      style={{ marginRight: '8px' }}
                    />
                    ⭐ Featured (แสดงในหน้าหลัก)
                  </label>
                </div>
                <div className="form-group">
                  <label className="form-label">วันที่ Publish (ว่าง = Draft)</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.publishedAt}
                    onChange={e => setForm(f => ({ ...f, publishedAt: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>ยกเลิก</button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
                style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c060)', color: '#0a0f1e', border: 'none' }}
              >
                {saving ? 'กำลังบันทึก...' : editing ? 'บันทึกการแก้ไข' : 'เพิ่มผลงาน'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
