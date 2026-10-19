// Module 6（部分）: 主题持久化与切换
// 5 套配色：经典靛蓝 / 森林草绿 / 晚霞暖杏 / 晴空碧海 / 优雅紫罗兰
import { useEffect, useState } from 'react';

export type ThemeId = 'indigo' | 'forest' | 'sunset' | 'sky' | 'violet';

export const THEMES: Record<ThemeId, { label: string; primary: string; primaryDark: string; soft: string }> = {
  indigo: { label: '经典靛蓝', primary: '#4f46e5', primaryDark: '#4338ca', soft: '#eef2ff' },
  forest: { label: '森林草绿', primary: '#059669', primaryDark: '#047857', soft: '#ecfdf5' },
  sunset: { label: '晚霞暖杏', primary: '#ea580c', primaryDark: '#c2410c', soft: '#fff7ed' },
  sky:    { label: '晴空碧海', primary: '#0284c7', primaryDark: '#0369a1', soft: '#f0f9ff' },
  violet: { label: '优雅紫罗兰', primary: '#7c3aed', primaryDark: '#6d28d9', soft: '#f5f3ff' },
};

const STORAGE_KEY = 'mistake-book:theme';
const DEFAULT_THEME: ThemeId = 'indigo';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeId>(() => {
    if (typeof localStorage === 'undefined') return DEFAULT_THEME;
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    return saved && saved in THEMES ? saved : DEFAULT_THEME;
  });

  useEffect(() => {
    const meta = THEMES[theme];
    const root = document.documentElement;
    root.style.setProperty('--primary', meta.primary);
    root.style.setProperty('--primary-dark', meta.primaryDark);
    root.style.setProperty('--primary-soft', meta.soft);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return { theme, setTheme };
}
