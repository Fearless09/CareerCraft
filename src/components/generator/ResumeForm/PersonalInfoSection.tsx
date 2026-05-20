'use client';

import React, { useRef } from 'react';
 import { User, Mail, Phone, MapPin,   Globe, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useResume } from '@/context';

export default function PersonalInfoSection() {
  const { resumeData, updatePersonalInfo } = useResume();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { personalInfo } = resumeData;

  const handleInputChange = (field: keyof typeof personalInfo, value: string) => {
    updatePersonalInfo({ [field]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 1.5MB to prevent localstorage bloat)
    if (file.size > 1.5 * 1024 * 1024) {
      alert('Photo is too large. Please select an image under 1.5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        updatePersonalInfo({ photoUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    updatePersonalInfo({ photoUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-100 mb-1">Personal Details</h2>
        <p className="text-xs text-zinc-400">Fill in your contact information. Uploading a professional photo is optional but recommended for modern layouts.</p>
      </div>

      {/* Photo Uploader */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-zinc-850 flex items-center justify-center overflow-hidden border border-zinc-850 shrink-0 relative group">
          {personalInfo.photoUrl ? (
            <img 
              src={personalInfo.photoUrl} 
              alt="Profile" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <User className="w-10 h-10 text-zinc-500" />
          )}
        </div>
        
        <div className="flex-1 text-center sm:text-left space-y-2">
          <p className="text-xs font-semibold text-zinc-200">Profile Picture</p>
          <p className="text-[11px] text-zinc-500">Supports PNG, JPG, or JPEG. Max size 1.5MB.</p>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 font-medium text-xs px-3.5 py-1.8 rounded-lg transition active:scale-95 cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{personalInfo.photoUrl ? 'Replace Photo' : 'Upload Photo'}</span>
            </button>
            
            {personalInfo.photoUrl && (
              <button
                onClick={removePhoto}
                className="flex items-center gap-1.5 bg-zinc-950 border border-red-900/30 hover:bg-red-950/20 text-red-400 font-medium text-xs px-3.5 py-1.8 rounded-lg transition active:scale-95 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Personal Info Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-zinc-500" />
            <span>Full Name</span>
          </label>
          <input
            type="text"
            value={personalInfo.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Jane Doe"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition duration-150"
          />
        </div>

        {/* Job Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-zinc-500" />
            <span>Professional Headline</span>
          </label>
          <input
            type="text"
            value={personalInfo.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            placeholder="Senior Frontend Engineer"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition duration-150"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-zinc-500" />
            <span>Email Address</span>
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="jane.doe@example.com"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition duration-150"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-zinc-500" />
            <span>Phone Number</span>
          </label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+1 (555) 019-2834"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition duration-150"
          />
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-500" />
            <span>Location</span>
          </label>
          <input
            type="text"
            value={personalInfo.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="San Francisco, CA"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition duration-150"
          />
        </div>

        {/* LinkedIn */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            {/* <Linkedin className="w-3.5 h-3.5 text-zinc-500" /> */}
            <span>LinkedIn Profile</span>
          </label>
          <input
            type="text"
            value={personalInfo.linkedIn || ''}
            onChange={(e) => handleInputChange('linkedIn', e.target.value)}
            placeholder="linkedin.com/in/janedoe"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition duration-150"
          />
        </div>

        {/* Website */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-zinc-500" />
            <span>Personal Portfolio / Website URL</span>
          </label>
          <input
            type="url"
            value={personalInfo.website || ''}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="janedoe.dev"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition duration-150"
          />
        </div>
      </div>
    </div>
  );
}
