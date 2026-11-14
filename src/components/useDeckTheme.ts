import { useEffect, useState } from 'react';

/** 덱의 data-theme 을 따라가는 훅 (T 키 토글과 자동 동기화) */
export function useDeckTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const el = document.documentElement;
    const read = () => setTheme(el.dataset.theme === 'dark' ? 'dark' : 'light');
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

  return theme;
}
