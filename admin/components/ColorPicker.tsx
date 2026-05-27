'use client';
import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';

// ── Colour name → CSS-usable value map ──────────────────────────────────────
// Extend this list as you add new colour names to your product catalogue.
const COLOR_CSS: Record<string, string> = {
  black: '#000000',
  white: '#ffffff',
  gray: '#9ca3af',
  grey: '#9ca3af',
  silver: '#c0c0c0',
  gold: '#d4af37',
  brown: '#92400e',
  red: '#ef4444',
  pink: '#ec4899',
  orange: '#f97316',
  yellow: '#eab308',
  green: '#22c55e',
  blue: '#3b82f6',
  navy: '#1e3a5f',
  purple: '#a855f7',
  violet: '#7c3aed',
  indigo: '#6366f1',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  beige: '#f5f5dc',
  cream: '#fffdd0',
  khaki: '#c3b091',
  olive: '#808000',
  maroon: '#800000',
  coral: '#ff6b6b',
  lavender: '#e6e6fa',
  mint: '#98ff98',
};

function toCSS(name: string): string {
  if (!name) return 'transparent';
  const key = name.toLowerCase().trim();
  if (COLOR_CSS[key]) return COLOR_CSS[key];
  // If it looks like a hex or rgb value already, use it directly
  if (/^#[0-9a-f]{3,8}$/i.test(name) || /^rgb/i.test(name)) return name;
  // Try CSS named color (browser will interpret it)
  return key;
}

// ─────────────────────────────────────────────────────────────────────────────

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  /** compact = small inline layout, used inside variant rows */
  compact?: boolean;
}

export default function ColorPicker({ value, onChange, compact = false }: ColorPickerProps) {
  const [existingColors, setExistingColors] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Fetch all unique colours used in variants
  useEffect(() => {
    api.get('/variant-colors').then(r => setExistingColors(r.data)).catch(() => {});
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const cssColor = toCSS(value);

  // Merge existing colours with the current value so it always shows
  const allColors = value && !existingColors.includes(value)
    ? [value, ...existingColors]
    : existingColors;

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      {/* Input row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Colour dot preview */}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          title="Pick from existing colours"
          style={{
            width: compact ? 28 : 32,
            height: compact ? 28 : 32,
            borderRadius: 6,
            border: '2px solid var(--border)',
            background: cssColor,
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'border-color 0.15s',
            outline: open ? '2px solid var(--accent)' : 'none',
          }}
        />
        <input
          className="form-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="e.g. Black"
          style={{ fontSize: compact ? 13 : 13.5, flex: 1 }}
        />
      </div>

      {/* Dropdown swatch panel */}
      {open && allColors.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 6,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          padding: 12,
          zIndex: 200,
          width: 'max-content',
          maxWidth: 320,
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--txt-muted)', margin: '0 0 10px' }}>
            Existing colours
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {allColors.map(c => {
              const css = toCSS(c);
              const selected = c.toLowerCase() === value.toLowerCase();
              const isLight = ['white', 'cream', 'beige', 'lavender', 'mint', 'silver'].includes(c.toLowerCase());
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => { onChange(c); setOpen(false); }}
                  title={c}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 6px',
                    borderRadius: 8,
                    outline: selected ? '2px solid var(--accent)' : '2px solid transparent',
                    outlineOffset: 2,
                    transition: 'outline 0.1s',
                  }}
                >
                  {/* Swatch circle */}
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: css,
                    border: isLight ? '1.5px solid var(--border)' : '1.5px solid transparent',
                    boxShadow: selected ? `0 0 0 2px var(--accent)` : '0 1px 3px rgba(0,0,0,0.2)',
                    transition: 'box-shadow 0.15s',
                  }} />
                  {/* Colour name */}
                  <span style={{ fontSize: 10, color: 'var(--txt-muted)', whiteSpace: 'nowrap' }}>{c}</span>
                </button>
              );
            })}
          </div>

          {/* Hint for custom entry */}
          <p style={{ fontSize: 11, color: 'var(--txt-muted)', marginTop: 10, marginBottom: 0 }}>
            Or type a new colour name in the field above.
          </p>
        </div>
      )}
    </div>
  );
}
