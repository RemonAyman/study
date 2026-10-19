// نظام تخصيص ألوان المنصة المستوحى بدقة من الصورة
export const PRESET_THEMES = [
  { id: 'berry', name: 'الوردي الملكي (الافتراضي)', color: '#ff2a85', hover: '#e01e69' },
  { id: 'coral', name: 'المرجان المشرق', color: '#ff708f', hover: '#e11d48' },
  { id: 'sunset', name: 'الغروب البرتقالي', color: '#ff7a00', hover: '#ea580c' },
  { id: 'mint', name: 'الأخضر النيوني', color: '#00e699', hover: '#059669' },
  { id: 'cyan', name: 'الأزرق الكهربي', color: '#00d4ff', hover: '#0284c7' },
  { id: 'purple', name: 'البنفسج الساحر', color: '#9d4edd', hover: '#7b2cbf' }
];

// تحويل كود Hex إلى RGB لحساب التوهج والشفافية
export function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(char => char + char).join('');
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function applyTheme(hexColor) {
  try {
    const rgb = hexToRgb(hexColor);
    const root = document.documentElement;

    root.style.setProperty('--theme-accent', hexColor);
    root.style.setProperty('--theme-accent-hover', hexColor);
    root.style.setProperty('--theme-accent-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45)`);
    root.style.setProperty('--theme-accent-subtle', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`);
    root.style.setProperty('--theme-accent-border', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
    root.style.setProperty('--border-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`);

    localStorage.setItem('study_custom_color', hexColor);
  } catch (err) {
    console.warn("Theme apply error:", err);
  }
}
