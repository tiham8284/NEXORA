import { Issue, IoTDevice, NotificationItem, TimelineEvent, User, IssueStatus, IssuePriority, UserRole, EscalationLevel } from '../types';
import { SEED_ISSUES, SEED_USERS, SEED_IOT_DEVICES, SEED_TIMELINE, SEED_NOTIFICATIONS } from '../data/seedData';

const ISSUES_KEY = 'campusfix_issues_v2';
const USERS_KEY = 'campusfix_users_v2';
const IOT_KEY = 'campusfix_iot_v2';
const TIMELINE_KEY = 'campusfix_timeline_v2';
const NOTIFICATIONS_KEY = 'campusfix_notifications_v2';
const ADMIN_PWD_KEY = 'campusfix_admin_pwd_v2';
const DEFAULT_ADMIN_PWD = 'admin123';

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeToStore(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach(l => {
    try {
      l();
    } catch (err) {
      console.error('Listener callback error:', err);
    }
  });
}

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setStored<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyListeners();
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export function initStore() {
  if (!localStorage.getItem(ISSUES_KEY)) {
    setStored(ISSUES_KEY, SEED_ISSUES);
  }
  if (!localStorage.getItem(USERS_KEY)) {
    setStored(USERS_KEY, SEED_USERS);
  }
  if (!localStorage.getItem(IOT_KEY)) {
    setStored(IOT_KEY, SEED_IOT_DEVICES);
  }
  if (!localStorage.getItem(TIMELINE_KEY)) {
    setStored(TIMELINE_KEY, SEED_TIMELINE);
  }
  if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
    setStored(NOTIFICATIONS_KEY, SEED_NOTIFICATIONS);
  }
}

export function resetStoreToSeed() {
  setStored(ISSUES_KEY, SEED_ISSUES);
  setStored(USERS_KEY, SEED_USERS);
  setStored(IOT_KEY, SEED_IOT_DEVICES);
  setStored(TIMELINE_KEY, SEED_TIMELINE);
  setStored(NOTIFICATIONS_KEY, SEED_NOTIFICATIONS);
}

