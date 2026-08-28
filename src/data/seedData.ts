import { Issue, User, IoTDevice, TimelineEvent, NotificationItem } from '../types';

export const CAMPUS_BUILDINGS = [
  'Block A — Academic Complex',
  'Block B — Science & Engineering Block',
  'Block C — Technology Tower',
  'Central Library',
  'Student Center & Canteen',
  'Auditorium & Seminar Halls',
  'Hostel Block 1 (Men)',
  'Hostel Block 2 (Women)',
  'Sports Complex & Gymnasium'
];

export const SEED_USERS: User[] = [
  {
    id: 'user-student-demo',
    name: 'Aarav Sharma',
    email: 'student@fixitcampus.demo',
    role: 'student',
    studentId: 'STU-2024-8841',
    department: 'Computer Science & Engineering',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-08-01T09:00:00Z'
  },
  {
    id: 'user-admin-demo',
    name: 'Dr. Ramesh Mehra',
    email: 'admin@fixitcampus.demo',
    role: 'admin',
    employeeId: 'EMP-ADM-102',
    department: 'Campus Infrastructure & Estates',
    phone: '+91 98222 33445',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-07-15T09:00:00Z'
  },
  {
    id: 'user-maintenance-demo',
    name: 'Rajesh Kumar',
    email: 'maintenance@fixitcampus.demo',
    role: 'maintenance',
    employeeId: 'TECH-PLM-401',
    department: 'Plumbing Maintenance & Hydraulics',
    phone: '+91 98111 22334',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-07-20T09:00:00Z'
  },
  {
    id: 'user-tech-elec',
    name: 'Vikram Singh',
    email: 'vikram.elec@campus.edu',
    role: 'maintenance',
    employeeId: 'TECH-ELC-402',
    department: 'Electrical Maintenance & Power Grid',
    phone: '+91 98333 44556',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-07-22T09:00:00Z'
  },
  {
    id: 'user-tech-net',
    name: 'Suresh Patil',
    email: 'suresh.it@campus.edu',
    role: 'maintenance',
    employeeId: 'TECH-NET-403',
    department: 'IT & Campus Network Operations',
    phone: '+91 98444 55667',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-07-25T09:00:00Z'
  }
];

