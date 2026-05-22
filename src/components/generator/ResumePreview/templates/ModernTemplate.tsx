import { ResumeData } from "@/types/resume";
import Image from "next/image";

interface TemplateProps {
  data: ResumeData;
  accentColor: string;
}

export default function ModernTemplate({ data, accentColor }: TemplateProps) {
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
      className="font-sans leading-normal text-zinc-800"
      style={{ wordBreak: "break-word" }}
    >
      {/* Top Header Panel */}
      <main
        className="pdf-block mb-6 flex items-center justify-between gap-6 border-b-4 pb-5"
        style={{ borderColor: accentColor }}
      >
        <div className="flex-1">
          <h1 className="font-display mb-1 text-3xl font-extrabold tracking-tight text-zinc-900">
            {personalInfo.fullName || "Your Name"}
          </h1>
          <p
            className="text-sm font-semibold tracking-wider uppercase"
            style={{ color: accentColor }}
          >
            {personalInfo.jobTitle || "Professional Title"}
          </p>
        </div>

        {/* Profile Image (base64) if uploaded */}
        {personalInfo.photoUrl && (
          <div
            className="relative size-18 shrink-0 overflow-clip rounded-full border-2"
            style={{ borderColor: accentColor }}
          >
            <Image
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="object-cover"
              fill
              sizes="100%"
            />
          </div>
        )}
      </main>

      {/* Main Two-Column Content Grid */}
      <section className="grid grid-cols-[240px_1fr] gap-6">
        {/* Left Sidebar (Contacts, Skills, Education, Certifications) */}
        <aside className="flex flex-col gap-5 border-r border-zinc-200 pr-5">
          {/* Contact Details */}
          <main className="pdf-block">
            <h3 className="mb-2 text-xs font-bold tracking-widest text-zinc-400 uppercase">
              Contact
            </h3>
            <ul className="space-y-2 text-xs text-zinc-600">
              {personalInfo.email && (
                <li className="flex flex-col">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase">
                    Email
                  </span>
                  <span className="truncate">{personalInfo.email}</span>
                </li>
              )}
              {personalInfo.phone && (
                <li className="flex flex-col">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase">
                    Phone
                  </span>
                  <span>{personalInfo.phone}</span>
                </li>
              )}
              {personalInfo.location && (
                <li className="flex flex-col">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase">
                    Location
                  </span>
                  <span>{personalInfo.location}</span>
                </li>
              )}
              {personalInfo.linkedIn && (
                <li className="flex flex-col">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase">
                    LinkedIn
                  </span>
                  <span className="truncate">{personalInfo.linkedIn}</span>
                </li>
              )}
              {personalInfo.website && (
                <li className="flex flex-col">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase">
                    Website
                  </span>
                  <span className="truncate">{personalInfo.website}</span>
                </li>
              )}
            </ul>
          </main>

          {/* Education */}
          {education && education.length > 0 && (
            <main className="flex flex-col gap-3">
              <h3 className="mb-1 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                Education
              </h3>

              <ul className="space-y-3">
                {education.map((edu) => (
                  <li key={edu.id} className="pdf-block text-xs">
                    <div className="font-semibold text-zinc-800">
                      {edu.degree}
                    </div>
                    <div className="font-medium text-zinc-500">
                      {edu.institution}
                    </div>
                    <div className="mt-0.5 text-zinc-400">
                      {edu.startYear} - {edu.endYear}
                    </div>
                    {(edu.gpa || edu.honours) && (
                      <div className="mt-0.5 text-[11px] text-zinc-500 italic">
                        {edu.gpa ? `GPA: ${edu.gpa}` : ""}
                        {edu.gpa && edu.honours ? " | " : ""}
                        {edu.honours ? edu.honours : ""}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </main>
          )}

          {/* Core Skills Tag Categories */}
          {((skills.technical && skills.technical.length > 0) ||
            (skills.soft && skills.soft.length > 0) ||
            (skills.languages && skills.languages.length > 0)) && (
            <main className="flex flex-col gap-4">
              <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                Skills
              </h3>

              {skills.technical && skills.technical.length > 0 && (
                <div className="pdf-block">
                  <span className="mb-1 block text-[10px] font-semibold text-zinc-400 uppercase">
                    Technical
                  </span>
                  <ul className="flex flex-wrap gap-1">
                    {skills.technical.map((tag, idx) => (
                      <li
                        key={idx}
                        className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {skills.soft && skills.soft.length > 0 && (
                <div className="pdf-block">
                  <span className="mb-1 block text-[10px] font-semibold text-zinc-400 uppercase">
                    Professional
                  </span>
                  <ul className="flex flex-wrap gap-1">
                    {skills.soft.map((tag, idx) => (
                      <li
                        key={idx}
                        className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {skills.languages && skills.languages.length > 0 && (
                <div className="pdf-block">
                  <span className="mb-1 block text-[10px] font-semibold text-zinc-400 uppercase">
                    Languages
                  </span>
                  <ul className="flex flex-wrap gap-1">
                    {skills.languages.map((tag, idx) => (
                      <li
                        key={idx}
                        className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </main>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <h3 className="mb-1 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                Certificates
              </h3>

              <ul className="gap-2.5">
                {certifications.map((cert) => (
                  <li
                    key={cert.id}
                    className="pdf-block border-b border-zinc-100 pb-1 text-xs"
                  >
                    <p className="font-semibold text-zinc-800">{cert.name}</p>
                    <p className="text-[11px] text-zinc-500">
                      {cert.issuer} ({cert.year})
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Right Panel (Profile, Work Experience, Key Projects, Additional Sections) */}
        <main className="flex flex-col gap-6 text-justify">
          {/* Executive Summary */}
          {summary && (
            <div className="pdf-block">
              <h3
                className="mb-2.5 border-b border-zinc-200 pb-1.5 text-sm font-bold text-zinc-800"
                style={{ color: accentColor }}
              >
                Profile Summary
              </h3>
              <p className="text-justify text-xs leading-relaxed text-zinc-600">
                {summary}
              </p>
            </div>
          )}

          {/* Professional Experience */}
          {experience && experience.length > 0 && (
            <div>
              <h3
                className="mb-3 border-b border-zinc-200 pb-1.5 text-sm font-bold text-zinc-800"
                style={{ color: accentColor }}
              >
                Work History
              </h3>
              <div className="flex flex-col gap-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="pdf-block text-xs">
                    <div className="mb-1 flex items-baseline justify-between">
                      <span className="text-[13px] font-bold text-zinc-800">
                        {exp.jobTitle}
                      </span>
                      <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-500">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <div className="mb-2 flex justify-between text-[11px] font-medium text-zinc-500">
                      <span>{exp.company}</span>
                      {exp.location && <span>{exp.location}</span>}
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc space-y-1 pl-4.5 text-[11px] leading-relaxed text-zinc-600">
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

          {/* Key Projects */}
          {projects && projects.length > 0 && (
            <div>
              <h3
                className="mb-3 border-b border-zinc-200 pb-1.5 text-sm font-bold text-zinc-800"
                style={{ color: accentColor }}
              >
                Featured Projects
              </h3>
              <div className="flex flex-col gap-3.5">
                {projects.map((proj) => (
                  <div key={proj.id} className="pdf-block text-xs">
                    <span className="font-bold text-zinc-800">{proj.name}</span>

                    <div className="mt-px mb-1 space-x-2 text-[10px] text-zinc-500">
                      {proj.liveUrl && (
                        <span className="hover:underline">{proj.liveUrl}</span>
                      )}
                      {proj.githubUrl && (
                        <span className="hover:underline">
                          {proj.githubUrl}
                        </span>
                      )}
                    </div>

                    <p className="mb-1.5 text-[11px] leading-normal text-zinc-600">
                      {proj.description}
                    </p>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <ul className="flex flex-wrap gap-1">
                        {proj.techStack.map((tech, idx) => (
                          <li
                            key={idx}
                            className="rounded border border-zinc-300 bg-zinc-100 px-1 py-px text-[10px] text-zinc-600"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Custom Sections */}
          {additionalSections && additionalSections.length > 0 && (
            <div className="flex flex-col gap-4">
              {additionalSections.map((sect) => (
                <div key={sect.id}>
                  <h3
                    className="mb-2.5 border-b border-zinc-200 pb-1.5 text-sm font-bold text-zinc-800"
                    style={{ color: accentColor }}
                  >
                    {sect.title}
                  </h3>
                  <ul className="list-disc space-y-1 pl-4.5 text-[11px] leading-relaxed text-zinc-600">
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
        </main>
      </section>
    </section>
  );
}
