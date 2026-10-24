import React, { useState } from "react";
import { SUBJECTS, TASK_TYPES, PRIORITY_LEVELS } from "../data/subjects";
import SubjectIcon from "./SubjectIcon";
import { 
  Plus, 
  Check, 
  Trash2, 
  Eye, 
  EyeOff, 
  BookOpen, 
  Trophy,
  Calendar
} from "lucide-react";

export default function SubjectWorkspace({
  subject,
  tasks,
  onBackToHub,
  onBackToSchedule,
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
    <div className="subject-workspace-view">
      {/* شريط العودة والتنقل السريع */}
      <div className="workspace-top-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {onBackToSchedule && (
            <button 
              onClick={onBackToSchedule} 
              className="btn-glow" 
              style={{ padding: "8px 18px", fontSize: "13.5px", gap: "7px" }}
            >
              <Calendar size={16} />
              <span>العودة لجدول الحصص المدرسي</span>
            </button>
          )}

          <button onClick={onBackToHub} className="btn-soft" style={{ padding: "8px 16px", fontSize: "13.5px" }}>
            <BookOpen size={16} />
            <span>عرض كل المواد</span>
          </button>
        </div>

        {/* أزرار التبديل السريع بين المواد الستة */}
        <div className="subject-switcher-row">
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectSubject(s.id)}
              className={`switcher-pill-btn ${s.id === subject.id ? "active" : ""}`}
            >
              <SubjectIcon name={s.iconName} size={15} />
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* بطاقة رأس المادة المختارة */}
      <div className="workspace-hero-banner luxury-glass">
        <div className="workspace-hero-info">
          <div className="workspace-hero-icon">
            <SubjectIcon name={subject.iconName} size={36} color="var(--theme-accent)" />
          </div>
          <div>
            <h2 className="workspace-hero-title">
              جدول متراكم مادة {subject.name}
            </h2>
            <p className="workspace-hero-tip">
              💡 {subject.tip}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "800" }}>
          <span className="status-counter-pill has-backlog">
            المتراكم: {activeTasks.length}
          </span>
          <span className="status-counter-pill is-clean">
            المنجز: {completedTasks.length}
          </span>
        </div>
      </div>

      {/* لوحة إضافة درس متراكم جديد في هذه المادة */}
      <div className="add-task-luxury-panel luxury-glass">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <BookOpen size={18} color="var(--theme-accent)" />
          <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#ffffff" }}>
            تسجيل درس متراكم في مادة {subject.name}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="add-task-grid-inputs">
          {/* اسم الدرس */}
          <input
            type="text"
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            placeholder="اكتب هنا اسم الدرس أو الجزء المتأخر فيه..."
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

          {/* زر الإضافة المضيء */}
          <button 
            type="submit" 
            className="btn-glow"
            disabled={isSubmitting}
            style={{ whiteSpace: "nowrap" }}
          >
            <Plus size={18} />
            <span>إضافة للجدول</span>
          </button>
        </form>
      </div>

      {/* جدول المتراكم المباشر للمادة */}
      <div className="table-luxury-wrap luxury-glass">
        <div className="table-header-strip">
          <h3 style={{ fontSize: "17px", fontWeight: "900", color: "#ffffff" }}>
            جدول المتراكم لمادة {subject.name} ({activeTasks.length})
          </h3>

          {completedTasks.length > 0 && (
            <button
              onClick={() => setShowArchive(!showArchive)}
              className="btn-soft"
              style={{ fontSize: "12.5px", padding: "6px 16px" }}
            >
              {showArchive ? <EyeOff size={15} /> : <Eye size={15} />}
              <span>{showArchive ? "إخفاء ما تم إنجازه" : `عرض ما تم إنجازه (${completedTasks.length})`}</span>
            </button>
          )}
        </div>

        {activeTasks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎉</div>
            <h4 style={{ fontSize: "20px", fontWeight: "900", color: "#34d399", marginBottom: "8px" }}>
              عاش يا بطل! مفيش أي متراكم عليك في مادة {subject.name}
            </h4>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", maxWidth: "420px", margin: "0 auto" }}>
              جدول المادة نظيف ومخلص كل اللي وراك. لو راكمت أي حاجة جديدة، اكتبها فوق وهتنزل في جدولك فوراً!
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="luxury-study-table">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>#</th>
                  <th>الدرس / الجزء المتراكم</th>
                  <th style={{ width: "170px" }}>نوع المذاكرة</th>
                  <th style={{ width: "160px" }}>الأولوية</th>
                  <th style={{ width: "110px", textAlign: "center" }}>إنجاز المهمة</th>
                  <th style={{ width: "65px", textAlign: "center" }}>حذف</th>
                </tr>
              </thead>
              <tbody>
                {activeTasks.map((task, idx) => {
                  const typeObj = TASK_TYPES.find((t) => t.id === task.type) || TASK_TYPES[0];
                  const priorityObj = PRIORITY_LEVELS.find((p) => p.id === task.priority) || PRIORITY_LEVELS[1];

                  return (
                    <tr key={task.id} className="row-hover-glow">
                      <td style={{ fontWeight: "800", color: "var(--text-muted)" }}>
                        {idx + 1}
                      </td>
                      <td className="task-title-text">
                        {task.title}
                      </td>
                      <td>
                        <span 
                          className="task-tag-badge"
                          style={{
                            background: `${typeObj.color}20`,
                            color: typeObj.color,
                            border: `1px solid ${typeObj.color}40`
                          }}
                        >
                          {typeObj.label}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="task-tag-badge"
                          style={{
                            background: `${priorityObj.color}20`,
                            color: priorityObj.color,
                            border: `1px solid ${priorityObj.color}40`
                          }}
                        >
                          {priorityObj.label}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => onCompleteTask(task)}
                          className="complete-checkmark-btn"
                          title="اضغط هنا لإتمام المهمة وإزالتها من الجدول والاحتفال!"
                        >
                          <Check size={22} strokeWidth={3} />
                        </button>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => onDeleteTask(task.id)}
                          className="delete-action-btn"
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

      {/* سجل الأرشيف للدروس التي تم إنجازها */}
      {showArchive && completedTasks.length > 0 && (
        <div className="table-luxury-wrap luxury-glass" style={{ borderColor: "rgba(16, 185, 129, 0.4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 14px" }}>
            <Trophy size={18} color="#10b981" />
            <h4 style={{ fontSize: "16px", fontWeight: "900", color: "#34d399" }}>
              سجل الدروس المنجزة بنجاح ({completedTasks.length})
            </h4>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="luxury-study-table">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>#</th>
                  <th>الدرس المنجز</th>
                  <th style={{ width: "160px" }}>النوع</th>
                  <th style={{ width: "110px", textAlign: "center" }}>إعادة للجدول</th>
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
                      <span className="task-tag-badge" style={{ background: "rgba(255, 255, 255, 0.06)", color: "var(--text-muted)" }}>
                        {task.type}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        onClick={() => onToggleUndoTask(task)}
                        className="btn-soft"
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
