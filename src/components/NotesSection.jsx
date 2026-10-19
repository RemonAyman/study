import React, { useState } from "react";
import { SUBJECTS } from "../data/subjects";
import SubjectIcon from "./SubjectIcon";
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
    <div className="notes-view-wrapper">
      {/* رأس قسم الملاحظات */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={24} color="var(--theme-accent)" />
            <span>الملاحظات ومواعيد الامتحانات</span>
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "3px" }}>
            سجل مواعيد امتحانات السناتر والشوامل وتنبيهات المدرسين
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-glow"
        >
          <Plus size={18} />
          <span>{showAddForm ? "إلغاء" : "إضافة ملاحظة أو امتحان"}</span>
        </button>
      </div>

      {/* نموذج إضافة الملاحظة */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="add-task-luxury-panel luxury-glass" style={{ borderColor: "var(--theme-accent)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "900", marginBottom: "14px", color: "var(--theme-accent)" }}>
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
                    {s.name}
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

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" onClick={() => setShowAddForm(false)} className="btn-soft">
              إلغاء
            </button>
            <button type="submit" className="btn-glow" disabled={isSubmitting}>
              حفظ الملاحظة
            </button>
          </div>
        </form>
      )}

      {/* شريط الفلاتر */}
      <div className="subject-switcher-row" style={{ marginBottom: "24px" }}>
        <button
          onClick={() => setSelectedFilter("all")}
          className={`switcher-pill-btn ${selectedFilter === "all" ? "active" : ""}`}
        >
          كل الملاحظات ({notes.length})
        </button>

        <button
          onClick={() => setSelectedFilter("exams")}
          className={`switcher-pill-btn ${selectedFilter === "exams" ? "active" : ""}`}
        >
          <Bell size={13} />
          <span>الامتحانات القادمة</span>
        </button>

        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedFilter(s.id)}
            className={`switcher-pill-btn ${selectedFilter === s.id ? "active" : ""}`}
          >
            <SubjectIcon name={s.iconName} size={14} />
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      {/* كروت الملاحظات */}
      {filteredNotes.length === 0 ? (
        <div className="table-luxury-wrap luxury-glass" style={{ textAlign: "center", padding: "50px 20px" }}>
          <div style={{ fontSize: "44px", marginBottom: "12px" }}>📝</div>
          <h4 style={{ fontSize: "19px", fontWeight: "800", color: "var(--theme-accent)", marginBottom: "6px" }}>
            لا توجد ملاحظات مسجلة هنا
          </h4>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>
            سجل امتحاناتك القادمة وملاحظات المواد المهمة عشان تكون دايماً عارف مواعيدك بدقة!
          </p>
        </div>
      ) : (
        <div className="notes-main-grid">
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
                className="note-item-card luxury-glass"
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--theme-accent)", fontWeight: "800", fontSize: "13.5px" }}>
                      <SubjectIcon name={subjectObj?.iconName} size={16} />
                      <span>{subjectObj?.name}</span>
                    </div>

                    {daysText && (
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "800",
                          color: isUrgent ? "#f87171" : "#fbbf24",
                          background: isUrgent ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)",
                          padding: "3px 10px",
                          borderRadius: "999px",
                          border: isUrgent ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(245, 158, 11, 0.4)"
                        }}
                      >
                        {daysText}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: "17px", fontWeight: "900", color: "#ffffff", marginBottom: "8px" }}>
                    {note.title}
                  </h3>

                  {note.content && (
                    <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                      {note.content}
                    </p>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.06)", marginTop: "14px", fontSize: "12px", color: "var(--text-muted)" }}>
                  {note.date ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <Calendar size={13} />
                      <span>{note.date}</span>
                    </div>
                  ) : <span>ملاحظة عامة</span>}

                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="delete-action-btn"
                    title="حذف الملاحظة"
                  >
                    <Trash2 size={16} />
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
