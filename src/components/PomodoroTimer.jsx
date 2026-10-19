import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Timer, Coffee, Flame } from "lucide-react";
import { soundFx } from "../utils/sound";

export default function PomodoroTimer() {
  const [mode, setMode] = useState("study"); // "study" or "break"
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      soundFx.playCelebration();
      if (mode === "study") {
        setMode("break");
        setTimeLeft(5 * 60);
      } else {
        setMode("study");
        setTimeLeft(25 * 60);
      }
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "study" ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === "study" ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="pomodoro-card glass-panel">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ padding: "10px", borderRadius: "12px", background: mode === "study" ? "rgba(59, 130, 246, 0.15)" : "rgba(16, 185, 129, 0.15)", color: mode === "study" ? "#60a5fa" : "#34d399" }}>
          {mode === "study" ? <Flame size={24} /> : <Coffee size={24} />}
        </div>
        <div>
          <h4 style={{ fontSize: "16px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>{mode === "study" ? "جلسة تركيز ومذاكرة (25 دقيقة)" : "استراحة راحة وتجديد طاقة (5 دقائق)"}</span>
          </h4>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
            {mode === "study" ? "اقفل السوشيال ميديا وركز في درسك الحالي!" : "اشرب مياه وتمشى شوية قبل الجلسة الجاية"}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div className="pomo-time-display" style={{ color: mode === "study" ? "#38bdf8" : "#34d399" }}>
          {timeFormatted}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button 
            onClick={toggleTimer} 
            className="btn btn-primary"
            style={{ 
              background: isRunning ? "#ef4444" : "linear-gradient(135deg, #3b82f6, #6366f1)",
              padding: "8px 16px"
            }}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            <span>{isRunning ? "إيقاف مؤقت" : "ابدأ الآن"}</span>
          </button>

          <button onClick={resetTimer} className="btn btn-ghost" title="إعادة ضبط">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
