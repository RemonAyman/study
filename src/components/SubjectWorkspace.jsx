import React, { useState } from "react";
import { SUBJECTS, TASK_TYPES, PRIORITY_LEVELS } from "../data/subjects";
import { ArrowRight, Plus, Check, Trash2, Eye, EyeOff, BookOpen, Trophy } from "lucide-react";

export default function SubjectWorkspace({
  subject,
  tasks,
  onBackToHub,
  onSelectSubject,
  onAddTask,
  onCompleteTask,
  onDeleteTask,
  onToggleUndoTask
}) {
  const [lessonTitle, setLessonTitle] = useState("");
  const [studyType, setStudyType] = useState("شرح");
  const [priority, setPriority] = useState("normal");
  const [showArchive, setShowArchive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // تصفية مهام المادة
  const subjectTasks = tasks.filter((t) => t.subject === subject.id);
  const activeTasks = subjectTasks.filter((t) => !t.completed);
  const completedTasks = subjectTasks.filter((t) => t.completed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lessonTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddTask({
        subject: subject.id,
        title: lessonTitle.trim(),
        type: studyType,
        priority: priority
      });
      setLessonTitle("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="subject-workspace animate-entrance">
      {/* شريط علوي للعودة والتنقل السريع بين المواد */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
        <button onClick={onBackToHub} className="back-to-hub-btn">
          <ArrowRight size={17} />
          <span>العودة لكافة المواد</span>
        </button>

        {/* أزرار التبديل السريع بين المواد الستة */}
        <div className="subject-quick-pills-bar" style={{ margin: 0 }}>
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectSubject(s.id)}
              className={`quick-pill ${s.id === subject.id ? "active" : ""}`}
              style={{
                "--pill-color": s.primaryColor
              }}
            >
              <span>{s.symbol}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* بطاقة رأس المادة المختارة */}
      <div 
        className="active-subject-header glass-box"
        style={{
          borderRight: `6px solid ${subject.primaryColor}`
        }}
      >
        <div className="subject-header-right">
          <div className="card-symbol-badge" style={{ fontSize: "32px", width: "60px", height: "60px" }}>
            {subject.symbol}
          </div>
          <div>
            <h2 className="active-subject-title">
              جدول متراكم مادة {subject.name}
            </h2>
            <p className="active-subject-tip">
              💡 {subject.tip}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", fontWeight: "700" }}>
          <span style={{ padding: "6px 14px", borderRadius: "999px", background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
            المتراكم: {activeTasks.length}
          </span>
          <span style={{ padding: "6px 14px", borderRadius: "999px", background: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
            المنجز: {completedTasks.length}
          </span>
        </div>
      </div>

      {/* لوحة إضافة درس للمتراكم في هذه المادة */}
      <div className="add-lesson-card glass-box">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <BookOpen size={18} color={subject.primaryColor} />
          <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#ffffff" }}>
            تسجيل درس متراكم جديد في {subject.name}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="add-form-layout">
          {/* اسم الدرس أو الجزء */}
          <input
            type="text"
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            placeholder="اكتب هنا اسم الدرس أو الجزء المتأخر فيه (مثال: مسائل كيرشوف والدوائر)..."
            required
          />

          {/* نوع المذاكرة */}
          <select value={studyType} onChange={(e) => setStudyType(e.target.value)}>
            {TASK_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>

          {/* الأولوية */}
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            {PRIORITY_LEVELS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          {/* زر الإضافة */}
          <button 
            type="submit" 
            className="action-btn"
            disabled={isSubmitting}
            style={{
              background: subject.gradient,
              color: "#ffffff",
              whiteSpace: "nowrap",
              boxShadow: `0 4px 16px ${subject.glow}`
            }}
          >
            <Plus size={18} />
            <span>إضافة للجدول</span>
          </button>
        </form>
      </div>

      {/* جدول المتراكم المباشر للمادة */}
      <div className="table-card-wrapper glass-box">
        <div className="table-top-bar">
          <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#ffffff" }}>
            جدول المتراكم لمادة {subject.name} ({activeTasks.length})
          </h3>

          {completedTasks.length > 0 && (
            <button
              onClick={() => setShowArchive(!showArchive)}
              className="action-btn btn-outline"
              style={{ fontSize: "12.5px", padding: "6px 14px" }}
            >
              {showArchive ? <EyeOff size={15} /> : <Eye size={15} />}
              <span>{showArchive ? "إخفاء المنجز" : `عرض ما تم إنجازه (${completedTasks.length})`}</span>
            </button>
          )}
        </div>

        {activeTasks.length === 0 ? (
          <div className="clean-slate-box">
            <div className="clean-slate-icon">🎉</div>
            <div className="clean-slate-title">
              عاش يا بطل! مفيش أي متراكم عليك في {subject.name}
            </div>
            <p className="clean-slate-desc">
              جدول المادة نظيف تماماً ومخلص كل اللي وراك. لما تحتاج تضيف أي درس جديد، اكتبه في الخانة اللي فوق وهيظهر في جدولك فوراً!
            </p>
          </div>
        ) : (
          <div className="table-responsive-container">
            <table className="study-table">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>#</th>
                  <th>الدرس / الجزء المتراكم</th>
                  <th style={{ width: "170px" }}>نوع المذاكرة</th>
                  <th style={{ width: "160px" }}>الأولوية</th>
                  <th style={{ width: "120px", textAlign: "center" }}>إنجاز (صح)</th>
                  <th style={{ width: "70px", textAlign: "center" }}>حذف</th>
                </tr>
              </thead>
              <tbody>
                {activeTasks.map((task, idx) => {
                  const typeObj = TASK_TYPES.find((t) => t.id === task.type) || TASK_TYPES[0];
                  const priorityObj = PRIORITY_LEVELS.find((p) => p.id === task.priority) || PRIORITY_LEVELS[1];

                  return (
                    <tr key={task.id} className="table-row-hover">
                      <td style={{ fontWeight: "700", color: "var(--text-tertiary)" }}>
                        {idx + 1}
                      </td>
                      <td className="lesson-title-cell">
                        {task.title}
                      </td>
                      <td>
                        <span 
                          className="badge-pill"
                          style={{
                            background: `${typeObj.color}15`,
                            color: typeObj.color,
                            border: `1px solid ${typeObj.color}35`
                          }}
                        >
                          {typeObj.label}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="badge-pill"
                          style={{
                            background: `${priorityObj.color}15`,
                            color: priorityObj.color,
                            border: `1px solid ${priorityObj.color}35`
                          }}
                        >
                          {priorityObj.label}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => onCompleteTask(task)}
                          className="check-completion-btn"
                          title="اضغط هنا لإتمام المهمة وإزالتها من الجدول والاحتفال!"
                        >
                          <Check size={22} strokeWidth={3} />
                        </button>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => onDeleteTask(task.id)}
                          className="delete-btn-subtle"
                          title="حذف المهمة"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* قسم أرشيف الدروس المنجزة */}
      {showArchive && completedTasks.length > 0 && (
        <div className="table-card-wrapper glass-box animate-entrance" style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px" }}>
            <Trophy size={18} color="#10b981" />
            <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#34d399" }}>
              الدروس التي تم التخلص منها بنجاح ({completedTasks.length})
            </h4>
          </div>

          <div className="table-responsive-container">
            <table className="study-table">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>#</th>
                  <th>الدرس المنجز</th>
                  <th style={{ width: "160px" }}>النوع</th>
                  <th style={{ width: "100px", textAlign: "center" }}>إعادة للجدول</th>
                </tr>
              </thead>
              <tbody>
                {completedTasks.map((task, idx) => (
                  <tr key={task.id} style={{ opacity: 0.65 }}>
                    <td>{idx + 1}</td>
                    <td style={{ textDecoration: "line-through", color: "var(--text-secondary)" }}>
                      {task.title}
                    </td>
                    <td>
                      <span className="badge-pill" style={{ background: "rgba(255, 255, 255, 0.05)", color: "var(--text-tertiary)" }}>
                        {task.type}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        onClick={() => onToggleUndoTask(task)}
                        className="action-btn btn-outline"
                        style={{ fontSize: "12px", padding: "4px 12px" }}
                      >
                        استرجاع
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
