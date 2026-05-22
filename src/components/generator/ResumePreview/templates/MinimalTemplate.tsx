import { ResumeData } from "@/types/resume";

interface TemplateProps {
  data: ResumeData;
  accentColor: string;
}

export default function MinimalTemplate({ data, accentColor }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    additionalSections,
  } = data;

  return (
    <section
      className="p-1 font-sans leading-relaxed text-zinc-800"
      style={{ wordBreak: "break-word" }}
    >
      {/* Header Panel */}
      <div className="pdf-block mb-6">
        <h1 className="font-display mb-1 text-3xl font-light tracking-wide text-zinc-950">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <p
          className="mb-3.5 text-xs font-semibold tracking-widest uppercase"
          style={{ color: accentColor }}
        >
          {personalInfo.jobTitle || "Professional Title"}
        </p>

        <div className="flex flex-wrap gap-x-5 gap-y-1.5 border-b border-zinc-200 pb-4 text-xs font-light text-zinc-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedIn && <span>{personalInfo.linkedIn}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary Section */}
      {summary && (
        <div className="pdf-block mb-6 grid grid-cols-[140px_1fr] gap-4">
          <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            About Me
          </span>
          <p className="text-justify text-xs leading-relaxed text-zinc-600">
            {summary}
          </p>
        </div>
      )}

      {/* Work History */}
      {experience && experience.length > 0 && (
        <div className="mb-6 grid grid-cols-[140px_1fr] gap-4 border-t border-zinc-100 pt-5">
          <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Experience
          </span>
          <div className="flex flex-col gap-5">
            {experience.map((exp) => (
              <div key={exp.id} className="pdf-block text-xs">
                <div className="mb-0.5 flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-zinc-900">
                    {exp.jobTitle}
                  </span>
                  <span className="font-mono text-[10px] font-light text-zinc-400">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <div className="mb-2 text-[11px] font-medium text-zinc-500 italic">
                  {exp.company}
                  {exp.location ? `, ${exp.location}` : ""}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc space-y-1.5 pl-4 text-xs font-light text-zinc-600">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6 grid grid-cols-[140px_1fr] gap-4 border-t border-zinc-100 pt-5">
          <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Education
          </span>
          <div className="flex flex-col gap-4.5">
            {education.map((edu) => (
              <div key={edu.id} className="pdf-block text-xs">
                <div className="mb-0.5 flex items-baseline justify-between">
                  <span className="font-semibold text-zinc-900">
                    {edu.degree}
                    {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                  </span>
                  <span className="font-mono text-[10px] font-light text-zinc-400">
                    {edu.startYear} - {edu.endYear}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between text-[11px] font-medium text-zinc-500">
                  <span>{edu.institution}</span>
                  {(edu.gpa || edu.honours) && (
                    <span className="font-light italic">
                      {edu.gpa ? `GPA: ${edu.gpa}` : ""}
                      {edu.gpa && edu.honours ? " | " : ""}
                      {edu.honours ? edu.honours : ""}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {((skills.technical && skills.technical.length > 0) ||
        (skills.soft && skills.soft.length > 0) ||
        (skills.languages && skills.languages.length > 0)) && (
        <div className="pdf-block mb-6 grid grid-cols-[140px_1fr] gap-4 border-t border-zinc-100 pt-5">
          <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Skills
          </span>
          <div className="space-y-2.5 text-xs font-light text-zinc-600">
            {skills.technical && skills.technical.length > 0 && (
              <p>
                <strong className="mb-0.5 block text-[10px] font-semibold tracking-wider text-zinc-800 uppercase">
                  Technical
                </strong>{" "}
                {skills.technical.join("  •  ")}
              </p>
            )}
            {skills.soft && skills.soft.length > 0 && (
              <p>
                <strong className="mb-0.5 block text-[10px] font-semibold tracking-wider text-zinc-800 uppercase">
                  Professional
                </strong>{" "}
                {skills.soft.join("  •  ")}
              </p>
            )}
            {skills.languages && skills.languages.length > 0 && (
              <p>
                <strong className="mb-0.5 block text-[10px] font-semibold tracking-wider text-zinc-800 uppercase">
                  Languages
                </strong>{" "}
                {skills.languages.join("  •  ")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6 grid grid-cols-[140px_1fr] gap-4 border-t border-zinc-100 pt-5">
          <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Projects
          </span>
          <div className="flex flex-col gap-4">
            {projects.map((proj) => (
              <div key={proj.id} className="pdf-block text-xs">
                <div className="mb-0.5 flex items-baseline justify-between">
                  <span className="font-semibold text-zinc-900">
                    {proj.name}
                  </span>
                  <div className="space-x-3 font-mono text-[10px] font-light text-zinc-400">
                    {proj.liveUrl && (
                      <span className="hover:underline">{proj.liveUrl}</span>
                    )}
                    {proj.githubUrl && (
                      <span className="hover:underline">{proj.githubUrl}</span>
                    )}
                  </div>
                </div>
                <p className="mb-1 text-xs font-light text-zinc-600">
                  {proj.description}
                </p>
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="font-mono text-[10px] text-zinc-400">
                    {proj.techStack.join(" / ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="mb-6 grid grid-cols-[140px_1fr] gap-4 border-t border-zinc-100 pt-5">
          <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Certificates
          </span>
          <div className="text-xs font-light text-zinc-600">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="pdf-block border-b border-zinc-50 pb-0.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="shrink-0 font-medium text-zinc-800">
                    {cert.name}
                  </span>
                  <span className="font-mono text-[10px] whitespace-nowrap text-zinc-400">
                    {cert.year}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between text-[11px] font-medium text-zinc-500">
                  {cert.issuer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Sections */}
      {additionalSections && additionalSections.length > 0 && (
        <div className="flex flex-col gap-5 border-t border-zinc-100 pt-5">
          {additionalSections.map((sect) => (
            <div key={sect.id} className="grid grid-cols-[140px_1fr] gap-4">
              <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                {sect.title}
              </span>
              <ul className="list-disc space-y-1.5 pl-4 text-xs font-light text-zinc-600">
                {sect.items.map((item, idx) => (
                  <li key={idx} className="pdf-block leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
