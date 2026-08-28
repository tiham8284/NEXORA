export type UserRole = 'student' | 'admin' | 'maintenance';

export type IssueStatus =
  | 'REPORTED'
  | 'AI_ANALYSED'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REOPENED'
  | 'CLOSED';

export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type IssueCategory =
  | 'Electrical'
  | 'Plumbing'
  | 'Furniture'
  | 'Cleaning'
  | 'Wi-Fi/Network'
  | 'Classroom Equipment'
  | 'Safety'
  | 'Infrastructure'
  | 'HVAC/Air Conditioning'
  | 'Other';

export type EscalationLevel = 'None' | 'Supervisor' | 'Facility_Manager' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  studentId?: string;
  employeeId?: string;
  department?: string;
  phone?: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  issueId: string;
  status: IssueStatus;
  message: string;
  note?: string;
  evidenceImage?: string;
  timestamp: string;
  changedBy: {
    id: string;
    name: string;
    role: UserRole;
  };
}

export interface Issue {
  id: string; // e.g. CF-1042
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  
  // Location
  building: string;
  room: string;
  latitude?: number;
  longitude?: number;
  
  // Photographic Evidence
  beforeImage: string;
  afterImage?: string;
  
  // People & Routing
  reportedBy: {
    id: string;
    name: string;
    email: string;
    studentId?: string;
    department?: string;
    avatar?: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
    employeeId?: string;
    department?: string;
    phone?: string;
    avatar?: string;
  };
  aiSuggestedDepartment?: string;
  finalDepartment?: string;
  
  // Community & Duplicate Detection
  supportersCount?: number;
  supportedByUserIds?: string[];
  duplicateCandidateId?: string;
  similarityScore?: number;
  source: 'Student' | 'Faculty' | 'Staff' | 'IoT Sensor';
  
  // SLA & Escalation
  slaHours: number; // e.g., 2, 4, 24, 72
  slaDeadline: string; // ISO timestamp
  isSlaBreached?: boolean;
  escalationLevel: EscalationLevel;
  
  // Two-Way Verification & Feedback
  resolutionNote?: string;
  studentVerified?: boolean;
  studentFeedback?: string;
  rating?: number; // 1 to 5 stars
  feedbackComment?: string;
  reopenReason?: string;
  
  // AI Diagnostics Metadata
  aiCategory?: IssueCategory;
  aiPriority?: IssuePriority;
  aiConfidence?: number;
  aiKeyObservations?: string[];
  
  // Timestamps
  createdAt: string;
  acceptedAt?: string;
  resolvedAt?: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  roleTarget?: UserRole;
  title: string;
  message: string;
  type: 'status_change' | 'assignment' | 'critical_alert' | 'sla_breach' | 'escalation' | 'verification' | 'reopened' | 'iot_alert';
  read: boolean;
  createdAt: string;
  issueId?: string;
}

export interface IoTDevice {
  id: string;
  name: string;
  location: string;
  building: string;
  room: string;
  status: 'ONLINE' | 'OFFLINE' | 'ALERT';
  lastSeen: string;
  currentReading: {
    temperature: number;
    humidity: number;
    waterLeak: boolean;
    lightLevel: number;
    timestamp: string;
  };
  batteryLevel?: number;
}

export interface AIAnalysisResult {
  detectedIssue: string;
  category: IssueCategory;
  priority: IssuePriority;
  suggestedDepartment: string;
  slaHours: number;
  confidence: number;
  keyObservations: string[];
  duplicateCandidate?: {
    id: string;
    title: string;
    location: string;
    status: IssueStatus;
    similarityScore: number;
  };
}
