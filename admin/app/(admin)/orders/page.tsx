'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Search, X, Check, Loader, Eye, CheckCircle2, XCircle } from 'lucide-react';
import api from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

interface OrderItem {
  id: number; quantity: number; price_at_purchase: string | null;
  selected_sku: string | null; product: { id: number; ProductName: string } | null;
}
interface Order {
  id: number; order_status: string | null; payment_status: string | null;
  total_summary: string | null; tracking_info: string | null;
  slip_url: string | null; slip_transferred_at: string | null;
  createdAt: string;
  user: { id: number; username: string; email: string };
  items: OrderItem[];
}

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function statusBadge(s: string | null) {
  const map: Record<string, string> = {
    Pending: 'badge-warning', Processing: 'badge-info',
    Shipped: 'badge-info', Delivered: 'badge-success', Cancelled: 'badge-danger',
  };
  return `badge ${map[s ?? ''] ?? 'badge-gray'}`;
}

function paymentBadge(s: string | null) {
  if (s === 'confirmed') return { cls: 'badge badge-success', label: '✓ Confirmed' };
  if (s === 'slip_submitted') return { cls: 'badge badge-warning', label: '⏳ Slip Submitted' };
  if (s === 'rejected') return { cls: 'badge badge-danger', label: '✗ Rejected' };
  return { cls: 'badge badge-gray', label: 'Unpaid' };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [detail, setDetail] = useState<Order | null>(null);
  const [slipModal, setSlipModal] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [tracking, setTracking] = useState('');
  const [updating, setUpdating] = useState(false);
  const [verifying, setVerifying] = useState(false);

  function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus) params.set('status', filterStatus);
    if (filterPayment) params.set('payment', filterPayment);
    api.get(`/orders?${params}`).then(r => setOrders(r.data)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [filterStatus, filterPayment]);

  function openDetail(o: Order) {
    setDetail(o); setNewStatus(o.order_status ?? ''); setTracking(o.tracking_info ?? '');
  }

  async function updateStatus() {
    if (!detail) return;
    setUpdating(true);
    try {
      await api.put(`/orders/${detail.id}/status`, { order_status: newStatus, tracking_info: tracking });
      toast.success('Order updated!');
      setDetail(null); load();
    } catch { toast.error('Failed to update'); } finally { setUpdating(false); }
  }

  async function verifyPayment(order: Order, action: 'confirm' | 'reject') {
    setVerifying(true);
    try {
      await api.put(`/orders/${order.id}/payment`, { action });
      toast.success(action === 'confirm' ? '✓ Payment confirmed!' : 'Payment rejected');
      setSlipModal(null); load();
    } catch { toast.error('Failed to update payment status'); } finally { setVerifying(false); }
  }

  const filtered = orders.filter(o =>
    o.user.username.toLowerCase().includes(search.toLowerCase()) ||
    o.user.email.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toString().includes(search)
  );

  // Count pending slips
  const pendingSlips = orders.filter(o => o.payment_status === 'slip_submitted').length;

  return (
    <>
      <div className="page-header">
        <div className="flex items-center gap-3">
          <h1 className="page-title">Orders</h1>
          {pendingSlips > 0 && (
            <span style={{
              background: '#f59e0b', color: '#fff', fontSize: 11,
              fontWeight: 700, borderRadius: 100, padding: '2px 8px'
            }}>
              {pendingSlips} slip{pendingSlips > 1 ? 's' : ''} to review
            </span>
          )}
        </div>
        <span className="text-muted" style={{ fontSize: 13 }}>{filtered.length} orders</span>
      </div>

      <div className="page-body">
        <div className="card">
          <div className="card-header">
            <div className="toolbar" style={{ width: '100%' }}>
              <div className="search-wrap">
                <Search size={15} />
                <input className="search-input" placeholder="Search by customer or order ID…"
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="form-select" style={{ width: 160 }} value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); }}>
                <option value="">All statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="form-select" style={{ width: 170 }} value={filterPayment}
                onChange={e => { setFilterPayment(e.target.value); }}>
                <option value="">All payments</option>
                <option value="unpaid">Unpaid</option>
                <option value="slip_submitted">Slip Submitted</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {loading ? <div className="spinner" /> : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order</th><th>Customer</th><th>Items</th><th>Total</th>
                    <th>Status</th><th>Payment</th><th>Date</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0
                    ? <tr><td colSpan={8} className="empty-state">No orders found</td></tr>
                    : filtered.map(o => {
                      const py = paymentBadge(o.payment_status);
                      return (
                        <tr key={o.id}>
                          <td><span style={{ fontWeight: 700 }}>#{o.id}</span></td>
                          <td>
                            <div style={{ fontWeight: 500 }}>{o.user.username}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>{o.user.email}</div>
                          </td>
                          <td className="text-muted">{o.items.length}</td>
                          <td style={{ fontWeight: 600 }}>฿{Number(o.total_summary ?? 0).toLocaleString()}</td>
                          <td><span className={statusBadge(o.order_status)}>{o.order_status ?? '—'}</span></td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span className={py.cls}>{py.label}</span>
                              {o.payment_status === 'slip_submitted' && (
                                <button
                                  onClick={() => setSlipModal(o)}
                                  style={{
                                    background: '#f59e0b', color: '#fff', border: 'none',
                                    borderRadius: 6, padding: '3px 8px', fontSize: 11,
                                    fontWeight: 700, cursor: 'pointer', display: 'flex',
                                    alignItems: 'center', gap: 3,
                                  }}
                                >
                                  <Eye size={11} /> ดูสลิป
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="text-muted" style={{ fontSize: 12 }}>
                            {new Date(o.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button id={`order-detail-${o.id}`} className="btn btn-secondary btn-sm"
                              onClick={() => openDetail(o)}>Details</button>
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

      {/* ── Slip Review Modal ──────────────────────────────────────── */}
      {slipModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSlipModal(null)}>
          <div className="modal" style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <span className="modal-title">ตรวจสอบสลิป — Order #{slipModal.id}</span>
              <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setSlipModal(null)}>
                <X size={15} />
              </button>
            </div>
            <div className="modal-body">
              {/* Customer info */}
              <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--txt-muted)', marginBottom: 4 }}>ลูกค้า</div>
                <div style={{ fontWeight: 600 }}>{slipModal.user.username}</div>
                <div style={{ fontSize: 13, color: 'var(--txt-muted)' }}>{slipModal.user.email}</div>
              </div>

              {/* Amount */}
              <div style={{
                background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8,
                padding: '12px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, color: '#15803d', fontWeight: 500 }}>ยอดที่ต้องชำระ</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#14532d' }}>
                  ฿{Number(slipModal.total_summary ?? 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Transfer time */}
              {slipModal.slip_transferred_at && (
                <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--txt-muted)', marginBottom: 4 }}>เวลาที่โอนเงิน</div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>
                    {new Date(slipModal.slip_transferred_at).toLocaleString('th-TH', {
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </div>
                </div>
              )}

              {/* Slip image */}
              {slipModal.slip_url ? (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--txt-muted)', marginBottom: 8 }}>สลิปการโอนเงิน</div>
                  <a href={slipModal.slip_url.startsWith('http') ? slipModal.slip_url : `${API_BASE}${slipModal.slip_url}`}
                    target="_blank" rel="noreferrer">
                    <img
                      src={slipModal.slip_url.startsWith('http') ? slipModal.slip_url : `${API_BASE}${slipModal.slip_url}`}
                      alt="payment slip"
                      style={{ width: '100%', borderRadius: 12, border: '1px solid var(--border)', objectFit: 'contain', maxHeight: 400 }}
                    />
                    <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--txt-muted)', marginTop: 4 }}>
                      คลิกเพื่อดูรูปเต็ม
                    </p>
                  </a>
                </div>
              ) : (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--txt-muted)', fontSize: 13 }}>
                  ไม่พบรูปสลิป
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSlipModal(null)}>ปิด</button>
              <button
                className="btn btn-danger"
                onClick={() => verifyPayment(slipModal, 'reject')}
                disabled={verifying}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {verifying ? <Loader size={14} className="animate-spin" /> : <XCircle size={14} />}
                ปฏิเสธ
              </button>
              <button
                className="btn btn-primary"
                onClick={() => verifyPayment(slipModal, 'confirm')}
                disabled={verifying}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {verifying ? <Loader size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                ยืนยันการชำระเงิน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Order Detail Modal (status update) ───────────────────── */}
      {detail && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDetail(null)}>
          <div className="modal" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <span className="modal-title">Order #{detail.id}</span>
              <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setDetail(null)}>
                <X size={15} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--txt-muted)', marginBottom: 4 }}>Customer</div>
                <div style={{ fontWeight: 600 }}>{detail.user.username}</div>
                <div style={{ fontSize: 13, color: 'var(--txt-muted)' }}>{detail.user.email}</div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--txt-muted)', marginBottom: 8 }}>Order Items</div>
                {detail.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                    <span>{item.product?.ProductName ?? 'Unknown'} × {item.quantity} {item.selected_sku ? <span style={{ color: 'var(--txt-muted)' }}>({item.selected_sku})</span> : null}</span>
                    <span style={{ fontWeight: 600 }}>฿{Number(item.price_at_purchase ?? 0).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, fontWeight: 700 }}>
                  <span>Total</span>
                  <span>฿{Number(detail.total_summary ?? 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Payment status display */}
              <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--txt-muted)', marginBottom: 4 }}>Payment Status</div>
                <span className={paymentBadge(detail.payment_status).cls}>
                  {paymentBadge(detail.payment_status).label}
                </span>
                {detail.payment_status === 'slip_submitted' && (
                  <button className="btn btn-secondary btn-sm" style={{ marginLeft: 8 }}
                    onClick={() => { setDetail(null); setSlipModal(detail); }}>
                    <Eye size={13} /> ดูสลิป
                  </button>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Update Status</label>
                <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tracking Info</label>
                <input className="form-input" value={tracking} onChange={e => setTracking(e.target.value)}
                  placeholder="Tracking number or courier info" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDetail(null)}>Cancel</button>
              <button id="update-order-btn" className="btn btn-primary" onClick={updateStatus} disabled={updating}>
                {updating ? <Loader size={14} className="animate-spin" /> : <Check size={14} />}
                {updating ? 'Updating…' : 'Update Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
