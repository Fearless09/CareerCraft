"use client";

import React, { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { FolderGit2, Plus, Trash2, Globe, X } from "lucide-react";

export default function ProjectsSection() {
  const { resumeData, addProject, updateProject, removeProject } = useResume();

  const { projects } = resumeData;
  const [techInputs, setTechInputs] = useState<Record<string, string>>({});

  const handleFieldChange = (id: string, field: string, value: any) => {
    updateProject(id, { [field]: value });
  };

  const handleAddTech = (id: string) => {
    const rawInput = techInputs[id] || "";
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    const proj = projects.find((p) => p.id === id);
    if (!proj) return;

    const existingTech = proj.techStack || [];
    if (existingTech.includes(trimmed)) return;

    updateProject(id, { techStack: [...existingTech, trimmed] });
    setTechInputs((prev) => ({ ...prev, [id]: "" }));
  };

  const handleRemoveTech = (id: string, indexToRemove: number) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;

    const newTech = (proj.techStack || []).filter(
      (_, idx) => idx !== indexToRemove,
    );
    updateProject(id, { techStack: newTech });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTech(id);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-lg font-bold text-zinc-100">Key Projects</h2>
          <p className="text-xs text-zinc-400">
            Highlight important software projects, applications, websites, or
            research work.
          </p>
        </div>
        <button
          onClick={addProject}
          className="bg-accent flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white shadow transition hover:bg-rose-600 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
          <FolderGit2 className="mx-auto mb-2 h-10 w-10 text-zinc-600" />
          <p className="text-sm font-semibold">No projects added yet.</p>
          <p className="mt-1 text-xs text-zinc-500">
            Click the "Add Project" button above to showcase your custom
            projects.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((proj, index) => (
            <div
              key={proj.id}
              className="animate-fade-in-up relative space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="bg-zinc-850 rounded px-2 py-1 text-xs font-bold text-zinc-400">
                  Project Entry #{index + 1}
                </span>

                <button
                  onClick={() => removeProject(proj.id)}
                  title="Remove Project"
                  className="hover:bg-zinc-850 cursor-pointer rounded-lg p-1.5 text-zinc-500 transition duration-150 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Project Name */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) =>
                      handleFieldChange(proj.id, "name", e.target.value)
                    }
                    placeholder="e.g. CareerCraft App"
                    className="bg-zinc-855 focus:border-accent w-full rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-200 transition focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300">
                    Project Description
                  </label>
                  <textarea
                    value={proj.description}
                    onChange={(e) =>
                      handleFieldChange(proj.id, "description", e.target.value)
                    }
                    placeholder="e.g. Stunning career launchpad featuring an interactive split-screen resume builder, PDF generator, and flashcard practice suite."
                    rows={3}
                    className="bg-zinc-855 focus:border-accent w-full rounded-lg border border-zinc-800 p-3 text-sm text-zinc-200 transition focus:outline-none"
                  />
                </div>

                {/* Tech Stack Input */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300">
                    Tech Stack (comma-separated)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={techInputs[proj.id] || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTechInputs((prev) => ({ ...prev, [proj.id]: val }));
                      }}
                      onKeyDown={(e) => handleKeyDown(e, proj.id)}
                      placeholder="e.g. Next.js, Tailwind, LocalStorage"
                      className="bg-zinc-855 focus:border-accent w-full rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-200 transition focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddTech(proj.id)}
                      className="hover:bg-zinc-750 flex cursor-pointer items-center justify-center rounded-lg bg-zinc-800 p-2.5 text-zinc-200 transition active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(proj.techStack || []).map((tech, techIdx) => (
                      <span
                        key={techIdx}
                        className="bg-zinc-850 group inline-flex items-center gap-1 rounded-md border border-zinc-800 py-0.5 pr-1.5 pl-2 text-[11px] text-zinc-300"
                      >
                        <span>{tech}</span>
                        <button
                          onClick={() => handleRemoveTech(proj.id, techIdx)}
                          className="hover:text-zinc-250 cursor-pointer rounded p-0.5 text-zinc-500 transition"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Live Url */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                    <Globe className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Live Deployment URL</span>
                  </label>
                  <input
                    type="url"
                    value={proj.liveUrl || ""}
                    onChange={(e) =>
                      handleFieldChange(proj.id, "liveUrl", e.target.value)
                    }
                    placeholder="e.g. careercraft.example.com"
                    className="bg-zinc-855 focus:border-accent w-full rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-200 transition focus:outline-none"
                  />
                </div>

                {/* Github Url */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                    {/* <Github className="h-3.5 w-3.5 text-zinc-500" /> */}
                    <span>GitHub Repository URL</span>
                  </label>
                  <input
                    type="url"
                    value={proj.githubUrl || ""}
                    onChange={(e) =>
                      handleFieldChange(proj.id, "githubUrl", e.target.value)
                    }
                    placeholder="e.g. github.com/user/careercraft"
                    className="bg-zinc-855 focus:border-accent w-full rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-200 transition focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
