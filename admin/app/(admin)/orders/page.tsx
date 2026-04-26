'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Search, X, Check, Loader } from 'lucide-react';
import api from '@/lib/api';

interface OrderItem { id: number; quantity: number; price_at_purchase: string | null; selected_sku: string | null; product: { id: number; ProductName: string } | null; }
interface Order {
  id: number; order_status: string | null; total_summary: string | null;
  tracking_info: string | null; createdAt: string;
  user: { id: number; username: string; email: string };
  items: OrderItem[];
}

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function statusBadge(s: string | null) {
  const map: Record<string, string> = { Pending: 'badge-warning', Processing: 'badge-info', Shipped: 'badge-info', Delivered: 'badge-success', Cancelled: 'badge-danger' };
  return `badge ${map[s ?? ''] ?? 'badge-gray'}`;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [detail, setDetail] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [tracking, setTracking] = useState('');
  const [updating, setUpdating] = useState(false);

  function load() {
    const params = filterStatus ? `?status=${filterStatus}` : '';
    api.get(`/orders${params}`).then(r => setOrders(r.data)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [filterStatus]);

  function openDetail(o: Order) {
    setDetail(o);
    setNewStatus(o.order_status ?? '');
    setTracking(o.tracking_info ?? '');
  }

  async function updateStatus() {
    if (!detail) return;
    setUpdating(true);
    try {
      await api.put(`/orders/${detail.id}/status`, { order_status: newStatus, tracking_info: tracking });
      toast.success('Order updated!');
      setDetail(null);
      load();
    } catch { toast.error('Failed to update'); } finally { setUpdating(false); }
  }

  const filtered = orders.filter(o =>
    o.user.username.toLowerCase().includes(search.toLowerCase()) ||
    o.user.email.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toString().includes(search)
  );

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <span className="text-muted" style={{ fontSize: 13 }}>{filtered.length} orders</span>
      </div>

      <div className="page-body">
        <div className="card">
          <div className="card-header">
            <div className="toolbar" style={{ width: '100%' }}>
              <div className="search-wrap">
                <Search size={15} />
                <input className="search-input" placeholder="Search by customer or order ID…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="form-select" style={{ width: 160 }} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setLoading(true); }}>
                <option value="">All statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {loading ? <div className="spinner" /> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.length === 0
                    ? <tr><td colSpan={7} className="empty-state">No orders found</td></tr>
                    : filtered.map(o => (
                      <tr key={o.id}>
                        <td><span style={{ fontWeight: 700 }}>#{o.id}</span></td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{o.user.username}</div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>{o.user.email}</div>
                        </td>
                        <td className="text-muted">{o.items.length}</td>
                        <td style={{ fontWeight: 600 }}>฿{Number(o.total_summary ?? 0).toLocaleString()}</td>
                        <td><span className={statusBadge(o.order_status)}>{o.order_status ?? '—'}</span></td>
                        <td className="text-muted" style={{ fontSize: 12 }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button id={`order-detail-${o.id}`} className="btn btn-secondary btn-sm" onClick={() => openDetail(o)}>Details</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {detail && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDetail(null)}>
          <div className="modal" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <span className="modal-title">Order #{detail.id}</span>
              <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setDetail(null)}><X size={15} /></button>
            </div>
            <div className="modal-body">
              {/* Customer */}
              <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--txt-muted)', marginBottom: 4 }}>Customer</div>
                <div style={{ fontWeight: 600 }}>{detail.user.username}</div>
                <div style={{ fontSize: 13, color: 'var(--txt-muted)' }}>{detail.user.email}</div>
              </div>

              {/* Items */}
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

              {/* Update Status */}
              <div className="form-group">
                <label className="form-label">Update Status</label>
                <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tracking Info</label>
                <input className="form-input" value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Tracking number or courier info" />
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
