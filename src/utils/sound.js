// نظام مؤثرات صوتية تحفيزية متطور باستخدام Web Audio API بدون الحاجة لملفات خارجية
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound(enable) {
    this.enabled = enable;
  }

  // نغمة إنجاز حماسية احتفالية (عاش مووت!)
  playCelebration() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      // نغمات متتالية مبهجة (دو - مي - صول - دو حاد)
      const notes = [
        { freq: 523.25, time: 0, dur: 0.15 },      // C5
        { freq: 659.25, time: 0.12, dur: 0.15 },   // E5
        { freq: 783.99, time: 0.24, dur: 0.18 },   // G5
        { freq: 1046.50, time: 0.38, dur: 0.45 },  // C6 (تألق عالي)
        { freq: 1318.51, time: 0.50, dur: 0.6 }    // E6
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle'; // نغمة دافئة وناعمة على الأذن
        osc.frequency.setValueAtTime(freq, now + time);

        // تدريج الصوت بنعومة لحماية الأذن
        gain.gain.setValueAtTime(0.001, now + time);
        gain.gain.exponentialRampToValueAtTime(0.2, now + time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch (e) {
      console.warn("Sound play error:", e);
    }
  }

  // صوت نقرة إضافة مهمة جديدة
  playAdd() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn(e);
    }
  }
}

export const soundFx = new SoundEffects();
