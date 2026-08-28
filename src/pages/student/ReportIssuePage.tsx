import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IssueCategory, IssuePriority, AIAnalysisResult, Issue } from '../../types';
import { CAMPUS_BUILDINGS } from '../../data/seedData';
import { createIssue, toggleSupportIssue } from '../../services/storageService';
import { analyzeIssue } from '../../services/aiService';
import { AIAnalysisCard } from '../../components/ai/AIAnalysisCard';
import { DuplicateAlertModal } from '../../components/ai/DuplicateAlertModal';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SLATimerBadge } from '../../components/common/SLATimerBadge';
import { Modal } from '../../components/common/Modal';
import confetti from 'canvas-confetti';
import {
  Camera,
  Upload,
  MapPin,
  Compass,
  CheckCircle2,
  ArrowRight,
  Image as ImageIcon,
  Hash,
  Clock,
  Building,
  Plus,
  Search,
  Sparkles,
  Layers,
  FileEdit,
  Check,
  Wrench,
  HelpCircle
} from 'lucide-react';

interface ReportIssuePageProps {
  onNavigate: (route: string) => void;
  onSelectIssue: (issueId: string) => void;
}

export interface PresetScenario {
  name: string;
  url: string;
  desc: string;
  category?: IssueCategory;
  building?: string;
  room?: string;
}

const SAMPLE_PRESET_IMAGES: PresetScenario[] = [
  {
    name: 'Water Leakage',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    desc: 'Water is leaking continuously near Block B washroom.',
    category: 'Plumbing',
    building: CAMPUS_BUILDINGS[1],
    room: 'Ground Floor Washroom'
  },
  {
    name: 'Broken Ceiling Fan',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
    desc: 'Ceiling fan is wobbling vigorously and making a loud screeching noise.',
    category: 'Electrical',
    building: CAMPUS_BUILDINGS[0],
    room: 'Lecture Hall 102'
  },
  {
    name: 'Broken Chair',
    url: 'data:image/jpeg;base64,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',
    desc: 'Lecture hall chair armrest bracket is snapped with sharp exposed metal edge.',
    category: 'Furniture',
    building: CAMPUS_BUILDINGS[0],
    room: 'Room 204'
  },
  {
    name: 'Sparking Socket',
    url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&auto=format&fit=crop&q=80',
    desc: 'Wall electrical socket sparking with exposed live copper pins.',
    category: 'Electrical',
    building: CAMPUS_BUILDINGS[2],
    room: 'Lab 105'
  }
];

const EXTENDED_SCENARIO_CATALOG: PresetScenario[] = [
  {
    name: 'AC Leakage & Cooling Loss',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    desc: 'Split AC in Lab 301 is blowing warm air and dripping condensation water onto computer desks.',
    category: 'HVAC/Air Conditioning',
    building: 'Block C — Technology Tower',
    room: 'Lab 301 (AI & Robotics)'
  },
  {
    name: 'Projector AV Glitch & Blink',
    url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80',
    desc: 'Overhead digital projector has severe green tint distortion and blinks repeatedly every few minutes.',
    category: 'Classroom Equipment',
    building: 'Auditorium & Seminar Halls',
    room: 'Seminar Hall A'
  },
  {
    name: 'Door Lock Jammed',
    url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
    desc: 'Room 105 main door latch is completely jammed shut and students are unable to lock or secure the room.',
    category: 'Infrastructure',
    building: 'Block A — Academic Complex',
    room: 'Room 105 (Faculty Room)'
  },
  {
    name: 'Elevator Jerking & Stalling',
    url: 'https://images.unsplash.com/photo-1574873215043-44119461cb3b?w=600&auto=format&fit=crop&q=80',
    desc: 'Central passenger elevator is shuddering heavily between 2nd and 3rd floor with emergency alarm chime sounding.',
    category: 'Infrastructure',
    building: 'Block C — Technology Tower',
    room: 'Central Elevator Bay #2'
  },
  {
    name: 'Library Wi-Fi AP Offline',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    desc: 'Ceiling Wi-Fi Access Point LED is blinking red; all students in 2nd floor reading hall are offline.',
    category: 'Wi-Fi/Network',
    building: 'Central Library',
    room: '2nd Floor Digital Reading Hall'
  },
  {
    name: 'Washroom Sanitation & Bin Overflow',
    url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80',
    desc: 'Washroom dustbins overflowing, soap dispensers empty, and floor drain backed up with foul odor.',
    category: 'Cleaning',
    building: 'Block A — Academic Complex',
    room: '1st Floor Restroom'
  },
  {
    name: 'Chemistry Lab Faucet Broken',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    desc: 'Lab sink high-pressure faucet valve broke off; water spraying violently onto bench electrical sockets.',
    category: 'Plumbing',
    building: 'Block B — Science & Engineering Block',
    room: 'Chemistry Lab 202'
  },
  {
    name: 'Cracked Window Glass Hazard',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    desc: 'Ground floor cafeteria window glass pane has severe spiderweb cracks and loose shards posing safety risk.',
    category: 'Safety',
    building: 'Student Center & Canteen',
    room: 'Main Dining Hall - East Wing'
  },
  {
    name: 'Flickering Corridor Tube Lights',
    url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80',
    desc: 'Corridor LED panel light fixture is flickering rapidly with loud buzzing ballast noise.',
    category: 'Electrical',
    building: 'Hostel Block 1 (Men)',
    room: '3rd Floor Corridor'
  },
  {
    name: 'Computer Lab Workstation Fault',
    url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
    desc: 'Workstation 12 PC power supply emits burning plastic odor and fails to boot when powered on.',
    category: 'Classroom Equipment',
    building: 'Block B — Science & Engineering Block',
    room: 'Computer Lab 1'
  }
];

