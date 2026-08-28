import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Wrench,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Brain,
  CheckCircle2,
  MapPin,
  BarChart3,
  AlertTriangle,
  Camera,
  ThumbsUp,
  Activity,
  Check,
  Award,
  Clock,
  Star,
  Play,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { loginAsDemo } = useAuth();

  const handleDemoAccess = (role: 'student' | 'admin' | 'maintenance') => {
    if (role === 'admin') {
      onNavigate('/admin/dashboard');
      return;
    }
    loginAsDemo(role);
    if (role === 'student') onNavigate('/student/dashboard');
    if (role === 'maintenance') onNavigate('/maintenance/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors">
      {/* 1. HERO SECTION WITH VIBRANT GRADIENTS & NEXORA BRANDING */}
      <section className="relative pt-14 pb-20 sm:pt-20 sm:pb-28 bg-gradient-to-b from-indigo-50/60 via-blue-50/40 to-slate-50 dark:from-slate-900/80 dark:via-indigo-950/40 dark:to-slate-950 border-b border-indigo-100/80 dark:border-slate-800">
        {/* Decorative background glow circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/15 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-400/15 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* SIH 2026 Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-indigo-200/80 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
              <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Smart India Hackathon 2026 • Problem Statement 306 • Team NEXORA</span>
            </div>

            {/* Main NEXORA Headline */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                  <Layers className="w-7 h-7" />
                </div>
                <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                  NEX<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">ORA</span>
                </h1>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                Centralized Campus Facility Issue Reporting & Resolution Engine
              </h2>
            </div>

            {/* Tagline & Vision */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              "From noticing a problem to proving it's fixed." Engineered by <strong>Team NEXORA</strong> with real-time AI triage, live SLA countdown timers, multi-tier escalation, duplicate suppression, and student 5-star verification ratings.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <button
                onClick={() => {
                  loginAsDemo('student');
                  onNavigate('/student/report');
                }}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-102 flex items-center gap-2"
              >
                <span>Report Issue (&lt; 1 Min)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/admin/dashboard')}
                className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border-2 border-indigo-100 dark:border-slate-700 font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-xs transition-all hover:border-indigo-200"
              >
                Open Admin Console
              </button>
            </div>

            {/* Quick Demo Evaluator Access Box */}
            <div className="pt-2">
              <div className="inline-flex flex-col sm:flex-row items-center gap-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-indigo-100 dark:border-slate-800 rounded-2xl p-2.5 px-4 text-xs text-slate-600 dark:text-slate-300 shadow-xs">
                <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  1-Click Evaluator Roles:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDemoAccess('student')}
                    className="bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-lg font-semibold transition-colors"
                  >
                    Student / Reporter
                  </button>
                  <button
                    onClick={() => handleDemoAccess('admin')}
                    className="bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-3 py-1 rounded-lg font-semibold transition-colors"
                  >
                    Facilities Admin
                  </button>
                  <button
                    onClick={() => handleDemoAccess('maintenance')}
                    className="bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-3 py-1 rounded-lg font-semibold transition-colors"
                  >
                    Maintenance Staff
                  </button>
                </div>
              </div>
            </div>
          </div>


          {/* 2. SIH 2026 7-STAGE PIPELINE WITH COLORFUL CARDS */}
          <div className="mt-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-indigo-100 dark:border-slate-800 max-w-5xl mx-auto shadow-md shadow-indigo-100/50 dark:shadow-none">
            <div className="text-center mb-6">
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                SIH 2026 Lifecycle Pipeline
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                Reported → AI Analysis → Assigned → Accepted → In Progress → Resolved → Feedback
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center">
              {[
                { step: '1', title: 'Reported', sub: 'Photo + GPS', color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800', icon: Camera },
                { step: '2', title: 'AI Analysed', sub: 'Category & SLA', color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800', icon: Brain },
                { step: '3', title: 'Assigned', sub: 'Dept Allocated', color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800', icon: ShieldCheck },
                { step: '4', title: 'Accepted', sub: 'Tech En Route', color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800', icon: Play },
                { step: '5', title: 'In Progress', sub: 'On-Site Fix', color: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800', icon: Wrench },
                { step: '6', title: 'Resolved', sub: 'Proof Uploaded', color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', icon: CheckCircle2 },
                { step: '7', title: 'Feedback', sub: '5★ Rating', color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800', icon: Star },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className={`rounded-xl p-3 text-center space-y-1 border ${item.color}`}
                  >
                    <div className="w-8 h-8 rounded-lg mx-auto flex items-center justify-center bg-white dark:bg-slate-800 shadow-2xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-[10px] font-black opacity-60 uppercase tracking-wider">0{item.step}</div>
                    <h4 className="font-bold text-xs">{item.title}</h4>
                    <p className="text-[10px] opacity-80">{item.sub}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. 10-STEP HACKATHON DEMO WALKTHROUGH FLOW */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Evaluator Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              10-Step Live Demonstration Lifecycle
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              Follow this complete end-to-end flow created by <strong>Team NEXORA</strong> to observe AI triage, SLA countdown, photo proof, and institutional analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {[
              { step: 1, title: 'Student Reports', desc: 'Enter "Water leakage near Block B washroom" with photo & location.', color: 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/40' },
              { step: 2, title: 'AI Classification', desc: 'Auto-detects Category: Plumbing, Priority: High, SLA: 4h, Dept: Plumbing.', color: 'border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/40' },
              { step: 3, title: 'Duplicate Check', desc: 'Matches existing tickets in same area with 1-click "Submit as Supporting Report".', color: 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/40' },
              { step: 4, title: 'Auto-Routing', desc: 'Generates ticket CF-1042 and notifies plumbing maintenance queue.', color: 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40' },
              { step: 5, title: 'Staff Accepts Task', desc: 'Technician opens queue and clicks "Accept Task", setting status to ACCEPTED.', color: 'border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/40' },
              { step: 6, title: 'SLA Countdown', desc: 'Live countdown timer calculates remaining SLA window with auto-escalation.', color: 'border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/40' },
              { step: 7, title: 'In Progress & Fix', desc: 'Technician updates status to IN_PROGRESS while repairing the pipe valve on-site.', color: 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/40' },
              { step: 8, title: 'Upload Proof', desc: 'Technician attaches after-repair photo proof and detailed resolution note.', color: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40' },
              { step: 9, title: 'Student 5★ Rating', desc: 'Student inspects photo proof, verifies fix, and submits 5-star rating & comment.', color: 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/40' },
              { step: 10, title: 'Admin Analytics', desc: 'Admin console updates resolution time, SLA compliance %, and department stats.', color: 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40' },
            ].map(item => (
              <div key={item.step} className={`rounded-xl p-4 space-y-1.5 flex flex-col justify-between border ${item.color}`}>
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded shadow-2xs">
                    Step {item.step}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-2">{item.title}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SIX PILLARS OF NEXORA */}
      <section className="py-16 bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Enterprise Feature Architecture
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              Engineered by <strong>Team NEXORA</strong> specifically for university administrations, facility managers, technicians, and students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: 'AI Classification & Priority',
                desc: 'NLP heuristics and vision models automatically determine defect category, urgency priority score, and target SLA.',
                icon: Brain,
                color: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
              },
              {
                title: 'Duplicate Prevention',
                desc: 'Identifies existing complaints in the same room. Recommends upvoting existing tickets to increase urgency score.',
                icon: ThumbsUp,
                color: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
              },
              {
                title: 'SLA Timers & Escalation',
                desc: 'Real-time countdown timer with automated multi-tier escalation to Department Supervisors and Facility Managers upon SLA breach.',
                icon: Clock,
                color: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
              },
              {
                title: 'Before / After Photo Proof',
                desc: 'Technicians must upload after-repair photographic evidence before marking work resolved.',
                icon: Camera,
                color: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
              },
              {
                title: 'Student 5★ Feedback Loop',
                desc: 'Two-way accountability: complaints are only closed once the student inspects the fix and submits a rating.',
                icon: Star,
                color: 'bg-yellow-50 dark:bg-yellow-950/60 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300'
              },
              {
                title: 'Recurring Hotspots Analytics',
                desc: 'Executive institutional dashboards highlighting campus problem rankings, department compliance, and CSV exports.',
                icon: BarChart3,
                color: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
              }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all space-y-2.5"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${feat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. IOT HARDWARE TELEMETRY GRID */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-indigo-900/60 text-indigo-300 border border-indigo-700/60 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                NEXORA Autonomous Sensor Grid
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                ESP32 Hardware Telemetry
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                NEXORA connects physical ESP32 sensor nodes monitoring pipe liquid conductivity, temperature (DHT22), and illumination (LDR).
              </p>
              <p className="text-slate-400 text-xs leading-relaxed">
                When thresholds trip, an emergency critical ticket (<code className="text-blue-400 font-mono">CF-IOT-xxx</code>) is automatically generated.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/admin/iot')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/30 transition-all flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Open IoT Telemetry Monitor</span>
                </button>
              </div>
            </div>

            {/* IoT Telemetry Box */}
            <div className="bg-slate-950/90 backdrop-blur-md rounded-2xl p-5 border border-indigo-800/40 space-y-3 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  ESP32-CAMPUS-001 (Online)
                </span>
                <span className="text-slate-400 text-[11px]">802.11 b/g/n Telemetry</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-slate-300 font-sans">
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Temperature</p>
                  <p className="text-base font-bold text-white mt-0.5">24.2°C</p>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Humidity</p>
                  <p className="text-base font-bold text-white mt-0.5">58% RH</p>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Water Leak Sensor</p>
                  <p className="text-base font-bold text-emerald-400 mt-0.5">Dry / Nominal</p>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Ambient Light</p>
                  <p className="text-base font-bold text-white mt-0.5">450 lux</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-slate-950 text-white border-t border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-lg text-white">NEXORA</span>
                <p className="text-xs text-indigo-400 font-semibold">SIH 2026 Problem Statement 306 • Team Nexora</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-slate-900 text-indigo-400 border border-slate-800 text-xs font-bold px-3 py-1 rounded-lg">
                Smart India Hackathon 2026
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <p>© 2026 <strong>Team NEXORA</strong>. Centralized Campus Facility Issue Reporting & Tracking System.</p>
            <p>From noticing a problem to proving it's fixed.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

