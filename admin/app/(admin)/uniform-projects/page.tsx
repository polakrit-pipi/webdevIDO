'use client';
import { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Search, Star, X, Upload, ImagePlus } from 'lucide-react';
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
  tags: '',
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

  // Cover image state
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Additional images state — store as array of URL strings
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [uploadingExtra, setUploadingExtra] = useState(false);
  const extraInputRef = useRef<HTMLInputElement>(null);

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
    setAdditionalImages([]);
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
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
      quantity: p.quantity?.toString() ?? '',
      material: p.material ?? '',
      featured: p.featured,
      publishedAt: p.publishedAt ? p.publishedAt.slice(0, 10) : '',
    });
    // Load existing additional images (excluding cover)
    const imgs = Array.isArray(p.images)
      ? p.images.map(i => i.url).filter(u => u !== p.coverImage)
      : [];
    setAdditionalImages(imgs);
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
        images: additionalImages.map(url => ({ url })),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
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

  // ── Upload cover image ──────────────────────────────────
  async function handleUploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(f => ({ ...f, coverImage: data.url }));
      toast.success('อัปโหลดรูป Cover สำเร็จ');
    } catch {
      toast.error('อัปโหลดล้มเหลว');
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  }

  // ── Upload additional images (multiple) ─────────────────
  async function handleUploadExtra(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploadingExtra(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        urls.push(data.url);
      }
      setAdditionalImages(prev => [...prev, ...urls]);
      toast.success(`อัปโหลด ${urls.length} รูปสำเร็จ`);
    } catch {
      toast.error('อัปโหลดล้มเหลว');
    } finally {
      setUploadingExtra(false);
      if (extraInputRef.current) extraInputRef.current.value = '';
    }
  }

  function removeExtraImage(idx: number) {
    setAdditionalImages(prev => prev.filter((_, i) => i !== idx));
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
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>IDEABYIDO — Portfolio Management</div>
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
                <div style={{ marginBottom: '12px', opacity: 0.3 }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
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
                            flexShrink: 0,
                          }}
                        >
                          {p.coverImage ? (
                            <img src={p.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={CATEGORY_COLORS[p.category] ?? '#64748b'} strokeWidth="1.5" opacity="0.6">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="M21 15l-5-5L5 21" />
                            </svg>
                          )}
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
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>IDEABYIDO Uniform Portfolio</div>
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

                  {/* Upload zone */}
                  <div
                    style={{
                      border: '2px dashed #e2e8f0',
                      borderRadius: '12px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s, background 0.2s',
                      background: form.coverImage ? '#f8fafc' : 'transparent',
                    }}
                    onClick={() => coverInputRef.current?.click()}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#c9a84c'; (e.currentTarget as HTMLDivElement).style.background = '#fffbf0'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLDivElement).style.background = form.coverImage ? '#f8fafc' : 'transparent'; }}
                  >
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleUploadCover}
                    />
                    {form.coverImage ? (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img
                          src={form.coverImage}
                          alt="cover"
                          style={{ width: '160px', height: '110px', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
                        />
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, coverImage: '' })); }}
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                          }}
                        >
                          <X size={12} />
                        </button>
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>คลิกเพื่อเปลี่ยนรูป</div>
                      </div>
                    ) : (
                      <div>
                        {uploadingCover ? (
                          <div className="spinner" style={{ margin: '0 auto 8px', width: 28, height: 28 }} />
                        ) : (
                          <Upload size={28} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
                        )}
                        <div style={{ fontWeight: 600, color: '#334155', fontSize: '14px', marginBottom: '4px' }}>
                          {uploadingCover ? 'กำลังอัปโหลด...' : 'คลิกเพื่ออัปโหลดรูป Cover'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>PNG, JPG, WEBP ขนาดไม่เกิน 10MB</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Additional Images — Multi Upload */}
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">รูปภาพเพิ่มเติม</label>

                  {/* Existing previews */}
                  {additionalImages.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      {additionalImages.map((url, idx) => (
                        <div key={idx} style={{ position: 'relative' }}>
                          <img
                            src={url}
                            alt={`extra-${idx}`}
                            style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                          />
                          <button
                            type="button"
                            onClick={() => removeExtraImage(idx)}
                            style={{
                              position: 'absolute',
                              top: '-6px',
                              right: '-6px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button */}
                  <div
                    style={{
                      border: '2px dashed #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                      cursor: uploadingExtra ? 'not-allowed' : 'pointer',
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                    onClick={() => !uploadingExtra && extraInputRef.current?.click()}
                    onMouseEnter={e => { if (!uploadingExtra) { (e.currentTarget as HTMLDivElement).style.borderColor = '#c9a84c'; (e.currentTarget as HTMLDivElement).style.background = '#fffbf0'; } }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                  >
                    <input
                      ref={extraInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleUploadExtra}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: uploadingExtra ? '#94a3b8' : '#64748b' }}>
                      {uploadingExtra ? (
                        <div className="spinner" style={{ width: 18, height: 18 }} />
                      ) : (
                        <ImagePlus size={18} />
                      )}
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>
                        {uploadingExtra ? 'กำลังอัปโหลด...' : 'คลิกเพื่ออัปโหลดรูปเพิ่มเติม (เลือกได้หลายรูป)'}
                      </span>
                    </div>
                  </div>
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
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    />
                    <span>Featured (แสดงในหน้าหลัก)</span>
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
