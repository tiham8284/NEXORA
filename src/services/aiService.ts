import { AIAnalysisResult, IssueCategory, IssuePriority, Issue } from '../types';
import { getIssues } from './storageService';

export async function analyzeIssue(
  description: string,
  _imageUri?: string,
  userSelectedCategory?: IssueCategory,
  building?: string,
  room?: string
): Promise<AIAnalysisResult> {
  // Simulate intelligent ML inference delay
  await new Promise(resolve => setTimeout(resolve, 350));

  const text = (description || '').toLowerCase();

  let category: IssueCategory = userSelectedCategory || 'Other';
  let priority: IssuePriority = 'Medium';
  let detectedIssue = 'Facility Infrastructure Issue';
  const keyObservations: string[] = [];

  // 1. NLP Pattern Recognition for Category & Defect
  if (text.includes('leak') || text.includes('water') || text.includes('tap') || text.includes('pipe') || text.includes('flush') || text.includes('drain') || text.includes('clog')) {
    category = 'Plumbing';
    detectedIssue = 'Fluid Leakage / Hydraulic Fixture Failure';
    keyObservations.push('Detected liquid flow / pipe pressure irregularity');
    if (text.includes('burst') || text.includes('flooding') || text.includes('severe') || text.includes('gushing') || text.includes('ceiling')) {
      priority = 'Critical';
      keyObservations.push('Active liquid risk to building electrical wiring');
    } else {
      priority = 'High';
    }
  } else if (text.includes('spark') || text.includes('shock') || text.includes('short circuit') || text.includes('fire') || text.includes('burning') || text.includes('smoke')) {
    category = 'Electrical';
    priority = 'Critical';
    detectedIssue = 'Severe Electrical Safety Hazard / Sparking';
    keyObservations.push('Exposed conductor / arcing hazard detected');
    keyObservations.push('Immediate life safety lockout required');
  } else if (text.includes('fan') || text.includes('light') || text.includes('switch') || text.includes('socket') || text.includes('bulb') || text.includes('power') || text.includes('wire')) {
    category = 'Electrical';
    detectedIssue = 'Electrical Fixture Malfunction';
    keyObservations.push('Illumination or ventilation circuit fault');
    priority = text.includes('hanging') || text.includes('spark') ? 'Critical' : 'Medium';
  } else if (text.includes('chair') || text.includes('desk') || text.includes('bench') || text.includes('table') || text.includes('door') || text.includes('window') || text.includes('hinge') || text.includes('lock')) {
    category = 'Furniture';
    detectedIssue = 'Structural Furniture / Fixture Damage';
    keyObservations.push('Mechanical bracket or frame fatigue');
    priority = text.includes('sharp') || text.includes('broken glass') ? 'High' : 'Low';
  } else if (text.includes('wifi') || text.includes('wi-fi') || text.includes('internet') || text.includes('network') || text.includes('router') || text.includes('lan') || text.includes('ethernet')) {
    category = 'Wi-Fi/Network';
    detectedIssue = 'Wireless Access Point & Network Outage';
    keyObservations.push('Network gateway packet loss / AP offline');
    priority = 'Medium';
  } else if (text.includes('projector') || text.includes('mic') || text.includes('speaker') || text.includes('screen') || text.includes('audio') || text.includes('podium') || text.includes('display')) {
    category = 'Classroom Equipment';
    detectedIssue = 'Audio-Visual Classroom Hardware Defect';
    keyObservations.push('HDMI / Projection module fault');
    priority = 'Medium';
  } else if (text.includes('garbage') || text.includes('dustbin') || text.includes('clean') || text.includes('trash') || text.includes('stain') || text.includes('smell') || text.includes('odor')) {
    category = 'Cleaning';
    detectedIssue = 'Sanitization & Waste Disposal Request';
    keyObservations.push('Bio-waste or sanitation threshold exceeded');
    priority = 'Low';
  } else if (text.includes('ac') || text.includes('cooler') || text.includes('cooling') || text.includes('hvac') || text.includes('hot') || text.includes('vent')) {
    category = 'HVAC/Air Conditioning';
    detectedIssue = 'HVAC Thermal Control System Failure';
    keyObservations.push('Refrigerant / compressor airflow anomaly');
    priority = 'Medium';
  }

  // 2. Department Mapping
  const departmentMap: Record<IssueCategory, string> = {
    'Plumbing': 'Plumbing Maintenance & Hydraulics',
    'Electrical': 'Electrical Maintenance & Power Grid',
    'Furniture': 'Furniture & Carpentry Services',
    'Wi-Fi/Network': 'IT & Campus Network Operations',
    'Cleaning': 'Housekeeping & Sanitization',
    'Safety': 'Campus Safety & Security Administration',
    'Classroom Equipment': 'AV & Classroom Technology Support',
    'HVAC/Air Conditioning': 'HVAC & Thermal Systems',
    'Infrastructure': 'Civil Infrastructure & Estates',
    'Other': 'General Campus Facilities Office'
  };

  const suggestedDepartment = departmentMap[category];

  // 3. SLA Hours Matrix
  const slaMap: Record<IssuePriority, number> = {
    'Critical': 2,
    'High': 4,
    'Medium': 24,
    'Low': 72
  };
  const slaHours = slaMap[priority];

  // 4. Semantic Duplicate Detection Check against active issues
  const existingIssues = getIssues();
  let duplicateCandidate: AIAnalysisResult['duplicateCandidate'] = undefined;

  const activeIssues = existingIssues.filter(i => i.status !== 'CLOSED');

  for (const issue of activeIssues) {
    const sameBuilding = building && issue.building.toLowerCase().includes(building.toLowerCase().split('—')[0].trim());
    const sameRoom = room && issue.room.toLowerCase().includes(room.toLowerCase().trim());
    const sameCat = issue.category === category;

    if (sameBuilding && (sameRoom || sameCat)) {
      duplicateCandidate = {
        id: issue.id,
        title: issue.title,
        location: `${issue.building} (${issue.room})`,
        status: issue.status,
        similarityScore: sameRoom && sameCat ? 88 : 74
      };
      break;
    }
  }

  return {
    detectedIssue,
    category,
    priority,
    suggestedDepartment,
    slaHours,
    confidence: Math.floor(92 + Math.random() * 7),
    keyObservations,
    duplicateCandidate
  };
}
