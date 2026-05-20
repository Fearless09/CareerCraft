'use client';

import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { Briefcase, Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp, PlusCircle, MinusCircle } from 'lucide-react';

export default function ExperienceSection() {
  const { 
    resumeData, 
    addExperience, 
    updateExperience, 
    removeExperience 
  } = useResume();

  const { experience } = resumeData;

  const handleFieldChange = (id: string, field: string, value: any) => {
    updateExperience(id, { [field]: value });
  };

  const handleBulletChange = (id: string, index: number, value: string) => {
    const expItem = experience.find(e => e.id === id);
    if (!expItem) return;
    const newBullets = [...expItem.bullets];
    newBullets[index] = value;
    updateExperience(id, { bullets: newBullets });
  };

  const addBullet = (id: string) => {
    const expItem = experience.find(e => e.id === id);
    if (!expItem) return;
    updateExperience(id, { bullets: [...expItem.bullets, ''] });
  };

  const removeBullet = (id: string, index: number) => {
    const expItem = experience.find(e => e.id === id);
    if (!expItem) return;
    if (expItem.bullets.length <= 1) return; // Keep at least one bullet
    const newBullets = expItem.bullets.filter((_, idx) => idx !== index);
    updateExperience(id, { bullets: newBullets });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 mb-1">Work History</h2>
          <p className="text-xs text-zinc-400">Add details about your professional career, key achievements, and duties.</p>
        </div>
        <button
          onClick={addExperience}
          className="flex items-center gap-1.5 bg-accent hover:bg-rose-600 text-white font-medium text-xs px-3 py-2 rounded-lg shadow transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Job</span>
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
          <Briefcase className="w-10 h-10 mx-auto mb-2 text-zinc-600" />
          <p className="text-sm font-semibold">No work experience added yet.</p>
          <p className="text-xs text-zinc-500 mt-1">Click the "Add Job" button above to populate your career history.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {experience.map((exp, index) => (
            <div 
              key={exp.id} 
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 relative space-y-4 group animate-fade-in-up"
            >
              {/* Header Bar with quick actions */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs font-bold text-zinc-400 bg-zinc-850 px-2 py-1 rounded">
                  Job Entry #{index + 1}
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => removeExperience(exp.id)}
                    title="Remove Job"
                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-850 rounded-lg transition duration-150 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Job Title / Position</label>
                  <input
                    type="text"
                    value={exp.jobTitle}
                    onChange={(e) => handleFieldChange(exp.id, 'jobTitle', e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-zinc-855 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition"
                  />
                </div>

                {/* Company Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Company Name</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleFieldChange(exp.id, 'company', e.target.value)}
                    placeholder="e.g. TechCraft Solutions"
                    className="w-full bg-zinc-855 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition"
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Start Date</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => handleFieldChange(exp.id, 'startDate', e.target.value)}
                    placeholder="e.g. Jan 2023"
                    className="w-full bg-zinc-855 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">End Date</label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => handleFieldChange(exp.id, 'endDate', e.target.value)}
                    placeholder="e.g. Present or Dec 2024"
                    className="w-full bg-zinc-855 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300">Location (City, State / Remote)</label>
                  <input
                    type="text"
                    value={exp.location || ''}
                    onChange={(e) => handleFieldChange(exp.id, 'location', e.target.value)}
                    placeholder="e.g. San Francisco, CA or Remote"
                    className="w-full bg-zinc-855 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition"
                  />
                </div>
              </div>

              {/* Bullet Points Description */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-zinc-300">Key Roles & Metrics Achievements</label>
                  <button
                    onClick={() => addBullet(exp.id)}
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-accent font-semibold transition cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Bullet Point</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {exp.bullets.map((bullet, bulletIdx) => (
                    <div key={bulletIdx} className="flex gap-2">
                      <textarea
                        value={bullet}
                        onChange={(e) => handleBulletChange(exp.id, bulletIdx, e.target.value)}
                        placeholder={`Bullet point description detailing quantitative outcomes (e.g. Led redesign boosting active registrations by 20%).`}
                        rows={2}
                        className="w-full bg-zinc-855 border border-zinc-800 text-zinc-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-accent transition"
                      />
                      <button
                        onClick={() => removeBullet(exp.id, bulletIdx)}
                        disabled={exp.bullets.length <= 1}
                        title="Delete Bullet"
                        className="p-2 text-zinc-600 hover:text-red-400 hover:bg-zinc-850 rounded-lg transition disabled:opacity-40 shrink-0 self-start cursor-pointer"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
