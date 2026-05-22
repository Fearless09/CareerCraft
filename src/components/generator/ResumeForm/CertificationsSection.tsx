"use client";

import { useResume } from "@/context/ResumeContext";
import { cn } from "@/lib/utils";
import { Award, Plus, Trash2 } from "lucide-react";
import { ComponentProps, FC } from "react";

export default function CertificationsSection() {
  const {
    resumeData,
    addCertification,
    updateCertification,
    removeCertification,
  } = useResume();

  const { certifications } = resumeData;

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-lg font-bold text-zinc-100">
            Certifications
          </h2>
          <p className="text-sm text-balance text-zinc-400">
            List relevant industry certificates, achievements, and courses.
          </p>
        </div>
        <button
          onClick={addCertification}
          className="bg-accent transition-300 flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white hover:bg-rose-600 active:scale-95"
        >
          <Plus className="size-4" />
          <span>Add Certificate</span>
        </button>
      </header>

      {certifications.length === 0 ? (
        <main className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
          <Award className="mx-auto mb-2 size-10 text-zinc-600" />
          <p className="text-sm font-semibold">No certifications added yet.</p>
          <p className="mt-1 text-xs">
            Click the "Add Certificate" button above to list your
            accomplishments.
          </p>
        </main>
      ) : (
        <section id="certification-wrapper" className="space-y-5">
          {certifications.map((cert, index) => (
            <main
              id={`certificate-${index + 1}`}
              key={cert.id}
              className="relative space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="rounded bg-zinc-800 px-2.25 py-1 text-xs font-bold text-zinc-400">
                  Certificate Entry #{index + 1}
                </span>

                <button
                  onClick={() => removeCertification(cert.id)}
                  title="Remove Certificate"
                  className="transition-300 cursor-pointer rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* Form Fields Grid */}
              <main
                id={`certificate-${index + 1}-forms`}
                className="grid grid-cols-1 gap-4 md:grid-cols-3"
              >
                {/* Certificate Name */}
                <GroupInput
                  id={`certificate-${index + 1}-name`}
                  value={cert.name}
                  onChange={(e) =>
                    updateCertification(cert.id, { name: e.target.value })
                  }
                  placeholder="e.g. AWS Certified Developer - Associate"
                  label="Certificate Name"
                  wrapperClassName="md:col-span-2"
                />

                {/* Issuing Organisation */}
                <GroupInput
                  id={`certificate-${index + 1}-issuer`}
                  value={cert.issuer}
                  onChange={(e) =>
                    updateCertification(cert.id, { issuer: e.target.value })
                  }
                  placeholder="e.g. Amazon Web Services"
                  label="Issuing Body"
                />

                {/* Year */}
                <GroupInput
                  id={`certificate-${index + 1}-year`}
                  value={cert.year}
                  onChange={(e) =>
                    updateCertification(cert.id, { year: e.target.value })
                  }
                  placeholder="e.g. 2025"
                  label="Year Earned"
                  wrapperClassName="md:col-span-3"
                />
              </main>
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
  className,
  wrapperClassName,
  type = "text",
  ...props
}) => {
  return (
    <div className={cn("space-y-1.5", wrapperClassName)}>
      <label
        htmlFor={props.id}
        className="block w-fit text-xs font-semibold text-zinc-300"
      >
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
