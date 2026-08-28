import { Issue } from '../types';

export function exportIssuesToCSV(issues: Issue[], filename = 'campus-maintenance-report.csv') {
  const headers = [
    'Complaint ID',
    'Issue Title',
    'Category',
    'Priority',
    'Status',
    'Building',
    'Room',
    'Reported By',
    'Assigned Staff',
    'Source',
    'Reported Date',
    'Resolved Date',
    'Student Verified'
  ];

  const rows = issues.map(i => [
    `"${i.id}"`,
    `"${i.title.replace(/"/g, '""')}"`,
    `"${i.category}"`,
    `"${i.priority}"`,
    `"${i.status}"`,
    `"${i.building.replace(/"/g, '""')}"`,
    `"${i.room.replace(/"/g, '""')}"`,
    `"${i.reportedBy?.name || 'N/A'}"`,
    `"${i.assignedTo?.name || 'Unassigned'}"`,
    `"${i.source}"`,
    `"${new Date(i.createdAt).toLocaleString()}"`,
    `"${i.resolvedAt ? new Date(i.resolvedAt).toLocaleString() : 'N/A'}"`,
    `"${i.studentVerified ? 'Yes' : 'No'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
