'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, ShoppingBag, Tag, Image, Flag,
  Palette, Star, Users, ShoppingCart, LogOut, Zap
} from 'lucide-react';

const navItems = [
  { section: 'Overview' },
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { section: 'Catalog' },
  { href: '/products', label: 'Products', icon: ShoppingBag },
  { href: '/categories', label: 'Categories', icon: Tag },
  { section: 'Content' },
  { href: '/collections', label: 'Collections', icon: Image },
  { href: '/banners', label: 'Banners', icon: Flag },
  { href: '/colors', label: 'Theme Colors', icon: Palette },
  { href: '/new-products', label: 'New Arrivals', icon: Star },
  { section: 'Commerce' },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/users', label: 'Users', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    localStorage.removeItem('admin_token');
    router.push('/login');
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon"><Zap size={18} color="#fff" /></div>
        <div>
          <div className="sidebar-logo-text">ideabymuha</div>
          <div className="sidebar-logo-sub">Admin Panel</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if ('section' in item) {
            return <div key={i} className="sidebar-section">{item.section}</div>;
          }
          const Icon = item.icon!;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href!));
          return (
            <Link key={item.href} href={item.href!} className={`nav-link${isActive ? ' active' : ''}`}>
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </aside>
  );
}
