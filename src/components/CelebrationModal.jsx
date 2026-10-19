import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { MOTIVATIONAL_MESSAGES } from "../data/subjects";
import { Sparkles, Trophy, Flame, ArrowLeft } from "lucide-react";

export default function CelebrationModal({ 
  task, 
  subject, 
  onClose 
}) {
  useEffect(() => {
    // إطلاق مفرقعات الزينة والكونفيتي المبهجة
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 1500
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } catch (e) {
      console.warn("Confetti error:", e);
    }
  }, []);

  // اختيار رسالة تحفيزية عشوائية
  const randomPhrase = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];

  return (
    <div className="celebration-modal-overlay animate-pop" onClick={onClose}>
      <div 
        className="celebration-modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ borderColor: subject?.themeColor || "#f59e0b" }}
      >
        <div className="celebration-badge-hero">
          🔥
        </div>

        <h2 className="celebration-title-text">
          عاااش مووووت! 💪
        </h2>

        <p style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", marginBottom: "8px" }}>
          فخور بيك جداً.. كمل متوقفش! 🏆
        </p>

        {task && (
          <div className="celebration-task-tag">
            <span>تم التخلص من: {task.title}</span>
            {subject && <span> ({subject.name})</span>}
          </div>
        )}

        <p className="celebration-phrase-text">
          {randomPhrase}
        </p>

        <button 
          onClick={onClose} 
          className="btn btn-primary"
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            boxShadow: "0 4px 20px rgba(245, 158, 11, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          <span>استمر يا بطل، اللي بعده يلا!</span>
          <ArrowLeft size={18} />
        </button>
      </div>
    </div>
  );
}
