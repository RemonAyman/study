import React, { useState } from "react";
import { TASK_TYPES, PRIORITY_LEVELS } from "../data/subjects";
import { Plus, Check, Trash2, Eye, EyeOff, Sparkles, Trophy, BookOpen } from "lucide-react";

export default function SubjectView({
  subject,
  tasks,
  onAddTask,
  onCompleteTask,
  onDeleteTask,
  onToggleUndoTask
}) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskType, setTaskType] = useState("شرح");
  const [taskPriority, setTaskPriority] = useState("normal");
  const [showArchive, setShowArchive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // تصفية مهام المادة المحددة
  const subjectTasks = tasks.filter((t) => t.subject === subject.id);
  const activeTasks = subjectTasks.filter((t) => !t.completed);
  const completedTasks = subjectTasks.filter((t) => t.completed);

  const totalSubjectTasks = subjectTasks.length;
  const progressPercent = totalSubjectTasks === 0 ? 100 : Math.round((completedTasks.length / totalSubjectTasks) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddTask({
        subject: subject.id,
        title: taskTitle.trim(),
        type: taskType,
        priority: taskPriority
      });
      setTaskTitle("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="subject-view-container animate-pop">
      {/* بانر المادة ومعلوماتها ونسبة التقدم */}
      <div 
        className="subject-banner glass-panel"
        style={{
          "--banner-accent": subject.themeColor,
          borderColor: subject.borderGlow
        }}
      >
        <div className="banner-title-area">
          <div className="banner-symbol">{subject.symbol}</div>
          <div>
            <h2 className="banner-subject-name" style={{ color: subject.themeColor }}>
              مادة {subject.name}
            </h2>
            <p className="banner-quote">{subject.quote}</p>
            <p style={{ fontSize: "12.5px", color: "var(--text-dim)", marginTop: "4px" }}>
              💡 نصيحة: {subject.advice}
            </p>
          </div>
        </div>

        {/* مؤشر التقدم الخاص بالمادة */}
        <div className="banner-progress-box">
          <div className="progress-header">
            <span>نسبة إنجاز المادة</span>
            <span style={{ color: subject.themeColor }}>{progressPercent}%</span>
          </div>
          <div className="progress-bar-track">
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${progressPercent}%`, 
                background: subject.gradient 
              }} 
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)" }}>
            <span>المتبقي: {activeTasks.length}</span>
            <span>المنجز: {completedTasks.length}</span>
          </div>
        </div>
      </div>

      {/* لوحة إضافة درس متراكم جديد */}
      <div className="add-task-panel glass-panel">
        <div className="panel-title-row">
          <span className="panel-title">
            <BookOpen size={18} color={subject.themeColor} />
            تسجيل درس متراكم في مادة {subject.name}
          </span>
          <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
            اكتب اللي متأخر فيه وهينزل في جدولك فوراً
          </span>
        </div>

        <form onSubmit={handleSubmit} className="add-task-form-grid">
          {/* حقل اسم الدرس / الموضوع */}
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="مثال: الباب الثالث - الاتزان الأيوني وحل مسائل لوشاتيليه..."
            required
          />

          {/* نوع المهمة */}
          <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
            {TASK_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>

          {/* الأولوية */}
          <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}>
            {PRIORITY_LEVELS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          {/* زر الإضافة */}
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ background: subject.gradient, whiteSpace: "nowrap" }}
          >
            <Plus size={18} />
            <span>إضافة للجدول</span>
          </button>
        </form>
      </div>

      {/* جدول المتراكم الفعلي */}
      <div className="glass-panel" style={{ padding: "8px 12px 16px 12px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "800" }}>
              جدول الدروس المتراكمة ({activeTasks.length})
            </h3>
            {activeTasks.length > 0 && (
              <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                دوس على علامة الصح لما تخلص الدرس للاحتفال وإزالته!
              </span>
            )}
          </div>

          {/* زر إظهار الأرشيف */}
          {completedTasks.length > 0 && (
            <button
              onClick={() => setShowArchive(!showArchive)}
              className="btn btn-ghost"
              style={{ fontSize: "13px", padding: "6px 14px" }}
            >
              {showArchive ? <EyeOff size={15} /> : <Eye size={15} />}
              <span>{showArchive ? "إخفاء الدروس المنجزة" : `عرض المنجز (${completedTasks.length})`}</span>
            </button>
          )}
        </div>

        {activeTasks.length === 0 ? (
          <div className="empty-tasks-state">
            <div className="empty-state-icon">🎉</div>
            <div className="empty-state-title">
              عاش يا بطل! جدول {subject.name} فاضي ونظيف
            </div>
            <p className="empty-state-desc">
              مفيش أي دروس متراكمة عليك حالياً في مادة {subject.name}. لو وراك أي درس جديد ضيفه من الخانة اللي فوق وهيظهر في جدولك فوراً!
            </p>
          </div>
        ) : (
          <div className="tasks-table-container">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>#</th>
                  <th>الدرس / الجزء المتراكم</th>
                  <th style={{ width: "160px" }}>نوع المذاكرة</th>
                  <th style={{ width: "160px" }}>الأولوية</th>
                  <th style={{ width: "130px" }}>تاريخ التسجيل</th>
                  <th style={{ width: "120px", textAlign: "center" }}>إنجاز المهمة</th>
                  <th style={{ width: "70px", textAlign: "center" }}>حذف</th>
                </tr>
              </thead>
              <tbody>
                {activeTasks.map((task, idx) => {
                  const typeObj = TASK_TYPES.find((t) => t.id === task.type) || TASK_TYPES[0];
                  const priorityObj = PRIORITY_LEVELS.find((p) => p.id === task.priority) || PRIORITY_LEVELS[1];
                  const dateStr = task.createdAt?.toDate 
                    ? task.createdAt.toDate().toLocaleDateString("ar-EG") 
                    : "اليوم";

                  return (
                    <tr key={task.id} className="task-row">
                      <td style={{ fontWeight: "700", color: "var(--text-dim)" }}>
                        {idx + 1}
                      </td>
                      <td className="task-title-cell">
                        {task.title}
                      </td>
                      <td>
                        <span 
                          className="task-badge"
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
                          className="task-badge"
                          style={{
                            background: `${priorityObj.color}15`,
                            color: priorityObj.color,
                            border: `1px solid ${priorityObj.color}35`
                          }}
                        >
                          {priorityObj.label}
                        </span>
                      </td>
                      <td style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                        {dateStr}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => onCompleteTask(task)}
                          className="checkbox-complete-btn"
                          title="اضغط هنا لإتمام المهمة وإزالتها والاحتفال!"
                        >
                          <Check size={22} strokeWidth={3} />
                        </button>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => onDeleteTask(task.id)}
                          className="action-icon-btn"
                          title="حذف نهائي"
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

      {/* قسم الأرشيف للدروس التي تم إنجازها */}
      {showArchive && completedTasks.length > 0 && (
        <div className="glass-panel animate-pop" style={{ padding: "16px 20px", marginBottom: "24px", borderColor: "rgba(16, 185, 129, 0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <Trophy size={20} color="#10b981" />
            <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#34d399" }}>
              سجل الإنجاز والفخر لـ {subject.name} ({completedTasks.length} درس تم التخلص منه)
            </h4>
          </div>

          <table className="tasks-table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}>#</th>
                <th>الدرس المنجز</th>
                <th style={{ width: "160px" }}>النوع</th>
                <th style={{ width: "140px" }}>تاريخ الإنجاز</th>
                <th style={{ width: "100px", textAlign: "center" }}>تراجع</th>
              </tr>
            </thead>
            <tbody>
              {completedTasks.map((task, idx) => (
                <tr key={task.id} className="task-row completed-row">
                  <td>{idx + 1}</td>
                  <td style={{ textDecoration: "line-through", color: "var(--text-muted)" }}>
                    {task.title}
                  </td>
                  <td>
                    <span className="task-badge" style={{ background: "rgba(255, 255, 255, 0.05)", color: "var(--text-dim)" }}>
                      {task.type}
                    </span>
                  </td>
                  <td style={{ fontSize: "12.5px", color: "var(--text-dim)" }}>
                    {task.completedAt?.toDate ? task.completedAt.toDate().toLocaleDateString("ar-EG") : "مكتمل"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => onToggleUndoTask(task)}
                      className="btn btn-ghost"
                      style={{ fontSize: "12px", padding: "4px 10px" }}
                    >
                      إعادة للجدول
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