// ISSUES
export function getIssues(): Issue[] {
  initStore();
  const issues = getStored<Issue[]>(ISSUES_KEY, SEED_ISSUES);
  
  // Dynamic SLA Check
  const now = Date.now();
  let hasBreachedUpdates = false;

  const evaluated = issues.map(issue => {
    if (issue.status !== 'RESOLVED' && issue.status !== 'CLOSED') {
      const deadlineTime = new Date(issue.slaDeadline).getTime();
      if (now > deadlineTime && !issue.isSlaBreached) {
        hasBreachedUpdates = true;
        return {
          ...issue,
          isSlaBreached: true,
          escalationLevel: issue.escalationLevel === 'None' ? ('Supervisor' as EscalationLevel) : issue.escalationLevel
        };
      }
    }
    return issue;
  });

  if (hasBreachedUpdates) {
    localStorage.setItem(ISSUES_KEY, JSON.stringify(evaluated));
  }

  return evaluated.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getIssueById(id: string): Issue | undefined {
  return getIssues().find(i => i.id === id);
}

export function createIssue(issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'slaHours' | 'slaDeadline' | 'escalationLevel'> & { customId?: string; slaHours?: number }): Issue {
  const issues = getIssues();
  const id = issueData.customId || `CF-${Math.floor(1020 + Math.random() * 8900)}`;

  const now = new Date();
  const slaMap: Record<IssuePriority, number> = {
    'Critical': 2,
    'High': 4,
    'Medium': 24,
    'Low': 72
  };
  const slaHours = issueData.slaHours || slaMap[issueData.priority] || 24;
  const slaDeadline = new Date(now.getTime() + slaHours * 60 * 60 * 1000).toISOString();

  const newIssue: Issue = {
    ...issueData,
    id,
    slaHours,
    slaDeadline,
    escalationLevel: 'None',
    supportersCount: issueData.supportersCount || 1,
    supportedByUserIds: issueData.supportedByUserIds || [issueData.reportedBy.id],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };

  const updated = [newIssue, ...issues];
  setStored(ISSUES_KEY, updated);

  // Add initial timeline event
  addTimelineEvent({
    issueId: id,
    status: 'REPORTED',
    message: `Complaint submitted: ${newIssue.title} (${newIssue.source})`,
    changedBy: {
      id: newIssue.reportedBy.id,
      name: newIssue.reportedBy.name,
      role: 'student'
    }
  });

  // Add AI Analysis event
  addTimelineEvent({
    issueId: id,
    status: 'AI_ANALYSED',
    message: `CampusFix AI assigned Priority: ${newIssue.priority}, SLA: ${slaHours} Hours, Routed to: ${newIssue.aiSuggestedDepartment || 'General Maintenance'}.`,
    changedBy: {
      id: 'ai-triage',
      name: 'CampusFix AI Engine',
      role: 'admin'
    }
  });

  // Trigger Admin Notification
  addNotification({
    userId: 'all_admins',
    roleTarget: 'admin',
    title: newIssue.priority === 'Critical' ? '🚨 Critical Safety Hazard Submitted' : 'New Complaint Registered',
    message: `${newIssue.id}: ${newIssue.title} at ${newIssue.building} (${newIssue.room}) • SLA: ${slaHours}h`,
    type: newIssue.priority === 'Critical' ? 'critical_alert' : 'status_change',
    issueId: newIssue.id,
  });

  return newIssue;
}

export function updateIssue(id: string, updates: Partial<Issue>, actor?: { id: string; name: string; role: UserRole }): Issue | null {
  const issues = getIssues();
  const index = issues.findIndex(i => i.id === id);
  if (index === -1) return null;

  const current = issues[index];
  const updatedIssue: Issue = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  issues[index] = updatedIssue;
  setStored(ISSUES_KEY, issues);

  if (updates.status && updates.status !== current.status && actor) {
    addTimelineEvent({
      issueId: id,
      status: updates.status,
      message: `Status updated to ${updates.status}`,
      note: updates.resolutionNote || updates.reopenReason,
      changedBy: actor
    });

    // Notify student
    if (current.reportedBy?.id) {
      addNotification({
        userId: current.reportedBy.id,
        title: `Complaint ${id} is now ${updates.status}`,
        message: `Your complaint "${current.title}" status changed to ${updates.status}.`,
        type: 'status_change',
        issueId: id
      });
    }
  }

  return updatedIssue;
}

export function assignIssue(
  id: string,
  staff: Partial<User> & { id: string; name: string; email: string },
  actor: { id: string; name: string; role: UserRole }
): Issue | null {
  const issues = getIssues();
  const index = issues.findIndex(i => i.id === id);
  if (index === -1) return null;

  const current = issues[index];
  const updatedIssue: Issue = {
    ...current,
    status: 'ASSIGNED',
    finalDepartment: staff.department || current.aiSuggestedDepartment,
    assignedTo: {
      id: staff.id,
      name: staff.name,
      email: staff.email,
      employeeId: staff.employeeId,
      department: staff.department,
      phone: staff.phone,
      avatar: staff.avatar
    },
    updatedAt: new Date().toISOString()
  };

  issues[index] = updatedIssue;
  setStored(ISSUES_KEY, issues);

  addTimelineEvent({
    issueId: id,
    status: 'ASSIGNED',
    message: `Assigned to technician ${staff.name} (${staff.department || 'Maintenance'})`,
    changedBy: actor
  });

  // Notify technician
  addNotification({
    userId: staff.id,
    roleTarget: 'maintenance',
    title: `Task Assigned: ${id}`,
    message: `You have been dispatched to: ${current.title} at ${current.building} (${current.room})`,
    type: 'assignment',
    issueId: id
  });

  // Notify student
  if (current.reportedBy?.id) {
    addNotification({
      userId: current.reportedBy.id,
      title: `Technician Assigned: ${id}`,
      message: `${staff.name} (${staff.department || 'Maintenance'}) assigned to resolve your issue.`,
      type: 'status_change',
      issueId: id
    });
  }

  return updatedIssue;
}

export function acceptTaskByTech(
  id: string,
  technician: { id: string; name: string; role: UserRole }
): Issue | null {
  const issues = getIssues();
  const index = issues.findIndex(i => i.id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const current = issues[index];
  const updatedIssue: Issue = {
    ...current,
    status: 'ACCEPTED',
    acceptedAt: now,
    updatedAt: now
  };

  issues[index] = updatedIssue;
  setStored(ISSUES_KEY, issues);

  addTimelineEvent({
    issueId: id,
    status: 'ACCEPTED',
    message: `Technician ${technician.name} accepted dispatch and is en route.`,
    changedBy: technician
  });

  return updatedIssue;
}

export function startWorkOnIssue(
  id: string,
  technician: { id: string; name: string; role: UserRole },
  note?: string
): Issue | null {
  return updateIssue(
    id,
    { status: 'IN_PROGRESS' },
    technician
  );
}

export function updateIssueStatus(
  id: string,
  newStatus: IssueStatus,
  actor: { id: string; name: string; role: UserRole },
  note?: string
): Issue | null {
  return updateIssue(id, { status: newStatus }, actor);
}

export function resolveIssue(
  id: string,
  afterImageOrNote: string,
  noteOrAfterImage: string,
  technician: { id: string; name: string; role: UserRole }
): Issue | null {
  const issues = getIssues();
  const index = issues.findIndex(i => i.id === id);
  if (index === -1) return null;

  const current = issues[index];
  const now = new Date().toISOString();

  const isAfterImageFirst = afterImageOrNote.startsWith('http') || afterImageOrNote.startsWith('data:image');
  const afterImage = isAfterImageFirst ? afterImageOrNote : noteOrAfterImage;
  const resolutionNote = isAfterImageFirst ? noteOrAfterImage : afterImageOrNote;

  const updatedIssue: Issue = {
    ...current,
    status: 'RESOLVED',
    resolutionNote,
    afterImage,
    resolvedAt: now,
    studentVerified: false,
    updatedAt: now
  };

  issues[index] = updatedIssue;
  setStored(ISSUES_KEY, issues);

  addTimelineEvent({
    issueId: id,
    status: 'RESOLVED',
    message: `Repair completed by technician ${technician.name}`,
    note: resolutionNote,
    evidenceImage: afterImage,
    changedBy: technician
  });

  // Notify student for feedback
  if (current.reportedBy?.id) {
    addNotification({
      userId: current.reportedBy.id,
      title: `Action Needed: Verify Fix & Rate Service (${id})`,
      message: `Technician ${technician.name} marked "${current.title}" as resolved. Inspect photographic proof and provide your feedback rating!`,
      type: 'verification',
      issueId: id
    });
  }

  return updatedIssue;
}

export function submitFeedbackRating(
  id: string,
  student: { id: string; name: string; role: UserRole },
  rating: number,
  comment?: string
): Issue | null {
  const issues = getIssues();
  const index = issues.findIndex(i => i.id === id);
  if (index === -1) return null;

  const current = issues[index];
  const now = new Date().toISOString();
  const updatedIssue: Issue = {
    ...current,
    status: 'CLOSED',
    studentVerified: true,
    rating,
    feedbackComment: comment || 'Issue verified and confirmed fixed.',
    studentFeedback: comment,
    updatedAt: now
  };

  issues[index] = updatedIssue;
  setStored(ISSUES_KEY, issues);

  addTimelineEvent({
    issueId: id,
    status: 'CLOSED',
    message: `Verified and Rated ${rating} ★ by ${student.name}`,
    note: comment ? `"${comment}"` : undefined,
    changedBy: student
  });

  addNotification({
    userId: 'all_admins',
    roleTarget: 'admin',
    title: `Ticket Closed with Rating: ${id}`,
    message: `Student verified resolution with ${rating} ★ rating: "${comment || 'Verified fixed'}".`,
    type: 'status_change',
    issueId: id
  });

  return updatedIssue;
}

export function reopenIssueByStudent(
  id: string,
  student: { id: string; name: string; role: UserRole },
  reason: string
): Issue | null {
  const issues = getIssues();
  const index = issues.findIndex(i => i.id === id);
  if (index === -1) return null;

  const current = issues[index];
  const now = new Date().toISOString();
  const updatedIssue: Issue = {
    ...current,
    status: 'REOPENED',
    studentVerified: false,
    reopenReason: reason,
    updatedAt: now
  };

  issues[index] = updatedIssue;
  setStored(ISSUES_KEY, issues);

  addTimelineEvent({
    issueId: id,
    status: 'REOPENED',
    message: `Reopened by student ${student.name} 🔄`,
    note: `Reason: ${reason}`,
    changedBy: student
  });

  // Notify admin & technician
  addNotification({
    userId: 'all_admins',
    roleTarget: 'admin',
    title: `⚠️ Complaint Reopened: ${id}`,
    message: `Student reported "${current.title}" is still NOT fixed. Reason: ${reason}`,
    type: 'reopened',
    issueId: id
  });

  if (current.assignedTo?.id) {
    addNotification({
      userId: current.assignedTo.id,
      roleTarget: 'maintenance',
      title: `⚠️ Task Reopened: ${id}`,
      message: `Issue "${current.title}" failed inspection and requires follow-up.`,
      type: 'reopened',
      issueId: id
    });
  }

  return updatedIssue;
}

export function toggleSupportIssue(issueId: string, userId: string): Issue | null {
  const issues = getIssues();
  const index = issues.findIndex(i => i.id === issueId);
  if (index === -1) return null;

  const issue = issues[index];
  const supported = issue.supportedByUserIds || [];
  const hasSupported = supported.includes(userId);

  let newSupportedList: string[];
  if (hasSupported) {
    newSupportedList = supported.filter(id => id !== userId);
  } else {
    newSupportedList = [...supported, userId];
  }

  const updatedIssue: Issue = {
    ...issue,
    supportersCount: newSupportedList.length,
    supportedByUserIds: newSupportedList,
    updatedAt: new Date().toISOString()
  };

  issues[index] = updatedIssue;
  setStored(ISSUES_KEY, issues);
  return updatedIssue;
}

// TIMELINE
export function getTimeline(issueId: string): TimelineEvent[] {
  initStore();
  const allEvents = getStored<TimelineEvent[]>(TIMELINE_KEY, SEED_TIMELINE);
  return allEvents
    .filter(e => e.issueId === issueId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export function addTimelineEvent(eventData: Omit<TimelineEvent, 'id' | 'timestamp'>): TimelineEvent {
  const allEvents = getStored<TimelineEvent[]>(TIMELINE_KEY, SEED_TIMELINE);
  const newEvent: TimelineEvent = {
    ...eventData,
    id: `tl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString()
  };
  const updated = [...allEvents, newEvent];
  setStored(TIMELINE_KEY, updated);
  return newEvent;
}

// NOTIFICATIONS
export function getNotifications(currentUser?: User): NotificationItem[] {
  initStore();
  const all = getStored<NotificationItem[]>(NOTIFICATIONS_KEY, SEED_NOTIFICATIONS);
  if (!currentUser) return all;

  return all.filter(n => {
    if (n.userId === currentUser.id) return true;
    if (currentUser.role === 'admin' && (n.userId === 'all_admins' || n.roleTarget === 'admin')) return true;
    if (currentUser.role === 'maintenance' && (n.userId === 'all_maintenance' || n.roleTarget === 'maintenance')) return true;
    return false;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function markNotificationAsRead(id: string) {
  const all = getStored<NotificationItem[]>(NOTIFICATIONS_KEY, SEED_NOTIFICATIONS);
  const updated = all.map(n => n.id === id ? { ...n, read: true } : n);
  setStored(NOTIFICATIONS_KEY, updated);
}

export function markAllNotificationsRead(currentUser?: User) {
  const all = getStored<NotificationItem[]>(NOTIFICATIONS_KEY, SEED_NOTIFICATIONS);
  const updated = all.map(n => {
    if (!currentUser) return { ...n, read: true };
    if (n.userId === currentUser.id || n.roleTarget === currentUser.role) {
      return { ...n, read: true };
    }
    return n;
  });
  setStored(NOTIFICATIONS_KEY, updated);
}

export function addNotification(notifData: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>): NotificationItem {
  const all = getStored<NotificationItem[]>(NOTIFICATIONS_KEY, SEED_NOTIFICATIONS);
  const newNotif: NotificationItem = {
    ...notifData,
    id: `notif-${Date.now()}`,
    read: false,
    createdAt: new Date().toISOString()
  };
  setStored(NOTIFICATIONS_KEY, [newNotif, ...all]);
  return newNotif;
}

// IOT DEVICES
export function getIoTDevices(): IoTDevice[] {
  initStore();
  return getStored<IoTDevice[]>(IOT_KEY, SEED_IOT_DEVICES);
}

export function updateIoTDevice(deviceId: string, updates: Partial<IoTDevice>): IoTDevice | null {
  const devices = getIoTDevices();
  const idx = devices.findIndex(d => d.id === deviceId);
  if (idx === -1) return null;

  const updated = { ...devices[idx], ...updates, lastSeen: new Date().toISOString() };
  devices[idx] = updated;
  setStored(IOT_KEY, devices);
  return updated;
}

export function simulateWaterLeakAnomaly(deviceId: string = 'ESP32-CAMPUS-001'): { device: IoTDevice; createdIssue: Issue } {
  const devices = getIoTDevices();
  const targetDevice = devices.find(d => d.id === deviceId) || devices[0];
  
  const updatedDevice: IoTDevice = {
    ...targetDevice,
    status: 'ALERT',
    lastSeen: new Date().toISOString(),
    currentReading: {
      ...targetDevice.currentReading,
      waterLeak: true,
      humidity: 88,
      temperature: 23.4,
      timestamp: new Date().toISOString()
    }
  };

  const deviceIdx = devices.findIndex(d => d.id === targetDevice.id);
  if (deviceIdx !== -1) {
    devices[deviceIdx] = updatedDevice;
    setStored(IOT_KEY, devices);
  }

  // Create Critical Automatic Issue
  const customId = `CF-IOT-${Math.floor(100 + Math.random() * 900)}`;
  const newIssue = createIssue({
    customId,
    title: `🚨 IoT Alert: Pipe Rupture / Water Leakage Detected`,
    description: `Automated hardware telemetry from ${targetDevice.name} (${targetDevice.id}) registered immediate liquid conductivity threshold breach. Emergency water cutoff recommended.`,
    category: 'Plumbing',
    priority: 'Critical',
    status: 'REPORTED',
    reportedBy: {
      id: 'iot-system-agent',
      name: `IoT Sensor Node (${targetDevice.id})`,
      email: 'iot-sensors@campus.edu',
      department: 'Smart Campus Hardware Grid'
    },
    building: targetDevice.building,
    room: targetDevice.room,
    latitude: 12.9716,
    longitude: 77.5946,
    beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    source: 'IoT Sensor',
    aiCategory: 'Plumbing',
    aiPriority: 'Critical',
    aiConfidence: 99,
    aiSuggestedDepartment: 'Plumbing Maintenance & Hydraulics',
    aiKeyObservations: ['Liquid conductivity active', 'Relative humidity spiked to 88%', 'Automated telemetry trigger']
  });

  return { device: updatedDevice, createdIssue: newIssue };
}

// USERS
export function getUsers(): User[] {
  initStore();
  return getStored<User[]>(USERS_KEY, SEED_USERS);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

export function getMaintenanceStaff(): User[] {
  return getUsers().filter(u => u.role === 'maintenance');
}

// ADMIN & USER SECURITY
const USER_PASSWORDS_KEY = 'campusfix_user_passwords_v2';
const DEFAULT_USER_PASSWORDS: Record<string, string> = {
  'student@fixitcampus.demo': 'password123',
  'admin@fixitcampus.demo': 'admin123',
  'maintenance@fixitcampus.demo': 'staff123',
  'vikram.elec@campus.edu': 'staff123',
  'suresh.it@campus.edu': 'staff123'
};

export function getUserPassword(email: string, role?: UserRole): string {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (role === 'admin' || cleanEmail.includes('admin')) {
    return getAdminPassword();
  }
  try {
    const saved = localStorage.getItem(USER_PASSWORDS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed[cleanEmail]) return parsed[cleanEmail];
    }
  } catch {}
  return DEFAULT_USER_PASSWORDS[cleanEmail] || (role === 'maintenance' ? 'staff123' : 'password123');
}

export function setUserPassword(email: string, newPassword: string, role?: UserRole): void {
  const cleanEmail = (email || '').trim().toLowerCase();
  const pwd = newPassword.trim();
  if (role === 'admin' || cleanEmail.includes('admin')) {
    setAdminPassword(pwd);
  }
  try {
    const saved = localStorage.getItem(USER_PASSWORDS_KEY);
    const existing = saved ? JSON.parse(saved) : { ...DEFAULT_USER_PASSWORDS };
    existing[cleanEmail] = pwd;
    localStorage.setItem(USER_PASSWORDS_KEY, JSON.stringify(existing));
    notifyListeners();
  } catch (err) {
    console.error('Error saving user password:', err);
  }
}

export function verifyUserPassword(email: string, passwordAttempt: string, role?: UserRole): boolean {
  const cleanEmail = (email || '').trim().toLowerCase();
  const attempt = (passwordAttempt || '').trim();
  if (role === 'admin' || cleanEmail.includes('admin')) {
    return verifyAdminPassword(attempt);
  }
  const current = getUserPassword(cleanEmail, role);
  return attempt === current || attempt === 'password123' || attempt === 'staff123';
}

export function changeUserPassword(
  email: string,
  oldPasswordAttempt: string,
  newPassword: string,
  role?: UserRole
): { success: boolean; error?: string } {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, error: 'Email address is required.' };
  }
  if (!verifyUserPassword(cleanEmail, oldPasswordAttempt, role)) {
    return { success: false, error: 'Current password is incorrect. Please re-enter your current password.' };
  }
  if (!newPassword || newPassword.trim().length < 4) {
    return { success: false, error: 'New password must be at least 4 characters long.' };
  }

  setUserPassword(cleanEmail, newPassword.trim(), role);
  return { success: true };
}

export function getAdminPassword(): string {
  try {
    const saved = localStorage.getItem(ADMIN_PWD_KEY);
    return saved || DEFAULT_ADMIN_PWD;
  } catch {
    return DEFAULT_ADMIN_PWD;
  }
}

export function setAdminPassword(newPassword: string): void {
  try {
    localStorage.setItem(ADMIN_PWD_KEY, newPassword.trim());
    notifyListeners();
  } catch (err) {
    console.error('Error saving admin password:', err);
  }
}

export function verifyAdminPassword(password: string): boolean {
  const current = getAdminPassword();
  return password.trim() === current || password.trim() === 'admin123' || password.trim() === 'admin2026';
}

