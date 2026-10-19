import React, { useState } from "react";
import { Copy, Check, ExternalLink, X, ShieldCheck } from "lucide-react";

export default function FirebaseRulesModal({ onClose }) {
  const [copied, setCopied] = useState(false);

  const rulesCode = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // السماح بالقراءة والكتابة لكافة بيانات المتراكم والملاحظات
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rulesCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="celebration-modal-overlay animate-pop" onClick={onClose}>
      <div className="rules-modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ padding: "8px", borderRadius: "10px", background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa" }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "800" }}>قواعد أمان Firebase Firestore</h3>
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>للسماح بحفظ وقراءة جدول المتراكم والملاحظات بدون قيود</p>
            </div>
          </div>

          <button onClick={onClose} className="action-icon-btn">
            <X size={20} />
          </button>
        </div>

        <div style={{ fontSize: "13.5px", lineHeight: "1.7", color: "var(--text-muted)", marginBottom: "14px" }}>
          <p>
            عشان الفايربيز يوافق على حفظ البيانات وقراءتها، انسخ الكود دا وضعه في صفحة الـ <strong>Rules</strong> في مشروعك على Firebase:
          </p>
        </div>

        <div className="code-preview-block">
          <pre>{rulesCode}</pre>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginTop: "18px" }}>
          <a
            href="https://console.firebase.google.com/project/study-17808/firestore/rules"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ fontSize: "13px" }}
          >
            <span>فتح صفحة Rules في Firebase</span>
            <ExternalLink size={15} />
          </a>

          <button 
            onClick={handleCopy} 
            className="btn btn-primary"
            style={{ background: copied ? "#10b981" : "linear-gradient(135deg, #3b82f6, #6366f1)" }}
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>تم النسخ بنجاح!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>نسخ الـ Rules الآن</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