const ALL_SCENARIOS = [...SAMPLE_PRESET_IMAGES, ...EXTENDED_SCENARIO_CATALOG];

const QUICK_IMAGE_PRESETS = [
  { label: 'Water / Plumbing', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80' },
  { label: 'Electrical / Fan', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80' },
  { label: 'Wiring / Socket', url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&auto=format&fit=crop&q=80' },
  { label: 'AC / HVAC', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80' },
  { label: 'AV / Projector', url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80' },
  { label: 'Door / Lock', url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80' },
  { label: 'Network / Wi-Fi', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80' },
  { label: 'Sanitation', url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80' }
];

export const ReportIssuePage: React.FC<ReportIssuePageProps> = ({ onNavigate, onSelectIssue }) => {
  const { currentUser } = useAuth();

  // Form State
  const [imagePreview, setImagePreview] = useState<string>(SAMPLE_PRESET_IMAGES[0].url);
  const [description, setDescription] = useState<string>('Water is leaking continuously near Block B washroom.');
  const [category, setCategory] = useState<IssueCategory>('Plumbing');
  const [priority, setPriority] = useState<IssuePriority>('High');
  const [building, setBuilding] = useState<string>(CAMPUS_BUILDINGS[1]); // Block B
  const [room, setRoom] = useState<string>('Ground Floor Washroom');
  const [latitude, setLatitude] = useState<number>(12.9716);
  const [longitude, setLongitude] = useState<number>(77.5946);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationCaptured, setLocationCaptured] = useState<boolean>(false);

  // AI State
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiApplied, setAiApplied] = useState<boolean>(false);

  // Duplicate Modal State
  const [duplicateModalOpen, setDuplicateModalOpen] = useState<boolean>(false);

  // Scenario Catalogue / Custom Issue Modal State
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState<boolean>(false);
  const [activeModalTab, setActiveModalTab] = useState<'catalog' | 'custom'>('catalog');
  const [scenarioSearch, setScenarioSearch] = useState<string>('');
  const [scenarioCategoryFilter, setScenarioCategoryFilter] = useState<string>('ALL');

  // Custom Scenario Form State
  const [customIssueTitle, setCustomIssueTitle] = useState<string>('');
  const [customIssueDesc, setCustomIssueDesc] = useState<string>('');
  const [customIssueCategory, setCustomIssueCategory] = useState<IssueCategory>('Electrical');
  const [customIssueBuilding, setCustomIssueBuilding] = useState<string>(CAMPUS_BUILDINGS[0]);
  const [customIssueRoom, setCustomIssueRoom] = useState<string>('Room 101');
  const [customIssueImage, setCustomIssueImage] = useState<string>(QUICK_IMAGE_PRESETS[0].url);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedIssue, setSubmittedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    if (description.trim().length > 5) {
      const timer = setTimeout(() => {
        runAIAnalysis();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [description, building, room]);

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeIssue(description, imagePreview, category, building, room);
      setAiAnalysis(result);
      setAiApplied(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyAISuggestions = () => {
    if (!aiAnalysis) return;
    setCategory(aiAnalysis.category);
    setPriority(aiAnalysis.priority);
    setAiApplied(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        runAIAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (preset: PresetScenario) => {
    setImagePreview(preset.url);
    setDescription(preset.desc);
    if (preset.building) {
      setBuilding(preset.building);
    } else if (preset.name.includes('Water')) {
      setBuilding(CAMPUS_BUILDINGS[1]);
      setRoom('Ground Floor Washroom');
    }
    if (preset.room) {
      setRoom(preset.room);
    }
    if (preset.category) {
      setCategory(preset.category);
    }
  };

  const handleSelectAnyScenario = (scenario: PresetScenario) => {
    handlePresetSelect(scenario);
    setIsScenarioModalOpen(false);
  };

  const handleCustomScenarioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customIssueDesc.trim()) return;

    setImagePreview(customIssueImage);
    setDescription(customIssueDesc.trim());
    setCategory(customIssueCategory);
    setBuilding(customIssueBuilding);
    setRoom(customIssueRoom.trim() || 'General Area');
    setIsScenarioModalOpen(false);
  };

  const filteredScenarios = ALL_SCENARIOS.filter(sc => {
    const matchesSearch = scenarioSearch.trim() === '' ||
      sc.name.toLowerCase().includes(scenarioSearch.toLowerCase()) ||
      sc.desc.toLowerCase().includes(scenarioSearch.toLowerCase()) ||
      (sc.category && sc.category.toLowerCase().includes(scenarioSearch.toLowerCase())) ||
      (sc.building && sc.building.toLowerCase().includes(scenarioSearch.toLowerCase())) ||
      (sc.room && sc.room.toLowerCase().includes(scenarioSearch.toLowerCase()));

    const matchesCategory = scenarioCategoryFilter === 'ALL' || sc.category === scenarioCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const isPresetActive = SAMPLE_PRESET_IMAGES.some(p => p.desc === description);
  const matchedScenario = ALL_SCENARIOS.find(s => s.desc === description);
  const isCustomActive = !isPresetActive && description.trim().length > 0;
  const activeScenarioName = matchedScenario ? matchedScenario.name : 'Custom Scenario';

  const handleCaptureLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setLocationCaptured(true);
          setIsLocating(false);
        },
        () => {
          setLatitude(12.9716);
          setLongitude(77.5946);
          setLocationCaptured(true);
          setIsLocating(false);
        },
        { timeout: 3000 }
      );
    } else {
      setLatitude(12.9716);
      setLongitude(77.5946);
      setLocationCaptured(true);
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (aiAnalysis?.duplicateCandidate && !duplicateModalOpen && !submittedIssue) {
      setDuplicateModalOpen(true);
      return;
    }

    proceedSubmit();
  };

  const proceedSubmit = () => {
    setIsSubmitting(true);
    setDuplicateModalOpen(false);

    setTimeout(() => {
      const newIssue = createIssue({
        title: aiAnalysis?.detectedIssue || `${category} Issue at ${room}`,
        description,
        category,
        priority,
        status: 'REPORTED',
        reportedBy: {
          id: currentUser?.id || 'user-student-demo',
          name: currentUser?.name || 'Student Reporter',
          email: currentUser?.email || 'student@fixitcampus.demo',
          studentId: currentUser?.studentId || 'STU-2024-8841',
          department: currentUser?.department || 'Engineering'
        },
        building,
        room,
        latitude,
        longitude,
        beforeImage: imagePreview,
        source: 'Student',
        slaHours: aiAnalysis?.slaHours || 24,
        aiSuggestedDepartment: aiAnalysis?.suggestedDepartment,
        aiCategory: aiAnalysis?.category,
        aiPriority: aiAnalysis?.priority,
        aiConfidence: aiAnalysis?.confidence,
        aiKeyObservations: aiAnalysis?.keyObservations
      });

      setSubmittedIssue(newIssue);
      setIsSubmitting(false);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
    }, 400);
  };

  const handleSupportDuplicate = (issueId: string) => {
    if (currentUser) {
      toggleSupportIssue(issueId, currentUser.id);
    }
    setDuplicateModalOpen(false);
    onSelectIssue(issueId);
  };

  // SUCCESS SCREEN
  if (submittedIssue) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs text-center space-y-5">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 border border-green-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-green-700 bg-green-50 px-2.5 py-0.5 rounded border border-green-200">
              Complaint Successfully Registered
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-1">
              Complaint ID: <span className="font-mono text-blue-600">{submittedIssue.id}</span>
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your issue has been routed to <strong>{submittedIssue.aiSuggestedDepartment || 'Facilities Maintenance'}</strong> with automated SLA tracking.
            </p>
          </div>

          {/* Ticket Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-semibold text-slate-500">Complaint ID:</span>
              <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {submittedIssue.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Auto Category</span>
                <span className="font-medium text-slate-900">{submittedIssue.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Priority Score</span>
                <PriorityBadge priority={submittedIssue.priority} size="sm" />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Target SLA</span>
                <div className="flex items-center gap-1 font-bold text-slate-900 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{submittedIssue.slaHours} Hours</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Current Status</span>
                <StatusBadge status={submittedIssue.status} size="sm" />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Routed Department</span>
              <span className="font-medium text-slate-800">{submittedIssue.aiSuggestedDepartment}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <button
              onClick={() => onSelectIssue(submittedIssue.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm py-2.5 px-5 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Track Live SLA & Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSubmittedIssue(null);
                setDescription('');
              }}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors"
            >
              Report Another Issue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div className="space-y-1">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Student / Reporter Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Report a Campus Facility Issue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Fast sub-1-minute reporting with photographic evidence, AI triage, and real-time SLA window calculation.
        </p>
      </div>

      {/* Preset Test Scenarios */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>SIH Evaluation Quick Scenarios (Click to load):</span>
          </div>
          <button
            type="button"
            onClick={() => setIsScenarioModalOpen(true)}
            className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>Browse All Scenarios ({ALL_SCENARIOS.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className={`p-2 rounded-lg text-left border text-xs transition-all flex items-center gap-2 cursor-pointer ${
                description === preset.desc
                  ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold ring-1 ring-blue-400 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-medium'
              }`}
            >
              <img src={preset.url} alt={preset.name} className="w-6 h-6 rounded object-cover flex-shrink-0" />
              <span className="truncate">{preset.name}</span>
            </button>
          ))}

          {/* 5th Extra Button with Plus Symbol */}
          <button
            type="button"
            onClick={() => setIsScenarioModalOpen(true)}
            className={`p-2 rounded-lg text-left border-2 border-dashed transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer group ${
              isCustomActive
                ? 'bg-blue-50 text-blue-700 border-blue-400 ring-1 ring-blue-400 shadow-2xs'
                : 'bg-blue-50/40 hover:bg-blue-50 border-blue-300 hover:border-blue-500 text-blue-700 hover:text-blue-800 shadow-2xs'
            }`}
            title="Ask / Select what issue to raise from catalogue or create custom defect"
          >
            <div className="w-6 h-6 rounded bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center flex-shrink-0 shadow-xs transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <span className="truncate">
              {isCustomActive ? activeScenarioName : '+ More Issues'}
            </span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Photo Upload & Preview */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" />
                Defect Photographic Proof
              </h3>
              <p className="text-xs text-slate-500">Clear photographic evidence of the damaged infrastructure</p>
            </div>
            <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs px-3 py-1.5 rounded-lg cursor-pointer border border-slate-200 transition-colors flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Photo</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div className="relative aspect-video sm:aspect-21/9 w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Issue Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-slate-400 p-6 space-y-1.5">
                <ImageIcon className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-xs">No photograph selected</p>
              </div>
            )}
          </div>
        </div>

        {/* AI ANALYSIS PANEL */}
        <AIAnalysisCard
          analysis={aiAnalysis}
          isLoading={isAnalyzing}
          onApplySuggestions={handleApplyAISuggestions}
          isApplied={aiApplied}
        />

        {/* Description Field */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-xs text-slate-900 uppercase tracking-wider">
              Issue Description
            </label>
            <span className="text-[11px] text-slate-400">Describe what is broken or malfunctioning</span>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. Water is leaking continuously near Block B washroom..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:bg-white transition-colors resize-none"
            required
          />
        </div>

        {/* Category & Priority 2-Column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
            <label className="font-semibold text-xs text-slate-900 uppercase tracking-wider block">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as IssueCategory)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium"
            >
              {[
                'Electrical',
                'Plumbing',
                'Furniture',
                'Cleaning',
                'Wi-Fi/Network',
                'Classroom Equipment',
                'Safety',
                'Infrastructure',
                'HVAC/Air Conditioning',
                'Other'
              ].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-xs text-slate-900 uppercase tracking-wider block">
                Priority Level
              </label>
              {aiAnalysis && (
                <span className="text-[11px] text-blue-600 font-medium bg-blue-50 px-2 py-0.2 rounded border border-blue-200">
                  AI: {aiAnalysis.priority} (SLA: {aiAnalysis.slaHours}h)
                </span>
              )}
            </div>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as IssuePriority)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium"
            >
              <option value="Low">Low — SLA 72 Hours</option>
              <option value="Medium">Medium — SLA 24 Hours</option>
              <option value="High">High — SLA 4 Hours</option>
              <option value="Critical">Critical — SLA 2 Hours (Urgent Hazard)</option>
            </select>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Campus Location
              </h3>
              <p className="text-xs text-slate-500">Building and room identifier for maintenance routing</p>
            </div>

            <button
              type="button"
              onClick={handleCaptureLocation}
              disabled={isLocating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                locationCaptured
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-blue-600' : ''}`} />
              <span>{locationCaptured ? 'GPS Coordinates Attached ✓' : 'Use Current Location'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Campus Building
              </label>
              <select
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium"
              >
                {CAMPUS_BUILDINGS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Room / Facility Area
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g. Ground Floor Washroom / Room 204"
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('/student/dashboard')}
            className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow-xs transition-colors flex items-center gap-2"
          >
            <span>{isSubmitting ? 'Registering...' : 'Submit Complaint'}</span>
          </button>
        </div>
      </form>

      {/* Duplicate Alert Modal */}
      {aiAnalysis?.duplicateCandidate && (
        <DuplicateAlertModal
          isOpen={duplicateModalOpen}
          duplicateInfo={aiAnalysis.duplicateCandidate}
          onClose={() => setDuplicateModalOpen(false)}
          onSupport={handleSupportDuplicate}
          onViewExisting={(id) => {
            setDuplicateModalOpen(false);
            onSelectIssue(id);
          }}
          onProceedAnyway={proceedSubmit}
        />
      )}

      {/* Scenario Catalogue & Custom Issue Modal */}
      <Modal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        title="What Issue Needs to be Raised?"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          {/* Header Description & Tab Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select from our extended campus scenario catalogue or describe any custom defect for instant AI triage.
              </p>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveModalTab('catalog')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeModalTab === 'catalog'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Scenario Library ({ALL_SCENARIOS.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('custom')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeModalTab === 'custom'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Custom Issue</span>
              </button>
            </div>
          </div>

          {activeModalTab === 'catalog' ? (
            <div className="space-y-3.5">
              {/* Search & Category Filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={scenarioSearch}
                    onChange={(e) => setScenarioSearch(e.target.value)}
                    placeholder="Search any issue (e.g. AC, leak, elevator, wifi, lock, light, lab)..."
                    className="w-full pl-9 pr-14 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:bg-white dark:focus:bg-slate-850"
                  />
                  {scenarioSearch && (
                    <button
                      type="button"
                      onClick={() => setScenarioSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                  {['ALL', 'Plumbing', 'Electrical', 'HVAC/Air Conditioning', 'Classroom Equipment', 'Furniture', 'Infrastructure', 'Wi-Fi/Network', 'Cleaning', 'Safety'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setScenarioCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors font-medium cursor-pointer ${
                        scenarioCategoryFilter === cat
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat === 'ALL' ? 'All Scenarios' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scenarios Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {filteredScenarios.map((sc, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectAnyScenario(sc)}
                    className="group border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-slate-850 hover:bg-blue-50/40 dark:hover:bg-slate-800/60 rounded-xl p-3 cursor-pointer transition-all duration-150 flex gap-3 shadow-2xs hover:shadow-xs"
                  >
                    <img
                      src={sc.url}
                      alt={sc.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-slate-100 dark:border-slate-700 group-hover:scale-102 transition-transform"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                          {sc.name}
                        </h4>
                        {sc.category && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex-shrink-0">
                            {sc.category}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {sc.desc}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                        <span className="truncate">{sc.building || 'Campus'} • {sc.room || 'Area'}</span>
                        <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          Load →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredScenarios.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-slate-400 space-y-2">
                    <p className="text-xs">No scenario matching "{scenarioSearch}"</p>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomIssueTitle(scenarioSearch);
                        setCustomIssueDesc(`Issue reported: ${scenarioSearch}`);
                        setActiveModalTab('custom');
                      }}
                      className="text-xs text-blue-600 font-semibold underline hover:text-blue-700 cursor-pointer"
                    >
                      Click here to create "{scenarioSearch}" as a custom issue
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Tab 2: Custom Issue Builder */
            <form onSubmit={handleCustomScenarioSubmit} className="space-y-4">
              <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-3 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Instant Custom Issue Prompt</span>
                  <span>Describe what issue needs to be raised. Our AI engine will auto-triage priority, calculate SLA, and route to the correct department.</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                  What is the issue? (Title / Summary) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customIssueTitle}
                  onChange={(e) => {
                    setCustomIssueTitle(e.target.value);
                    if (!customIssueDesc || customIssueDesc.startsWith('Issue:')) {
                      setCustomIssueDesc(e.target.value);
                    }
                  }}
                  placeholder="e.g. Water cooler filter leaking, or Broken door hinge..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:bg-white dark:focus:bg-slate-850"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Detailed Defect Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={customIssueDesc}
                  onChange={(e) => setCustomIssueDesc(e.target.value)}
                  rows={3}
                  placeholder="Explain what is broken, abnormal sounds, hazards, or symptoms observed..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:bg-white dark:focus:bg-slate-850 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={customIssueCategory}
                    onChange={(e) => setCustomIssueCategory(e.target.value as IssueCategory)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
                  >
                    {[
                      'Electrical',
                      'Plumbing',
                      'Furniture',
                      'Cleaning',
                      'Wi-Fi/Network',
                      'Classroom Equipment',
                      'Safety',
                      'Infrastructure',
                      'HVAC/Air Conditioning',
                      'Other'
                    ].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Building
                  </label>
                  <select
                    value={customIssueBuilding}
                    onChange={(e) => setCustomIssueBuilding(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium truncate"
                  >
                    {CAMPUS_BUILDINGS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Room / Area
                  </label>
                  <input
                    type="text"
                    value={customIssueRoom}
                    onChange={(e) => setCustomIssueRoom(e.target.value)}
                    placeholder="e.g. Room 204"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
                    required
                  />
                </div>
              </div>

              {/* Photographic Proof Selection for Custom Issue */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Select Visual Evidence Photo
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {QUICK_IMAGE_PRESETS.map((imgItem, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCustomIssueImage(imgItem.url)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        customIssueImage === imgItem.url
                          ? 'border-blue-600 ring-2 ring-blue-300 scale-102'
                          : 'border-slate-200 dark:border-slate-700 hover:opacity-80'
                      }`}
                      title={imgItem.label}
                    >
                      <img src={imgItem.url} alt={imgItem.label} className="w-full h-full object-cover" />
                      <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] truncate px-1 text-center">
                        {imgItem.label.split('/')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsScenarioModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Custom Issue & Auto-Triage →</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};
