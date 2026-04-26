'use client';
import { useEffect, useState } from 'react';
import { ShoppingBag, Users, ShoppingCart, Clock, TrendingUp } from 'lucide-react';
import api from '@/lib/api';

interface Stats {
  products: number;
  users: number;
  orders: number;
  pendingOrders: number;
  totalRevenue: number;
}

interface Order {
  id: number;
  order_status: string;
  total_summary: string;
  createdAt: string;
  user: { username: string; email: string };
}

function statusBadge(s: string) {
  const map: Record<string, string> = {
    Pending: 'badge-warning',
    Processing: 'badge-info',
    Shipped: 'badge-info',
    Delivered: 'badge-success',
    Cancelled: 'badge-danger',
  };
  return `badge ${map[s] ?? 'badge-gray'}`;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(r => {
      setStats(r.data.stats);
      setOrders(r.data.recentOrders);
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats?.products ?? 0, icon: ShoppingBag, color: '#6366f1', bg: '#ede9fe' },
    { label: 'Total Users', value: stats?.users ?? 0, icon: Users, color: '#0ea5e9', bg: '#e0f2fe' },
    { label: 'Total Orders', value: stats?.orders ?? 0, icon: ShoppingCart, color: '#22c55e', bg: '#dcfce7' },
    { label: 'Pending Orders', value: stats?.pendingOrders ?? 0, icon: Clock, color: '#f59e0b', bg: '#fef9c3' },
    { label: 'Total Revenue', value: `฿${Number(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: TrendingUp, color: '#ec4899', bg: '#fce7f3' },
  ];

  if (loading) return <div className="spinner" />;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <span className="text-muted" style={{ fontSize: 13 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="page-body">
        {/* Stat Cards */}
        <div className="stat-grid">
          {statCards.map(c => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="stat-card">
                <div className="stat-icon" style={{ background: c.bg }}>
                  <Icon size={22} color={c.color} />
                </div>
                <div>
                  <div className="stat-label">{c.label}</div>
                  <div className="stat-value">{c.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Orders</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: '#64748b' }}>No orders yet</td></tr>
                ) : orders.map(o => (
                  <tr key={o.id}>
                    <td><span style={{ fontWeight: 600 }}>#{o.id}</span></td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{o.user.username}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{o.user.email}</div>
                    </td>
                    <td><span className={statusBadge(o.order_status ?? '')}>{o.order_status}</span></td>
                    <td>฿{Number(o.total_summary ?? 0).toLocaleString()}</td>
                    <td style={{ color: '#64748b', fontSize: 12 }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
