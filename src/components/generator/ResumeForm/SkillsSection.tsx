"use client";

import React, { ComponentProps, FC, useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { Cpu, UserCheck, Languages, Plus, X } from "lucide-react";
import { ResumeData } from "@/types/resume";

export default function SkillsSection() {
  const { resumeData, updateSkills } = useResume();
  const { skills } = resumeData;

  return (
    <section className="space-y-6">
      <header>
        <h2 className="mb-1 text-lg font-bold text-zinc-100">
          Skills & Competencies
        </h2>
        <p className="text-sm text-balance text-zinc-400">
          Add technical stack, soft skills, and languages spoken. Type the skill
          and press{" "}
          <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">
            Enter
          </kbd>{" "}
          or use a comma to save.
        </p>
      </header>

      <section className="space-y-6">
        {/* Technical Skills Tag Field */}
        <SkillGroup
          label="Technical / Hard Skills"
          Icon={Cpu}
          category="technical"
          onAddTag={(newtags) => updateSkills("technical", newtags)}
          onRemoveTag={(newTags) => updateSkills("technical", newTags)}
          skills={skills.technical}
          placeholder="e.g. React, TypeScript, Next.js, Node.js"
        />

        {/* Soft Skills Tag Field */}
        <SkillGroup
          category="soft"
          label="Professional / Soft Skills"
          Icon={UserCheck}
          onAddTag={(newtags) => updateSkills("technical", newtags)}
          onRemoveTag={(newTags) => updateSkills("soft", newTags)}
          skills={skills.soft}
          placeholder="e.g. Leadership, Mentorship, Agile Delivery"
        />

        {/* Languages Tag Field */}
        <SkillGroup
          category="languages"
          label="Languages Spoken"
          Icon={Languages}
          onAddTag={(newtags) => updateSkills("technical", newtags)}
          onRemoveTag={(newTags) => updateSkills("languages", newTags)}
          skills={skills.languages}
          placeholder="e.g. English (Native), Spanish (Conversational)"
        />
      </section>
    </section>
  );
}

type SkillGroup = FC<{
  category: keyof ResumeData["skills"];
  label: string;
  Icon: React.FC<ComponentProps<"svg">>;
  onAddTag: (newTags: string[]) => void;
  onRemoveTag: (newTags: string[]) => void;
  skills: string[];
  placeholder?: string;
}>;

const SkillGroup: SkillGroup = ({
  Icon,
  label,
  onAddTag,
  onRemoveTag,
  skills,
  category,
  placeholder = "",
}) => {
  const [value, setValue] = useState<string>("");

  const handleAddTag = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    // Prevent duplicate tags
    if (skills.includes(trimmed)) return;

    const newTags = [...skills, trimmed];
    onAddTag(newTags);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    const newTags = skills.filter((_, idx) => idx !== indexToRemove);
    onRemoveTag(newTags);
  };

  return (
    <section className="space-y-2.5" id={category + "-skills-wrapper"}>
      <label
        htmlFor={category + "-skills"}
        className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300"
      >
        <Icon className="size-4 text-zinc-500" />
        <span>{label}</span>
      </label>

      <main id={category + "-skills-input"} className="flex gap-2">
        <input
          id={category + "-skills"}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          placeholder={placeholder}
          className="focus:border-accent transition-300 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:outline-none"
        />
        <button
          onClick={() => handleAddTag()}
          className="transition-300 flex shrink-0 cursor-pointer items-center justify-center rounded-lg bg-zinc-800 p-2.5 text-zinc-200 hover:bg-zinc-700 active:scale-95"
        >
          <Plus className="size-4" />
        </button>
      </main>

      {/* Committed Tags */}
      <main
        className="flex flex-wrap gap-1.5 pt-1"
        id={category + "-skills-tags"}
      >
        {skills.map((tag, idx) => (
          <span
            id={category + "-skills-tag-" + (idx + 1)}
            key={category + "-skills-tag-" + idx}
            className="group transition-300 inline-flex shrink-0 items-center gap-1 rounded-full border border-zinc-800 bg-zinc-800 py-1 pr-1.5 pl-2.5 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            <span>{tag}</span>
            <button
              onClick={() => handleRemoveTag(idx)}
              className="transition-300 shrink-0 cursor-pointer rounded-full p-0.5 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-200"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        {skills.length === 0 && (
          <span className="text-xs font-light text-zinc-600 italic">
            No technical skills added yet.
          </span>
        )}
      </main>
    </section>
  );
};
