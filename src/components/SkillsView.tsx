import React, { useState } from 'react';
import { Search, Brain, CheckCircle2, RefreshCw, AlertCircle, Sparkles, Filter, Plus, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { RoadmapData, SkillStatus } from '../types';

interface SkillsViewProps {
  roadmapData: RoadmapData;
  onUpdateSkillStatus: (skillName: string, newStatus: SkillStatus) => void;
  onAddSkill: (skillName: string, status: SkillStatus) => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({
  roadmapData,
  onUpdateSkillStatus,
  onAddSkill,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'known' | 'learning' | 'needed'>('all');
  const [customSkill, setCustomSkill] = useState('');
  const [targetJobDescription, setTargetJobDescription] = useState('');
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false);
  const [jobAnalysisResult, setJobAnalysisResult] = useState<{ matchScore: number; missingSkills: string[]; tips: string } | null>(null);

  // Consolidate skills
  const allSkills = [
    ...roadmapData.knownSkills.map((s) => ({ name: s, status: 'known' as SkillStatus, priority: undefined, progress: 100 })),
    ...roadmapData.learningSkills.map((s) => ({ name: s.name, status: 'learning' as SkillStatus, priority: undefined, progress: s.progress })),
    ...roadmapData.neededSkills.map((s) => ({ name: s.name, status: 'needed' as SkillStatus, priority: s.priority, progress: 0 })),
  ];

  const filteredSkills = allSkills.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || s.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim()) {
      onAddSkill(customSkill.trim(), 'known');
      setCustomSkill('');
    }
  };

  const handleAnalyzeJob = () => {
    if (!targetJobDescription.trim()) return;
    setIsAnalyzingJob(true);
    setTimeout(() => {
      setIsAnalyzingJob(false);
      setJobAnalysisResult({
        matchScore: 68,
        missingSkills: ['Deep Learning (PyTorch)', 'Docker / Containerization', 'Distributed Computing (Spark)'],
        tips: 'Adding 1 production project featuring PyTorch and Dockerized model serving will increase your interview callback rate significantly.',
      });
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto px-5 pt-4 pb-28 space-y-5 bg-radial-glow">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight">
          Skills & Competencies
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Manage your technical stack and bridge gaps for {roadmapData.roleTitle}.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills (e.g. Python, SQL, NLP)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
          {[
            { id: 'all', label: `All (${allSkills.length})` },
            { id: 'known', label: `Known (${roadmapData.knownSkills.length})` },
            { id: 'learning', label: `Learning (${roadmapData.learningSkills.length})` },
            { id: 'needed', label: `Needed (${roadmapData.neededSkills.length})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add Custom Skill Bar */}
      <form onSubmit={handleAddSubmit} className="flex gap-2">
        <input
          type="text"
          value={customSkill}
          onChange={(e) => setCustomSkill(e.target.value)}
          placeholder="Add a new skill to profile..."
          className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </form>

      {/* Skills List */}
      <div className="space-y-2.5">
        {filteredSkills.map((skill) => (
          <div
            key={skill.name}
            className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              {skill.status === 'known' ? (
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </div>
              ) : skill.status === 'learning' ? (
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4 stroke-[2.5]" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-slate-900">{skill.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">
                  Status: {skill.status} {skill.status === 'learning' ? `(${skill.progress}%)` : ''}
                </p>
              </div>
            </div>

            {/* Status Switcher Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdateSkillStatus(skill.name, 'known')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                  skill.status === 'known'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Know
              </button>
              <button
                onClick={() => onUpdateSkillStatus(skill.name, 'learning')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                  skill.status === 'learning'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Learn
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Job Description Match Analyzer */}
      <div className="p-5 rounded-3xl bg-white border border-indigo-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            AI Job Description Gap Matcher
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Paste any job posting to analyze how closely your profile matches and generate tailored roadmap recommendations.
        </p>

        <textarea
          rows={3}
          value={targetJobDescription}
          onChange={(e) => setTargetJobDescription(e.target.value)}
          placeholder="Paste requirements: e.g. Looking for a Data Scientist with 2+ years of Python, SQL, PyTorch, Docker..."
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
        />

        <button
          onClick={handleAnalyzeJob}
          disabled={isAnalyzingJob || !targetJobDescription.trim()}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {isAnalyzingJob ? 'Analyzing Skill Vectors...' : 'Analyze Match with AI'}
        </button>

        {jobAnalysisResult && (
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Job Fit Score</span>
              <span className="text-xs font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-md shadow-2xs">
                {jobAnalysisResult.matchScore}% Match
              </span>
            </div>
            <div className="text-[11px] text-slate-600">
              <p className="font-semibold text-slate-800">Priority Skill Gaps:</p>
              <ul className="list-disc list-inside mt-0.5 text-rose-700">
                {jobAnalysisResult.missingSkills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <p className="text-[11px] text-indigo-950 italic pt-1 border-t border-indigo-100">
              💡 {jobAnalysisResult.tips}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
