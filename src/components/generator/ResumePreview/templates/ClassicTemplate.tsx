import { ResumeData } from "@/types/resume";

interface TemplateProps {
  data: ResumeData;
}

export default function ClassicTemplate({ data }: TemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    additionalSections,
    meta,
  } = data;
  const { accentColor } = meta;

  return (
    <div
      className="p-2 font-serif leading-relaxed text-[#1e293b]"
      style={{ wordBreak: "break-word" }}
    >
      {/* Header Info */}
      <div className="pdf-block mb-6 text-center">
        <h1
          className="font-display mb-1 text-3xl font-bold tracking-wide uppercase"
          style={{ color: accentColor }}
        >
          {personalInfo.fullName || "Your Name"}
        </h1>
        <p className="text-md mb-3 font-sans text-zinc-600 italic">
          {personalInfo.jobTitle || "Professional Title"}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-sans text-xs text-zinc-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              <span className="text-zinc-300">•</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.location && (
            <>
              <span className="text-zinc-300">•</span>
              <span>{personalInfo.location}</span>
            </>
          )}
          {personalInfo.linkedIn && (
            <>
              <span className="text-zinc-300">•</span>
              <span>{personalInfo.linkedIn}</span>
            </>
          )}
          {personalInfo.website && (
            <>
              <span className="text-zinc-300">•</span>
              <span>{personalInfo.website}</span>
            </>
          )}
        </div>
      </div>

      {/* Profile Summary */}
      {summary && (
        <div className="pdf-block mb-6">
          <h2
            className="mb-2 border-b border-zinc-300 pb-1 font-sans text-xs font-bold tracking-widest uppercase"
            style={{ color: accentColor }}
          >
            Professional Summary
          </h2>
          <p className="text-justify text-sm leading-normal text-zinc-700">
            {summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2
            className="mb-3 border-b border-zinc-300 pb-1 font-sans text-xs font-bold tracking-widest uppercase"
            style={{ color: accentColor }}
          >
            Professional Experience
          </h2>
          <div className="flex flex-col gap-4">
            {experience.map((exp) => (
              <div key={exp.id} className="pdf-block text-sm">
                <div className="mb-1 flex items-baseline justify-between font-sans font-semibold text-zinc-800">
                  <span>
                    {exp.jobTitle}{" "}
                    <span className="font-normal text-zinc-500">at</span>{" "}
                    {exp.company}
                  </span>
                  <span className="text-xs font-normal text-zinc-500">
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <div className="mb-1.5 font-sans text-xs text-zinc-500 italic">
                    {exp.location}
                  </div>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-zinc-700">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
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
        <div className="mb-6">
          <h2
            className="mb-3 border-b border-zinc-300 pb-1 font-sans text-xs font-bold tracking-widest uppercase"
            style={{ color: accentColor }}
          >
            Education
          </h2>
          <div className="flex flex-col gap-3">
            {education.map((edu) => (
              <div key={edu.id} className="pdf-block text-sm">
                <div className="flex items-baseline justify-between font-sans font-semibold text-zinc-800">
                  <span>
                    {edu.degree}
                    {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                  </span>
                  <span className="text-xs font-normal text-zinc-500">
                    {edu.startYear} – {edu.endYear}
                  </span>
                </div>
                <div className="mt-0.5 flex items-baseline justify-between font-sans text-xs text-zinc-600">
                  <span>{edu.institution}</span>
                  {(edu.gpa || edu.honours) && (
                    <span>
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
        <div className="pdf-block mb-6">
          <h2
            className="mb-2.5 border-b border-zinc-300 pb-1 font-sans text-xs font-bold tracking-widest uppercase"
            style={{ color: accentColor }}
          >
            Skills & Expertise
          </h2>
          <div className="space-y-1.5 text-xs text-zinc-700">
            {skills.technical && skills.technical.length > 0 && (
              <p>
                <strong className="font-sans font-semibold text-zinc-800">
                  Technical Skills:
                </strong>{" "}
                {skills.technical.join(", ")}
              </p>
            )}
            {skills.soft && skills.soft.length > 0 && (
              <p>
                <strong className="font-sans font-semibold text-zinc-800">
                  Professional Competencies:
                </strong>{" "}
                {skills.soft.join(", ")}
              </p>
            )}
            {skills.languages && skills.languages.length > 0 && (
              <p>
                <strong className="font-sans font-semibold text-zinc-800">
                  Languages:
                </strong>{" "}
                {skills.languages.join(", ")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2
            className="mb-3 border-b border-zinc-300 pb-1 font-sans text-xs font-bold tracking-widest uppercase"
            style={{ color: accentColor }}
          >
            Key Projects
          </h2>
          <div className="flex flex-col gap-3.5">
            {projects.map((proj) => (
              <div key={proj.id} className="pdf-block text-sm">
                <div className="mb-1 flex items-baseline justify-between font-sans font-semibold text-zinc-800">
                  <span>{proj.name}</span>
                  <div className="space-x-2 text-xs font-normal text-zinc-500">
                    {proj.liveUrl && <span>{proj.liveUrl}</span>}
                    {proj.githubUrl && <span>{proj.githubUrl}</span>}
                  </div>
                </div>
                <p className="mb-1.5 text-[13px] leading-relaxed text-zinc-700">
                  {proj.description}
                </p>
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="font-sans text-xs text-zinc-500">
                    <span className="font-semibold text-zinc-600">
                      Technologies:
                    </span>{" "}
                    {proj.techStack.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="mb-6">
          <h2
            className="mb-2.5 border-b border-zinc-300 pb-1 font-sans text-xs font-bold tracking-widest uppercase"
            style={{ color: accentColor }}
          >
            Certifications
          </h2>
          <ul className="space-y-3 text-xs text-zinc-700">
            {certifications.map((cert) => (
              <li key={cert.id} className="pdf-block">
                <p className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-zinc-800">
                    {cert.name}
                  </span>
                  <span className="whitespace-nowrap text-zinc-500">
                    {cert.year}
                  </span>
                </p>
                <p className="text-zinc-600">{cert.issuer}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Sections */}
      {additionalSections && additionalSections.length > 0 && (
        <div className="flex flex-col gap-5">
          {additionalSections.map((sect) => (
            <div key={sect.id} className="mb-2">
              <h2
                className="mb-2.5 border-b border-zinc-300 pb-1 font-sans text-xs font-bold tracking-widest uppercase"
                style={{ color: accentColor }}
              >
                {sect.title}
              </h2>
              <ul className="list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-zinc-700">
                {sect.items.map((item, idx) => (
                  <li key={idx} className="pdf-block">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
