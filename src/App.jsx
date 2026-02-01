import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Check, Settings, Play, Pause, TrendingUp, Clock, ChevronLeft, Volume2, VolumeX, Bell, Sparkles } from 'lucide-react';

const STRETCHES = [
  { id: 1, name: "Overhead Reach", description: "Stand up, reach both arms overhead, interlace fingers, and stretch upward", duration: 15, videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/Arm_stretch/Arm+stretch.mp4", fallbackEmoji: "🙆" },
  { id: 2, name: "Shoulder Rolls", description: "Stand up, roll shoulders backward 5 times, then forward 5 times", duration: 15, videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/Shoulder_shrugs/video_media_01KG8B226QGMN86GP43EKEJMNH.mp4", fallbackEmoji: "💪" },
  { id: 3, name: "Torso Twist", description: "Stand with feet shoulder-width apart, twist torso left and right alternating", duration: 15, videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/Torso_twist/Torso+twist.mp4", fallbackEmoji: "🔄" },
  { id: 4, name: "Arm Circles", description: "Stand up, extend arms to sides, make small circles forward then backward", duration: 20, videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/video_media_01KG8B226QGMN86GP43EKEJMNH.mp4", fallbackEmoji: "⭕" },
  { id: 5, name: "Side Bend", description: "Stand tall, reach right arm overhead and bend left, then switch sides", duration: 15, videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/Side_bend/side+bend.mp4", fallbackEmoji: "🤸" },
  { id: 6, name: "Neck Rolls", description: "Gently roll head in a circle, 3 times each direction", duration: 15, videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/neck_rolls/Animate_this_manequin_202601312324_s2zxr.mp4", fallbackEmoji: "🔃" },
  { id: 7, name: "Chest Opener", description: "Clasp hands behind back, straighten arms and lift chest", duration: 15, videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/Chest_stretch/Animate_this_mannequin_202601312313_856dw.mp4", fallbackEmoji: "🫸" },
  { id: 8, name: "Hip Circles", description: "Hands on hips, make circles clockwise then counter-clockwise", duration: 15, videoUrl: "https://fitness-app-365.s3.eu-west-1.amazonaws.com/video_media_01KG8B226QGMN86GP43EKEJMNH.mp4", fallbackEmoji: "↩️" }
];

const Btn=({children,onClick,primary,icon:I})=><button onClick={onClick} className={`w-full py-4 font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${primary?'bg-black text-white border-2 border-black hover:bg-white hover:text-black':'border-2 border-black bg-white hover:bg-neutral-100'}`}>{I&&<I className="w-5 h-5" strokeWidth={2}/>}{children}</button>;

export default function App(){
  const [mode,setMode]=useState('setup');
  const [advancedMode,setAdvancedMode]=useState(false);
  const [intervalMinutes,setIntervalMinutes]=useState(45);
  const [isRunning,setIsRunning]=useState(false);
  const [timeLeft,setTimeLeft]=useState(0);
  const [currentStretch,setCurrentStretch]=useState(null);
  const [stretchCount,setStretchCount]=useState(0);
  const [soundVolume,setSoundVolume]=useState(0.5);
  const [soundStyle,setSoundStyle]=useState('chime');
  
  const timerRef=useRef(null);

  useEffect(()=>{
    if(isRunning&&mode==='running'){
      timerRef.current=setInterval(()=>{
        setTimeLeft(prev=>{if(prev<=1){triggerReminder();return intervalMinutes*60;}return prev-1;});
      },1000);
    }else{if(timerRef.current)clearInterval(timerRef.current);}
    return()=>{if(timerRef.current)clearInterval(timerRef.current);};
  },[isRunning,mode,intervalMinutes]);

  const playSound=()=>{
    if(soundStyle==='silent')return;
    const ctx=new(window.AudioContext||window.webkitAudioContext)(),vol=soundVolume;
    if(soundStyle==='chime')[659.25,830.61,987.77].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.frequency.value=f;const t=ctx.currentTime+i*0.15;g.gain.setValueAtTime(vol*0.3,t);g.gain.exponentialRampToValueAtTime(0.01,t+0.6);o.start(t);o.stop(t+0.6);});
  };

  const triggerReminder=()=>{setCurrentStretch(STRETCHES[Math.floor(Math.random()*STRETCHES.length)]);setMode('reminder');playSound();};
  const startApp=()=>{setTimeLeft(intervalMinutes*60);setIsRunning(true);setMode('running');};
  const skipStretch=()=>{setMode('running');setCurrentStretch(null);};
  const completeStretch=()=>{setStretchCount(p=>p+1);skipStretch();};
  const formatTime=(s)=>`${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  const Shell=({children})=>(
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@700;900&family=Lora:wght@400&display=swap');body{background:#F9F9F7;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Cpath fill='%23111' fill-opacity='0.04' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'/%3E%3C/svg%3E")}*{border-radius:0!important}@keyframes scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.ticker-content{animation:scroll 30s linear infinite;display:inline-flex;white-space:nowrap}.ticker-wrapper{flex:1;overflow:hidden;position:relative}`}</style>
      <div className="min-h-screen" style={{fontFamily:'Inter,sans-serif'}}>
        <div className="w-full bg-black text-white border-b-4 border-black py-3 overflow-hidden">
          <div className="flex items-center">
            <div className="bg-[#CC0000] px-6 py-2 font-bold text-xs uppercase tracking-widest flex-shrink-0 mr-4">Breaking News</div>
            <div className="ticker-wrapper">
              <div className="ticker-content">
                <span className="mx-6 text-sm font-mono">★ STUDY: <span className="text-[#CC0000]">73%</span> of remote workers forget to stretch during video calls</span>
                <span className="mx-6 text-sm font-mono">★ BREAKING: Local developer discovers standing desk <span className="text-[#CC0000]">actually requires standing</span></span>
                <span className="mx-6 text-sm font-mono">★ WFH ALERT: Your cat judging you for <span className="text-[#CC0000]">poor posture</span>, experts say</span>
                <span className="mx-6 text-sm font-mono">★ URGENT: Coffee run doesn't count as <span className="text-[#CC0000]">cardio</span>, scientists confirm</span>
                <span className="mx-6 text-sm font-mono">★ EXCLUSIVE: Couch ≠ <span className="text-[#CC0000]">Ergonomic chair</span>, survey finds</span>
                <span className="mx-6 text-sm font-mono">★ REPORT: Pajama pants reduce stretch motivation by <span className="text-[#CC0000]">67%</span></span>
                <span className="mx-6 text-sm font-mono">★ STUDY: <span className="text-[#CC0000]">73%</span> of remote workers forget to stretch during video calls</span>
                <span className="mx-6 text-sm font-mono">★ BREAKING: Local developer discovers standing desk <span className="text-[#CC0000]">actually requires standing</span></span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center p-6">{children}</div>
      </div>
    </>
  );

  if(mode==='setup')return(
    <Shell>
      <div className="w-full max-w-2xl border-4 border-black bg-[#F9F9F7] p-12">
        <div className="text-center border-b-4 border-black pb-8 mb-8">
          <div className="text-xs font-mono tracking-widest uppercase mb-2 text-[#CC0000]">Vol. 1 | Health Edition</div>
          <h1 className="text-7xl font-black leading-[0.9] tracking-tighter mb-4" style={{fontFamily:"'Playfair Display',serif"}}>StretchCheck</h1>
          <p className="text-sm uppercase tracking-widest font-mono">Desktop Wellness Assistant</p>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-3">Interval</label>
            <div className="grid grid-cols-5 gap-px bg-black">
              {[{l:'1m',v:1},{l:'30m',v:30},{l:'45m',v:45},{l:'1h',v:60},{l:'90m',v:90}].map(o=><button key={o.v} onClick={()=>setIntervalMinutes(o.v)} className={`p-4 font-mono font-bold transition ${intervalMinutes===o.v?'bg-black text-white':'bg-white hover:bg-neutral-100'}`}>{o.l}</button>)}
            </div>
          </div>
          <div className="border-2 border-black p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="border-2 border-black p-3"><Camera className="w-6 h-6" strokeWidth={1.5}/></div>
                <div><div className="font-bold" style={{fontFamily:"'Playfair Display',serif"}}>Camera Verification</div><div className="text-xs font-mono uppercase text-[#CC0000]">{advancedMode?'Active':'Off'}</div></div>
              </div>
              <button onClick={()=>setAdvancedMode(!advancedMode)} className={`w-14 h-7 border-2 border-black relative ${advancedMode?'bg-black':'bg-white'}`}><div className={`absolute top-0.5 left-0.5 w-5 h-5 border border-black transition ${advancedMode?'translate-x-7 bg-white':'bg-black'}`}/></button>
            </div>
          </div>
          <Btn onClick={startApp} primary icon={Play}>Start Session</Btn>
          <Btn onClick={()=>setMode('settings')} icon={Settings}>Sound Config</Btn>
        </div>
        <div className="text-center mt-8 pt-6 border-t border-black"><p className="text-xs font-mono text-neutral-500">Ed. 1.0 | <span className="text-[#CC0000]">{new Date().toLocaleDateString()}</span></p></div>

        <div className="mt-12 pt-8 border-t-4 border-black">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2" style={{fontFamily:"'Playfair Display',serif"}}>Health & Wellness Gazette</h2>
            <p className="text-xs font-mono uppercase tracking-widest text-[#CC0000]">Featured Articles</p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-black border-2 border-black">
            <div className="bg-white p-6">
              <div className="text-xs font-mono uppercase tracking-wide text-[#CC0000] mb-2">Workplace Health</div>
              <h3 className="text-xl font-bold mb-3 leading-tight" style={{fontFamily:"'Playfair Display',serif"}}>The Silent Epidemic of Desk Jobs</h3>
              <p className="text-sm leading-relaxed mb-3" style={{fontFamily:"'Lora',serif"}}>Studies show that prolonged sitting increases risk of cardiovascular disease by <span className="text-[#CC0000] font-semibold">147%</span>. Regular movement breaks every <span className="text-[#CC0000] font-semibold">30-45 minutes</span> can dramatically reduce these risks.</p>
              <div className="text-xs font-mono text-neutral-500">— Medical Journal, <span className="text-[#CC0000]">2024</span></div>
            </div>
            <div className="bg-white p-6">
              <div className="text-xs font-mono uppercase tracking-wide text-[#CC0000] mb-2">Ergonomics</div>
              <h3 className="text-xl font-bold mb-3 leading-tight" style={{fontFamily:"'Playfair Display',serif"}}>Why Your Posture Matters</h3>
              <p className="text-sm leading-relaxed mb-3" style={{fontFamily:"'Lora',serif"}}>Poor posture while working from home leads to chronic neck and back pain in <span className="text-[#CC0000] font-semibold">80%</span> of remote workers. Simple stretches can prevent long-term damage.</p>
              <div className="text-xs font-mono text-neutral-500">— Ergonomics <span className="text-[#CC0000]">Today</span></div>
            </div>
            <div className="bg-white p-6 border-t-2 border-black">
              <div className="text-xs font-mono uppercase tracking-wide text-[#CC0000] mb-2">Movement Science</div>
              <h3 className="text-xl font-bold mb-3 leading-tight" style={{fontFamily:"'Playfair Display',serif"}}>15 Seconds to Better Health</h3>
              <p className="text-sm leading-relaxed mb-3" style={{fontFamily:"'Lora',serif"}}>Research confirms that micro-breaks as short as <span className="text-[#CC0000] font-semibold">15 seconds</span> can reset muscle tension and improve circulation. Consistency matters more than duration.</p>
              <div className="text-xs font-mono text-neutral-500">— Sports Medicine <span className="text-[#CC0000]">Review</span></div>
            </div>
            <div className="bg-white p-6 border-t-2 border-black">
              <div className="text-xs font-mono uppercase tracking-wide text-[#CC0000] mb-2">Remote Work</div>
              <h3 className="text-xl font-bold mb-3 leading-tight" style={{fontFamily:"'Playfair Display',serif"}}>The WFH Revolution's Hidden Cost</h3>
              <p className="text-sm leading-relaxed mb-3" style={{fontFamily:"'Lora',serif"}}>Remote workers report <span className="text-[#CC0000] font-semibold">54% increase</span> in sedentary behavior. Experts recommend structured movement routines to combat the "desk anchor" effect.</p>
              <div className="text-xs font-mono text-neutral-500">— Remote Work <span className="text-[#CC0000]">Weekly</span></div>
            </div>
          </div>
          <div className="mt-6 border-2 border-black bg-neutral-50 p-8">
            <div className="text-center mb-4">
              <div className="text-xs font-mono uppercase tracking-widest text-[#CC0000] mb-2">Editor's Note</div>
              <h3 className="text-2xl font-bold" style={{fontFamily:"'Playfair Display',serif"}}>Motion is Medicine</h3>
            </div>
            <p className="text-base leading-relaxed text-center max-w-2xl mx-auto" style={{fontFamily:"'Lora',serif"}}>
              In an era where knowledge work chains us to our desks, the simple act of standing and stretching becomes revolutionary. StretchCheck isn't just an app—it's a movement against the sedentary crisis plaguing modern workers.
            </p>
            <div className="text-center mt-6 pt-4 border-t border-neutral-300">
              <div className="text-xs font-mono text-neutral-500">★ ★ ★</div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );

  if(mode==='settings')return(
    <Shell>
      <div className="w-full max-w-2xl border-4 border-black bg-[#F9F9F7] p-12">
        <div className="flex items-center gap-4 border-b-4 border-black pb-6 mb-8">
          <button onClick={()=>setMode('setup')} className="border-2 border-black p-2 hover:bg-black hover:text-white transition"><ChevronLeft className="w-6 h-6" strokeWidth={2}/></button>
          <div><div className="text-xs font-mono tracking-widest uppercase text-[#CC0000]">Config</div><h1 className="text-4xl font-black" style={{fontFamily:"'Playfair Display',serif"}}>Settings</h1></div>
        </div>
        <div className="space-y-8">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-3">Sound Style</label>
            <div className="grid grid-cols-2 gap-px bg-black">
              {[{s:'chime',i:Bell,l:'Chime'},{s:'bell',i:Bell,l:'Bell'},{s:'gentle',i:Sparkles,l:'Gentle'},{s:'silent',i:VolumeX,l:'Silent'}].map(({s,i:I,l})=><button key={s} onClick={()=>{setSoundStyle(s);setTimeout(playSound,100);}} className={`p-5 transition flex items-center justify-center gap-3 ${soundStyle===s?'bg-black text-white':'bg-white hover:bg-neutral-100'}`}><I className="w-5 h-5" strokeWidth={1.5}/><span className="font-mono font-bold text-sm">{l}</span></button>)}
            </div>
          </div>
          {soundStyle!=='silent'&&(
            <div>
              <div className="flex justify-between mb-3"><label className="text-xs font-mono uppercase tracking-widest">Volume</label><span className="font-mono font-bold text-[#CC0000]">{Math.round(soundVolume*100)}%</span></div>
              <div className="flex items-center gap-4">
                <VolumeX className="w-5 h-5" strokeWidth={1.5}/>
                <input type="range" min="0" max="1" step="0.1" value={soundVolume} onChange={e=>setSoundVolume(parseFloat(e.target.value))} className="flex-1 h-2 bg-neutral-200 border border-black"/>
                <Volume2 className="w-5 h-5" strokeWidth={1.5}/>
              </div>
            </div>
          )}
        </div>
        <div className="mt-8"><Btn onClick={()=>setMode('setup')} primary>Save</Btn></div>
      </div>
    </Shell>
  );

  if(mode==='running'){
    const prog=((intervalMinutes*60-timeLeft)/(intervalMinutes*60))*100;
    return(
      <Shell>
        <div className="w-full max-w-2xl border-4 border-black bg-[#F9F9F7]">
          <div className="border-b-4 border-black bg-black text-white p-6 text-center">
            <div className="text-xs font-mono tracking-widest uppercase mb-2 text-[#CC0000]">Active</div>
            <div className="text-2xl font-black" style={{fontFamily:"'Playfair Display',serif"}}>NEXT STRETCH</div>
          </div>
          <div className="p-12">
            <div className="text-center mb-8">
              <div className="text-8xl font-black font-mono tracking-tighter leading-none mb-4">{formatTime(timeLeft)}</div>
              <div className="h-8 border-2 border-black overflow-hidden relative"><div className="absolute inset-0 bg-black transition-all duration-1000" style={{width:`${prog}%`}}/></div>
            </div>
            <div className="border-2 border-black p-6 mb-8 flex items-center justify-between">
              <div><div className="text-xs font-mono uppercase text-[#CC0000]">Today</div><div className="text-6xl font-black font-mono">{stretchCount}</div></div>
              <div className="border-2 border-black p-4"><TrendingUp className="w-12 h-12" strokeWidth={1.5}/></div>
            </div>
            <div className="space-y-3">
              <button onClick={()=>setIsRunning(!isRunning)} className={`w-full py-4 font-bold text-sm uppercase tracking-widest transition flex items-center justify-center gap-2 ${isRunning?'bg-[#CC0000] text-white border-2 border-[#CC0000]':'bg-black text-white border-2 border-black hover:bg-white hover:text-black'}`}>
                {isRunning?<><Pause className="w-5 h-5" strokeWidth={2}/>Pause</>:<><Play className="w-5 h-5" strokeWidth={2}/>Resume</>}
              </button>
              <Btn onClick={()=>setMode('setup')} icon={Settings}>Setup</Btn>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  if(mode==='reminder')return(
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@700;900&family=Lora:wght@400&display=swap');body{background:#F9F9F7;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Cpath fill='%23111' fill-opacity='0.04' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'/%3E%3C/svg%3E")}*{border-radius:0!important}@keyframes scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.ticker-content{animation:scroll 30s linear infinite;display:inline-flex;white-space:nowrap}.ticker-wrapper{flex:1;overflow:hidden;position:relative}`}</style>
      <div className="min-h-screen" style={{fontFamily:'Inter,sans-serif'}}>
        <div className="w-full bg-black text-white border-b-4 border-black py-3 overflow-hidden">
          <div className="flex items-center">
            <div className="bg-[#CC0000] px-6 py-2 font-bold text-xs uppercase tracking-widest flex-shrink-0 mr-4">Breaking News</div>
            <div className="ticker-wrapper">
              <div className="ticker-content">
                <span className="mx-6 text-sm font-mono">★ STUDY: <span className="text-[#CC0000]">73%</span> of remote workers forget to stretch during video calls</span>
                <span className="mx-6 text-sm font-mono">★ BREAKING: Local developer discovers standing desk <span className="text-[#CC0000]">actually requires standing</span></span>
                <span className="mx-6 text-sm font-mono">★ WFH ALERT: Your cat judging you for <span className="text-[#CC0000]">poor posture</span>, experts say</span>
                <span className="mx-6 text-sm font-mono">★ URGENT: Coffee run doesn't count as <span className="text-[#CC0000]">cardio</span>, scientists confirm</span>
                <span className="mx-6 text-sm font-mono">★ EXCLUSIVE: Couch ≠ <span className="text-[#CC0000]">Ergonomic chair</span>, survey finds</span>
                <span className="mx-6 text-sm font-mono">★ REPORT: Pajama pants reduce stretch motivation by <span className="text-[#CC0000]">67%</span></span>
                <span className="mx-6 text-sm font-mono">★ STUDY: <span className="text-[#CC0000]">73%</span> of remote workers forget to stretch during video calls</span>
                <span className="mx-6 text-sm font-mono">★ BREAKING: Local developer discovers standing desk <span className="text-[#CC0000]">actually requires standing</span></span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-3xl border-4 border-black bg-[#F9F9F7]">
            <div className="border-b-4 border-black bg-[#CC0000] text-white p-6 text-center">
              <div className="text-xs font-mono tracking-widest uppercase mb-2 text-white">Health Alert</div>
              <h1 className="text-5xl font-black leading-tight text-white" style={{fontFamily:"'Playfair Display',serif"}}>TIME TO STRETCH</h1>
            </div>
            <div className="p-12">
              <div className="border-b-2 border-black pb-6 mb-6">
                <h2 className="text-4xl font-bold mb-3" style={{fontFamily:"'Playfair Display',serif"}}>{currentStretch.name}</h2>
                <div className="text-xs font-mono uppercase text-neutral-600">Fig. {currentStretch.id} • <span className="text-[#CC0000]">{currentStretch.duration}s</span></div>
              </div>
              <div className="mb-6 border-2 border-black grayscale flex items-center justify-center p-20 bg-neutral-200"><div className="text-9xl">{currentStretch.fallbackEmoji}</div></div>
              <div className="border-2 border-black p-6 mb-8"><p className="text-base leading-relaxed" style={{fontFamily:"'Lora',serif"}}>{currentStretch.description}</p></div>
              <div className="grid grid-cols-2 gap-px bg-black">
                <button onClick={completeStretch} className="bg-black text-white py-4 font-bold text-sm uppercase tracking-widest hover:bg-neutral-900 transition flex items-center justify-center gap-2 col-span-2"><Check className="w-5 h-5" strokeWidth={2}/>Complete</button>
                <button onClick={skipStretch} className="bg-white py-3 font-mono text-xs uppercase tracking-widest hover:bg-neutral-100 transition flex items-center justify-center gap-2 col-span-2 border-t-2 border-black"><X className="w-4 h-4"/>Skip</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return null;
}
