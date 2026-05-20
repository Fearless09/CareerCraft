import React from 'react';
import { ResumeData } from '../../../../types/resume';

interface TemplateProps {
  data: ResumeData;
  accentColor: string;
}

export default function ClassicTemplate({ data, accentColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, additionalSections } = data;

  return (
    <div className="font-serif text-[#1e293b] leading-relaxed p-2" style={{ wordBreak: 'break-word' }}>
      {/* Header Info */}
      <div className="pdf-block text-center mb-6">
        <h1 
          className="text-3xl font-bold tracking-wide uppercase mb-1 font-display" 
          style={{ color: accentColor }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-md italic text-zinc-600 font-sans mb-3">{personalInfo.jobTitle || 'Professional Title'}</p>
        
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-zinc-600 font-sans">
          {personalInfo.email && (
            <span>{personalInfo.email}</span>
          )}
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
          <h2 className="text-xs uppercase tracking-widest font-sans font-bold border-b border-zinc-300 pb-1 mb-2" style={{ color: accentColor }}>
            Professional Summary
          </h2>
          <p className="text-sm text-zinc-700 leading-normal text-justify">
            {summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase tracking-widest font-sans font-bold border-b border-zinc-300 pb-1 mb-3" style={{ color: accentColor }}>
            Professional Experience
          </h2>
          <div className="flex flex-col gap-4">
            {experience.map((exp) => (
              <div key={exp.id} className="pdf-block text-sm">
                <div className="flex justify-between items-baseline font-sans font-semibold text-zinc-800 mb-1">
                  <span>{exp.jobTitle} <span className="font-normal text-zinc-500">at</span> {exp.company}</span>
                  <span className="text-xs text-zinc-500 font-normal">
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <div className="text-xs text-zinc-500 font-sans italic mb-1.5">{exp.location}</div>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc pl-5 text-zinc-700 space-y-1 text-[13px] leading-relaxed">
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
          <h2 className="text-xs uppercase tracking-widest font-sans font-bold border-b border-zinc-300 pb-1 mb-3" style={{ color: accentColor }}>
            Education
          </h2>
          <div className="flex flex-col gap-3">
            {education.map((edu) => (
              <div key={edu.id} className="pdf-block text-sm">
                <div className="flex justify-between items-baseline font-sans font-semibold text-zinc-800">
                  <span>
                    {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                  </span>
                  <span className="text-xs text-zinc-500 font-normal">
                    {edu.startYear} – {edu.endYear}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-zinc-600 font-sans mt-0.5">
                  <span>{edu.institution}</span>
                  {(edu.gpa || edu.honours) && (
                    <span>
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
      )}

      {/* Skills */}
      {((skills.technical && skills.technical.length > 0) || 
        (skills.soft && skills.soft.length > 0) || 
        (skills.languages && skills.languages.length > 0)) && (
        <div className="pdf-block mb-6">
          <h2 className="text-xs uppercase tracking-widest font-sans font-bold border-b border-zinc-300 pb-1 mb-2.5" style={{ color: accentColor }}>
            Skills & Expertise
          </h2>
          <div className="text-xs space-y-1.5 text-zinc-700">
            {skills.technical && skills.technical.length > 0 && (
              <p>
                <strong className="font-sans font-semibold text-zinc-800">Technical Skills:</strong>{' '}
                {skills.technical.join(', ')}
              </p>
            )}
            {skills.soft && skills.soft.length > 0 && (
              <p>
                <strong className="font-sans font-semibold text-zinc-800">Professional Competencies:</strong>{' '}
                {skills.soft.join(', ')}
              </p>
            )}
            {skills.languages && skills.languages.length > 0 && (
              <p>
                <strong className="font-sans font-semibold text-zinc-800">Languages:</strong>{' '}
                {skills.languages.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase tracking-widest font-sans font-bold border-b border-zinc-300 pb-1 mb-3" style={{ color: accentColor }}>
            Key Projects
          </h2>
          <div className="flex flex-col gap-3.5">
            {projects.map((proj) => (
              <div key={proj.id} className="pdf-block text-sm">
                <div className="flex justify-between items-baseline font-sans font-semibold text-zinc-800 mb-1">
                  <span>{proj.name}</span>
                  <div className="text-xs text-zinc-500 font-normal space-x-2">
                    {proj.liveUrl && <span>{proj.liveUrl}</span>}
                    {proj.githubUrl && <span>{proj.githubUrl}</span>}
                  </div>
                </div>
                <p className="text-zinc-700 text-[13px] leading-relaxed mb-1.5">{proj.description}</p>
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="text-xs text-zinc-500 font-sans">
                    <span className="font-semibold text-zinc-600">Technologies:</span> {proj.techStack.join(', ')}
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
          <h2 className="text-xs uppercase tracking-widest font-sans font-bold border-b border-zinc-300 pb-1 mb-2.5" style={{ color: accentColor }}>
            Certifications
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-zinc-700">
            {certifications.map((cert) => (
              <div key={cert.id} className="pdf-block flex justify-between items-center py-0.5 border-b border-zinc-100 pb-1">
                <span className="font-semibold text-zinc-800">{cert.name}</span>
                <span className="text-zinc-500 whitespace-nowrap ml-2">{cert.issuer} ({cert.year})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Sections */}
      {additionalSections && additionalSections.length > 0 && (
        <div className="flex flex-col gap-5">
          {additionalSections.map((sect) => (
            <div key={sect.id} className="mb-2">
              <h2 className="text-xs uppercase tracking-widest font-sans font-bold border-b border-zinc-300 pb-1 mb-2.5" style={{ color: accentColor }}>
                {sect.title}
              </h2>
              <ul className="list-disc pl-5 text-zinc-700 space-y-1 text-[13px] leading-relaxed">
                {sect.items.map((item, idx) => (
                  <li key={idx} className="pdf-block">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
