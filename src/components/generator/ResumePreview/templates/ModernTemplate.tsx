import React from 'react';
import { ResumeData } from '../../../../types/resume';

interface TemplateProps {
  data: ResumeData;
  accentColor: string;
}

export default function ModernTemplate({ data, accentColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, additionalSections } = data;

  return (
    <div className="font-sans text-zinc-800 leading-normal" style={{ wordBreak: 'break-word' }}>
      {/* Top Header Panel */}
      <div className="pdf-block flex items-center justify-between gap-6 border-b-4 pb-5 mb-6" style={{ borderColor: accentColor }}>
        <div className="flex-1">
          <h1 className="text-3.5xl font-extrabold tracking-tight mb-1 text-zinc-900 font-display">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: accentColor }}>
            {personalInfo.jobTitle || 'Professional Title'}
          </p>
        </div>
        
        {/* Profile Image (base64) if uploaded */}
        {personalInfo.photoUrl && (
          <div className="shrink-0">
            <img 
              src={personalInfo.photoUrl} 
              alt={personalInfo.fullName} 
              className="w-18 h-18 rounded-full object-cover border-2 shadow-sm"
              style={{ borderColor: accentColor }}
            />
          </div>
        )}
      </div>

      {/* Main Two-Column Content Grid */}
      <div className="grid grid-cols-[260px_1fr] gap-6">
        {/* Left Sidebar (Contacts, Skills, Education, Certifications) */}
        <div className="flex flex-col gap-5 border-r border-zinc-200 pr-5">
          {/* Contact Details */}
          <div className="pdf-block">
            <h3 className="text-xs uppercase font-bold tracking-widest text-zinc-400 mb-2">
              Contact
            </h3>
            <ul className="text-xs space-y-1.5 text-zinc-600">
              {personalInfo.email && (
                <li className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase">Email</span>
                  <span className="truncate">{personalInfo.email}</span>
                </li>
              )}
              {personalInfo.phone && (
                <li className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase">Phone</span>
                  <span>{personalInfo.phone}</span>
                </li>
              )}
              {personalInfo.location && (
                <li className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase">Location</span>
                  <span>{personalInfo.location}</span>
                </li>
              )}
              {personalInfo.linkedIn && (
                <li className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase">LinkedIn</span>
                  <span className="truncate">{personalInfo.linkedIn}</span>
                </li>
              )}
              {personalInfo.website && (
                <li className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase">Website</span>
                  <span className="truncate">{personalInfo.website}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Education */}
          {education && education.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs uppercase font-bold tracking-widest text-zinc-400 mb-1">
                Education
              </h3>
              {education.map((edu) => (
                <div key={edu.id} className="pdf-block text-xs">
                  <div className="font-semibold text-zinc-800">{edu.degree}</div>
                  <div className="text-zinc-500 font-medium">{edu.institution}</div>
                  <div className="text-zinc-400 mt-0.5">{edu.startYear} – {edu.endYear}</div>
                  {(edu.gpa || edu.honours) && (
                    <div className="text-[10px] text-zinc-500 italic mt-0.5">
                      {edu.gpa ? `GPA: ${edu.gpa}` : ''}
                      {edu.gpa && edu.honours ? ' | ' : ''}
                      {edu.honours ? edu.honours : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Core Skills Tag Categories */}
          {((skills.technical && skills.technical.length > 0) || 
            (skills.soft && skills.soft.length > 0) || 
            (skills.languages && skills.languages.length > 0)) && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs uppercase font-bold tracking-widest text-zinc-400">
                Skills
              </h3>
              
              {skills.technical && skills.technical.length > 0 && (
                <div className="pdf-block">
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase block mb-1">Technical</span>
                  <div className="flex flex-wrap gap-1">
                    {skills.technical.map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skills.soft && skills.soft.length > 0 && (
                <div className="pdf-block">
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase block mb-1">Professional</span>
                  <div className="flex flex-wrap gap-1">
                    {skills.soft.map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skills.languages && skills.languages.length > 0 && (
                <div className="pdf-block">
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase block mb-1">Languages</span>
                  <div className="flex flex-wrap gap-1">
                    {skills.languages.map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <h3 className="text-xs uppercase font-bold tracking-widest text-zinc-400 mb-1">
                Certificates
              </h3>
              {certifications.map((cert) => (
                <div key={cert.id} className="pdf-block text-xs border-b border-zinc-100 pb-1">
                  <div className="font-semibold text-zinc-800">{cert.name}</div>
                  <div className="text-[10px] text-zinc-500">{cert.issuer} ({cert.year})</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel (Profile, Work Experience, Key Projects, Additional Sections) */}
        <div className="flex flex-col gap-6">
          {/* Executive Summary */}
          {summary && (
            <div className="pdf-block">
              <h3 className="text-sm font-bold border-b border-zinc-200 pb-1.5 mb-2.5 text-zinc-800" style={{ color: accentColor }}>
                Profile Summary
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed text-justify">
                {summary}
              </p>
            </div>
          )}

          {/* Professional Experience */}
          {experience && experience.length > 0 && (
            <div>
              <h3 className="text-sm font-bold border-b border-zinc-200 pb-1.5 mb-3 text-zinc-800" style={{ color: accentColor }}>
                Work History
              </h3>
              <div className="flex flex-col gap-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="pdf-block text-xs">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-zinc-800 text-[13px]">{exp.jobTitle}</span>
                      <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-500 font-medium mb-2">
                      <span>{exp.company}</span>
                      {exp.location && <span>{exp.location}</span>}
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc pl-4.5 space-y-1 text-zinc-600 text-[11.5px] leading-relaxed">
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
              <h3 className="text-sm font-bold border-b border-zinc-200 pb-1.5 mb-3 text-zinc-800" style={{ color: accentColor }}>
                Featured Projects
              </h3>
              <div className="flex flex-col gap-3.5">
                {projects.map((proj) => (
                  <div key={proj.id} className="pdf-block text-xs">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-zinc-800">{proj.name}</span>
                      <div className="text-[10px] text-zinc-400 space-x-2">
                        {proj.liveUrl && <span className="hover:underline">{proj.liveUrl}</span>}
                        {proj.githubUrl && <span className="hover:underline">{proj.githubUrl}</span>}
                      </div>
                    </div>
                    <p className="text-zinc-600 leading-normal mb-1.5 text-[11.5px]">{proj.description}</p>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {proj.techStack.map((tech, idx) => (
                          <span key={idx} className="text-[9px] bg-zinc-50 border border-zinc-200 px-1 py-0.2 rounded text-zinc-500">
                            {tech}
                          </span>
                        ))}
                      </div>
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
                  <h3 className="text-sm font-bold border-b border-zinc-200 pb-1.5 mb-2.5 text-zinc-800" style={{ color: accentColor }}>
                    {sect.title}
                  </h3>
                  <ul className="list-disc pl-4.5 space-y-1 text-zinc-600 text-[11.5px] leading-relaxed">
                    {sect.items.map((item, idx) => (
                      <li key={idx} className="pdf-block">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