export const SEED_ISSUES: Issue[] = [
  {
    id: 'CF-1001',
    title: 'Ceiling Water Leakage Dripping on Desk Area',
    description: 'Continuous water leakage from ceiling tiles in Room 204 near the front projection screen.',
    category: 'Plumbing',
    priority: 'Critical',
    status: 'IN_PROGRESS',
    building: 'Block A — Academic Complex',
    room: 'Room 204',
    latitude: 12.9716,
    longitude: 77.5946,
    beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    reportedBy: {
      id: 'user-student-demo',
      name: 'Aarav Sharma',
      email: 'student@fixitcampus.demo',
      studentId: 'STU-2024-8841',
      department: 'Computer Science & Engineering'
    },
    assignedTo: {
      id: 'user-maintenance-demo',
      name: 'Rajesh Kumar',
      email: 'maintenance@fixitcampus.demo',
      phone: '+91 98111 22334',
      department: 'Plumbing Maintenance & Hydraulics'
    },
    aiSuggestedDepartment: 'Plumbing Maintenance & Hydraulics',
    finalDepartment: 'Plumbing Maintenance & Hydraulics',
    supportersCount: 4,
    supportedByUserIds: ['user-student-demo', 'user-student-2'],
    source: 'Student',
    slaHours: 2,
    slaDeadline: new Date(Date.now() + 1000 * 60 * 45).toISOString(), // 45m remaining
    escalationLevel: 'None',
    aiCategory: 'Plumbing',
    aiPriority: 'Critical',
    aiConfidence: 97,
    aiKeyObservations: ['Liquid intrusion detected', 'Proximity to high-voltage projector', 'Active pooling risk'],
    createdAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    acceptedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 'CF-1002',
    title: 'Ceiling Fan Wobbling & High Pitch Screech',
    description: 'Ceiling fan #3 in Classroom 302 wobbling vigorously at speed 4 and 5 with severe bearing noise.',
    category: 'Electrical',
    priority: 'High',
    status: 'ASSIGNED',
    building: 'Block B — Science & Engineering Block',
    room: 'Room 302',
    latitude: 12.9722,
    longitude: 77.5952,
    beforeImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
    reportedBy: {
      id: 'user-student-demo',
      name: 'Aarav Sharma',
      email: 'student@fixitcampus.demo',
      studentId: 'STU-2024-8841'
    },
    assignedTo: {
      id: 'user-tech-elec',
      name: 'Vikram Singh',
      email: 'vikram.elec@campus.edu',
      phone: '+91 98333 44556',
      department: 'Electrical Maintenance & Power Grid'
    },
    aiSuggestedDepartment: 'Electrical Maintenance & Power Grid',
    finalDepartment: 'Electrical Maintenance & Power Grid',
    supportersCount: 7,
    source: 'Student',
    slaHours: 4,
    slaDeadline: new Date(Date.now() + 1000 * 60 * 120).toISOString(),
    escalationLevel: 'None',
    aiCategory: 'Electrical',
    aiPriority: 'High',
    aiConfidence: 94,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'CF-1003',
    title: 'Broken Armrest Bracket on Lecture Hall Seat',
    description: 'Metal bracket broken with sharp exposed edge on Seat D-14 in Seminar Hall A.',
    category: 'Furniture',
    priority: 'Medium',
    status: 'REPORTED',
    building: 'Auditorium & Seminar Halls',
    room: 'Hall A',
    latitude: 12.973,
    longitude: 77.596,
    beforeImage: 'https://images.unsplash.com/photo-1580481077167-33638234f4e0?w=600&auto=format&fit=crop&q=80',
    reportedBy: {
      id: 'user-student-3',
      name: 'Pooja Hegde',
      email: 'pooja.h@campus.edu'
    },
    aiSuggestedDepartment: 'Furniture & Carpentry Services',
    supportersCount: 2,
    source: 'Student',
    slaHours: 24,
    slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
    escalationLevel: 'None',
    aiCategory: 'Furniture',
    aiPriority: 'Medium',
    aiConfidence: 93,
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString()
  },
  {
    id: 'CF-1004',
    title: 'High-Density Wi-Fi Access Point Offline',
    description: 'Central Library 2nd floor silent study zone Wi-Fi dropping all connections and authentication failing.',
    category: 'Wi-Fi/Network',
    priority: 'High',
    status: 'IN_PROGRESS',
    building: 'Central Library',
    room: '2nd Floor Reading Hall',
    latitude: 12.9711,
    longitude: 77.5935,
    beforeImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    reportedBy: {
      id: 'user-student-demo',
      name: 'Aarav Sharma',
      email: 'student@fixitcampus.demo',
      studentId: 'STU-2024-8841'
    },
    assignedTo: {
      id: 'user-tech-net',
      name: 'Suresh Patil',
      email: 'suresh.it@campus.edu',
      phone: '+91 98444 55667',
      department: 'IT & Campus Network Operations'
    },
    aiSuggestedDepartment: 'IT & Campus Network Operations',
    finalDepartment: 'IT & Campus Network Operations',
    supportersCount: 18,
    source: 'Student',
    slaHours: 4,
    slaDeadline: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // BREACHED
    isSlaBreached: true,
    escalationLevel: 'Facility_Manager',
    aiCategory: 'Wi-Fi/Network',
    aiPriority: 'High',
    aiConfidence: 96,
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    acceptedAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString()
  },
  {
    id: 'CF-1005',
    title: 'Flush Valve Leakage in 1st Floor Washroom',
    description: 'Continuous valve bypass water leakage in Men Washroom Block C.',
    category: 'Plumbing',
    priority: 'Medium',
    status: 'RESOLVED',
    building: 'Block C — Technology Tower',
    room: '1st Floor Washroom',
    latitude: 12.9725,
    longitude: 77.597,
    beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&auto=format&fit=crop&q=80',
    resolutionNote: 'Replaced internal rubber diaphragm and tightened inlet bypass valve. Tested 5 flush cycles with 0 leakage.',
    reportedBy: {
      id: 'user-student-demo',
      name: 'Aarav Sharma',
      email: 'student@fixitcampus.demo',
      studentId: 'STU-2024-8841'
    },
    assignedTo: {
      id: 'user-maintenance-demo',
      name: 'Rajesh Kumar',
      email: 'maintenance@fixitcampus.demo',
      department: 'Plumbing Maintenance & Hydraulics'
    },
    aiSuggestedDepartment: 'Plumbing Maintenance & Hydraulics',
    finalDepartment: 'Plumbing Maintenance & Hydraulics',
    supportersCount: 3,
    source: 'Student',
    slaHours: 24,
    slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    escalationLevel: 'None',
    studentVerified: false,
    aiCategory: 'Plumbing',
    aiPriority: 'Medium',
    aiConfidence: 95,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    acceptedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'CF-1006',
    title: 'Lab 4 HDMI Projector Flickering with Pink Tint',
    description: 'Optoma ceiling projector has faulty color wheel / cable causing severe screen tint during lectures.',
    category: 'Classroom Equipment',
    priority: 'Medium',
    status: 'CLOSED',
    building: 'Block A — Academic Complex',
    room: 'Lab 4',
    latitude: 12.9718,
    longitude: 77.5948,
    beforeImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
    resolutionNote: 'Replaced 15m active optical HDMI trunk cable and calibrated projector RGB gain settings.',
    studentVerified: true,
    rating: 5,
    feedbackComment: 'Projector display is crystal clear now. Thank you for the rapid fix!',
    reportedBy: {
      id: 'user-student-demo',
      name: 'Aarav Sharma',
      email: 'student@fixitcampus.demo',
      studentId: 'STU-2024-8841'
    },
    assignedTo: {
      id: 'user-tech-net',
      name: 'Suresh Patil',
      email: 'suresh.it@campus.edu',
      department: 'AV & Classroom Technology Support'
    },
    aiSuggestedDepartment: 'AV & Classroom Technology Support',
    finalDepartment: 'AV & Classroom Technology Support',
    supportersCount: 5,
    source: 'Student',
    slaHours: 24,
    slaDeadline: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    escalationLevel: 'None',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString()
  }
];

