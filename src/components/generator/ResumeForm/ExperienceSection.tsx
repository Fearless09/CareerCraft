"use client";

import { useResume } from "@/context/ResumeContext";
import { cn } from "@/lib/utils";
import { Briefcase, Plus, Trash2, PlusCircle, MinusCircle } from "lucide-react";
import { ComponentProps, FC } from "react";

export default function ExperienceSection() {
  const { resumeData, addExperience, updateExperience, removeExperience } =
    useResume();

  const { experience } = resumeData;

  const handleBulletChange = (id: string, index: number, value: string) => {
    const expItem = experience.find((e) => e.id === id);
    if (!expItem) return;
    const newBullets = [...expItem.bullets];
    newBullets[index] = value;
    updateExperience(id, { bullets: newBullets });
  };

  const addBullet = (id: string) => {
    const expItem = experience.find((e) => e.id === id);
    if (!expItem) return;
    updateExperience(id, { bullets: [...expItem.bullets, ""] });
  };

  const removeBullet = (id: string, index: number) => {
    const expItem = experience.find((e) => e.id === id);
    if (!expItem) return;
    if (expItem.bullets.length <= 1) return; // Keep at least one bullet
    const newBullets = expItem.bullets.filter((_, idx) => idx !== index);
    updateExperience(id, { bullets: newBullets });
  };

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-lg font-bold text-zinc-100">Work History</h2>
          <p className="text-sm text-balance text-zinc-400">
            Add details about your professional career, key achievements, and
            duties.
          </p>
        </div>

        <button
          onClick={addExperience}
          className="bg-accent transition-300 flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white hover:bg-rose-600 active:scale-95"
        >
          <Plus className="size-4" />
          <span>Add Job</span>
        </button>
      </header>

      {experience.length === 0 ? (
        <main className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
          <Briefcase className="mx-auto mb-2 size-10 text-zinc-600" />
          <p className="text-sm font-semibold">No work experience added yet.</p>
          <p className="mt-1 text-xs">
            Click the "Add Job" button above to populate your career history.
          </p>
        </main>
      ) : (
        <section className="space-y-6">
          {experience.map((exp, index) => (
            <main
              key={exp.id}
              id={"experience_#" + (index + 1)}
              className="group relative space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            >
              {/* Header Bar with quick actions */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="rounded bg-zinc-800 px-2.25 py-1 text-xs font-bold text-zinc-400">
                  Job Entry #{index + 1}
                </span>

                <button
                  onClick={() => removeExperience(exp.id)}
                  title="Remove Job"
                  className="transition-300 shrink-0 cursor-pointer rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* Form Grid */}
              <main
                id={"experience_form_#" + (index + 1)}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                {/* Job Title */}
                <GroupInput
                  label="Job Title / Position"
                  id={"job_title_#" + (index + 1)}
                  value={exp.jobTitle}
                  onChange={(e) =>
                    updateExperience(exp.id, { jobTitle: e.target.value })
                  }
                  placeholder="e.g. Senior Frontend Engineer"
                />

                {/* Company Name */}
                <GroupInput
                  label="Company Name"
                  id={"company_name_#" + (index + 1)}
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(exp.id, { company: e.target.value })
                  }
                  placeholder="e.g. TechCraft Solutions"
                />

                {/* Start Date */}
                <GroupInput
                  label="Start Date"
                  id={"start_date_#" + (index + 1)}
                  value={exp.startDate}
                  onChange={(e) =>
                    updateExperience(exp.id, { startDate: e.target.value })
                  }
                  placeholder="e.g. Jan 2023"
                />

                {/* End Date */}
                <GroupInput
                  label="End Date"
                  id={"end_date_#" + (index + 1)}
                  value={exp.endDate}
                  onChange={(e) =>
                    updateExperience(exp.id, { endDate: e.target.value })
                  }
                  placeholder="e.g. Present or Dec 2024"
                />

                {/* Location */}
                <GroupInput
                  wrapperClassName="md:col-span-2"
                  label="Location (City, State / Remote)"
                  id={"company_location_#" + (index + 1)}
                  value={exp.location || ""}
                  onChange={(e) =>
                    updateExperience(exp.id, { location: e.target.value })
                  }
                  placeholder="e.g. San Francisco, CA or Remote"
                />
              </main>

              {/* Bullet Points Description */}
              <section
                id={"experience_achievements_#" + (index + 1)}
                className="space-y-2.5 pt-2"
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300">
                    Key Roles & Metrics Achievements
                  </label>
                  <button
                    onClick={() => addBullet(exp.id)}
                    className="hover:text-accent transition-300 flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-zinc-400"
                  >
                    <PlusCircle className="size-3.5" />
                    <span>Add Bullet Point</span>
                  </button>
                </div>

                <div
                  className="space-y-2"
                  id={"experience_achievements_forms_#" + (index + 1)}
                >
                  {exp.bullets.map((bullet, bulletIdx) => (
                    <div key={bulletIdx} className="flex gap-2">
                      <textarea
                        id={
                          "experience_achievement_#" +
                          (index + 1) +
                          "_" +
                          (bulletIdx + 1)
                        }
                        value={bullet}
                        onChange={(e) =>
                          handleBulletChange(exp.id, bulletIdx, e.target.value)
                        }
                        placeholder={`Bullet point description detailing quantitative outcomes (e.g. Led redesign boosting active registrations by 20%).`}
                        rows={2.5}
                        className="focus:border-accent transition-300 w-full rounded-lg border border-zinc-800 bg-zinc-800/40 p-2.5 text-xs text-zinc-200 focus:outline-none"
                      />
                      <button
                        onClick={() => removeBullet(exp.id, bulletIdx)}
                        disabled={exp.bullets.length <= 1}
                        title="Delete Bullet"
                        className="transition-300 shrink-0 cursor-pointer self-start rounded-lg p-2 text-zinc-600 hover:bg-zinc-800 hover:text-red-400 disabled:opacity-40"
                      >
                        <MinusCircle className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          ))}
        </section>
      )}
    </section>
  );
}

type GroupInput = FC<
  ComponentProps<"input"> & {
    label: string;
    wrapperClassName?: string;
  }
>;

const GroupInput: GroupInput = ({
  label,
  wrapperClassName,
  className,
  type = "text",
  ...props
}) => {
  return (
    <div className={cn("space-y-1.5", wrapperClassName)}>
      <label htmlFor={props.id} className="text-xs font-semibold text-zinc-300">
        {label}
      </label>
      <input
        type={type}
        className={cn(
          "focus:border-accent transition-300 w-full rounded-lg border border-zinc-800 bg-zinc-800/40 px-3 py-2 text-sm text-zinc-200 focus:outline-none",
          className,
        )}
        {...props}
      />
    </div>
  );
};
