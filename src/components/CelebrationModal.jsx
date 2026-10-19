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
      const count = 200;
      const defaults = {
        origin: { y: 0.65 },
        zIndex: 999999
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
    <div className="celebrate-popup-overlay" onClick={onClose}>
      <div 
        className="celebrate-popup-box" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="celebrate-fire-badge">
          🔥
        </div>

        <h2 className="celebrate-title">
          عاااش مووووت! 💪
        </h2>

        <p className="celebrate-subtext">
          فخور بيك جداً.. كمل متوقفش! 🏆
        </p>

        {task && (
          <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: "999px", background: "rgba(255, 255, 255, 0.08)", color: "var(--theme-accent)", fontSize: "14px", fontWeight: "800", marginBottom: "16px" }}>
            <span>خلصت: {task.title}</span>
            {subject && <span> ({subject.name})</span>}
          </div>
        )}

        <p style={{ fontSize: "15px", color: "#f1d4eb", lineHeight: "1.6", marginBottom: "24px" }}>
          {randomPhrase}
        </p>

        <button 
          onClick={onClose} 
          className="btn-glow"
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          <span>استمر يا وحش، اللي بعده يلا!</span>
          <ArrowLeft size={18} />
        </button>
      </div>
    </div>
  );
}