export const SEED_IOT_DEVICES: IoTDevice[] = [
  {
    id: 'ESP32-CAMPUS-001',
    name: 'Block A — Ceiling Pipe Grid Monitor',
    location: 'Block A — Room 204 Ceiling Grid',
    building: 'Block A — Academic Complex',
    room: 'Room 204',
    status: 'ONLINE',
    lastSeen: new Date().toISOString(),
    currentReading: {
      temperature: 24.2,
      humidity: 58.0,
      waterLeak: false,
      lightLevel: 450,
      timestamp: new Date().toISOString()
    },
    batteryLevel: 98
  },
  {
    id: 'ESP32-CAMPUS-002',
    name: 'Block B — Server Room Environment Node',
    location: 'Block B — Ground Floor Server Rack',
    building: 'Block B — Science & Engineering Block',
    room: 'Server Room B-01',
    status: 'ONLINE',
    lastSeen: new Date().toISOString(),
    currentReading: {
      temperature: 19.8,
      humidity: 45.0,
      waterLeak: false,
      lightLevel: 320,
      timestamp: new Date().toISOString()
    },
    batteryLevel: 100
  },
  {
    id: 'ESP32-CAMPUS-003',
    name: 'Central Library — Archive HVAC Sensor',
    location: 'Library Basement Rare Book Vault',
    building: 'Central Library',
    room: 'Basement Vault',
    status: 'ONLINE',
    lastSeen: new Date().toISOString(),
    currentReading: {
      temperature: 21.0,
      humidity: 52.0,
      waterLeak: false,
      lightLevel: 150,
      timestamp: new Date().toISOString()
    },
    batteryLevel: 92
  }
];

export const SEED_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl-1',
    issueId: 'CF-1001',
    status: 'REPORTED',
    message: 'Complaint submitted by Aarav Sharma with photo evidence.',
    timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    changedBy: { id: 'user-student-demo', name: 'Aarav Sharma', role: 'student' }
  },
  {
    id: 'tl-2',
    issueId: 'CF-1001',
    status: 'AI_ANALYSED',
    message: 'CampusFix AI evaluated priority Critical, Target SLA: 2 Hours, Routed to Plumbing.',
    timestamp: new Date(Date.now() - 1000 * 60 * 74).toISOString(),
    changedBy: { id: 'ai-engine', name: 'CampusFix AI Engine', role: 'admin' }
  },
  {
    id: 'tl-3',
    issueId: 'CF-1001',
    status: 'ASSIGNED',
    message: 'Assigned to Rajesh Kumar (Plumbing Maintenance & Hydraulics).',
    timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    changedBy: { id: 'user-admin-demo', name: 'Dr. Ramesh Mehra', role: 'admin' }
  },
  {
    id: 'tl-4',
    issueId: 'CF-1001',
    status: 'ACCEPTED',
    message: 'Technician acknowledged dispatch and departed for Block A.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    changedBy: { id: 'user-maintenance-demo', name: 'Rajesh Kumar', role: 'maintenance' }
  },
  {
    id: 'tl-5',
    issueId: 'CF-1001',
    status: 'IN_PROGRESS',
    message: 'Commenced ceiling access and pressure isolation testing.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    changedBy: { id: 'user-maintenance-demo', name: 'Rajesh Kumar', role: 'maintenance' }
  }
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'SLA Escalation Alert: CF-1004',
    message: 'Ticket CF-1004 (Wi-Fi Outage in Library) has breached the 4-hour SLA. Escalated to Facility Manager.',
    type: 'sla_breach',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    issueId: 'CF-1004',
    roleTarget: 'admin'
  },
  {
    id: 'notif-2',
    title: 'Action Needed: Verify Fix for CF-1005',
    message: 'Technician Rajesh Kumar completed repair with photo proof. Please inspect and rate the fix.',
    type: 'verification',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    issueId: 'CF-1005',
    userId: 'user-student-demo'
  }
];
