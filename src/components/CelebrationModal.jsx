import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { MOTIVATIONAL_MESSAGES } from "../data/subjects";
import { ArrowLeft } from "lucide-react";

export default function CelebrationModal({ 
  task, 
  subject, 
  onClose 
}) {
  useEffect(() => {
    try {
      const count = 180;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 99999
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

  const randomPhrase = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];

  return (
    <div className="modal-overlay animate-entrance" onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ borderColor: subject?.primaryColor || "#f59e0b" }}
      >
        <div className="modal-fire-circle">
          🔥
        </div>

        <h2 className="modal-celebration-title">
          عاااش مووووت! 💪
        </h2>

        <p style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", marginBottom: "8px" }}>
          فخور بيك جداً.. كمل متوقفش! 🏆
        </p>

        {task && (
          <div className="modal-task-badge">
            <span>خلصت: {task.title}</span>
            {subject && <span> ({subject.name})</span>}
          </div>
        )}

        <p className="modal-celebration-text">
          {randomPhrase}
        </p>

        <button 
          onClick={onClose} 
          className="action-btn"
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#ffffff",
            boxShadow: "0 6px 20px rgba(245, 158, 11, 0.4)",
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
