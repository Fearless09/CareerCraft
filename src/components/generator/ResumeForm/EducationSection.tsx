"use client";

import { useResume } from "@/context";
import { cn } from "@/lib/utils";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { ComponentProps, FC } from "react";

export default function EducationSection() {
  const { resumeData, addEducation, updateEducation, removeEducation } =
    useResume();
  const { education } = resumeData;

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-lg font-bold text-zinc-100">
            Education History
          </h2>
          <p className="text-sm text-balance text-zinc-400">
            Add details about your degrees, certifications, schools, and
            academic accolades.
          </p>
        </div>
        <button
          onClick={addEducation}
          className="bg-accent transition-300 flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white hover:bg-rose-600 active:scale-95"
        >
          <Plus className="size-4" />
          <span>Add School</span>
        </button>
      </header>

      {education.length === 0 ? (
        <main className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
          <GraduationCap className="mx-auto mb-2 size-10 text-zinc-600" />
          <p className="text-sm font-semibold">
            No education details added yet.
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Click the "Add School" button above to populate your academic
            history.
          </p>
        </main>
      ) : (
        <section className="space-y-5">
          {education.map((edu, index) => (
            <section
              id={"education_#" + (index + 1)}
              key={edu.id}
              className="relative space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="rounded bg-zinc-800 px-2.25 py-1 text-xs font-bold text-zinc-400">
                  Education Entry #{index + 1}
                </span>

                <button
                  onClick={() => removeEducation(edu.id)}
                  title="Remove Education"
                  className="transition-300 shrink-0 cursor-pointer rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* Form Grid */}
              <main
                id={"education_forms_#" + (index + 1)}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                {/* Degree */}
                <GroupInput
                  label="Degree / Qualification"
                  id={"degree_#" + (index + 1)}
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(edu.id, { degree: e.target.value })
                  }
                  placeholder="e.g. Bachelor of Science"
                />

                {/* Field of Study */}
                <GroupInput
                  label="Field of Study"
                  id={"field_of_study_#" + (index + 1)}
                  value={edu.fieldOfStudy}
                  onChange={(e) =>
                    updateEducation(edu.id, { fieldOfStudy: e.target.value })
                  }
                  placeholder="e.g. Computer Science"
                />

                {/* Institution */}
                <GroupInput
                  wrapperClassName="md:col-span-2"
                  label="Institution Name"
                  id={"institution_name_#" + (index + 1)}
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(edu.id, { institution: e.target.value })
                  }
                  placeholder="e.g. University of California, Berkeley"
                />

                {/* Start Year */}
                <GroupInput
                  label="Start Year"
                  id={"start_year_#" + (index + 1)}
                  value={edu.startYear}
                  onChange={(e) =>
                    updateEducation(edu.id, { startYear: e.target.value })
                  }
                  placeholder="e.g. 2016"
                />

                {/* End Year */}
                <GroupInput
                  label="End Year"
                  id={"end_year_#" + (index + 1)}
                  value={edu.endYear}
                  onChange={(e) =>
                    updateEducation(edu.id, { endYear: e.target.value })
                  }
                  placeholder="e.g. 2020 or Present"
                />

                {/* GPA */}
                <GroupInput
                  label="GPA (Optional)"
                  id={"gpa_#" + (index + 1)}
                  value={edu.gpa || ""}
                  onChange={(e) =>
                    updateEducation(edu.id, { gpa: e.target.value })
                  }
                  placeholder="e.g. 3.8 / 4.0"
                />

                {/* Honors */}
                <GroupInput
                  label="Academic Honors / Awards (Optional)"
                  id={"honors_#" + (index + 1)}
                  value={edu.honours || ""}
                  onChange={(e) =>
                    updateEducation(edu.id, { honours: e.target.value })
                  }
                  placeholder="e.g. Magna Cum Laude, Dean's List"
                />
              </main>
            </section>
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
