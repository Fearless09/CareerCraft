"use client";

import React, { ComponentProps, FC, useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { FolderGit2, Plus, Trash2, Globe, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GitHubSvg } from "@/components/shared/Svgs";

export default function ProjectsSection() {
  const { resumeData, addProject, updateProject, removeProject } = useResume();

  const { projects } = resumeData;
  const [techInputs, setTechInputs] = useState<Map<string, string>>(new Map());

  const handleAddTech = (id: string) => {
    const rawInput = techInputs.get(id) || "";
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    const proj = projects.find((p) => p.id === id);
    if (!proj) return;

    const existingTech = proj.techStack || [];
    if (existingTech.includes(trimmed)) return; // to avoid duplication

    updateProject(id, { techStack: [...existingTech, trimmed] });
    setTechInputs((prev) => new Map(prev).set(id, ""));
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
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-lg font-bold text-zinc-100">Key Projects</h2>
          <p className="text-sm text-balance text-zinc-400">
            Highlight important software projects, applications, websites, or
            research work.
          </p>
        </div>
        <button
          onClick={addProject}
          className="bg-accent transition-300 flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white shadow hover:bg-rose-600 active:scale-95"
        >
          <Plus className="size-4" />
          <span>Add Project</span>
        </button>
      </header>

      {projects.length === 0 ? (
        <main
          id="no-project"
          className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500"
        >
          <FolderGit2 className="mx-auto mb-2 size-10 text-zinc-600" />
          <p className="text-sm font-semibold">No projects added yet.</p>
          <p className="mt-1 text-xs">
            Click the "Add Project" button above to showcase your custom
            projects.
          </p>
        </main>
      ) : (
        <section id="projects-wrapper" className="space-y-6">
          {projects.map((proj, index) => (
            <main
              id={`project-${index + 1}`}
              key={proj.id}
              className="relative space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="rounded bg-zinc-800 px-2.25 py-1 text-xs font-bold text-zinc-400">
                  Project Entry #{index + 1}
                </span>

                <button
                  onClick={() => removeProject(proj.id)}
                  title="Remove Project"
                  className="transition-300 cursor-pointer rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Project Name */}
                <InputGroup
                  label="Project Title"
                  id={`project-${index + 1}-name`}
                  value={proj.name}
                  onChange={(e) =>
                    updateProject(proj.id, { name: e.target.value })
                  }
                  placeholder="e.g. CareerCraft App"
                  wrapperClassName="md:col-span-2"
                />

                {/* Description */}
                <div className="space-y-1.5 md:col-span-2">
                  <label
                    htmlFor={`project-${index + 1}-description`}
                    className="text-xss block w-fit font-semibold text-zinc-300"
                  >
                    Project Description
                  </label>
                  <textarea
                    id={`project-${index + 1}-description`}
                    value={proj.description}
                    onChange={(e) =>
                      updateProject(proj.id, { description: e.target.value })
                    }
                    placeholder="e.g. Stunning career launchpad featuring an interactive split-screen resume builder, PDF generator, and flashcard practice suite."
                    rows={3}
                    className="focus:border-accent transition-300 w-full rounded-lg border border-zinc-800 bg-zinc-800/40 p-3 text-sm text-zinc-200 focus:outline-none"
                  />
                </div>

                {/* Tech Stack Input */}
                <main
                  id={`project-${index + 1}-techstack`}
                  className="space-y-1.5 pb-2 md:col-span-2"
                >
                  <label
                    htmlFor={`project-${index + 1}-techstack-input`}
                    className="block w-fit text-xs font-semibold text-zinc-300"
                  >
                    Tech Stack (comma-separated)
                  </label>
                  <div className="flex gap-2">
                    <input
                      id={`project-${index + 1}-techstack-input`}
                      type="text"
                      value={techInputs.get(proj.id) || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTechInputs((prev) =>
                          new Map(prev).set(proj.id, val),
                        );
                      }}
                      onKeyDown={(e) => handleKeyDown(e, proj.id)}
                      placeholder="e.g. Next.js, Tailwind, LocalStorage"
                      className="focus:border-accent transition-300 w-full rounded-lg border border-zinc-800 bg-zinc-800/40 px-3 py-2 text-sm text-zinc-200 focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddTech(proj.id)}
                      className="transition-300 flex shrink-0 cursor-pointer items-center justify-center rounded-lg bg-zinc-800 p-2.5 text-zinc-200 hover:bg-zinc-700 active:scale-95"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>

                  {/* Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(proj.techStack || []).map((tech, techIdx) => (
                      <span
                        id={`project-${index + 1}-techstack-chip-${techIdx + 1}`}
                        key={techIdx}
                        className="group inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-800/40 py-0.5 pr-1.5 pl-2 text-[11px] text-zinc-300"
                      >
                        <span>{tech}</span>
                        <button
                          onClick={() => handleRemoveTech(proj.id, techIdx)}
                          className="transition-300 shrink-0 cursor-pointer rounded p-0.5 text-zinc-500 hover:text-zinc-200"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </main>

                {/* Live Url */}
                <InputGroup
                  id={`project-${index + 1}-url`}
                  label="Live Deployment URL"
                  Icon={Globe}
                  type="url"
                  value={proj.liveUrl || ""}
                  onChange={(e) =>
                    updateProject(proj.id, { liveUrl: e.target.value })
                  }
                  placeholder="e.g. careercraft.example.com"
                />

                {/* Github Url */}
                <InputGroup
                  id={`project-${index + 1}-github`}
                  label="GitHub Repository URL"
                  Icon={GitHubSvg}
                  type="url"
                  value={proj.githubUrl || ""}
                  onChange={(e) =>
                    updateProject(proj.id, { githubUrl: e.target.value })
                  }
                  placeholder="e.g. github.com/user/careercraft"
                />
              </div>
            </main>
          ))}
        </section>
      )}
    </section>
  );
}

type InputGroup = FC<
  ComponentProps<"input"> & {
    label: string;
    Icon?: FC<ComponentProps<"svg">>;
    wrapperClassName?: string;
  }
>;

const InputGroup: InputGroup = ({
  label,
  Icon,
  type = "text",
  className,
  wrapperClassName,
  ...props
}) => {
  return (
    <div className={cn("space-y-1.5", wrapperClassName)}>
      <label
        htmlFor={props.id}
        className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300"
      >
        {!!Icon && <Icon className="size-3.5 text-zinc-500" />}
        <span>{label}</span>
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
