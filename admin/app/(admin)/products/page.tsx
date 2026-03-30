'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, Search, Pencil, Trash2, ChevronRight } from 'lucide-react';
import api from '@/lib/api';

interface Product {
  id: number;
  ProductName: string;
  recomended: boolean;
  publishedAt: string | null;
  cat_pro: { categoryName: string } | null;
  variants: { id: number }[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  function load() {
    api.get('/products').then(r => setProducts(r.data)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function remove(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This will also delete all its variants.`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      load();
    } catch {
      toast.error('Failed to delete product');
    }
  }

  const filtered = products.filter(p =>
    p.ProductName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <Link href="/products/new" className="btn btn-primary" id="add-product-btn">
          <Plus size={15} /> Add Product
        </Link>
      </div>

      <div className="page-body">
        <div className="card">
          <div className="card-header">
            <div className="toolbar" style={{ width: '100%' }}>
              <div className="search-wrap">
                <Search size={15} />
                <input
                  className="search-input"
                  placeholder="Search products…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <span className="text-muted" style={{ fontSize: 13 }}>
                {filtered.length} products
              </span>
            </div>
          </div>

          {loading ? <div className="spinner" /> : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Variants</th>
                    <th>Featured</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="empty-state">No products found</td></tr>
                  ) : filtered.map(p => (
                    <tr key={p.id}>
                      <td>
                        <Link href={`/products/${p.id}`} style={{ fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>
                          {p.ProductName}
                        </Link>
                      </td>
                      <td className="text-muted">{p.cat_pro?.categoryName ?? '—'}</td>
                      <td>
                        <span className="badge badge-info">{p.variants.length} vars</span>
                      </td>
                      <td>
                        {p.recomended ? <span className="badge badge-success">Yes</span> : <span className="badge badge-gray">No</span>}
                      </td>
                      <td>
                        {p.publishedAt ? <span className="badge badge-success">Published</span> : <span className="badge badge-gray">Draft</span>}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link href={`/products/${p.id}`} className="btn btn-secondary btn-sm btn-icon" title="Edit">
                            <Pencil size={14} />
                          </Link>
                          <button className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={() => remove(p.id, p.ProductName)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
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
