'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Plus, Search, X, Check, Loader, Trash2, Eye,
  Package, RotateCcw, Truck, Download,
} from 'lucide-react';
import api from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────
interface OrderUser { id: number; username: string; email: string; phone?: string; }
interface OrderItem { id: number; quantity: number; price_at_purchase: string | null; selected_sku: string | null; product: { id: number; ProductName: string } | null; }
interface OriginalOrder { id: number; order_status: string | null; total_summary: string | null; createdAt: string; user: OrderUser; items: OrderItem[]; }

interface ReturnItem { productName: string; sku: string; quantity: number; priceOverride: number; }
interface ReturnOrder {
  id: number;
  originalOrderId: number;
  returnReason: string | null;
  items: ReturnItem[];
  itemsPrice: string;
  shippingCost: string;
  status: string;
  trackingInfo: string | null;
  adminNote: string | null;
  createdAt: string;
  originalOrder: OriginalOrder;
}

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function statusColor(s: string) {
  const map: Record<string, { bg: string; color: string }> = {
    Pending:    { bg: '#fef3c7', color: '#92400e' },
    Processing: { bg: '#dbeafe', color: '#1e40af' },
    Shipped:    { bg: '#ede9fe', color: '#5b21b6' },
    Delivered:  { bg: '#dcfce7', color: '#166534' },
    Cancelled:  { bg: '#fee2e2', color: '#991b1b' },
  };
  return map[s] ?? { bg: '#f1f5f9', color: '#475569' };
}

