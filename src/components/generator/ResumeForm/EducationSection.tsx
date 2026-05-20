"use client";

import { useResume } from "@/context";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

export default function EducationSection() {
  const { resumeData, addEducation, updateEducation, removeEducation } =
    useResume();

  const { education } = resumeData;

  const handleFieldChange = (id: string, field: string, value: string) => {
    updateEducation(id, { [field]: value });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-lg font-bold text-zinc-100">
            Education History
          </h2>
          <p className="text-xs text-zinc-400">
            Add details about your degrees, certifications, schools, and
            academic accolades.
          </p>
        </div>
        <button
          onClick={addEducation}
          className="bg-accent flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white shadow transition hover:bg-rose-600 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add School</span>
        </button>
      </div>

      {education.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
          <GraduationCap className="mx-auto mb-2 h-10 w-10 text-zinc-600" />
          <p className="text-sm font-semibold">
            No education details added yet.
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Click the "Add School" button above to populate your academic
            history.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {education.map((edu, index) => (
            <div
              key={edu.id}
              className="animate-fade-in-up relative space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="bg-zinc-850 rounded px-2 py-1 text-xs font-bold text-zinc-400">
                  Education Entry #{index + 1}
                </span>

                <button
                  onClick={() => removeEducation(edu.id)}
                  title="Remove Education"
                  className="hover:bg-zinc-850 cursor-pointer rounded-lg p-1.5 text-zinc-500 transition duration-150 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Degree */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Degree / Qualification
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) =>
                      handleFieldChange(edu.id, "degree", e.target.value)
                    }
                    placeholder="e.g. Bachelor of Science"
                    className="bg-zinc-855 focus:border-accent w-full rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-200 transition focus:outline-none"
                  />
                </div>

                {/* Field of Study */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={(e) =>
                      handleFieldChange(edu.id, "fieldOfStudy", e.target.value)
                    }
                    placeholder="e.g. Computer Science"
                    className="bg-zinc-855 focus:border-accent w-full rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-200 transition focus:outline-none"
                  />
                </div>

                {/* Institution */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) =>
                      handleFieldChange(edu.id, "institution", e.target.value)
                    }
                    placeholder="e.g. University of California, Berkeley"
                    className="bg-zinc-855 focus:border-accent w-full rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-200 transition focus:outline-none"
                  />
                </div>

                {/* Start Year */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Start Year
                  </label>
                  <input
                    type="text"
                    value={edu.startYear}
                    onChange={(e) =>
                      handleFieldChange(edu.id, "startYear", e.target.value)
                    }
                    placeholder="e.g. 2016"
                    className="bg-zinc-855 focus:border-accent w-full rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-200 transition focus:outline-none"
                  />
                </div>

                {/* End Year */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    End Year
                  </label>
                  <input
                    type="text"
                    value={edu.endYear}
                    onChange={(e) =>
                      handleFieldChange(edu.id, "endYear", e.target.value)
                    }
                    placeholder="e.g. 2020 or Present"
                    className="bg-zinc-855 focus:border-accent w-full rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-200 transition focus:outline-none"
                  />
                </div>

                {/* GPA */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    GPA (Optional)
                  </label>
                  <input
                    type="text"
                    value={edu.gpa || ""}
                    onChange={(e) =>
                      handleFieldChange(edu.id, "gpa", e.target.value)
                    }
                    placeholder="e.g. 3.8 / 4.0"
                    className="bg-zinc-855 focus:border-accent w-full rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-200 transition focus:outline-none"
                  />
                </div>

                {/* Honors */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Academic Honors / Awards (Optional)
                  </label>
                  <input
                    type="text"
                    value={edu.honours || ""}
                    onChange={(e) =>
                      handleFieldChange(edu.id, "honours", e.target.value)
                    }
                    placeholder="e.g. Magna Cum Laude, Dean's List"
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
