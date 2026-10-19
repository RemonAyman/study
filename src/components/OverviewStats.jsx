import React from "react";
import { CheckCircle2, AlertCircle, TrendingUp, CalendarDays } from "lucide-react";

export default function OverviewStats({ tasks, notes }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const progressPercent = totalTasks === 0 ? 100 : Math.round((completedTasks / totalTasks) * 100);

  // البحث عن أقرب امتحان من الملاحظات
  const upcomingExams = notes
    .filter((n) => n.date && (n.tag === "امتحان قادم" || n.tag === "امتحان"))
    .map((n) => {
      const examDate = new Date(n.date);
      const diffTime = examDate.getTime() - new Date().setHours(0, 0, 0, 0);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...n, diffDays };
    })
    .filter((n) => n.diffDays >= 0)
    .sort((a, b) => a.diffDays - b.diffDays);

  const nextExam = upcomingExams[0];

  return (
    <div className="overview-stats-grid">
      {/* إجمالي المتراكم */}
      <div className="stat-card glass-panel" style={{ borderRight: "4px solid #ef4444" }}>
        <div className="stat-info">
          <span className="stat-label">المتراكم الحالي عليك</span>
          <span className="stat-number" style={{ color: pendingTasks > 0 ? "#f87171" : "#34d399" }}>
            {pendingTasks}
          </span>
          <span style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            {pendingTasks === 0 ? "عاش يا بطل! مفيش أي تراكم" : "دروس تحتاج تخلصها وتطمن"}
          </span>
        </div>
        <div className="stat-icon-wrap" style={{ background: "rgba(239, 68, 68, 0.12)", color: "#ef4444" }}>
          <AlertCircle size={24} />
        </div>
      </div>

      {/* المنجز بفخر */}
      <div className="stat-card glass-panel" style={{ borderRight: "4px solid #10b981" }}>
        <div className="stat-info">
          <span className="stat-label">المنجز بفخر واجتهاد</span>
          <span className="stat-number" style={{ color: "#34d399" }}>
            {completedTasks}
          </span>
          <span style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            مهام شيلتها من على دماغك
          </span>
        </div>
        <div className="stat-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
          <CheckCircle2 size={24} />
        </div>
      </div>

      {/* نسبة الإنجاز الشاملة */}
      <div className="stat-card glass-panel" style={{ borderRight: "4px solid #3b82f6" }}>
        <div className="stat-info">
          <span className="stat-label">نسبة الإنجاز العامة</span>
          <span className="stat-number" style={{ color: "#60a5fa" }}>
            {progressPercent}%
          </span>
          <span style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            {progressPercent >= 75 ? "مستوى ممتاز جداً! 🚀" : progressPercent >= 40 ? "ماشي بخطوات ثابتة 💪" : "بداية طريق التفوق 🎯"}
          </span>
        </div>
        <div className="stat-icon-wrap" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#3b82f6" }}>
          <TrendingUp size={24} />
        </div>
      </div>

      {/* أقرب امتحان */}
      <div className="stat-card glass-panel" style={{ borderRight: "4px solid #f59e0b" }}>
        <div className="stat-info">
          <span className="stat-label">أقرب امتحان قادم</span>
          <span className="stat-number" style={{ fontSize: "20px", color: "#fbbf24" }}>
            {nextExam ? (
              nextExam.diffDays === 0 ? "اليوم! 🚨" : `باقي ${nextExam.diffDays} يوم`
            ) : (
              "لا يوجد امتحانات مسجلة"
            )}
          </span>
          <span style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" }}>
            {nextExam ? nextExam.title : "سجل مواعيد امتحاناتك في الملاحظات"}
          </span>
        </div>
        <div className="stat-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}>
          <CalendarDays size={24} />
        </div>
      </div>
    </div>
  );
}
