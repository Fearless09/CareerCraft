import React from 'react';
import { ResumeData } from '../../../../types/resume';

interface TemplateProps {
  data: ResumeData;
  accentColor: string;
}

export default function MinimalTemplate({ data, accentColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, additionalSections } = data;

  return (
    <div className="font-sans text-zinc-800 leading-relaxed p-1" style={{ wordBreak: 'break-word' }}>
      {/* Header Panel */}
      <div className="pdf-block mb-6">
        <h1 className="text-3xl font-light tracking-wide text-zinc-950 mb-1 font-display">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-xs uppercase tracking-widest font-semibold mb-3.5" style={{ color: accentColor }}>
          {personalInfo.jobTitle || 'Professional Title'}
        </p>
        
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-zinc-500 font-light border-b border-zinc-150 pb-4">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <span>{personalInfo.email}</span>
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <span>{personalInfo.phone}</span>
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <span>{personalInfo.location}</span>
            </span>
          )}
          {personalInfo.linkedIn && (
            <span className="flex items-center gap-1">
              <span>{personalInfo.linkedIn}</span>
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <span>{personalInfo.website}</span>
            </span>
          )}
        </div>
      </div>

      {/* Summary Section */}
      {summary && (
        <div className="pdf-block mb-6">
          <div className="grid grid-cols-[140px_1fr] gap-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">About Me</span>
            <p className="text-xs.5 text-zinc-650 leading-relaxed text-justify mt-[-1px]">
              {summary}
            </p>
          </div>
        </div>
      )}

      {/* Work History */}
      {experience && experience.length > 0 && (
        <div className="mb-6 border-t border-zinc-100 pt-5">
          <div className="grid grid-cols-[140px_1fr] gap-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Experience</span>
            <div className="flex flex-col gap-5">
              {experience.map((exp) => (
                <div key={exp.id} className="pdf-block text-xs.5">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-semibold text-zinc-900 text-sm">{exp.jobTitle}</span>
                    <span className="text-[10px] text-zinc-400 font-light font-mono">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500 font-medium italic mb-2">
                    {exp.company}{exp.location ? `, ${exp.location}` : ''}
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc pl-4 space-y-1.5 text-zinc-600 text-xs font-light">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="leading-relaxed">{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6 border-t border-zinc-100 pt-5">
          <div className="grid grid-cols-[140px_1fr] gap-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Education</span>
            <div className="flex flex-col gap-4.5">
              {education.map((edu) => (
                <div key={edu.id} className="pdf-block text-xs.5">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-semibold text-zinc-900">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</span>
                    <span className="text-[10px] text-zinc-400 font-light font-mono">
                      {edu.startYear} – {edu.endYear}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-zinc-500 font-medium mt-0.5">
                    <span>{edu.institution}</span>
                    {(edu.gpa || edu.honours) && (
                      <span className="font-light italic">
                        {edu.gpa ? `GPA: ${edu.gpa}` : ''}
                        {edu.gpa && edu.honours ? ' | ' : ''}
                        {edu.honours ? edu.honours : ''}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Skills */}
      {((skills.technical && skills.technical.length > 0) || 
        (skills.soft && skills.soft.length > 0) || 
        (skills.languages && skills.languages.length > 0)) && (
        <div className="pdf-block mb-6 border-t border-zinc-100 pt-5">
          <div className="grid grid-cols-[140px_1fr] gap-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Skills</span>
            <div className="text-xs.5 space-y-2 text-zinc-650 font-light">
              {skills.technical && skills.technical.length > 0 && (
                <p>
                  <strong className="font-semibold text-zinc-800 uppercase tracking-wider text-[10px] block mb-0.5">Technical</strong>{' '}
                  {skills.technical.join('  •  ')}
                </p>
              )}
              {skills.soft && skills.soft.length > 0 && (
                <p>
                  <strong className="font-semibold text-zinc-800 uppercase tracking-wider text-[10px] block mb-0.5">Professional</strong>{' '}
                  {skills.soft.join('  •  ')}
                </p>
              )}
              {skills.languages && skills.languages.length > 0 && (
                <p>
                  <strong className="font-semibold text-zinc-800 uppercase tracking-wider text-[10px] block mb-0.5">Languages</strong>{' '}
                  {skills.languages.join('  •  ')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6 border-t border-zinc-100 pt-5">
          <div className="grid grid-cols-[140px_1fr] gap-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Projects</span>
            <div className="flex flex-col gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="pdf-block text-xs.5">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-semibold text-zinc-900">{proj.name}</span>
                    <div className="text-[10px] text-zinc-400 font-light font-mono space-x-3">
                      {proj.liveUrl && <span className="hover:underline">{proj.liveUrl}</span>}
                      {proj.githubUrl && <span className="hover:underline">{proj.githubUrl}</span>}
                    </div>
                  </div>
                  <p className="text-zinc-600 text-xs font-light mb-1">{proj.description}</p>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {proj.techStack.join(' / ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="mb-6 border-t border-zinc-100 pt-5">
          <div className="grid grid-cols-[140px_1fr] gap-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Certificates</span>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs.5 text-zinc-650 font-light">
              {certifications.map((cert) => (
                <div key={cert.id} className="pdf-block flex justify-between items-center pb-0.5 border-b border-zinc-50">
                  <span className="font-medium text-zinc-800">{cert.name}</span>
                  <span className="text-zinc-400 text-[10px] font-mono whitespace-nowrap ml-2">{cert.issuer} ({cert.year})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Additional Sections */}
      {additionalSections && additionalSections.length > 0 && (
        <div className="flex flex-col gap-5 border-t border-zinc-100 pt-5">
          {additionalSections.map((sect) => (
            <div key={sect.id}>
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">{sect.title}</span>
                <ul className="list-disc pl-4 space-y-1.5 text-zinc-600 text-xs font-light">
                  {sect.items.map((item, idx) => (
                    <li key={idx} className="pdf-block leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
