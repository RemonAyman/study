import React from "react";
import { SUBJECTS } from "../data/subjects";
import { ArrowLeft, Check, AlertCircle, Sparkles } from "lucide-react";

export default function SubjectsHub({ tasks, onSelectSubject }) {
  return (
    <div className="subjects-hub-wrapper animate-entrance">
      <div className="subjects-hub-header">
        <h2 className="hub-title">
          <Sparkles size={22} color="#f59e0b" />
          المواد الدراسية (الثانوية العامة)
        </h2>
        <p className="hub-subtitle">
          اختر أي مادة لفتح جدول الدروس المتراكمة وتسجيل وإنجاز المهام فوراً
        </p>
      </div>

      <div className="subjects-main-grid">
        {SUBJECTS.map((subject) => {
          const subjectTasks = tasks.filter((t) => t.subject === subject.id);
          const pendingTasks = subjectTasks.filter((t) => !t.completed);
          const completedTasks = subjectTasks.filter((t) => t.completed);
          const totalTasks = subjectTasks.length;
          const progressPercent = totalTasks === 0 ? 100 : Math.round((completedTasks.length / totalTasks) * 100);

          return (
            <div
              key={subject.id}
              onClick={() => onSelectSubject(subject.id)}
              className="subject-hub-card glass-box"
              style={{
                "--card-color": subject.primaryColor,
                "--card-glow": subject.glow,
              }}
            >
              <div>
                <div className="card-top-row">
                  <div className="card-symbol-badge">
                    {subject.symbol}
                  </div>

                  {pendingTasks.length > 0 ? (
                    <span 
                      className="card-status-pill"
                      style={{
                        background: "rgba(239, 68, 68, 0.15)",
                        color: "#f87171",
                        border: "1px solid rgba(239, 68, 68, 0.3)"
                      }}
                    >
                      <AlertCircle size={13} />
                      <span>{pendingTasks.length} متراكم</span>
                    </span>
                  ) : (
                    <span 
                      className="card-status-pill"
                      style={{
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "#34d399",
                        border: "1px solid rgba(16, 185, 129, 0.3)"
                      }}
                    >
                      <Check size={13} strokeWidth={3} />
                      <span>مفيش متراكم! 🎉</span>
                    </span>
                  )}
                </div>

                <h3 className="card-subject-name">
                  مادة {subject.name}
                </h3>
                <p className="card-tagline">{subject.tagline}</p>
              </div>

              <div>
                {/* شريط نسبة الإنجاز الخاص بالمادة */}
                <div className="card-progress-bar-bg">
                  <div 
                    className="card-progress-bar-fill"
                    style={{
                      width: `${progressPercent}%`,
                      background: subject.gradient
                    }}
                  />
                </div>

                <div className="card-cta-footer">
                  <span style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                    تم إنجاز: {completedTasks.length} من {totalTasks}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span>افتح الجدول</span>
                    <ArrowLeft size={15} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