// ─── Main Page ────────────────────────────────────────────────
export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnOrder[]>([]);
  const [orders, setOrders] = useState<OriginalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Create modal
  const [showCreate, setShowCreate] = useState(false);

  // Detail / update modal
  const [detail, setDetail] = useState<ReturnOrder | null>(null);
  const [detailStatus, setDetailStatus] = useState('');
  const [detailTracking, setDetailTracking] = useState('');
  const [detailNote, setDetailNote] = useState('');
  const [updating, setUpdating] = useState(false);

  function load() {
    setLoading(true);
    const q = filterStatus ? `?status=${filterStatus}` : '';
    api.get(`/returns${q}`).then(r => setReturns(r.data)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [filterStatus]);

  // Fetch all orders once for the "create" dropdown
  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data)).catch(() => {});
  }, []);

  const filtered = returns.filter(r =>
    String(r.originalOrderId).includes(search) ||
    r.originalOrder.user.username.toLowerCase().includes(search.toLowerCase()) ||
    r.originalOrder.user.email.toLowerCase().includes(search.toLowerCase())
  );

  async function openDetail(ret: ReturnOrder) {
    const r = await api.get(`/returns/${ret.id}`).catch(() => ({ data: ret }));
    setDetail(r.data);
    setDetailStatus(r.data.status);
    setDetailTracking(r.data.trackingInfo ?? '');
    setDetailNote(r.data.adminNote ?? '');
  }

  async function updateReturn() {
    if (!detail) return;
    setUpdating(true);
    try {
      await api.put(`/returns/${detail.id}`, {
        status: detailStatus,
        trackingInfo: detailTracking,
        adminNote: detailNote,
      });
      toast.success('อัปเดตสำเร็จ');
      setDetail(null);
      load();
    } catch { toast.error('Failed to update'); } finally { setUpdating(false); }
  }

  async function deleteReturn(id: number) {
    if (!confirm('ลบ Return Order นี้?')) return;
    try { await api.delete(`/returns/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  }

  function exportCSV() {
    const rows = [
      ['Return ID', 'Original Order', 'Customer', 'Email', 'Items Price', 'Shipping', 'Status', 'Tracking', 'Date'],
      ...filtered.map(r => [
        r.id,
        `#${r.originalOrderId}`,
        r.originalOrder.user.username,
        r.originalOrder.user.email,
        Number(r.itemsPrice),
        Number(r.shippingCost),
        r.status,
        r.trackingInfo ?? '',
        new Date(r.createdAt).toLocaleDateString('th-TH'),
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `returns_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Export ${filtered.length} records สำเร็จ`);
  }

  return (
    <>
      {/* ── Header ────────────────────────── */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <h1 className="page-title">Return & Replacement Orders</h1>
          {returns.filter(r => r.status === 'Pending').length > 0 && (
            <span style={{ background: '#f59e0b', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 100, padding: '2px 8px' }}>
              {returns.filter(r => r.status === 'Pending').length} pending
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={14} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={15} /> สร้าง Return Order
          </button>
        </div>
      </div>

      {/* ── List ──────────────────────────── */}
      <div className="page-body">
        <div className="card">
          <div className="card-header">
            <div className="toolbar" style={{ width: '100%' }}>
              <div className="search-wrap">
                <Search size={15} />
                <input className="search-input" placeholder="ค้นหา Order ID / ลูกค้า…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="form-select" style={{ width: 160 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">All statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="text-muted" style={{ fontSize: 13 }}>{filtered.length} records</span>
            </div>
          </div>

          {loading ? <div className="spinner" /> : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Return #</th>
                    <th>Order เดิม</th>
                    <th>ลูกค้า</th>
                    <th>สาเหตุ</th>
                    <th>ราคาสินค้า</th>
                    <th>ค่าส่ง</th>
                    <th>สถานะ</th>
                    <th>วันที่</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9} className="empty-state">
                      <RotateCcw size={32} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
                      ยังไม่มี Return Orders
                    </td></tr>
                  ) : filtered.map(ret => {
                    const sc = statusColor(ret.status);
                    return (
                      <tr key={ret.id}>
                        <td><span style={{ fontWeight: 700 }}>RET-{ret.id}</span></td>
                        <td><span style={{ fontWeight: 600, color: 'var(--accent)' }}>#{ret.originalOrderId}</span></td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{ret.originalOrder.user.username}</div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>{ret.originalOrder.user.email}</div>
                        </td>
                        <td className="text-muted" style={{ fontSize: 13, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ret.returnReason || '—'}
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          {Number(ret.itemsPrice) === 0
                            ? <span style={{ color: '#22c55e', fontWeight: 700 }}>ฟรี</span>
                            : `฿${Number(ret.itemsPrice).toLocaleString()}`}
                        </td>
                        <td>
                          {Number(ret.shippingCost) === 0
                            ? <span style={{ color: '#22c55e', fontWeight: 700 }}>ฟรี</span>
                            : `฿${Number(ret.shippingCost).toLocaleString()}`}
                        </td>
                        <td>
                          <span style={{ ...sc, borderRadius: 100, padding: '3px 10px', fontSize: 12, fontWeight: 600, display: 'inline-block' }}>
                            {ret.status}
                          </span>
                        </td>
                        <td className="text-muted" style={{ fontSize: 12 }}>
                          {new Date(ret.createdAt).toLocaleDateString('th-TH')}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button className="btn btn-secondary btn-sm" onClick={() => openDetail(ret)}>
                              <Eye size={13} /> Details
                            </button>
                            <button className="btn btn-danger btn-sm btn-icon" onClick={() => deleteReturn(ret.id)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Create Modal ─────────────────── */}
      {showCreate && (
        <CreateReturnModal
          orders={orders}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); load(); }}
        />
      )}

      {/* ── Detail / Update Modal ─────────── */}
      {detail && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDetail(null)}>
          <div className="modal" style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <span className="modal-title">RET-{detail.id} — Order #{detail.originalOrderId}</span>
              <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setDetail(null)}><X size={15} /></button>
            </div>
            <div className="modal-body">
              {/* Original order summary */}
              <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--txt-muted)', marginBottom: 4 }}>ลูกค้า</div>
                <div style={{ fontWeight: 600 }}>{detail.originalOrder.user.username}</div>
                <div style={{ fontSize: 13, color: 'var(--txt-muted)' }}>{detail.originalOrder.user.email}</div>
              </div>

              {/* Items */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--txt-muted)', marginBottom: 8 }}>สินค้าที่ต้องส่งทดแทน</div>
                {(detail.items as ReturnItem[]).map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                    <span>{item.productName} × {item.quantity} <span style={{ color: 'var(--txt-muted)' }}>({item.sku})</span></span>
                    <span style={{ fontWeight: 600 }}>
                      {item.priceOverride === 0 ? <span style={{ color: '#22c55e' }}>฿0 (ฟรี)</span> : `฿${item.priceOverride.toLocaleString()}`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--txt-muted)' }}>ราคาสินค้า</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: Number(detail.itemsPrice) === 0 ? '#22c55e' : 'var(--txt)' }}>
                    {Number(detail.itemsPrice) === 0 ? 'ฟรี' : `฿${Number(detail.itemsPrice).toLocaleString()}`}
                  </div>
                </div>
                <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--txt-muted)' }}>ค่าจัดส่ง</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: Number(detail.shippingCost) === 0 ? '#22c55e' : 'var(--txt)' }}>
                    {Number(detail.shippingCost) === 0 ? 'ฟรี' : `฿${Number(detail.shippingCost).toLocaleString()}`}
                  </div>
                </div>
              </div>

              {detail.returnReason && (
                <div className="form-group">
                  <label className="form-label">สาเหตุการคืน</label>
                  <div style={{ padding: '8px 12px', background: 'var(--bg)', borderRadius: 6, fontSize: 13 }}>{detail.returnReason}</div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">อัปเดตสถานะ</label>
                <select className="form-select" value={detailStatus} onChange={e => setDetailStatus(e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tracking Number</label>
                <input className="form-input" value={detailTracking} onChange={e => setDetailTracking(e.target.value)} placeholder="หมายเลขพัสดุ / ชื่อขนส่ง" />
              </div>
              <div className="form-group">
                <label className="form-label">Admin Note</label>
                <textarea className="form-textarea" value={detailNote} onChange={e => setDetailNote(e.target.value)} placeholder="หมายเหตุสำหรับ admin…" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDetail(null)}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={updateReturn} disabled={updating} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {updating ? <Loader size={14} className="animate-spin" /> : <Check size={14} />}
                {updating ? 'กำลังบันทึก…' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Create Return Modal ─────────────────────────────────────
interface CreateReturnModalProps {
  orders: OriginalOrder[];
  onClose: () => void;
  onCreated: () => void;
}

function CreateReturnModal({ orders, onClose, onCreated }: CreateReturnModalProps) {
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OriginalOrder | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [itemsPriceFree, setItemsPriceFree] = useState(true);
  const [itemsPriceCustom, setItemsPriceCustom] = useState('');
  const [shippingFree, setShippingFree] = useState(true);
  const [shippingCustom, setShippingCustom] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [saving, setSaving] = useState(false);

  function selectOrder(id: string) {
    setSelectedOrderId(id);
    const order = orders.find(o => String(o.id) === id) ?? null;
    setSelectedOrder(order);
    if (order) {
      // Pre-fill return items from original order items
      setReturnItems(order.items.map(item => ({
        productName: item.product?.ProductName ?? 'Unknown',
        sku: item.selected_sku ?? '',
        quantity: item.quantity,
        priceOverride: 0,
      })));
    } else {
      setReturnItems([]);
    }
  }

  function setItemField(idx: number, key: keyof ReturnItem, val: string | number) {
    setReturnItems(prev => prev.map((item, i) => i === idx ? { ...item, [key]: val } : item));
  }

  function addBlankItem() {
    setReturnItems(prev => [...prev, { productName: '', sku: '', quantity: 1, priceOverride: 0 }]);
  }

  function removeItem(idx: number) {
    setReturnItems(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    if (!selectedOrderId) { toast.error('กรุณาเลือก Order เดิม'); return; }
    if (returnItems.length === 0) { toast.error('กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ'); return; }
    if (returnItems.some(i => !i.productName.trim())) { toast.error('กรุณากรอกชื่อสินค้าทุกรายการ'); return; }

    const itemsPrice = itemsPriceFree ? 0 : parseFloat(itemsPriceCustom || '0');
    const shippingCost = shippingFree ? 0 : parseFloat(shippingCustom || '0');

    setSaving(true);
    try {
      await api.post('/returns', {
        originalOrderId: parseInt(selectedOrderId),
        returnReason: returnReason || null,
        items: returnItems,
        itemsPrice,
        shippingCost,
        adminNote: adminNote || null,
      });
      toast.success('สร้าง Return Order สำเร็จ');
      onCreated();
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message ?? 'Failed');
    } finally { setSaving(false); }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 680, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <span className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RotateCcw size={16} /> สร้าง Return & Replacement Order
          </span>
          <button className="btn btn-secondary btn-icon btn-sm" onClick={onClose}><X size={15} /></button>
        </div>

        <div className="modal-body">
          {/* 1. Select original order */}
          <div className="form-group">
            <label className="form-label">Order เดิม *</label>
            <select className="form-select" value={selectedOrderId} onChange={e => selectOrder(e.target.value)}>
              <option value="">— เลือก Order —</option>
              {orders.map(o => (
                <option key={o.id} value={o.id}>
                  #{o.id} — {o.user?.username} — ฿{Number(o.total_summary ?? 0).toLocaleString()} ({o.order_status})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Return reason */}
          <div className="form-group">
            <label className="form-label">สาเหตุการคืน</label>
            <textarea
              className="form-textarea"
              value={returnReason}
              onChange={e => setReturnReason(e.target.value)}
              placeholder="เช่น ส่งสินค้าผิดรุ่น / ผิดสี / ผิดไซส์…"
            />
          </div>

          {/* 3. Items */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label className="form-label" style={{ margin: 0 }}>สินค้าที่ต้องส่งทดแทน *</label>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addBlankItem}>
                <Plus size={13} /> เพิ่มสินค้า
              </button>
            </div>

            {returnItems.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', background: 'var(--bg)', borderRadius: 8, color: 'var(--txt-muted)', fontSize: 13 }}>
                {selectedOrder ? 'ไม่มี items จาก order นี้' : 'เลือก Order ก่อน หรือกด "เพิ่มสินค้า"'}
              </div>
            )}

            {returnItems.map((item, idx) => (
              <div key={idx} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 80px 32px', gap: 8, alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>ชื่อสินค้า *</span>
                    <input className="form-input" style={{ fontSize: 13 }} value={item.productName}
                      onChange={e => setItemField(idx, 'productName', e.target.value)} placeholder="ชื่อสินค้า" />
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>SKU</span>
                    <input className="form-input" style={{ fontSize: 13 }} value={item.sku}
                      onChange={e => setItemField(idx, 'sku', e.target.value)} placeholder="SKU" />
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>จำนวน</span>
                    <input className="form-input" type="number" min={1} style={{ fontSize: 13 }} value={item.quantity}
                      onChange={e => setItemField(idx, 'quantity', parseInt(e.target.value) || 1)} />
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>ราคา ฿</span>
                    <input className="form-input" type="number" min={0} style={{ fontSize: 13 }} value={item.priceOverride}
                      onChange={e => setItemField(idx, 'priceOverride', parseFloat(e.target.value) || 0)} />
                  </div>
                  <button type="button" className="btn btn-danger btn-icon btn-sm" onClick={() => removeItem(idx)} style={{ alignSelf: 'flex-end', marginBottom: 1 }}>
                    <X size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 4. Pricing options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Items price */}
            <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Package size={14} /> ราคาสินค้า (รวม)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input type="radio" name="itemsPrice" checked={itemsPriceFree} onChange={() => setItemsPriceFree(true)} />
                  <span style={{ color: '#22c55e', fontWeight: 600 }}>ฟรี (฿0)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input type="radio" name="itemsPrice" checked={!itemsPriceFree} onChange={() => setItemsPriceFree(false)} />
                  กำหนดราคาเอง
                </label>
                {!itemsPriceFree && (
                  <input className="form-input" type="number" min={0} placeholder="0.00" value={itemsPriceCustom}
                    onChange={e => setItemsPriceCustom(e.target.value)} style={{ fontSize: 13 }} />
                )}
              </div>
            </div>

            {/* Shipping cost */}
            <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Truck size={14} /> ค่าจัดส่ง
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input type="radio" name="shippingCost" checked={shippingFree} onChange={() => setShippingFree(true)} />
                  <span style={{ color: '#22c55e', fontWeight: 600 }}>จัดส่งฟรี</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input type="radio" name="shippingCost" checked={!shippingFree} onChange={() => setShippingFree(false)} />
                  เก็บค่าส่ง
                </label>
                {!shippingFree && (
                  <input className="form-input" type="number" min={0} placeholder="0.00" value={shippingCustom}
                    onChange={e => setShippingCustom(e.target.value)} style={{ fontSize: 13 }} />
                )}
              </div>
            </div>
          </div>

          {/* Summary highlight */}
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#15803d', fontWeight: 500 }}>ยอดรวมที่ลูกค้าต้องชำระ</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#14532d' }}>
              ฿{(
                (itemsPriceFree ? 0 : parseFloat(itemsPriceCustom || '0')) +
                (shippingFree ? 0 : parseFloat(shippingCustom || '0'))
              ).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Admin note */}
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Admin Note (ไม่บังคับ)</label>
            <textarea className="form-textarea" value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="หมายเหตุเพิ่มเติม…" />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>ยกเลิก</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {saving ? <Loader size={14} className="animate-spin" /> : <Check size={14} />}
            {saving ? 'กำลังสร้าง…' : 'สร้าง Return Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
