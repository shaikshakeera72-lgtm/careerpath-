export type TabType = 'dashboard' | 'roadmap' | 'skills' | 'profile';

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type SkillStatus = 'known' | 'learning' | 'needed';

export type PhaseStatus = 'completed' | 'in_progress' | 'locked';

export interface UserProfile {
  name: string;
  university: string;
  degree: string;
  gradYear: string;
  targetRole: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  weeklyHours: number;
  learningPace: 'Casual' | 'Balanced' | 'Intensive';
  streakDays: number;
  completedSkillsCount: number;
  totalSkillsCount: number;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  status: SkillStatus;
  progress?: number; // 0 - 100 for learning skills
  priority?: PriorityLevel; // for needed skills
  description?: string;
  recommendedResource?: string;
}

export interface PhaseMilestone {
  id: string;
  title: string;
  completed: boolean;
  type: 'concept' | 'coding' | 'project' | 'quiz';
  estimatedTime?: string;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  status: PhaseStatus;
  description: string;
  tags: string[];
  progress?: number; // 0 - 100
  milestones?: PhaseMilestone[];
  isLocked?: boolean;
}

export interface RoadmapData {
  id: string;
  roleTitle: string;
  roleCategory: string;
  readinessScore: number; // e.g. 42
  acquiredSkillsCount: number; // e.g. 8
  totalRequiredSkillsCount: number; // e.g. 20
  knownSkills: string[];
  learningSkills: { name: string; progress: number; id?: string }[];
  neededSkills: { name: string; priority: PriorityLevel; id?: string; category?: string }[];
  phases: RoadmapPhase[];
  salaryRange?: string;
  demandGrowth?: string;
}

export interface DailyFocusTask {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  minutes: number;
  xp: number;
  phaseRef?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'streak' | 'roadmap' | 'quiz' | 'ai';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
