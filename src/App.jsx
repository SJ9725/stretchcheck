import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Check, X, Settings, Play, Pause, TrendingUp, ChevronLeft, Volume2, VolumeX, Bell, Sparkles, Share2, BarChart3, ArrowRight, RotateCcw, Zap, Droplets, Plus, Minus } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

// ─── STRETCH LIBRARY ─────────────────────────────────────────────────────────
const STRETCHES = [
  { id: 1, name: "Overhead Reach", area: "upper", description: "Stand up, reach both arms overhead, interlace fingers, and stretch upward", duration: 15, fallbackEmoji: "🙆", videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/Arm_stretch/Arm+stretch.mp4" },
  { id: 2, name: "Shoulder Rolls", area: "upper", description: "Stand up, roll shoulders backward 5 times, then forward 5 times", duration: 15, fallbackEmoji: "💪", videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/Shoulder_shrugs/video_media_01KG8B226QGMN86GP43EKEJMNH.mp4" },
  { id: 3, name: "Torso Twist", area: "core", description: "Stand with feet shoulder-width apart, twist torso left and right alternating", duration: 15, fallbackEmoji: "🔄", videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/Torso_twist/Torso+twist.mp4" },
  { id: 5, name: "Side Bend", area: "core", description: "Stand tall, reach right arm overhead and bend left, then switch sides", duration: 15, fallbackEmoji: "🤸", videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/Side_bend/side+bend.mp4" },
  { id: 6, name: "Neck Rolls", area: "upper", description: "Gently roll head in a circle, 3 times each direction", duration: 15, fallbackEmoji: "🧘", videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/neck_rolls/Animate_this_manequin_202601312324_s2zxr.mp4" },
  { id: 7, name: "Chest Opener", area: "upper", description: "Clasp hands behind your back. Squeeze shoulder blades together, lift hands slightly, and open your chest. Hold 15 seconds.", duration: 20, fallbackEmoji: "🫁", videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/new-stretches/Chest_Opener_Stretch_Video_Generation.mp4" },
  { id: 8, name: "Standing Quad Stretch", area: "lower", description: "Stand on one foot, grab the other ankle behind you. Keep knees together and hold 15 seconds each leg.", duration: 30, fallbackEmoji: "🦵", videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/new-stretches/Quad+stretch.mp4" },
  { id: 9, name: "Cross Body Arm Pull", area: "upper", description: "Pull one arm across your chest with the opposite hand, gently stretching your shoulder and upper back.", duration: 25, fallbackEmoji: "🦶", videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/new-stretches/Cross_Body_Arm_Pull_Video_Generation.mp4" },
  { id: 10, name: "Seated Spinal Twist", area: "upper", description: "Sit on chair, rotate your torso to one side while keeping hips forward, hold, then twist to the other side.", duration: 25, fallbackEmoji: "🐱", videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/new-stretches/Seated_spinal_twist_202602022238_eh5j3.mp4" },
  { id: 11, name: "Chair-Assisted Forward Fold", area: "upper", description: "Place hands on chair back, step back, and hinge forward at hips with straight spine and extended arms.", duration: 30, fallbackEmoji: "4️⃣", videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/new-stretches/Woman_stands_facing_1080p_202602022233.mp4" },
  { id: 12, name: "Eye 20-20-20", area: "eyes", description: "Look at something 20 feet away for 20 seconds. Blink slowly 10 times. Repeat with a different focal point.", duration: 25, fallbackEmoji: "👁️", videoUrl: "" },
];

// ─── BREATHING EXERCISES ─────────────────────────────────────────────────────
const BREATHING_EXERCISES = [
  {
    id: 'b1', name: "Box Breathing", pattern: [4, 4, 4, 4], labels: ["Inhale", "Hold", "Exhale", "Hold"],
    emoji: "📦", context: "Pre-interview · Before a tough meeting · Calming anxiety",
    description: "Used by Navy SEALs to stay calm under pressure. Equal parts inhale, hold, exhale, hold. Do 4 cycles before your next stressful event.",
    tip: "Try this 5 minutes before a meeting with your boss or a job interview. It activates your parasympathetic nervous system and lowers cortisol.",
    color: "#2563eb"
  },
  {
    id: 'b2', name: "4-7-8 Relaxation", pattern: [4, 7, 8, 0], labels: ["Inhale", "Hold", "Exhale", "—"],
    emoji: "🌊", context: "Wind down after work · Can't sleep · Feeling overwhelmed",
    description: "Dr. Andrew Weil's natural tranquilizer for the nervous system. The long exhale triggers deep relaxation.",
    tip: "Perfect for the end of your workday. The extended exhale tells your body it's safe to switch off. Two cycles and you'll feel the tension melt.",
    color: "#7c3aed"
  },
  {
    id: 'b3', name: "Energizing Breath", pattern: [2, 0, 2, 0], labels: ["Inhale", "—", "Exhale", "—"],
    emoji: "⚡", context: "Post-lunch slump · Need quick focus · Before a presentation",
    description: "Quick rhythmic breathing that floods your system with oxygen. Short, sharp cycles to boost alertness fast.",
    tip: "Feeling that 2pm energy crash? Do 10 rapid cycles of this. It's like a caffeine hit without the coffee. Great before presentations too.",
    color: "#dc2626"
  },
];

const AREA_LABELS = { upper: "Upper Body", core: "Core & Back", lower: "Lower Body", eyes: "Eyes & Face" };

// ─── S3 SOUNDS ───────────────────────────────────────────────────────────────
const SOUND_URLS = {
  bell: "",
  marimba: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/sounds/Firefly_audio_A_soft_marimba_note._Warm_wooden_tone._Minimal_and_variation1.wav",
  notification: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/sounds/Firefly_audio_A_soft%2C_calming_notification_sound._Two_gentle_bel_variation3.wav",
  gentle: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/sounds/Firefly_audio_A_light%2C_airy_notification_sound._A_air_pop_or_who_variation1.wav",
  annoying: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/sounds/microsoft+teams+ringtone+remix+this+is+looking+best.mp3",
};

const trackEvent = (name, data = {}) => {
  if (typeof window !== 'undefined') {
    window.__SC_EVENTS = window.__SC_EVENTS || [];
    window.__SC_EVENTS.push({ name, data, ts: Date.now() });
  }
};

// ─── BUTTON ──────────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, primary, small, icon: I, disabled }) => (
  <button onClick={onClick} disabled={disabled}
    className={`w-full font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2
      ${small ? 'py-2 text-xs' : 'py-4'}
      ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
      ${primary ? 'bg-black text-white border-2 border-black hover:bg-white hover:text-black'
        : 'border-2 border-black bg-white hover:bg-neutral-100'}`}>
    {I && <I className={small ? "w-4 h-4" : "w-5 h-5"} strokeWidth={2} />}{children}
  </button>
);

// ─── TOGGLE SWITCH ───────────────────────────────────────────────────────────
const Toggle = ({ enabled, onToggle, activeColor = '#000' }) => (
  <button onClick={onToggle}
    style={{ width: 52, height: 28, borderWidth: 2, borderColor: '#000', position: 'relative', transition: 'background-color 0.2s', backgroundColor: enabled ? activeColor : '#fff' }}>
    <div style={{
      position: 'absolute', top: 3, width: 18, height: 18,
      border: '1px solid #000', transition: 'left 0.2s',
      left: enabled ? 27 : 3,
      backgroundColor: enabled ? '#fff' : '#000',
    }} />
  </button>
);

// ─── VIDEO PLAYER WITH FALLBACK (memoized to prevent re-render on timer tick) ─
const StretchVideo = React.memo(({ videoUrl, fallbackEmoji }) => {
  const [videoFailed, setVideoFailed] = useState(false);

  if (!videoUrl || videoFailed) {
    return (
      <div style={{ padding: '64px 0', textAlign: 'center' }}>
        <div style={{ fontSize: '120px', filter: 'grayscale(1)' }}>{fallbackEmoji}</div>
      </div>
    );
  }

  return (
    <video
      src={videoUrl}
      autoPlay
      loop
      muted
      playsInline
      crossOrigin="anonymous"
      onError={() => setVideoFailed(true)}
      style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain', display: 'block' }}
    />
  );
});

// ─── STRETCH TIMER (isolated to prevent parent re-renders) ───────────────────
const StretchTimer = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            clearInterval(timerRef.current);
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft, onComplete]);

  const progress = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;
  const mono = { fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' };

  return (
    <div style={{ border: '2px solid #000', padding: 20, marginBottom: 24, textAlign: 'center' }}>
      <div style={{ ...mono, color: '#999', marginBottom: 12 }}>
        {isActive ? 'Stretching…' : timeLeft === 0 ? '✓ Done!' : 'Guided Timer'}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 48, fontWeight: 'bold', marginBottom: 12 }}>{timeLeft}s</div>
      <div style={{ height: 12, border: '1px solid #000', overflow: 'hidden', position: 'relative', backgroundColor: '#f5f5f5', marginBottom: 16 }}>
        <div style={{ 
          position: 'absolute', inset: 0, 
          width: `${progress}%`, 
          backgroundColor: timeLeft === 0 ? '#22c55e' : '#CC0000',
          transition: 'width 1s linear'
        }} />
      </div>
      {!isActive && timeLeft > 0 && (
        <button onClick={() => setIsActive(true)}
          style={{ 
            border: '2px solid #000', padding: '8px 24px', fontWeight: 'bold', cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
            backgroundColor: '#fff', transition: 'all 0.2s'
          }}
          onMouseOver={e => { e.currentTarget.style.backgroundColor = '#000'; e.currentTarget.style.color = '#fff'; }}
          onMouseOut={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#000'; }}>
          ▶ START TIMER
        </button>
      )}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [mode, setMode] = useState('setup');
  const [intervalMinutes, setIntervalMinutes] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [endTime, setEndTime] = useState(null); // timestamp when timer should fire
  const [timeLeft, setTimeLeft] = useState(0); // display only, calculated from endTime
  const [pausedTimeLeft, setPausedTimeLeft] = useState(null); // stores remaining seconds when paused
  const [currentStretch, setCurrentStretch] = useState(null);

  const [soundVolume, setSoundVolume] = useState(0.5);
  const [soundStyle, setSoundStyle] = useState('bell');

  const [stretchCount, setStretchCount] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);

  const [breathingExercise, setBreathingExercise] = useState(null);
  const [breathPhase, setBreathPhase] = useState(0);
  const [breathCycles, setBreathCycles] = useState(0);
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(0);

  const [hydrationEnabled, setHydrationEnabled] = useState(true);
  const [hydrationCount, setHydrationCount] = useState(0);
  const [hydrationGoal, setHydrationGoal] = useState(8);
  
  const [notificationPermission, setNotificationPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'denied'
  );

  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const breathTimerRef = useRef(null);

  // ─── PERSIST: Load ──────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const stats = await window.storage.get('sc-stats');
        if (stats) {
          const d = JSON.parse(stats.value);
          if (d.stretchCount) setStretchCount(d.stretchCount);
          if (d.totalSeconds) setTotalSeconds(d.totalSeconds);
          if (d.streak) setStreak(d.streak);
          if (d.bestStreak) setBestStreak(d.bestStreak);
          if (d.weeklyData) setWeeklyData(d.weeklyData);
          if (d.sessionHistory) setSessionHistory(d.sessionHistory);
          if (d.hydrationCount) setHydrationCount(d.hydrationCount);
        }
      } catch { }
      try {
        const prefs = await window.storage.get('sc-prefs');
        if (prefs) {
          const p = JSON.parse(prefs.value);
          if (p.intervalMinutes) setIntervalMinutes(p.intervalMinutes);
          if (p.soundStyle) setSoundStyle(p.soundStyle);
          if (p.soundVolume !== undefined) setSoundVolume(p.soundVolume);
          if (p.hydrationEnabled !== undefined) setHydrationEnabled(p.hydrationEnabled);
          if (p.hydrationGoal) setHydrationGoal(p.hydrationGoal);
        }
      } catch { }
    };
    load();
  }, []);

  // ─── PERSIST: Save ─────────────────────────────────────────────────────
  const saveStats = useCallback(async (updates = {}) => {
    const data = { stretchCount, totalSeconds, streak, bestStreak, weeklyData, sessionHistory, hydrationCount, ...updates };
    try { await window.storage.set('sc-stats', JSON.stringify(data)); } catch { }
  }, [stretchCount, totalSeconds, streak, bestStreak, weeklyData, sessionHistory, hydrationCount]);

  const savePrefs = useCallback(async () => {
    try {
      await window.storage.set('sc-prefs', JSON.stringify({
        intervalMinutes, soundStyle, soundVolume, hydrationEnabled, hydrationGoal
      }));
    } catch { }
  }, [intervalMinutes, soundStyle, soundVolume, hydrationEnabled, hydrationGoal]);

  useEffect(() => { savePrefs(); }, [savePrefs]);

  // ─── MAIN TIMER (uses real clock time, works in background tabs) ──────────
  useEffect(() => {
    if (isRunning && mode === 'running' && endTime) {
      const tick = () => {
        const now = Date.now();
        const remaining = Math.max(0, Math.round((endTime - now) / 1000));
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          // Time's up - trigger reminder and reset timer
          triggerReminder();
          setEndTime(Date.now() + intervalMinutes * 60 * 1000);
        }
      };
      
      // Run immediately to sync, then every second for display
      tick();
      timerRef.current = setInterval(tick, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, mode, endTime, intervalMinutes]);

  // ─── BREATHING TIMER ────────────────────────────────────────────────────
  useEffect(() => {
    if (breathingExercise && breathSecondsLeft > 0) {
      breathTimerRef.current = setInterval(() => {
        setBreathSecondsLeft(prev => {
          if (prev <= 1) {
            const ex = breathingExercise;
            let next = (breathPhase + 1) % ex.pattern.length;
            let safety = 0;
            while (ex.pattern[next] === 0 && safety < 4) { next = (next + 1) % ex.pattern.length; safety++; }
            if (next <= breathPhase) setBreathCycles(c => c + 1);
            setBreathPhase(next);
            return ex.pattern[next];
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (breathTimerRef.current) clearInterval(breathTimerRef.current); };
  }, [breathingExercise, breathPhase, breathSecondsLeft]);

  // ─── SOUND (distinct synth tone per style + S3 attempt) ──────────────────
  const playSound = (styleOverride) => {
    const style = styleOverride || soundStyle;
    if (style === 'silent') return;

    // Each style has its own distinct synthesized sound
    const synthSounds = {
      bell: { freqs: [659.25, 830.61, 987.77], gap: 0.15, dur: 0.6, type: 'sine', vol: 0.3 },
      marimba: { freqs: [523.25, 659.25, 783.99], gap: 0.12, dur: 0.3, type: 'triangle', vol: 0.4 },
      notification: { freqs: [880, 1108.73], gap: 0.1, dur: 0.25, type: 'sine', vol: 0.25 },
      gentle: { freqs: [440, 554.37, 659.25], gap: 0.25, dur: 0.8, type: 'sine', vol: 0.15 },
      annoying: { freqs: [1000, 800, 1000, 800, 1200], gap: 0.08, dur: 0.15, type: 'square', vol: 0.2 },
    };

    const playSynth = () => {
      try {
        const cfg = synthSounds[style] || synthSounds.bell;
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        cfg.freqs.forEach((f, i) => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = cfg.type;
          o.connect(g); g.connect(ctx.destination); o.frequency.value = f;
          const t = ctx.currentTime + i * cfg.gap;
          g.gain.setValueAtTime(soundVolume * cfg.vol, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + cfg.dur);
          o.start(t); o.stop(t + cfg.dur);
        });
      } catch { }
    };

    // Try S3 first, fall back to synth
    const url = SOUND_URLS[style];
    if (url) {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
      const audio = new Audio(url);
      audio.volume = soundVolume;
      audio.crossOrigin = 'anonymous';
      audio.onerror = () => playSynth();
      audio.play().catch(() => playSynth());
      audioRef.current = audio;
    } else {
      playSynth();
    }
  };

  // ─── ACTIONS ────────────────────────────────────────────────────────────
  
  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission;
    }
    return 'denied';
  };

  // Show browser notification (system sound plays automatically)
  // When user clicks it, they return to tab and our sound + UI plays
  const showBrowserNotification = (stretch) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('🧘 Time to Stretch!', {
        body: `${stretch.name} - ${stretch.duration}s\nClick to open StretchCheck`,
        icon: '/icon-192.png',
        tag: 'stretch-reminder',
        requireInteraction: true,
      });
      
      // When user clicks notification, focus tab and play our sound
      notification.onclick = () => {
        window.focus();
        notification.close();
        // Play our app sound now that user is back on the tab
        playSound();
      };
    }
  };
  
  const triggerReminder = () => {
    const pick = STRETCHES[Math.floor(Math.random() * STRETCHES.length)];
    setCurrentStretch(pick);
    setMode('reminder');
    
    // Stop the timer while user is doing the stretch
    setIsRunning(false);
    
    // If tab is visible, play sound immediately
    // If tab is hidden, show notification (sound plays when they click it)
    if (document.visibilityState === 'visible') {
      playSound();
    } else {
      showBrowserNotification(pick);
    }
    
    trackEvent('reminder_triggered', { stretch: pick.name });
  };

  const startApp = async () => {
    // Request notification permission when starting
    if (notificationPermission !== 'granted') {
      await requestNotificationPermission();
    }
    
    const now = Date.now();
    setEndTime(now + intervalMinutes * 60 * 1000);
    setTimeLeft(intervalMinutes * 60);
    setPausedTimeLeft(null);
    setIsRunning(true);
    setMode('running');
    trackEvent('session_started', { interval: intervalMinutes });
  };

  const togglePause = () => {
    if (isRunning) {
      // Pausing: save the current remaining time
      const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
      setPausedTimeLeft(remaining);
      setIsRunning(false);
    } else {
      // Resuming: set new endTime based on saved remaining time
      const remaining = pausedTimeLeft !== null ? pausedTimeLeft : timeLeft;
      setEndTime(Date.now() + remaining * 1000);
      setPausedTimeLeft(null);
      setIsRunning(true);
    }
  };

  // Restart timer fresh after completing or skipping a stretch
  const resumeTimer = () => {
    const now = Date.now();
    setEndTime(now + intervalMinutes * 60 * 1000);
    setTimeLeft(intervalMinutes * 60);
    setPausedTimeLeft(null);
    setIsRunning(true);
  };

  const skipStretch = () => { 
    setMode('running'); 
    setCurrentStretch(null); 
    resumeTimer();
    trackEvent('stretch_skipped'); 
  };

  const completeStretch = () => {
    const nc = stretchCount + 1;
    const ns = totalSeconds + (currentStretch?.duration || 0);
    const day = new Date().getDay();
    const nw = [...weeklyData]; nw[day] = (nw[day] || 0) + 1;
    const nStreak = streak + (stretchCount === 0 ? 1 : 0);
    const nBest = Math.max(bestStreak, nStreak);
    const entry = { name: currentStretch?.name, area: currentStretch?.area, ts: Date.now() };
    const nh = [...sessionHistory.slice(-49), entry];
    setStretchCount(nc); setTotalSeconds(ns); setWeeklyData(nw);
    setStreak(nStreak); setBestStreak(nBest); setSessionHistory(nh);
    saveStats({ stretchCount: nc, totalSeconds: ns, weeklyData: nw, streak: nStreak, bestStreak: nBest, sessionHistory: nh });
    setMode('running'); 
    setCurrentStretch(null);
    resumeTimer();
    trackEvent('stretch_completed', { stretch: currentStretch?.name });
  };

  const logWater = () => {
    const nc = hydrationCount + 1;
    setHydrationCount(nc);
    saveStats({ hydrationCount: nc });
    trackEvent('water_logged', { count: nc });
  };

  const startBreathing = (ex) => {
    setBreathingExercise(ex); setBreathCycles(0);
    const first = ex.pattern.findIndex(p => p > 0);
    setBreathPhase(first >= 0 ? first : 0);
    setBreathSecondsLeft(ex.pattern[first >= 0 ? first : 0]);
    setMode('breathing');
    trackEvent('breathing_started', { exercise: ex.name });
  };

  const stopBreathing = () => {
    setBreathingExercise(null);
    if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    setMode(isRunning ? 'running' : 'setup');
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const resetStats = async () => {
    setStretchCount(0); setTotalSeconds(0); setStreak(0); setWeeklyData([0, 0, 0, 0, 0, 0, 0]);
    setSessionHistory([]); setHydrationCount(0);
    try { await window.storage.delete('sc-stats'); } catch { }
  };

  const handleShare = async () => {
    const text = `🔥 StretchCheck — Day ${streak} streak!\n💪 ${stretchCount} stretches completed\n💧 ${hydrationCount} glasses of water\n⏱️ ${Math.round(totalSeconds / 60)} minutes of movement\n\nTake care of your body while WFH!`;
    if (navigator.share) { try { await navigator.share({ title: 'StretchCheck', text }); } catch { } }
    else { try { await navigator.clipboard.writeText(text); } catch { } }
    trackEvent('streak_shared');
  };

  // ─── FONT HELPERS ───────────────────────────────────────────────────────
  const mono = (size = 10, extra = {}) => ({ fontFamily: "'JetBrains Mono', monospace", fontSize: `${size}px`, letterSpacing: '0.15em', textTransform: 'uppercase', ...extra });
  const serif = { fontFamily: "'DM Serif Display', serif" };

  // ═════════════════════════════════════════════════════════════════════════
  // SHELL
  // ═════════════════════════════════════════════════════════════════════════
  const Shell = ({ children }) => (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        body { background: #F5F1EB; margin: 0; }
        * { border-radius: 0 !important; box-sizing: border-box; }
        @keyframes scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
        .ticker-content { animation: scroll 35s linear infinite; display:inline-flex; white-space:nowrap; }
        .ticker-wrapper { flex:1; overflow:hidden; position:relative; }
        .fade-up { animation: fadeUp 0.4s ease-out both; }
        .fade-up-d1 { animation-delay:0.05s; }
        .fade-up-d2 { animation-delay:0.1s; }
        .fade-up-d3 { animation-delay:0.15s; }
        .slide-down { animation: slideDown 0.4s ease-out both; }
        input[type="range"] { -webkit-appearance:none; height:6px; background:#ddd; border:1px solid #000; outline:none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; background:#000; border:2px solid #000; cursor:pointer; }
        input[type="range"]::-moz-range-thumb { width:18px; height:18px; background:#000; border:2px solid #000; cursor:pointer; border-radius:0; }
      `}</style>
      <div className="min-h-screen" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
        {/* TICKER — solid black bg, white text */}
        <div style={{ width: '100%', backgroundColor: '#000000', color: '#ffffff', borderBottom: '4px solid #000', padding: '10px 0', overflow: 'hidden' }}>
          <div className="flex items-center">
            <div style={{ ...mono(10), backgroundColor: '#CC0000', color: '#ffffff', padding: '6px 20px', flexShrink: 0, marginRight: 16, fontWeight: 'bold' }}>Live</div>
            <div className="ticker-wrapper">
              <div className="ticker-content">
                {[
                  { t: "73% of remote workers skip stretches during video calls", h: "73%" },
                  { t: "Local developer discovers standing desk actually requires standing", h: "actually requires standing" },
                  { t: "Your cat is judging your poor posture right now", h: "poor posture" },
                  { t: "Coffee run doesn't count as cardio, scientists confirm", h: "cardio" },
                  { t: "Couch ≠ ergonomic chair, international survey finds", h: "ergonomic chair" },
                  { t: "Pajama pants reduce stretch motivation by 67%", h: "67%" },
                  { t: "Dehydration drops productivity by 25%, drink water now", h: "25%" },
                  { t: "15-second micro-breaks reset muscle tension, new study finds", h: "micro-breaks" },
                  { t: "73% of remote workers skip stretches during video calls", h: "73%" },
                  { t: "Local developer discovers standing desk actually requires standing", h: "actually requires standing" },
                ].map((item, i) => {
                  const parts = item.t.split(item.h);
                  return (
                    <span key={i} style={{ ...mono(11, { letterSpacing: '0.03em' }), margin: '0 32px', color: '#ffffff' }}>
                      ★ {parts[0]}<span style={{ color: '#CC0000', fontWeight: 'bold' }}>{item.h}</span>{parts[1] || ''}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex items-start justify-center p-4 sm:p-6 min-h-[calc(100vh-52px)]">
          <div className="w-full max-w-2xl">{children}</div>
        </div>
      </div>
      <Analytics />
    </>
  );

  // ═════════════════════════════════════════════════════════════════════════
  // SETUP
  // ═════════════════════════════════════════════════════════════════════════
  if (mode === 'setup') return (
    <Shell>
      <div className="border-4 border-black bg-[#FAFAF7] fade-up">
        {/* Masthead */}
        <div className="text-center border-b-4 border-black p-8 sm:p-10">
          <div style={{ ...mono(10, { letterSpacing: '0.3em' }), color: '#CC0000', marginBottom: 8 }}>
            Vol. 2 · Wellness Edition · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold leading-[0.9] tracking-tight mb-3" style={serif}>StretchCheck</h1>
          <p style={{ ...mono(11, { letterSpacing: '0.2em' }), color: '#999' }}>Your Desktop Wellness Companion</p>
        </div>

        {/* Intro */}
        <div className="p-6 sm:p-8 border-b-2 border-black">
          <div style={{ ...mono(10, { letterSpacing: '0.3em' }), color: '#CC0000', marginBottom: 8 }}>How It Works</div>
          <p className="text-sm text-neutral-600 leading-relaxed" style={{ maxWidth: 540 }}>
            Select your preferred reminder interval below. Keep this tab open in the background while you work. When it's time to move, you'll receive an alert with a guided stretch to follow. No signup required.
          </p>
        </div>

        <div className="p-8 sm:p-10 space-y-8">
          {/* Interval */}
          <div className="fade-up fade-up-d1">
            <label className="block mb-1" style={mono(10)}>Reminder Interval</label>
            <p className="text-sm text-neutral-500 mb-3">You'll get a stretch reminder after this much time. Pick what works with your flow.</p>
            <div className="grid grid-cols-5 gap-px bg-black border-2 border-black">
              {[{ l: '15m', v: 15 }, { l: '30m', v: 30 }, { l: '45m', v: 45 }, { l: '1h', v: 60 }, { l: '90m', v: 90 }].map(o => (
                <button key={o.v} onClick={() => setIntervalMinutes(o.v)}
                  className={`p-3 sm:p-4 font-bold text-sm transition-all ${intervalMinutes === o.v ? 'bg-black text-white' : 'bg-white hover:bg-neutral-50'}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>{o.l}</button>
              ))}
            </div>
          </div>

          {/* Hydration */}
          <div className="border-2 border-black fade-up fade-up-d2">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-[#0ea5e9]" strokeWidth={1.5} />
                <div>
                  <div className="font-bold text-sm">Hydration Reminders</div>
                  <div style={{ ...mono(10), color: '#999' }}>
                    {hydrationEnabled ? `Shown with each stretch · Goal: ${hydrationGoal} glasses` : 'Disabled'}
                  </div>
                </div>
              </div>
              <Toggle enabled={hydrationEnabled} onToggle={() => setHydrationEnabled(!hydrationEnabled)} activeColor="#0ea5e9" />
            </div>
            {hydrationEnabled && (
              <div className="border-t border-neutral-200 p-5">
                <label className="block mb-2" style={mono(10)}>Daily Goal (glasses)</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setHydrationGoal(Math.max(1, hydrationGoal - 1))}
                    className="border-2 border-black p-2 hover:bg-black hover:text-white transition-all"><Minus className="w-4 h-4" strokeWidth={2} /></button>
                  <div className="text-2xl font-bold flex-1 text-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{hydrationGoal}</div>
                  <button onClick={() => setHydrationGoal(Math.min(20, hydrationGoal + 1))}
                    className="border-2 border-black p-2 hover:bg-black hover:text-white transition-all"><Plus className="w-4 h-4" strokeWidth={2} /></button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="border-2 border-black p-5 fade-up fade-up-d2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 20 }}>🔔</span>
                <div>
                  <div className="font-bold text-sm">Browser Notifications</div>
                  <div style={{ ...mono(10), color: notificationPermission === 'granted' ? '#22c55e' : notificationPermission === 'denied' ? '#CC0000' : '#999' }}>
                    {notificationPermission === 'granted' ? '✓ Enabled — alerts work in background tabs' 
                      : notificationPermission === 'denied' ? '✗ Blocked — check browser settings to enable'
                      : 'Required for background reminders'}
                  </div>
                </div>
              </div>
              {notificationPermission !== 'granted' && notificationPermission !== 'denied' && (
                <button 
                  onClick={requestNotificationPermission}
                  style={{ 
                    border: '2px solid #000', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                    backgroundColor: '#000', color: '#fff', transition: 'all 0.2s'
                  }}>
                  Enable
                </button>
              )}
              {notificationPermission === 'granted' && (
                <div style={{ color: '#22c55e', fontSize: 24 }}>✓</div>
              )}
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #eee', fontSize: 11, color: '#999', lineHeight: 1.5 }}>
              💡 <strong>Not getting notifications?</strong> Check your system settings:<br/>
              <span style={{ color: '#bbb' }}>Mac: System Settings → Notifications → Your Browser → Allow</span><br/>
              <span style={{ color: '#bbb' }}>Windows: Settings → System → Notifications → Your Browser → On</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 fade-up fade-up-d3">
            <Btn onClick={startApp} primary icon={Play}>Start Session</Btn>
            <div className="grid grid-cols-2 gap-3">
              <Btn onClick={() => setMode('settings')} icon={Settings}>Sound</Btn>
              <Btn onClick={() => setMode('stats')} icon={BarChart3}>Stats</Btn>
            </div>
          </div>
        </div>

        {/* BREATHING */}
        <div className="border-t-4 border-black p-8 sm:p-10">
          <div className="text-center mb-6">
            <div style={{ ...mono(10, { letterSpacing: '0.3em' }), color: '#CC0000', marginBottom: 4 }}>Quick Mental Reset</div>
            <h2 className="text-2xl font-bold" style={serif}>Breathing Exercises</h2>
          </div>
          <div className="space-y-3">
            {BREATHING_EXERCISES.map(ex => (
              <button key={ex.id} onClick={() => startBreathing(ex)}
                className="w-full border-2 border-black bg-white p-5 text-left hover:bg-neutral-50 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0 mt-1">{ex.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-base" style={serif}>{ex.name}</span>
                      <span style={{ ...mono(10), color: '#CC0000' }}>{ex.pattern.filter(p => p > 0).join('-')}</span>
                    </div>
                    <div className="text-sm text-neutral-600 mb-2">{ex.description}</div>
                    <div className="px-2 py-1 bg-neutral-100 border border-neutral-200 inline-block" style={mono(9)}>
                      {ex.context}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-black transition-colors flex-shrink-0 mt-2" strokeWidth={1.5} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* GAZETTE */}
        <div className="border-t-4 border-black p-8 sm:p-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold" style={serif}>Health & Wellness Gazette</h2>
            <div style={{ ...mono(10, { letterSpacing: '0.3em' }), color: '#CC0000', marginTop: 4 }}>Featured Articles</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black border-2 border-black">
            {[
              { cat: "Workplace Health", title: "The Silent Epidemic of Desk Jobs", body: "Prolonged sitting increases cardiovascular disease risk significantly. Regular movement breaks every 30–45 minutes can dramatically reduce these risks.", cite: "Medical Journal, 2024" },
              { cat: "Ergonomics", title: "Why Your Posture Matters", body: "Poor posture while working from home leads to chronic pain in a majority of remote workers. Simple stretches can prevent long-term damage.", cite: "Ergonomics Today" },
              { cat: "Movement Science", title: "15 Seconds to Better Health", body: "Micro-breaks as short as 15 seconds can reset muscle tension and improve circulation. Consistency matters more than duration.", cite: "Sports Medicine Review" },
              { cat: "Hydration", title: "Water: The Forgotten Productivity Hack", body: "Even mild dehydration reduces cognitive performance and increases fatigue. Drinking water consistently throughout the day improves focus and reduces headaches.", cite: "Nutrition Research Quarterly" },
            ].map((a, i) => (
              <div key={i} className="bg-white p-6">
                <div style={{ ...mono(10), color: '#CC0000', marginBottom: 8 }}>{a.cat}</div>
                <h3 className="text-lg font-bold mb-2 leading-tight" style={serif}>{a.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-600 mb-3">{a.body}</p>
                <div style={{ ...mono(10), color: '#aaa' }}>— {a.cite}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-2 border-black bg-[#FFF8F0] p-8 text-center relative">
            <div style={{ ...mono(10, { letterSpacing: '0.3em' }), color: '#CC0000', marginBottom: 8 }}>Editor's Note</div>
            <h3 className="text-xl font-bold mb-3" style={serif}>Motion is Medicine</h3>
            <p className="text-sm leading-relaxed text-neutral-600 max-w-xl mx-auto">
              Somewhere between meetings and deadlines, movement gets forgotten. StretchCheck is a gentle reminder that your body still exists.
            </p>
            <div className="text-neutral-300 mt-4">★ ★ ★</div>
            <div style={{ position: 'absolute', bottom: 8, right: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#000000c7', letterSpacing: '0.05em' }}>by Shayan Jamali</div>
          </div>
        </div>

        <div className="border-t-2 border-black p-4 text-center">
          <p style={{ ...mono(10), color: '#aaa' }}>Ed. 2.0 · <span style={{ color: '#CC0000' }}>{STRETCHES.length} stretches</span> · {BREATHING_EXERCISES.length} breathing exercises · Built for humans who sit too much</p>
        </div>
      </div>
    </Shell>
  );

  // ═════════════════════════════════════════════════════════════════════════
  // SETTINGS
  // ═════════════════════════════════════════════════════════════════════════
  if (mode === 'settings') return (
    <Shell>
      <div className="border-4 border-black bg-[#FAFAF7] p-8 sm:p-10 fade-up">
        <div className="flex items-center gap-4 border-b-4 border-black pb-6 mb-8">
          <button onClick={() => setMode('setup')} className="border-2 border-black p-2 hover:bg-black hover:text-white transition-all">
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </button>
          <div>
            <div style={{ ...mono(10), color: '#CC0000' }}>Configuration</div>
            <h1 className="text-3xl font-bold" style={serif}>Sound Settings</h1>
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <label className="block mb-3" style={mono(10)}>Sound Style</label>
            <div className="grid grid-cols-3 gap-px bg-black border-2 border-black">
              {[
                { s: 'bell', i: Bell, l: 'Bell' },
                { s: 'marimba', i: Sparkles, l: 'Marimba' },
                { s: 'notification', i: Bell, l: 'Alert' },
                { s: 'gentle', i: Volume2, l: 'Gentle' },
                { s: 'annoying', i: Zap, l: 'Urgent' },
                { s: 'silent', i: VolumeX, l: 'Silent' },
              ].map(({ s, i: I, l }) => (
                <button key={s} onClick={() => { setSoundStyle(s); playSound(s); }}
                  className={`p-4 transition-all flex items-center justify-center gap-2 ${soundStyle === s ? 'bg-black text-white' : 'bg-white hover:bg-neutral-50'}`}>
                  <I className="w-4 h-4" strokeWidth={1.5} />
                  <span className="font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{l}</span>
                </button>
              ))}
            </div>
          </div>
          {soundStyle !== 'silent' && (
            <div>
              <div className="flex justify-between mb-3">
                <label style={mono(10)}>Volume</label>
                <span className="font-bold text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#CC0000' }}>{Math.round(soundVolume * 100)}%</span>
              </div>
              <div className="flex items-center gap-4">
                <VolumeX className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />
                <input type="range" min="0" max="1" step="0.1" value={soundVolume} onChange={e => setSoundVolume(parseFloat(e.target.value))} className="flex-1" />
                <Volume2 className="w-4 h-4" strokeWidth={1.5} />
              </div>
            </div>
          )}
        </div>
        <div className="mt-8"><Btn onClick={() => setMode('setup')} primary>Save & Back</Btn></div>
      </div>
    </Shell>
  );

  // ═════════════════════════════════════════════════════════════════════════
  // STATS
  // ═════════════════════════════════════════════════════════════════════════
  if (mode === 'stats') {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const maxW = Math.max(...weeklyData, 1);
    const areaCounts = {};
    sessionHistory.forEach(h => { areaCounts[h.area] = (areaCounts[h.area] || 0) + 1; });
    const hydPct = hydrationGoal > 0 ? Math.min(100, Math.round((hydrationCount / hydrationGoal) * 100)) : 0;

    return (
      <Shell>
        <div className="border-4 border-black bg-[#FAFAF7] fade-up">
          <div className="border-b-4 border-black p-8 sm:p-10">
            <div className="flex items-center gap-4">
              <button onClick={() => setMode('setup')} className="border-2 border-black p-2 hover:bg-black hover:text-white transition-all">
                <ChevronLeft className="w-5 h-5" strokeWidth={2} />
              </button>
              <div>
                <div style={{ ...mono(10), color: '#CC0000' }}>Dashboard</div>
                <h1 className="text-3xl font-bold" style={serif}>Your Stats</h1>
              </div>
            </div>
          </div>
          <div className="p-8 sm:p-10 space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-black border-2 border-black">
              {[
                { label: 'Stretches', value: stretchCount, icon: '💪' },
                { label: 'Minutes', value: Math.round(totalSeconds / 60), icon: '⏱️' },
                { label: 'Streak', value: `${streak}d`, icon: '🔥' },
                { label: 'Water', value: `${hydrationCount}/${hydrationGoal}`, icon: '💧' },
              ].map((m, i) => (
                <div key={i} className="bg-white p-5 text-center">
                  <div className="text-2xl mb-1">{m.icon}</div>
                  <div className="text-2xl font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</div>
                  <div style={{ ...mono(10), color: '#999', marginTop: 4 }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Hydration bar */}
            <div className="border-2 border-black p-5">
              <div className="flex items-center justify-between mb-3">
                <span style={{ ...mono(10), color: '#0ea5e9' }}>Hydration Today</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 'bold' }}>{hydPct}%</span>
              </div>
              <div className="h-5 border border-black bg-neutral-100 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-[#0ea5e9] transition-all duration-500" style={{ width: `${hydPct}%` }} />
              </div>
              <div className="flex justify-between mt-2">
                <span style={{ ...mono(10), color: '#aaa' }}>{hydrationCount} glasses</span>
                <span style={{ ...mono(10), color: '#aaa' }}>Goal: {hydrationGoal}</span>
              </div>
            </div>

            {/* Weekly */}
            <div className="border-2 border-black p-6">
              <div style={{ ...mono(10), color: '#CC0000', marginBottom: 16 }}>This Week — Stretches</div>
              <div className="flex items-end justify-between gap-2" style={{ height: 120 }}>
                {weeklyData.map((count, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div style={{ ...mono(10), fontWeight: 'bold' }}>{count > 0 ? count : ''}</div>
                    <div className="w-full transition-all duration-500" style={{
                      height: `${Math.max((count / maxW) * 80, count > 0 ? 8 : 2)}px`,
                      backgroundColor: i === new Date().getDay() ? '#CC0000' : count > 0 ? '#1a1a1a' : '#e5e5e5',
                    }} />
                    <div style={{ ...mono(10), fontWeight: i === new Date().getDay() ? 'bold' : 'normal', color: i === new Date().getDay() ? '#CC0000' : '#aaa' }}>{days[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Area breakdown */}
            {Object.keys(areaCounts).length > 0 && (
              <div className="border-2 border-black p-6">
                <div style={{ ...mono(10), color: '#CC0000', marginBottom: 16 }}>Area Breakdown</div>
                <div className="space-y-3">
                  {Object.entries(areaCounts).sort((a, b) => b[1] - a[1]).map(([area, count]) => {
                    const total = Object.values(areaCounts).reduce((a, b) => a + b, 0);
                    return (
                      <div key={area} className="flex items-center gap-3">
                        <div className="w-20" style={{ ...mono(10), fontWeight: 'bold' }}>{AREA_LABELS[area] || area}</div>
                        <div className="flex-1 h-5 bg-neutral-100 border border-black relative overflow-hidden">
                          <div className="absolute inset-y-0 left-0 bg-black transition-all duration-500" style={{ width: `${(count / total) * 100}%` }} />
                        </div>
                        <div className="w-8 text-right" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 'bold' }}>{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Btn onClick={handleShare} icon={Share2}>Share</Btn>
              <Btn onClick={resetStats} icon={RotateCcw}>Reset</Btn>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // RUNNING
  // ═════════════════════════════════════════════════════════════════════════
  if (mode === 'running') {
    const prog = ((intervalMinutes * 60 - timeLeft) / (intervalMinutes * 60)) * 100;
    return (
      <Shell>
        <div className="border-4 border-black bg-[#FAFAF7]">
          {/* Header — white text on black bg */}
          <div style={{ borderBottom: '4px solid #000', backgroundColor: '#000000', padding: '20px', textAlign: 'center' }}>
            <div style={{ ...mono(10, { letterSpacing: '0.3em' }), color: isRunning ? '#CC0000' : '#666', marginBottom: 4 }}>
              {isRunning ? '● Active' : '❚❚ Paused'}
            </div>
            <div style={{ ...serif, fontSize: 20, fontWeight: 'bold', color: '#ffffff' }}>Next Stretch In</div>
          </div>
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="text-7xl sm:text-8xl font-bold tracking-tighter leading-none mb-4"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatTime(timeLeft)}</div>
              <div className="h-6 border-2 border-black overflow-hidden relative bg-neutral-100">
                <div className="absolute inset-0 bg-black transition-all duration-1000" style={{ width: `${prog}%` }} />
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="border-2 border-black p-4">
                <div style={{ ...mono(10), color: '#CC0000' }}>Stretches</div>
                <div className="text-4xl font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{stretchCount}</div>
                <div style={{ ...mono(10), color: '#aaa', marginTop: 4 }}>{Math.round(totalSeconds / 60)} min total</div>
              </div>
              <div className="border-2 border-black p-4">
                <div style={{ ...mono(10), color: '#0ea5e9' }}>Water</div>
                <div className="text-4xl font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {hydrationCount}<span style={{ fontSize: 18, color: '#aaa' }}>/{hydrationGoal}</span>
                </div>
                {hydrationEnabled && (
                  <button onClick={logWater} style={{ ...mono(9), color: '#0ea5e9', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 4, textDecoration: 'underline' }}>
                    + log a glass
                  </button>
                )}
              </div>
            </div>

            {streak > 0 && (
              <div className="border-2 border-black p-3 mb-6 flex items-center justify-center gap-2 bg-[#FFF8F0]">
                <span className="text-lg">🔥</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 'bold' }}>{streak} day streak</span>
              </div>
            )}

            <div className="space-y-3">
              <button onClick={togglePause}
                className={`w-full py-4 font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2
                  ${isRunning ? 'bg-[#CC0000] text-white border-2 border-[#CC0000] hover:bg-[#990000]' : 'bg-black text-white border-2 border-black hover:bg-white hover:text-black'}`}>
                {isRunning ? <><Pause className="w-5 h-5" strokeWidth={2} />Pause</> : <><Play className="w-5 h-5" strokeWidth={2} />Resume</>}
              </button>
              <div className="grid grid-cols-3 gap-3">
                <Btn onClick={() => setMode('setup')} small icon={ChevronLeft}>Home</Btn>
                <Btn onClick={() => setMode('stats')} small icon={BarChart3}>Stats</Btn>
                <Btn onClick={() => triggerReminder()} small icon={Zap}>Now</Btn>
              </div>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // REMINDER — S3 videos with onError fallback
  // ═════════════════════════════════════════════════════════════════════════
  if (mode === 'reminder' && currentStretch) {
    return (
      <Shell>
        <div className="border-4 border-black bg-[#FAFAF7]">
          {/* HEADER — forced black text on red so it's always visible */}
          <div style={{ borderBottom: '4px solid #000', backgroundColor: '#CC0000', padding: '24px', textAlign: 'center' }}>
            <div style={{ ...mono(10, { letterSpacing: '0.3em' }), color: '#000000', marginBottom: 4 }}>⚡ HEALTH ALERT</div>
            <h1 style={{ ...serif, fontSize: 36, fontWeight: 'bold', color: '#000000', margin: 0, lineHeight: 1.1 }}>TIME TO STRETCH</h1>
          </div>

          <div className="p-8 sm:p-10">
            <div className="border-b-2 border-black pb-5 mb-6">
              <h2 className="text-3xl font-bold mb-1" style={serif}>{currentStretch.name}</h2>
              <div className="flex items-center gap-3 flex-wrap">
                <span style={{ ...mono(10), color: '#999' }}>Fig. {currentStretch.id}</span>
                <span className="px-2 py-0.5 border border-black" style={mono(10)}>{AREA_LABELS[currentStretch.area]}</span>
                <span style={{ ...mono(10), color: '#CC0000' }}>{currentStretch.duration}s</span>
              </div>
            </div>

            {/* Video with fallback — key prevents remount on timer tick */}
            <div className="mb-6 border-2 border-black bg-neutral-100 overflow-hidden flex items-center justify-center">
              <StretchVideo key={currentStretch.id} videoUrl={currentStretch.videoUrl} fallbackEmoji={currentStretch.fallbackEmoji} />
            </div>

            <div className="border-2 border-black p-5 mb-6 bg-[#FFF8F0]">
              <p className="text-sm leading-relaxed">{currentStretch.description}</p>
            </div>

            {/* Guided timer — isolated component to prevent screen re-renders */}
            <StretchTimer key={currentStretch.id} duration={currentStretch.duration} />

            {/* Hydration nudge — shown with every stretch reminder */}
            {hydrationEnabled && (
              <div style={{ border: '2px solid #0ea5e9', padding: 16, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f0f9ff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>💧</span>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: 13 }}>Grab some water too!</div>
                    <div style={{ ...mono(10), color: '#0ea5e9' }}>{hydrationCount}/{hydrationGoal} glasses today</div>
                  </div>
                </div>
                <button onClick={logWater}
                  style={{ backgroundColor: '#0ea5e9', color: '#fff', border: '2px solid #0ea5e9', padding: '8px 16px', fontWeight: 'bold', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', transition: 'opacity 0.2s' }}>
                  +1 Glass
                </button>
              </div>
            )}

            <div className="space-y-2">
              <button onClick={completeStretch}
                className="w-full bg-black text-white py-4 font-bold text-sm uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-2">
                <Check className="w-5 h-5" strokeWidth={2} />Complete
              </button>
              <button onClick={skipStretch}
                className="w-full bg-white py-3 hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 border-2 border-neutral-300"
                style={{ ...mono(11), cursor: 'pointer' }}>
                <X className="w-4 h-4" />SKIP THIS TIME
              </button>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // BREATHING
  // ═════════════════════════════════════════════════════════════════════════
  if (mode === 'breathing' && breathingExercise) {
    const ex = breathingExercise;
    const label = ex.labels[breathPhase] || '';
    const isInhale = label.toLowerCase() === 'inhale';
    const isExhale = label.toLowerCase() === 'exhale';
    const phaseColor = isInhale ? ex.color : isExhale ? '#1a1a1a' : '#888';

    return (
      <Shell>
        <div className="border-4 border-black bg-[#FAFAF7] fade-up">
          <div style={{ borderBottom: '4px solid #000', backgroundColor: '#1a1a1a', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ ...mono(10, { letterSpacing: '0.3em' }), color: '#999' }}>{ex.emoji} Breathing</div>
                <div style={{ ...serif, fontSize: 20, fontWeight: 'bold', color: '#ffffff' }}>{ex.name}</div>
              </div>
              <button onClick={stopBreathing} style={{ border: '2px solid rgba(255,255,255,0.3)', background: 'none', color: '#fff', padding: 8, cursor: 'pointer' }}>
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="p-8 sm:p-12 text-center">
            <div className="mb-6 px-3 py-2 bg-neutral-100 border border-neutral-200 inline-block" style={mono(9)}>{ex.context}</div>

            <div className="relative inline-flex items-center justify-center mb-6">
              <div style={{
                width: 224, height: 224, border: `4px solid ${phaseColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 1s ease, border-color 0.5s',
                transform: isInhale ? 'scale(1.1)' : isExhale ? 'scale(0.9)' : 'scale(1)',
              }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 56, fontWeight: 'bold', color: phaseColor }}>{breathSecondsLeft}</div>
                  <div style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 14, color: phaseColor }}>{label}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-1 mb-4">
              {ex.pattern.map((p, i) => p > 0 && (
                <div key={i} style={{ height: 6, transition: 'all 0.3s', width: i === breathPhase ? 32 : 16, backgroundColor: i === breathPhase ? ex.color : '#e5e5e5' }} />
              ))}
            </div>

            <div style={{ ...mono(12), color: '#999', marginBottom: 16 }}>Cycle {breathCycles + 1}</div>

            <div className="border-2 border-black p-5 mb-6 bg-[#FFF8F0] text-left">
              <div style={{ ...mono(10), color: '#CC0000', marginBottom: 4 }}>💡 When to use this</div>
              <p className="text-sm leading-relaxed text-neutral-700">{ex.tip}</p>
            </div>

            <Btn onClick={stopBreathing} icon={Check}>Done</Btn>
          </div>
        </div>
      </Shell>
    );
  }

  return null;
}


