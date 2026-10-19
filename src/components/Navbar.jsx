import React from "react";
import { Volume2, VolumeX, Eye } from "lucide-react";

export default function Navbar({ 
  soundEnabled, 
  onToggleSound, 
  theme, 
  onToggleTheme, 
  onOpenRulesModal,
  activeTab,
  onSelectTab
}) {
  return (
    <header className="header-nav glass-panel">
      <div className="brand-section">
        <div className="brand-logo-badge animate-float">
          🎯
        </div>
        <div>
          <h1 className="brand-title">منصتي للمذاكرة والمتراكم</h1>
          <p className="brand-subtitle">نظم موادك • خلص متراكمك • حقق مجموعك</p>
        </div>
      </div>

      <div className="nav-actions">
        {/* مؤشر فايربيز */}
        <button 
          onClick={onOpenRulesModal}
          className="firebase-status-badge"
          title="عرض قواعد الفايربيز وإرشادات الاتصال"
          style={{ cursor: "pointer", background: "rgba(59, 130, 246, 0.12)", color: "#60a5fa", borderColor: "rgba(59, 130, 246, 0.3)" }}
        >
          <span className="status-dot"></span>
          <span>قواعد Firebase</span>
        </button>

        {/* زر حماية العين */}
        <button 
          onClick={onToggleTheme}
          className="nav-pill-btn"
          title={theme === "warm" ? "العودة للوضع الليلي الفاخر" : "تفعيل نمط حماية العين الدافيء"}
        >
          <Eye size={16} color={theme === "warm" ? "#f59e0b" : "#94a3b8"} />
          <span>{theme === "warm" ? "وضع العين 🌙" : "حماية العين"}</span>
        </button>

        {/* زر الصوت */}
        <button 
          onClick={onToggleSound}
          className="nav-pill-btn"
          title={soundEnabled ? "كتم المؤثرات الصوتية" : "تشغيل نغمات الإنجاز"}
        >
          {soundEnabled ? (
            <>
              <Volume2 size={16} color="#34d399" />
              <span>الصوت مفعّل</span>
            </>
          ) : (
            <>
              <VolumeX size={16} color="#f87171" />
              <span>مكتوم</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
