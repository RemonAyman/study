import React from "react";
import { SUBJECTS } from "../data/subjects";
import SubjectIcon from "./SubjectIcon";
import { ArrowLeft, Check, AlertCircle, Sparkles } from "lucide-react";

export default function SubjectsHub({ tasks, onSelectSubject }) {
  return (
    <div className="subjects-hub-view">
      <div className="hub-intro-row">
        <h2 className="hub-main-title">
          <Sparkles size={22} color="var(--theme-accent)" />
          <span>المواد الدراسية ومتابعة المتراكم</span>
        </h2>
        <p className="hub-sub-title">
          اضغط على أي مادة لفتح جدولها المباشر وتسجيل وإنجاز الدروس المتراكمة
        </p>
      </div>

      <div className="subjects-3col-grid">
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
              className="subject-luxury-card luxury-glass"
            >
              <div>
                <div className="subject-card-header">
                  <div className="subject-svg-icon-box">
                    <SubjectIcon name={subject.iconName} size={28} color="var(--theme-accent)" />
                  </div>

                  {pendingTasks.length > 0 ? (
                    <span className="status-counter-pill has-backlog">
                      <AlertCircle size={13} />
                      <span>{pendingTasks.length} متراكم</span>
                    </span>
                  ) : (
                    <span className="status-counter-pill is-clean">
                      <Check size={13} strokeWidth={3} />
                      <span>نظيف تماماً! 🎉</span>
                    </span>
                  )}
                </div>

                <h3 className="subject-luxury-title">
                  مادة {subject.name}
                </h3>
                <p className="subject-luxury-desc">
                  {subject.tagline}
                </p>
              </div>

              <div>
                {/* شريط الإنجاز المتوهج */}
                <div className="progress-track-mini">
                  <div 
                    className="progress-fill-mini"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="card-bottom-cta">
                  <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                    تم إنجاز {completedTasks.length} من {totalTasks}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>افتح الجدول</span>
                    <ArrowLeft size={16} />
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
