import React from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { PRESET_THEMES } from "../utils/theme";

export default function Header({ 
  soundEnabled, 
  onToggleSound, 
  currentColor, 
  onSelectColor 
}) {
  return (
    <header className="top-header-bar">
      {/* أدوات التحكم بالصوت والألوان كما في الصورة تماماً */}
      <div className="header-left-tools">
        {/* زر تشغيل / كتم الصوت */}
        <button
          onClick={onToggleSound}
          className="icon-circle-btn"
          title={soundEnabled ? "كتم الصوت" : "تشغيل الصوت"}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* شريط باليت الألوان النيون مع منتقي الألوان المتدرج */}
        <div className="theme-palette-strip">
          {/* دائرة عجلة الألوان المخصصة (Custom Rainbow Wheel) */}
          <div className="color-wheel-wrapper" title="اختر أي لون مخصص يعجبك">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => onSelectColor(e.target.value)}
              className="color-wheel-input"
            />
          </div>

          {/* دوائر الألوان الجاهزة المستوحاة من الصورة */}
          {PRESET_THEMES.map((theme) => {
            const isActive = currentColor.toLowerCase() === theme.color.toLowerCase();
            return (
              <button
                key={theme.id}
                onClick={() => onSelectColor(theme.color)}
                className={`palette-circle-btn ${isActive ? "active" : ""}`}
                style={{ backgroundColor: theme.color }}
                title={theme.name}
              />
            );
          })}
        </div>
      </div>

      {/* الشعار الفاخر */}
      <div className="header-brand-badge">
        <h1 className="brand-pill-title">
          <span>منصة المتراكم والمذاكرة</span>
          <span className="brand-icon-tag">
            <Sparkles size={14} style={{ display: "inline", marginLeft: "4px", verticalAlign: "middle" }} />
            ثانوية عامة
          </span>
        </h1>
      </div>
    </header>
  );
}
