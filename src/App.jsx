import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Check, Settings, Play, Pause, Clock, TrendingUp, Sparkles, Volume2, VolumeX, Bell, ChevronLeft } from 'lucide-react';

const STRETCHES = [
  { id: 1, name: "Overhead Reach", description: "Stand up, reach both arms overhead, interlace fingers, and stretch upward", duration: 15, videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/video_media_01KG8B226QGMN86GP43EKEJMNH.mp4", fallbackEmoji: "🙆" },
  { id: 2, name: "Shoulder Rolls", description: "Stand up, roll shoulders backward 5 times, then forward 5 times", duration: 15, videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/video_media_01KG8B226QGMN86GP43EKEJMNH.mp4", fallbackEmoji: "💪" },
  { id: 3, name: "Torso Twist", description: "Stand with feet shoulder-width apart, twist torso left and right alternating", duration: 15, videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/video_media_01KG8B226QGMN86GP43EKEJMNH.mp4", fallbackEmoji: "🔄" },
  { id: 4, name: "Arm Circles", description: "Stand up, extend arms to sides, make small circles forward then backward", duration: 20, videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/video_media_01KG8B226QGMN86GP43EKEJMNH.mp4", fallbackEmoji: "⭕" },
  { id: 5, name: "Side Bend", description: "Stand tall, reach right arm overhead and bend left, then switch sides", duration: 15, videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/video_media_01KG8B226QGMN86GP43EKEJMNH.mp4", fallbackEmoji: "🤸" },
  { id: 6, name: "Neck Rolls", description: "Gently roll head in a circle, 3 times each direction", duration: 15, videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/video_media_01KG8B226QGMN86GP43EKEJMNH.mp4", fallbackEmoji: "🔃" },
  { id: 7, name: "Chest Opener", description: "Clasp hands behind back, straighten arms and lift chest", duration: 15, videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/video_media_01KG8B226QGMN86GP43EKEJMNH.mp4", fallbackEmoji: "🫸" },
  { id: 8, name: "Hip Circles", description: "Hands on hips, make circles clockwise then counter-clockwise", duration: 15, videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/video_media_01KG8B226QGMN86GP43EKEJMNH.mp4", fallbackEmoji: "↩️" }
];

export default function StretchCheckApp() {
  const [mode, setMode] = useState('setup');
  const [advancedMode, setAdvancedMode] = useState(false);
  const [intervalMinutes, setIntervalMinutes] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentStretch, setCurrentStretch] = useState(null);
  const [stretchCount, setStretchCount] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [motionDetected, setMotionDetected] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.5);
  const [soundStyle, setSoundStyle] = useState('chime');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const motionIntervalRef = useRef(null);
  const previousFrameRef = useRef(null);

  useEffect(() => {
    if (isRunning && mode === 'running') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            triggerStretchReminder();
            return intervalMinutes * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, mode, intervalMinutes]);

  const playNotificationSound = () => {
    if (soundStyle === 'silent') return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const vol = soundVolume;
    
    if (soundStyle === 'chime') {
      [659.25, 830.61, 987.77].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const startTime = ctx.currentTime + i * 0.15;
        gain.gain.setValueAtTime(vol * 0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6);
        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });
    } else if (soundStyle === 'bell') {
      [1, 2, 3, 4].forEach(h => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 523.25 * h;
        gain.gain.setValueAtTime(vol * (0.4 / h), ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        osc.start();
        osc.stop(ctx.currentTime + 1.5);
      });
    } else if (soundStyle === 'gentle') {
      [880, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + i * 0.1;
        gain.gain.setValueAtTime(vol * 0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    }
  };

  const triggerStretchReminder = () => {
    setCurrentStretch(STRETCHES[Math.floor(Math.random() * STRETCHES.length)]);
    setMode('reminder');
    playNotificationSound();
  };

  const startApp = () => {
    setTimeLeft(intervalMinutes * 60);
    setIsRunning(true);
    setMode('running');
  };

  const skipStretch = () => {
    setMode('running');
    setCurrentStretch(null);
    setVideoError(false);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
  };

  const completeStretch = () => {
    setStretchCount(prev => prev + 1);
    skipStretch();
  };

  const startCamera = async () => {
    try {
      setVerificationStatus('Starting camera...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setShowCamera(true);
        setVerificationStatus('Stand up and move your arms!');
        startMotionDetection();
      }
    } catch (err) {
      setVerificationStatus('Camera access denied. Using easy mode instead.');
      setTimeout(() => {
        setAdvancedMode(false);
        setMode('reminder');
      }, 2000);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (motionIntervalRef.current) {
      clearInterval(motionIntervalRef.current);
    }
    previousFrameRef.current = null;
    setMotionDetected(false);
  };

  const startMotionDetection = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    let motionFrames = 0;
    
    motionIntervalRef.current = setInterval(() => {
      if (!video || video.readyState !== 4) return;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      if (previousFrameRef.current) {
        let diffCount = 0;
        const threshold = 30;
        const pixelStep = 4;
        
        for (let i = 0; i < currentFrame.data.length; i += pixelStep * 4) {
          const diff = Math.abs(currentFrame.data[i] - previousFrameRef.current.data[i]) +
                       Math.abs(currentFrame.data[i + 1] - previousFrameRef.current.data[i + 1]) +
                       Math.abs(currentFrame.data[i + 2] - previousFrameRef.current.data[i + 2]);
          
          if (diff > threshold) diffCount++;
        }
        
        if (diffCount > (canvas.width * canvas.height / pixelStep) * 0.05) {
          motionFrames++;
          
          if (motionFrames >= 3) {
            setMotionDetected(true);
            setVerificationStatus('Perfect! Motion detected ✓');
            setTimeout(() => {
              completeStretch();
            }, 1500);
            if (motionIntervalRef.current) {
              clearInterval(motionIntervalRef.current);
            }
          }
        } else {
          motionFrames = 0;
        }
      }
      
      previousFrameRef.current = currentFrame;
    }, 200);
  };

  const verifyStretch = () => {
    setMode('verifying');
    startCamera();
  };

  const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  if (mode === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-4"><span className="text-5xl">🧘</span></div>
            <h1 className="text-4xl font-bold text-white mb-2">StretchCheck</h1>
            <p className="text-white/80 text-lg">Stay healthy while working from home</p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-3">Reminder Interval</label>
              <select value={intervalMinutes} onChange={(e) => setIntervalMinutes(Number(e.target.value))} className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none">
                <option value={1} className="bg-gray-800">1 minute (testing)</option>
                <option value={30} className="bg-gray-800">30 minutes</option>
                <option value={45} className="bg-gray-800">45 minutes</option>
                <option value={60} className="bg-gray-800">1 hour</option>
              </select>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center"><Camera className="w-5 h-5 mr-3 text-white"/><span className="font-semibold text-white">Advanced Mode</span></div>
                <button onClick={() => setAdvancedMode(!advancedMode)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${advancedMode ? 'bg-green-400':'bg-white/30'}`}>
                  <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${advancedMode ? 'translate-x-6':'translate-x-1'}`}/>
                </button>
              </div>
              <p className="text-sm text-white/70">{advancedMode ? "Camera verifies you stretched" : "Trust-based completion"}</p>
            </div>
            <button onClick={startApp} className="w-full bg-white text-indigo-600 py-4 rounded-xl font-bold text-lg hover:bg-white/90 transition flex items-center justify-center shadow-lg"><Play className="w-6 h-6 mr-2"/>Start</button>
            <button onClick={() => setMode('settings')} className="w-full bg-white/10 border border-white/30 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition flex items-center justify-center"><Settings className="w-5 h-5 mr-2"/>Sound Settings</button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'settings') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
          <div className="flex items-center mb-8">
            <button onClick={() => setMode('setup')} className="mr-4 p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-6 h-6"/></button>
            <div><h2 className="text-3xl font-bold text-gray-900">Settings</h2><p className="text-gray-600">Customize sounds</p></div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Notification Sound</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { style: 'chime', icon: Bell, label: 'Chime', desc: '3-note' },
                  { style: 'bell', icon: Bell, label: 'Bell', desc: 'Rich tone' },
                  { style: 'gentle', icon: Sparkles, label: 'Gentle', desc: 'Soft ping' },
                  { style: 'silent', icon: VolumeX, label: 'Silent', desc: 'No sound' }
                ].map(({ style, icon: Icon, label, desc }) => (
                  <button key={style} onClick={() => { setSoundStyle(style); setTimeout(playNotificationSound, 100); }} className={`p-4 rounded-xl border-2 transition ${soundStyle === style ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${soundStyle === style ? 'text-indigo-600':'text-gray-400'}`}/>
                    <div className={`text-sm font-medium ${soundStyle === style ? 'text-indigo-600':'text-gray-600'}`}>{label}</div>
                    <div className="text-xs text-gray-500 mt-1">{desc}</div>
                  </button>
                ))}
              </div>
            </div>
            {soundStyle !== 'silent' && (
              <div>
                <div className="flex items-center justify-between mb-3"><label className="text-sm font-semibold text-gray-700">Volume</label><span className="text-sm text-gray-600">{Math.round(soundVolume*100)}%</span></div>
                <div className="flex items-center space-x-3">
                  <VolumeX className="w-5 h-5 text-gray-400"/>
                  <input type="range" min="0" max="1" step="0.1" value={soundVolume} onChange={(e) => setSoundVolume(parseFloat(e.target.value))} className="flex-1 h-2 bg-gray-200 rounded-lg accent-indigo-600 cursor-pointer"/>
                  <Volume2 className="w-5 h-5 text-gray-600"/>
                </div>
                <button onClick={playNotificationSound} className="mt-3 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">Test Sound</button>
              </div>
            )}
          </div>
          <button onClick={() => setMode('setup')} className="mt-8 w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg">Save & Continue</button>
        </div>
      </div>
    );
  }

  if (mode === 'running') {
    const progress = ((intervalMinutes * 60 - timeLeft) / (intervalMinutes * 60)) * 100;
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4"><Sparkles className="w-8 h-8 text-emerald-600"/></div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Active</h2>
            <p className="text-gray-600">Next stretch in</p>
          </div>
          <div className="text-center mb-10">
            <div className="text-7xl font-bold text-gray-900 mb-4">{formatTime(timeLeft)}</div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 transition-all duration-1000" style={{width:`${progress}%`}}></div></div>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between"><div><p className="text-sm text-gray-600 mb-1">Stretches Today</p><p className="text-4xl font-bold text-gray-900">{stretchCount}</p></div><TrendingUp className="w-12 h-12 text-emerald-500"/></div>
          </div>
          <div className="space-y-3">
            <button onClick={isRunning ? () => setIsRunning(false) : () => setIsRunning(true)} className={`w-full py-4 rounded-xl font-semibold text-white transition flex items-center justify-center shadow-lg ${isRunning?'bg-gradient-to-r from-orange-400 to-red-500':'bg-gradient-to-r from-emerald-400 to-cyan-500'}`}>
              {isRunning ? <><Pause className="w-5 h-5 mr-2"/>Pause</> : <><Play className="w-5 h-5 mr-2"/>Resume</>}
            </button>
            <button onClick={() => setMode('setup')} className="w-full py-4 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center justify-center"><Settings className="w-5 h-5 mr-2"/>Settings</button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'reminder') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Time to Stretch! 🎯</h2>
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">{currentStretch.name}</h3>
          </div>
          <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-inner" style={{minHeight:'320px'}}>
            {currentStretch.videoUrl ? (
              <video 
                key={currentStretch.id}
                src={currentStretch.videoUrl}
                autoPlay 
                loop 
                muted 
                playsInline
                controls
                onError={() => setVideoError(true)}
                className="w-full h-auto max-h-96 object-contain rounded-xl bg-black"
              />
            ) : (
              <div className="text-center p-8"><div className="text-9xl mb-4">{currentStretch.fallbackEmoji}</div></div>
            )}
          </div>
          <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-2xl p-6 mb-8">
            <p className="text-gray-700 text-center text-lg leading-relaxed mb-4">{currentStretch.description}</p>
            <div className="flex items-center justify-center"><Clock className="w-5 h-5 text-violet-600 mr-2"/><span className="text-2xl font-bold text-violet-600">{currentStretch.duration}s</span></div>
          </div>
          <div className="space-y-3">
            {advancedMode ? (
              <button onClick={verifyStretch} className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white py-4 rounded-xl font-bold text-lg hover:from-violet-600 hover:to-fuchsia-600 transition flex items-center justify-center shadow-lg"><Camera className="w-6 h-6 mr-2"/>Verify with Camera</button>
            ) : (
              <button onClick={completeStretch} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition flex items-center justify-center shadow-lg"><Check className="w-6 h-6 mr-2"/>Completed!</button>
            )}
            <button onClick={skipStretch} className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition flex items-center justify-center"><X className="w-5 h-5 mr-2"/>Skip</button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'verifying') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-3xl w-full">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Verification Mode</h2>
            <p className="text-gray-600 text-lg">{verificationStatus}</p>
          </div>
          {showCamera && (
            <div className="relative mb-8 rounded-2xl overflow-hidden bg-black shadow-2xl">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto"/>
              {motionDetected && (
                <div className="absolute top-6 right-6 bg-emerald-500 text-white px-6 py-3 rounded-full font-bold flex items-center shadow-lg animate-pulse"><Check className="w-6 h-6 mr-2"/>Motion Detected!</div>
              )}
              <div className="absolute inset-0 border-4 border-blue-500/50 rounded-2xl pointer-events-none"><div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div></div>
            </div>
          )}
          <canvas ref={canvasRef} width={160} height={120} className="hidden"/>
          <div className="space-y-4">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 text-blue-900">
              <div className="flex items-start"><div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">ℹ</div><div><p className="font-semibold mb-1">Privacy First</p><p className="text-sm text-blue-800">Video is processed locally in your browser. Nothing is recorded or sent anywhere.</p></div></div>
            </div>
            <button onClick={skipStretch} className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition">Cancel Verification</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}