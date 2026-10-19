import React, { useState } from "react";
import { SUBJECTS } from "../data/subjects";
import { Calendar, Plus, Trash2, Pin, Clock, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";

const NOTE_TAGS = [
  { id: "امتحان قادم", label: "امتحان قادم 🚨", color: "#ef4444", classType: "exam" },
  { id: "ملاحظة هامة", label: "ملاحظة هامة 📌", color: "#f59e0b", classType: "reminder" },
  { id: "ملحوظة مدرس", label: "ملحوظة مدرس 💡", color: "#38bdf8", classType: "info" },
  { id: "واجب وشيت", label: "شيت ومطلوب حله 📝", color: "#10b981", classType: "homework" }
];

export default function NotesSection({
  notes,
  onAddNote,
  onDeleteNote,
  activeSubjectId
}) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteSubject, setNoteSubject] = useState(activeSubjectId || "chemistry");
  const [tag, setTag] = useState("امتحان قادم");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // تصفية الملاحظات
  const filteredNotes = notes.filter((n) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "exams") return n.tag === "امتحان قادم" || n.tag === "امتحان";
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
        tag: tag,
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
    <div className="notes-section animate-pop">
      {/* رأس قسم الملاحظات وأزرار التصفية */}
      <div className="notes-header-row">
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px" }}>
            <FileText size={22} color="#3b82f6" />
            الملاحظات ومواعيد الامتحانات
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
            سجل مواعيد امتحانات السناتر والشوامل وملاحظات المستر المهمة في مكان واحد
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
          style={{ whiteSpace: "nowrap" }}
        >
          <Plus size={18} />
          <span>{showAddForm ? "إلغاء الإضافة" : "إضافة ملاحظة / امتحان جديد"}</span>
        </button>
      </div>

      {/* نموذج إضافة ملاحظة جديدة */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="glass-panel animate-pop" style={{ padding: "22px", marginBottom: "24px", borderColor: "rgba(59, 130, 246, 0.3)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "#60a5fa" }}>
            ✍️ تفاصيل الملاحظة أو الامتحان القادم
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", marginBottom: "6px" }}>
                العنوان
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: امتحان شامل فيزياء على الفصل الأول والثاني"
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", marginBottom: "6px" }}>
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
              <label style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", marginBottom: "6px" }}>
                نوع التنبيه
              </label>
              <select value={tag} onChange={(e) => setTag(e.target.value)}>
                {NOTE_TAGS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", marginBottom: "6px" }}>
                تاريخ الموعد / الامتحان (اختياري)
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", marginBottom: "6px" }}>
              تفاصيل أو ملاحظات إضافية (الصفحات المقررة، تنبيهات المستر...)
            </label>
            <textarea
              rows="3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب هنا أي تفاصيل تحتاج ترجع لها قبل الامتحان..."
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-ghost">
              إلغاء
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              حفظ الملاحظة في Firebase
            </button>
          </div>
        </form>
      )}

      {/* شريط الفلاتر */}
      <div className="notes-filter-pills" style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setSelectedFilter("all")}
          className={`filter-pill ${selectedFilter === "all" ? "active" : ""}`}
        >
          كل الملاحظات ({notes.length})
        </button>

        <button
          onClick={() => setSelectedFilter("exams")}
          className={`filter-pill ${selectedFilter === "exams" ? "active" : ""}`}
          style={{ borderColor: selectedFilter === "exams" ? "#ef4444" : "var(--border-subtle)", background: selectedFilter === "exams" ? "#ef4444" : "" }}
        >
          🚨 الامتحانات القادمة
        </button>

        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedFilter(s.id)}
            className={`filter-pill ${selectedFilter === s.id ? "active" : ""}`}
          >
            {s.symbol} {s.name}
          </button>
        ))}
      </div>

      {/* قائمة كروت الملاحظات */}
      {filteredNotes.length === 0 ? (
        <div className="glass-panel empty-tasks-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-title" style={{ color: "#60a5fa" }}>
            لا توجد ملاحظات مسجلة هنا
          </div>
          <p className="empty-state-desc">
            سجل امتحاناتك القادمة وملاحظات المواد عشان تكون دايماً منظم وعارف مواعيدك بدقة!
          </p>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => {
            const subjectObj = SUBJECTS.find((s) => s.id === note.subject);
            const tagObj = NOTE_TAGS.find((t) => t.id === note.tag) || NOTE_TAGS[0];
            
            // حساب الأيام المتبقية
            let daysDiffText = null;
            let isUrgent = false;

            if (note.date) {
              const target = new Date(note.date);
              const today = new Date().setHours(0, 0, 0, 0);
              const diffTime = target.getTime() - today;
              const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              if (days < 0) {
                daysDiffText = "انتهى الموعد ⌛";
              } else if (days === 0) {
                daysDiffText = "اليوم! 🚨";
                isUrgent = true;
              } else if (days === 1) {
                daysDiffText = "غداً بإذن الله! ⚡";
                isUrgent = true;
              } else {
                daysDiffText = `باقي ${days} أيام ⏳`;
              }
            }

            return (
              <div 
                key={note.id} 
                className="note-card glass-panel"
                style={{ borderRightColor: subjectObj?.themeColor || "#3b82f6" }}
              >
                <div className="note-top">
                  <div className="note-header-line">
                    <span 
                      className={`note-tag-badge ${tagObj.classType}`}
                      style={{
                        background: `${tagObj.color}18`,
                        color: tagObj.color,
                        borderColor: `${tagObj.color}35`
                      }}
                    >
                      {note.tag}
                    </span>

                    {daysDiffText && (
                      <span 
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: isUrgent ? "#ef4444" : "#fbbf24",
                          background: isUrgent ? "rgba(239, 68, 68, 0.12)" : "rgba(245, 158, 11, 0.12)",
                          padding: "3px 8px",
                          borderRadius: "6px"
                        }}
                      >
                        {daysDiffText}
                      </span>
                    )}
                  </div>

                  <h3 className="note-title">{note.title}</h3>

                  {note.content && (
                    <p className="note-content">{note.content}</p>
                  )}
                </div>

                <div className="note-footer">
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: subjectObj?.themeColor }}>
                    <span>{subjectObj?.symbol}</span>
                    <span style={{ fontWeight: "700" }}>{subjectObj?.name}</span>
                  </div>

                  {note.date && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={13} />
                      <span>{note.date}</span>
                    </div>
                  )}

                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="action-icon-btn"
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
