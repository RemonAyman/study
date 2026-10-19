import React from "react";
import { SUBJECTS } from "../data/subjects";
import { Check } from "lucide-react";

export default function SubjectSelector({ selectedSubjectId, onSelectSubject, tasks }) {
  return (
    <div className="subjects-carousel-grid">
      {SUBJECTS.map((subject) => {
        const isSelected = subject.id === selectedSubjectId;
        // حساب عدد المتراكم في هذه المادة فقط
        const subjectTasks = tasks.filter((t) => t.subject === subject.id);
        const pendingCount = subjectTasks.filter((t) => !t.completed).length;

        return (
          <div
            key={subject.id}
            onClick={() => onSelectSubject(subject.id)}
            className={`subject-nav-card glass-panel ${isSelected ? "active" : ""}`}
            style={{
              "--card-accent": subject.themeColor,
              "--card-bg-soft": subject.bgSoft,
              "--card-glow": subject.borderGlow,
            }}
          >
            {/* شارة عدد المتراكم أو علامة نظيف تماماً */}
            {pendingCount > 0 ? (
              <span className="backlog-count-pill" title={`${pendingCount} درس متراكم`}>
                {pendingCount}
              </span>
            ) : subjectTasks.length > 0 ? (
              <span className="backlog-count-pill clean" title="مخلص كل المتراكم!">
                <Check size={12} strokeWidth={3} />
              </span>
            ) : null}

            <div 
              className="subject-icon-box"
              style={{
                background: isSelected ? subject.themeColor : "rgba(255, 255, 255, 0.05)",
                color: isSelected ? "#fff" : "var(--text-main)",
                boxShadow: isSelected ? `0 0 16px ${subject.borderGlow}` : "none"
              }}
            >
              {subject.symbol}
            </div>

            <span className="subject-nav-name">{subject.name}</span>
          </div>
        );
      })}
    </div>
  );
}
