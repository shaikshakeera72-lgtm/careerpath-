import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { RoadmapView } from './components/RoadmapView';
import { HomeHeroView } from './components/HomeHeroView';
import { SkillsView } from './components/SkillsView';
import { ProfileView } from './components/ProfileView';
import { OnboardingModal } from './components/OnboardingModal';
import { InteractiveLearningModal } from './components/InteractiveLearningModal';
import { ExploreCareersModal } from './components/ExploreCareersModal';
import { AIQuizModal } from './components/AIQuizModal';
import { NotificationModal } from './components/NotificationModal';
import { NavigationDrawer } from './components/NavigationDrawer';

import {
  initialUserProfile,
  defaultRoadmaps,
  initialDailyTasks,
  initialNotifications,
} from './data/initialData';
import { TabType, UserProfile, RoadmapData, DailyFocusTask, NotificationItem, SkillStatus } from './types';

export default function App() {
  // Navigation state
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showHomeHero, setShowHomeHero] = useState<boolean>(false);

  // App data state
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [currentRoadmap, setCurrentRoadmap] = useState<RoadmapData>(
    defaultRoadmaps['Data Scientist'] || Object.values(defaultRoadmaps)[0]
  );
  const [dailyTasks, setDailyTasks] = useState<DailyFocusTask[]>(initialDailyTasks);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Modals state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isExploreCareersOpen, setIsExploreCareersOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizTopic, setQuizTopic] = useState('Data Structures & Machine Learning');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Learning Module Modal
  const [activeLearningPhaseId, setActiveLearningPhaseId] = useState<string | null>(null);

  // Recalculate Readiness and Completed Skills
  const recalculateStats = (phases: typeof currentRoadmap.phases, knownCount: number) => {
    let totalMilestones = 0;
    let completedMilestones = 0;
    phases.forEach((p) => {
      if (p.milestones) {
        totalMilestones += p.milestones.length;
        completedMilestones += p.milestones.filter((m) => m.completed).length;
      }
    });

    const milestoneRatio = totalMilestones > 0 ? completedMilestones / totalMilestones : 0.4;
    const skillRatio = currentRoadmap.totalRequiredSkillsCount > 0
      ? knownCount / currentRoadmap.totalRequiredSkillsCount
      : 0.4;

    const computedScore = Math.min(
      95,
      Math.max(15, Math.round((milestoneRatio * 0.5 + skillRatio * 0.5) * 100))
    );

    return computedScore;
  };

  // Handlers
  const handleToggleDailyTask = (taskId: string) => {
    setDailyTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleToggleMilestone = (phaseId: string, milestoneId: string) => {
    setCurrentRoadmap((prev) => {
      const updatedPhases = prev.phases.map((phase) => {
        if (phase.id === phaseId && phase.milestones) {
          const updatedMilestones = phase.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          );
          const comp = updatedMilestones.filter((m) => m.completed).length;
          const prog = Math.round((comp / updatedMilestones.length) * 100);
          const stat = comp === updatedMilestones.length ? 'completed' : comp > 0 ? 'in_progress' : phase.status;
          return { ...phase, milestones: updatedMilestones, progress: prog, status: stat as any };
        }
        return phase;
      });

      const newScore = recalculateStats(updatedPhases, prev.acquiredSkillsCount);
      return {
        ...prev,
        phases: updatedPhases,
        readinessScore: newScore,
      };
    });
  };

  const handleAddKnownSkill = (skillName: string) => {
    if (!currentRoadmap.knownSkills.includes(skillName)) {
      setCurrentRoadmap((prev) => {
        const nextKnown = [...prev.knownSkills, skillName];
        const nextCount = prev.acquiredSkillsCount + 1;
        const newScore = recalculateStats(prev.phases, nextCount);
        return {
          ...prev,
          knownSkills: nextKnown,
          acquiredSkillsCount: nextCount,
          readinessScore: newScore,
        };
      });

      setUserProfile((prev) => ({
        ...prev,
        completedSkillsCount: prev.completedSkillsCount + 1,
      }));
    }
  };

  const handleUpdateSkillStatus = (skillName: string, newStatus: SkillStatus) => {
    setCurrentRoadmap((prev) => {
      let known = prev.knownSkills.filter((s) => s !== skillName);
      let learning = prev.learningSkills.filter((s) => s.name !== skillName);
      let needed = prev.neededSkills.filter((s) => s.name !== skillName);

      if (newStatus === 'known') {
        known.push(skillName);
      } else if (newStatus === 'learning') {
        learning.push({ name: skillName, progress: 40 });
      } else {
        needed.push({ name: skillName, priority: 'MEDIUM' });
      }

      const nextCount = known.length;
      const newScore = recalculateStats(prev.phases, nextCount);

      return {
        ...prev,
        knownSkills: known,
        learningSkills: learning,
        neededSkills: needed,
        acquiredSkillsCount: nextCount,
        readinessScore: newScore,
      };
    });
  };

  const handleCompleteOnboarding = (newProfile: UserProfile, newRoadmap?: RoadmapData) => {
    setUserProfile(newProfile);
    if (newRoadmap) {
      setCurrentRoadmap(newRoadmap);
    } else if (defaultRoadmaps[newProfile.targetRole]) {
      setCurrentRoadmap(defaultRoadmaps[newProfile.targetRole]);
    }
    setIsOnboardingOpen(false);
    setShowHomeHero(false);
    setActiveTab('roadmap');
  };

  const handleSelectRole = (roadmap: RoadmapData) => {
    setCurrentRoadmap(roadmap);
    setUserProfile((prev) => ({
      ...prev,
      targetRole: roadmap.roleTitle,
    }));
  };

  const handleResetAll = () => {
    setUserProfile(initialUserProfile);
    setCurrentRoadmap(defaultRoadmaps['Data Scientist']);
    setDailyTasks(initialDailyTasks);
    setActiveTab('dashboard');
    setShowHomeHero(false);
  };

  const handleOpenLearningModule = (phaseId: string) => {
    setActiveLearningPhaseId(phaseId);
  };

  const activePhaseObject = currentRoadmap.phases.find((p) => p.id === activeLearningPhaseId) || null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <Header
        onOpenMenu={() => setIsDrawerOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={notifications.filter((n) => !n.read).length}
        onStartOnboarding={() => setIsOnboardingOpen(true)}
        showHomeHero={showHomeHero}
        onToggleHero={() => setShowHomeHero((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto pb-12">
        {showHomeHero ? (
          <HomeHeroView
            onStartOnboarding={() => setIsOnboardingOpen(true)}
            onExploreCareers={() => setIsExploreCareersOpen(true)}
            onGoToRoadmap={() => {
              setShowHomeHero(false);
              setActiveTab('roadmap');
            }}
            currentRoadmap={currentRoadmap}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                userProfile={userProfile}
                roadmapData={currentRoadmap}
                dailyTasks={dailyTasks}
                onToggleDailyTask={handleToggleDailyTask}
                onGoToRoadmap={() => setActiveTab('roadmap')}
                onOpenLearningModule={handleOpenLearningModule}
                onStartQuiz={() => {
                  setQuizTopic(currentRoadmap.roleTitle + ' Fundamentals & DSA');
                  setIsQuizOpen(true);
                }}
              />
            )}

            {activeTab === 'roadmap' && (
              <RoadmapView
                roadmapData={currentRoadmap}
                onOpenLearningModule={handleOpenLearningModule}
                onSkillGapClick={(skill) => {
                  setQuizTopic(skill);
                  setIsQuizOpen(true);
                }}
                onAddKnownSkill={handleAddKnownSkill}
                onSwitchRole={() => setIsExploreCareersOpen(true)}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsView
                roadmapData={currentRoadmap}
                onUpdateSkillStatus={handleUpdateSkillStatus}
                onAddSkill={(name) => handleAddKnownSkill(name)}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                userProfile={userProfile}
                roadmapData={currentRoadmap}
                onRetakeAssessment={() => setIsOnboardingOpen(true)}
                onSwitchRole={() => setIsExploreCareersOpen(true)}
                onResetAll={handleResetAll}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom 4-Tab Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setShowHomeHero(false);
          setActiveTab(tab);
        }}
      />

      {/* 5-Step Guided Onboarding Modal (Matching Image 1) */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleCompleteOnboarding}
        initialProfile={userProfile}
      />

      {/* Interactive Learning Module Modal (Launched from "Continue Learning ->") */}
      <InteractiveLearningModal
        isOpen={Boolean(activeLearningPhaseId)}
        onClose={() => setActiveLearningPhaseId(null)}
        phase={activePhaseObject}
        roleTitle={currentRoadmap.roleTitle}
        onToggleMilestone={handleToggleMilestone}
        onOpenQuiz={(topic) => {
          setQuizTopic(topic);
          setIsQuizOpen(true);
        }}
      />

      {/* Explore Careers Catalogue Modal */}
      <ExploreCareersModal
        isOpen={isExploreCareersOpen}
        onClose={() => setIsExploreCareersOpen(false)}
        currentRole={currentRoadmap.roleTitle}
        onSelectRole={handleSelectRole}
        onStartCustomOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* AI Practice Quiz Modal */}
      <AIQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        topic={quizTopic}
        roleTitle={currentRoadmap.roleTitle}
      />

      {/* Notifications Modal */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
      />

      {/* Side Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        onChangeTab={(t) => {
          setShowHomeHero(false);
          setActiveTab(t);
        }}
        userProfile={userProfile}
        roadmapData={currentRoadmap}
        onStartOnboarding={() => setIsOnboardingOpen(true)}
        onExploreCareers={() => setIsExploreCareersOpen(true)}
        onShowHeroView={() => setShowHomeHero(true)}
      />
    </div>
  );
}
