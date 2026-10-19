import React, { useState } from "react";
import { SUBJECTS } from "../data/subjects";
import { Plus, Trash2, Calendar, FileText, Bell } from "lucide-react";

export default function NotesSection({
  notes,
  onAddNote,
  onDeleteNote
}) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteSubject, setNoteSubject] = useState("chemistry");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // تصفية الملاحظات
  const filteredNotes = notes.filter((n) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "exams") return Boolean(n.date);
    return n.subject === selectedFilter;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddNote({
        title: title.trim(),
        content: content.trim(),
        subject: noteSubject,
        date: date || null
      });
      setTitle("");
      setContent("");
      setDate("");
      setShowAddForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="notes-container animate-entrance">
      {/* رأس قسم الملاحظات */}
      <div className="notes-header-bar">
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={22} color="#38bdf8" />
            الملاحظات ومواعيد الامتحانات
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
            سجل مواعيد امتحانات السناتر والشوامل والملاحظات المهمة لكل مادة
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="action-btn btn-primary-gradient"
        >
          <Plus size={18} />
          <span>{showAddForm ? "إلغاء" : "إضافة ملاحظة / امتحان"}</span>
        </button>
      </div>

      {/* نموذج إضافة الملاحظة */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="add-lesson-card glass-box animate-entrance" style={{ borderColor: "rgba(56, 189, 248, 0.3)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "14px", color: "#38bdf8" }}>
            ✍️ تفاصيل الملاحظة أو الامتحان القادم
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                العنوان
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: امتحان شامل كيمياء على الباب الأول والثاني"
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                المادة التابعة لها
              </label>
              <select value={noteSubject} onChange={(e) => setNoteSubject(e.target.value)}>
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.symbol} {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                تاريخ الامتحان / الموعد (اختياري)
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px" }}>
              ملاحظات أو تفاصيل إضافية (الصفحات المقررة، تنبيهات المستر)
            </label>
            <textarea
              rows="3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب هنا أي تفاصيل تحتاج ترجع لها قبل الامتحان..."
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <button type="button" onClick={() => setShowAddForm(false)} className="action-btn btn-outline">
              إلغاء
            </button>
            <button type="submit" className="action-btn btn-primary-gradient" disabled={isSubmitting}>
              حفظ الملاحظة
            </button>
          </div>
        </form>
      )}

      {/* شريط الفلاتر */}
      <div className="notes-filter-strip">
        <button
          onClick={() => setSelectedFilter("all")}
          className={`quick-pill ${selectedFilter === "all" ? "active" : ""}`}
          style={{ "--pill-color": "#0284c7" }}
        >
          كل الملاحظات ({notes.length})
        </button>

        <button
          onClick={() => setSelectedFilter("exams")}
          className={`quick-pill ${selectedFilter === "exams" ? "active" : ""}`}
          style={{ "--pill-color": "#ef4444" }}
        >
          <Bell size={13} />
          <span>الامتحانات القادمة</span>
        </button>

        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedFilter(s.id)}
            className={`quick-pill ${selectedFilter === s.id ? "active" : ""}`}
            style={{ "--pill-color": s.primaryColor }}
          >
            <span>{s.symbol}</span>
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      {/* شبكة كروت الملاحظات */}
      {filteredNotes.length === 0 ? (
        <div className="clean-slate-box glass-box">
          <div className="clean-slate-icon">📝</div>
          <div className="clean-slate-title" style={{ color: "#38bdf8" }}>
            لا توجد ملاحظات مسجلة هنا
          </div>
          <p className="clean-slate-desc">
            تقدر تسجل امتحاناتك القادمة وملاحظات المواد المهمة عشان تكون دايماً عارف جدولك ومواعيدك بدقة!
          </p>
        </div>
      ) : (
        <div className="notes-grid-cards">
          {filteredNotes.map((note) => {
            const subjectObj = SUBJECTS.find((s) => s.id === note.subject);

            // حساب الأيام المتبقية على الامتحان
            let daysText = null;
            let isUrgent = false;

            if (note.date) {
              const target = new Date(note.date);
              const today = new Date().setHours(0, 0, 0, 0);
              const diffTime = target.getTime() - today;
              const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              if (days < 0) {
                daysText = "انتهى الموعد ⌛";
              } else if (days === 0) {
                daysText = "اليوم! 🚨";
                isUrgent = true;
              } else if (days === 1) {
                daysText = "غداً بإذن الله! ⚡";
                isUrgent = true;
              } else {
                daysText = `باقي ${days} أيام ⏳`;
              }
            }

            return (
              <div
                key={note.id}
                className="single-note-card glass-box"
                style={{ borderRightColor: subjectObj?.primaryColor || "#38bdf8" }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", color: subjectObj?.primaryColor, fontWeight: "700", fontSize: "13px" }}>
                      <span>{subjectObj?.symbol}</span>
                      <span>{subjectObj?.name}</span>
                    </div>

                    {daysText && (
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: isUrgent ? "#f87171" : "#fbbf24",
                          background: isUrgent ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)",
                          padding: "3px 8px",
                          borderRadius: "6px"
                        }}
                      >
                        {daysText}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#ffffff", marginBottom: "6px" }}>
                    {note.title}
                  </h3>

                  {note.content && (
                    <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                      {note.content}
                    </p>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", marginTop: "12px", fontSize: "12px", color: "var(--text-tertiary)" }}>
                  {note.date ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={13} />
                      <span>{note.date}</span>
                    </div>
                  ) : <span>ملاحظة عامة</span>}

                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="delete-btn-subtle"
                    title="حذف الملاحظة"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
