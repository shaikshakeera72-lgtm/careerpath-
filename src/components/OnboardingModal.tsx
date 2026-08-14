import React, { useState } from 'react';
import { X, User, GraduationCap, ArrowRight, ArrowLeft, Check, Sparkles, Target, Wrench, Clock, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { UserProfile, RoadmapData } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: UserProfile, newRoadmap?: RoadmapData) => void;
  initialProfile?: UserProfile;
}

const CAREER_OPTIONS = [
  { role: 'Data Scientist', desc: 'Statistics, Machine Learning, Python & Big Data', icon: '📊' },
  { role: 'Software Engineer', desc: 'Full-stack systems, DSA, APIs & Architecture', icon: '💻' },
  { role: 'AI Engineer', desc: 'LLMs, RAG, Neural Networks & Autonomous Agents', icon: '🤖' },
  { role: 'Full Stack Web Developer', desc: 'React, Node.js, Databases & Cloud Deployment', icon: '🌐' },
  { role: 'DevOps & Cloud Engineer', desc: 'Kubernetes, Terraform, CI/CD & AWS/GCP', icon: '☁️' },
  { role: 'Product Manager (Tech)', desc: 'Roadmaps, User Analytics, Agile & Execution', icon: '🎯' },
];

const SKILL_OPTIONS = [
  'Python', 'SQL', 'Pandas', 'NumPy', 'Git & GitHub', 'JavaScript', 'TypeScript',
  'React', 'Node.js', 'C++', 'Java', 'Data Structures', 'Algorithms',
  'Machine Learning', 'Deep Learning', 'Docker', 'AWS', 'Linux Basics', 'HTML & CSS'
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialProfile,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form states
  const [fullName, setFullName] = useState(initialProfile?.name || 'Jane Doe');
  const [university, setUniversity] = useState(initialProfile?.university || 'Stanford University');
  const [degree, setDegree] = useState(initialProfile?.degree || 'Bachelor of Science in Computer Science');
  const [gradYear, setGradYear] = useState(initialProfile?.gradYear || '2025');
  
  const [selectedRole, setSelectedRole] = useState(initialProfile?.targetRole || 'Data Scientist');
  const [customRole, setCustomRole] = useState('');
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'SQL', 'Pandas', 'Git & GitHub']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [weeklyHours, setWeeklyHours] = useState(12);
  const [learningPace, setLearningPace] = useState<'Casual' | 'Balanced' | 'Intensive'>('Balanced');
  
  const [learningPreference, setLearningPreference] = useState('Hands-on Projects & Real Code');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = () => {
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step: AI Generation
      setIsGenerating(true);
      const effectiveRole = customRole.trim() || selectedRole;

      const newProfile: UserProfile = {
        name: fullName.trim() || 'Jane Doe',
        university: university.trim() || 'Stanford University',
        degree: degree || 'Bachelor of Science in Computer Science',
        gradYear: gradYear || '2025',
        targetRole: effectiveRole,
        experienceLevel,
        weeklyHours,
        learningPace,
        streakDays: 1,
        completedSkillsCount: selectedSkills.length || 8,
        totalSkillsCount: 22,
      };

      try {
        const response = await fetch('/api/ai/generate-roadmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullName,
            university,
            degree,
            gradYear,
            targetRole: effectiveRole,
            experienceLevel,
            weeklyHours,
            currentSkills: selectedSkills,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {
            // fallback if canvas not available
          }
          setIsGenerating(false);
          onComplete(newProfile, data);
          return;
        }
      } catch (err) {
        console.warn('AI Roadmap creation fetch failed:', err);
      }

      setIsGenerating(false);
      onComplete(newProfile);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 bg-grid-pattern min-h-[580px] flex flex-col">
        
        {/* Top Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur-md">
          <button
            onClick={onClose}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-indigo-700" />
          </button>
          <span className="text-xl font-bold tracking-tight text-indigo-700 font-['Plus_Jakarta_Sans',sans-serif]">
            CareerPath AI
          </span>
          <div className="w-7" />
        </div>

        {/* Loading Overlay */}
        {isGenerating ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white/95">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin flex items-center justify-center"></div>
              <Sparkles className="w-8 h-8 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Generating Your Custom AI Roadmap...
            </h3>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Synthesizing syllabus milestones, mapping skill gaps for {customRole || selectedRole}, and personalizing your career readiness index.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between p-5 sm:p-6">
            
            {/* Step Header */}
            <div>
              <div className="text-center mb-4">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600">
                  STEP {currentStep} OF {totalSteps}
                </span>
                
                {currentStep === 1 && (
                  <>
                    <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 mt-1 tracking-tight">
                      Tell us about your education
                    </h2>
                    <p className="text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                      We use this to establish your baseline foundation.
                    </p>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 mt-1 tracking-tight">
                      What is your target career?
                    </h2>
                    <p className="text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                      Choose your dream role to calibrate required industry skills.
                    </p>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 mt-1 tracking-tight">
                      What skills do you already know?
                    </h2>
                    <p className="text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                      Select your acquired foundations to calculate your readiness gap.
                    </p>
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 mt-1 tracking-tight">
                      Experience & Commitment
                    </h2>
                    <p className="text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                      How much time can you dedicate per week?
                    </p>
                  </>
                )}

                {currentStep === 5 && (
                  <>
                    <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 mt-1 tracking-tight">
                      Learning Preferences
                    </h2>
                    <p className="text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                      Tailor your roadmap milestones to your preferred study style.
                    </p>
                  </>
                )}
              </div>

              {/* Progress Line */}
              <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden mb-6">
                <motion.div
                  className="h-full bg-indigo-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.35 }}
                />
              </div>

              {/* Form Content Steps */}
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4"
                  >
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative flex items-center">
                        <User className="absolute left-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* College / University */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        College / University
                      </label>
                      <div className="relative flex items-center">
                        <GraduationCap className="absolute left-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={university}
                          onChange={(e) => setUniversity(e.target.value)}
                          placeholder="Stanford University"
                          className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Degree Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Degree
                      </label>
                      <select
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
                      >
                        <option value="Bachelor of Science in Computer Science">Bachelor of Science in Computer Science</option>
                        <option value="Bachelor of Science in Data Science">Bachelor of Science in Data Science</option>
                        <option value="Master of Science in Computer Science">Master of Science in Computer Science</option>
                        <option value="Bachelor of Engineering (Software / IT)">Bachelor of Engineering (Software / IT)</option>
                        <option value="Bachelor of Science in Mathematics / Statistics">Bachelor of Science in Mathematics / Statistics</option>
                        <option value="Self-Taught / Bootcamp Graduate">Self-Taught / Bootcamp Graduate</option>
                        <option value="Other Degree / Non-CS Background">Other Degree / Non-CS Background</option>
                      </select>
                    </div>

                    {/* Graduation Year */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Graduation Year
                      </label>
                      <select
                        value={gradYear}
                        onChange={(e) => setGradYear(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
                      >
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="Already Graduated">Already Graduated</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-2 max-h-[310px] overflow-y-auto pr-1 hide-scrollbar"
                  >
                    {CAREER_OPTIONS.map((item) => {
                      const isSelected = selectedRole === item.role && !customRole;
                      return (
                        <div
                          key={item.role}
                          onClick={() => {
                            setSelectedRole(item.role);
                            setCustomRole('');
                          }}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{item.role}</p>
                              <p className="text-[11px] text-slate-500">{item.desc}</p>
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                              isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}

                    {/* Custom Role Input */}
                    <div className="pt-1">
                      <input
                        type="text"
                        placeholder="Or enter custom role (e.g. Quantum AI Researcher)"
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"
                  >
                    <div className="flex flex-wrap gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                      {SKILL_OPTIONS.map((skill) => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            {skill}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={customSkillInput}
                        onChange={(e) => setCustomSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                        placeholder="Add custom skill (e.g. PyTorch, Rust)"
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={addCustomSkill}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Current Experience Level
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setExperienceLevel(lvl)}
                            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer ${
                              experienceLevel === lvl
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Weekly Study Hours
                        </label>
                        <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {weeklyHours} hrs / week
                        </span>
                      </div>
                      <input
                        type="range"
                        min={4}
                        max={35}
                        step={1}
                        value={weeklyHours}
                        onChange={(e) => setWeeklyHours(Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                        <span>4 hrs (Casual)</span>
                        <span>15 hrs (Recommended)</span>
                        <span>35 hrs (Intensive)</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-2.5"
                  >
                    {[
                      { title: 'Hands-on Projects & Real Code', desc: 'Build production-ready portfolio artifacts and GitHub repos.' },
                      { title: 'LeetCode & Problem Solving', desc: 'Focus on coding interviews, data structures, and algorithmic speed.' },
                      { title: 'System Design & End-to-End Architecture', desc: 'Master scalable infrastructure, databases, and microservices.' },
                      { title: 'Fast-Track Job Ready Curriculum', desc: 'Optimized speed-run focusing only on high-priority hiring requirements.' }
                    ].map((pref) => {
                      const isSelected = learningPreference === pref.title;
                      return (
                        <div
                          key={pref.title}
                          onClick={() => setLearningPreference(pref.title)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-900">{pref.title}</p>
                            {isSelected && <Check className="w-4 h-4 text-indigo-600 stroke-[3]" />}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{pref.desc}</p>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer ml-auto"
              >
                {currentStep === totalSteps ? 'Generate AI Roadmap' : 'Next Step'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
