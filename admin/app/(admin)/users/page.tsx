'use client';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api from '@/lib/api';

interface User {
  id: number; username: string; email: string;
  firstname: string | null; lastname: string | null;
  role: string; confirmed: boolean; blocked: boolean; createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <span className="text-muted" style={{ fontSize: 13 }}>{filtered.length} users</span>
      </div>

      <div className="page-body">
        <div className="card">
          <div className="card-header">
            <div className="search-wrap" style={{ maxWidth: 320 }}>
              <Search size={15} />
              <input className="search-input" placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          {loading ? <div className="spinner" /> : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  {filtered.length === 0
                    ? <tr><td colSpan={5} className="empty-state">No users found</td></tr>
                    : filtered.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{u.firstname || u.lastname ? `${u.firstname ?? ''} ${u.lastname ?? ''}`.trim() : u.username}</div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>@{u.username}</div>
                        </td>
                        <td className="text-muted">{u.email}</td>
                        <td><span className="badge badge-info">{u.role}</span></td>
                        <td>
                          {u.blocked
                            ? <span className="badge badge-danger">Blocked</span>
                            : u.confirmed
                              ? <span className="badge badge-success">Active</span>
                              : <span className="badge badge-warning">Unconfirmed</span>}
                        </td>
                        <td className="text-muted" style={{ fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
