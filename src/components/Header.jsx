import React from "react";
import { Volume2, VolumeX, BookOpen, FileText } from "lucide-react";

export default function Header({ 
  activeTab, 
  onSelectTab, 
  soundEnabled, 
  onToggleSound,
  notesCount
}) {
  return (
    <header className="site-header glass-box">
      <div className="brand-wrapper">
        <div className="brand-avatar">
          🎯
        </div>
        <div>
          <h1 className="brand-title">منصة المتراكم والمذاكرة</h1>
          <p className="brand-tagline">الثانوية العامة • كل مادة وجدولها تحتها • مكملين للقمة 🚀</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* أزرار التبديل الرئيسية: المواد vs الملاحظات */}
        <div className="header-tabs">
          <button
            onClick={() => onSelectTab("subjects")}
            className={`tab-btn ${activeTab === "subjects" ? "active" : ""}`}
          >
            <BookOpen size={16} />
            <span>المواد والمتراكم</span>
          </button>

          <button
            onClick={() => onSelectTab("notes")}
            className={`tab-btn ${activeTab === "notes" ? "active" : ""}`}
          >
            <FileText size={16} />
            <span>الملاحظات والامتحانات {notesCount > 0 ? `(${notesCount})` : ""}</span>
          </button>
        </div>

        {/* زر تشغيل / كتم الصوت */}
        <button
          onClick={onToggleSound}
          className="sound-toggle-btn"
          title={soundEnabled ? "كتم المؤثرات الصوتية" : "تشغيل نغمات الإنجاز"}
        >
          {soundEnabled ? <Volume2 size={18} color="#34d399" /> : <VolumeX size={18} color="#f87171" />}
        </button>
      </div>
    </header>
  );
}
