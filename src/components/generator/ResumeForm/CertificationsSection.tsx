"use client";

import { useResume } from "@/context/ResumeContext";
import { Award, Plus, Trash2 } from "lucide-react";

export default function CertificationsSection() {
  const {
    resumeData,
    addCertification,
    updateCertification,
    removeCertification,
  } = useResume();

  const { certifications } = resumeData;

  const handleFieldChange = (id: string, field: string, value: string) => {
    updateCertification(id, { [field]: value });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-lg font-bold text-zinc-100">
            Certifications
          </h2>
          <p className="text-xs text-zinc-400">
            List relevant industry certificates, achievements, and courses.
          </p>
        </div>
        <button
          onClick={addCertification}
          className="bg-accent flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white shadow transition hover:bg-rose-600 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
          <Award className="mx-auto mb-2 h-10 w-10 text-zinc-600" />
          <p className="text-sm font-semibold">No certifications added yet.</p>
          <p className="mt-1 text-xs text-zinc-500">
            Click the "Add Certificate" button above to list your
            accomplishments.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              className="animate-fade-in-up relative space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="bg-zinc-850 rounded px-2 py-1 text-xs font-bold text-zinc-400">
                  Certificate Entry #{index + 1}
                </span>

                <button
                  onClick={() => removeCertification(cert.id)}
                  title="Remove Certificate"
                  className="hover:bg-zinc-850 cursor-pointer rounded-lg p-1.5 text-zinc-500 transition duration-150 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Certificate Name */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300">
                    Certificate Name
                  </label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) =>
                      handleFieldChange(cert.id, "name", e.target.value)
                    }
                    placeholder="e.g. AWS Certified Developer – Associate"
                    className="bg-zinc-855 focus:border-accent w-full rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-200 transition focus:outline-none"
                  />
                </div>

                {/* Issuing Organisation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Issuing Body
                  </label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) =>
                      handleFieldChange(cert.id, "issuer", e.target.value)
                    }
                    placeholder="e.g. Amazon Web Services"
                    className="bg-zinc-855 focus:border-accent w-full rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-200 transition focus:outline-none"
                  />
                </div>

                {/* Year */}
                <div className="space-y-1.5 md:col-span-3">
                  <label className="text-xs font-semibold text-zinc-300">
                    Year Earned
                  </label>
                  <input
                    type="text"
                    value={cert.year}
                    onChange={(e) =>
                      handleFieldChange(cert.id, "year", e.target.value)
                    }
                    placeholder="e.g. 2025"
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
