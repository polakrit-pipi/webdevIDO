'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, ShoppingBag, Tag, Image, Flag,
  Palette, Star, Users, ShoppingCart, LogOut, Zap, Shirt, RotateCcw
} from 'lucide-react';

const navItems = [
  { section: 'Overview' },
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { section: 'IDO IDENTITY — Catalog' },
  { href: '/products', label: 'Products', icon: ShoppingBag },
  { href: '/categories', label: 'Categories', icon: Tag },
  { section: 'IDO IDENTITY — Content' },
  { href: '/collections', label: 'Collections', icon: Image },
  { href: '/banners', label: 'Banners', icon: Flag },
  { href: '/colors', label: 'Theme Colors', icon: Palette },
  { href: '/new-products', label: 'New Arrivals', icon: Star },
  { section: 'IDO IDENTITY — Commerce' },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/returns', label: 'Return & Replacement', icon: RotateCcw },
  { href: '/users', label: 'Users', icon: Users },
  { section: '✦ IDEA BY IDO' },
  { href: '/uniform-projects', label: 'Uniform Projects', icon: Shirt },
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
          <div className="sidebar-logo-text">IDO GROUP</div>
          <div className="sidebar-logo-sub">Admin Panel</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if ('section' in item) {
            const isIdeaSection = String(item.section).startsWith('✦');
            return (
              <div
                key={i}
                className="sidebar-section"
                style={isIdeaSection ? { color: '#c9a84c', marginTop: '16px' } : undefined}
              >
                {item.section}
              </div>
            );
          }
          const Icon = item.icon!;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href!));
          const isIdea = item.href === '/uniform-projects';
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`nav-link${isActive ? ' active' : ''}`}
              style={
                isIdea && !isActive
                  ? { color: '#c9a84c', opacity: 0.8 }
                  : isIdea && isActive
                  ? { background: 'linear-gradient(135deg, #c9a84c, #e8c060)', color: '#0a0f1e' }
                  : undefined
              }
            >
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
