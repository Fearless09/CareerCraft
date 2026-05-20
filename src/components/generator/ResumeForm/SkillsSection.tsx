"use client";

import React, { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { Cpu, UserCheck, Languages, Plus, X } from "lucide-react";

export default function SkillsSection() {
  const { resumeData, updateSkills } = useResume();
  const { skills } = resumeData;

  const [techInput, setTechInput] = useState("");
  const [softInput, setSoftInput] = useState("");
  const [langInput, setLangInput] = useState("");

  const handleAddTag = (
    category: "technical" | "soft" | "languages",
    value: string,
  ) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    // Prevent duplicate tags
    if (skills[category].includes(trimmed)) {
      return;
    }

    const newTags = [...skills[category], trimmed];
    updateSkills(category, newTags);
  };

  const handleRemoveTag = (
    category: "technical" | "soft" | "languages",
    indexToRemove: number,
  ) => {
    const newTags = skills[category].filter((_, idx) => idx !== indexToRemove);
    updateSkills(category, newTags);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    category: "technical" | "soft" | "languages",
    inputValue: string,
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(category, inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="mb-1 text-lg font-bold text-zinc-100">
          Skills & Competencies
        </h2>
        <p className="text-xs text-zinc-400">
          Add technical stack, soft skills, and languages spoken. Type the skill
          and press{" "}
          <kbd className="rounded bg-zinc-800 px-1 font-mono text-[10px] text-zinc-300">
            Enter
          </kbd>{" "}
          or use a comma to save.
        </p>
      </div>

      <div className="space-y-6">
        {/* Technical Skills Tag Field */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
            <Cpu className="h-4 w-4 text-zinc-500" />
            <span>Technical / Hard Skills</span>
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) =>
                handleKeyDown(e, "technical", techInput, setTechInput)
              }
              placeholder="e.g. React, TypeScript, Next.js, Node.js"
              className="focus:border-accent w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 transition duration-150 focus:outline-none"
            />
            <button
              onClick={() => {
                handleAddTag("technical", techInput);
                setTechInput("");
              }}
              className="hover:bg-zinc-750 flex cursor-pointer items-center justify-center rounded-lg bg-zinc-800 p-2.5 text-zinc-200 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Committed Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.technical.map((tag, idx) => (
              <span
                key={idx}
                className="bg-zinc-850 group inline-flex items-center gap-1 rounded-full border border-zinc-800 py-1 pr-1.5 pl-2.5 text-xs text-zinc-300 transition hover:bg-zinc-800"
              >
                <span>{tag}</span>
                <button
                  onClick={() => handleRemoveTag("technical", idx)}
                  className="cursor-pointer rounded-full p-0.5 text-zinc-500 transition hover:bg-zinc-700 hover:text-zinc-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {skills.technical.length === 0 && (
              <span className="text-xs font-light text-zinc-600 italic">
                No technical skills added yet.
              </span>
            )}
          </div>
        </div>

        {/* Soft Skills Tag Field */}
        <div className="border-zinc-850 space-y-2.5 border-t pt-5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
            <UserCheck className="h-4 w-4 text-zinc-500" />
            <span>Professional / Soft Skills</span>
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={softInput}
              onChange={(e) => setSoftInput(e.target.value)}
              onKeyDown={(e) =>
                handleKeyDown(e, "soft", softInput, setSoftInput)
              }
              placeholder="e.g. Leadership, Mentorship, Agile Delivery"
              className="focus:border-accent w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 transition duration-150 focus:outline-none"
            />
            <button
              onClick={() => {
                handleAddTag("soft", softInput);
                setSoftInput("");
              }}
              className="hover:bg-zinc-750 flex cursor-pointer items-center justify-center rounded-lg bg-zinc-800 p-2.5 text-zinc-200 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Committed Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.soft.map((tag, idx) => (
              <span
                key={idx}
                className="bg-zinc-850 group inline-flex items-center gap-1 rounded-full border border-zinc-800 py-1 pr-1.5 pl-2.5 text-xs text-zinc-300 transition hover:bg-zinc-800"
              >
                <span>{tag}</span>
                <button
                  onClick={() => handleRemoveTag("soft", idx)}
                  className="cursor-pointer rounded-full p-0.5 text-zinc-500 transition hover:bg-zinc-700 hover:text-zinc-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {skills.soft.length === 0 && (
              <span className="text-xs font-light text-zinc-600 italic">
                No soft skills added yet.
              </span>
            )}
          </div>
        </div>

        {/* Languages Tag Field */}
        <div className="border-zinc-850 space-y-2.5 border-t pt-5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
            <Languages className="h-4 w-4 text-zinc-500" />
            <span>Languages Spoken</span>
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={langInput}
              onChange={(e) => setLangInput(e.target.value)}
              onKeyDown={(e) =>
                handleKeyDown(e, "languages", langInput, setLangInput)
              }
              placeholder="e.g. English (Native), Spanish (Conversational)"
              className="focus:border-accent w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 transition duration-150 focus:outline-none"
            />
            <button
              onClick={() => {
                handleAddTag("languages", langInput);
                setLangInput("");
              }}
              className="hover:bg-zinc-750 flex cursor-pointer items-center justify-center rounded-lg bg-zinc-800 p-2.5 text-zinc-200 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Committed Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.languages.map((tag, idx) => (
              <span
                key={idx}
                className="bg-zinc-850 group inline-flex items-center gap-1 rounded-full border border-zinc-800 py-1 pr-1.5 pl-2.5 text-xs text-zinc-300 transition hover:bg-zinc-800"
              >
                <span>{tag}</span>
                <button
                  onClick={() => handleRemoveTag("languages", idx)}
                  className="cursor-pointer rounded-full p-0.5 text-zinc-500 transition hover:bg-zinc-700 hover:text-zinc-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {skills.languages.length === 0 && (
              <span className="text-xs font-light text-zinc-600 italic">
                No languages added yet.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
