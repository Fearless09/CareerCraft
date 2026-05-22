"use client";

import React, { ComponentProps, FC, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { useResume } from "@/context";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LinkedInSvg } from "@/components/shared/Svgs";

export default function PersonalInfoSection() {
  const { resumeData, updatePersonalInfo } = useResume();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { personalInfo } = resumeData;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 1.5MB to prevent localstorage bloat)
    if (file.size > 1.5 * 1024 * 1024) {
      alert("Photo is too large. Please select an image under 1.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        updatePersonalInfo({ photoUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    updatePersonalInfo({ photoUrl: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="mb-1 text-lg font-bold text-zinc-100">
          Personal Details
        </h2>
        <p className="text-sm text-balance text-zinc-400">
          Fill in your contact information. Uploading a professional photo is
          optional but recommended for modern layouts.
        </p>
      </header>

      {/* Photo Uploader */}
      <main
        id="photo-uploader"
        className="flex flex-col items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:flex-row"
      >
        <div className="group relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-800 bg-zinc-800">
          {personalInfo.photoUrl ? (
            <Image
              src={personalInfo.photoUrl}
              alt="Profile"
              fill
              sizes="100%"
              className="object-cover"
            />
          ) : (
            <User className="size-10 text-zinc-500" />
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-semibold text-zinc-200">Profile Picture</p>
          <p className="text-xs text-zinc-500">
            Supports PNG, JPG, or JPEG. Max size 1.5MB.
          </p>

          <div className="mt-1 flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="transition-300 flex cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-800 px-3.5 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 active:scale-95"
            >
              <ImageIcon className="size-3.5" />
              <span>
                {personalInfo.photoUrl ? "Replace Photo" : "Upload Photo"}
              </span>
            </button>

            {!!personalInfo.photoUrl && (
              <button
                onClick={removePhoto}
                className="transition-300 flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-900/30 bg-red-950/15 px-3.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-950/50 active:scale-95"
              >
                <Trash2 className="size-3.5" />
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
      </main>

      {/* Personal Info Grid Inputs */}
      <main
        id="personal_forms"
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {/* Full Name */}
        <GroupInput
          label="Full Name"
          id="full_name"
          Icon={User}
          value={personalInfo.fullName}
          onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
          placeholder="Jane Doe"
        />

        {/* Job Title */}
        <GroupInput
          label="Professional Headline"
          Icon={Globe}
          id="professional_headline"
          value={personalInfo.jobTitle}
          onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
          placeholder="Senior Frontend Engineer"
        />

        {/* Email */}
        <GroupInput
          label="Email Address"
          Icon={Mail}
          id="email_address"
          type="email"
          value={personalInfo.email}
          onChange={(e) => updatePersonalInfo({ email: e.target.value })}
          placeholder="jane.doe@example.com"
        />

        {/* Phone */}
        <GroupInput
          label="Phone Number"
          Icon={Phone}
          id="phone_number"
          type="tel"
          value={personalInfo.phone}
          onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
          placeholder="+1 (555) 019-2834"
        />

        {/* Location */}
        <GroupInput
          label="Location"
          Icon={MapPin}
          id="location"
          value={personalInfo.location}
          onChange={(e) => updatePersonalInfo({ location: e.target.value })}
          placeholder="San Francisco, CA"
        />

        {/* LinkedIn */}
        <GroupInput
          label="LinkedIn Profile"
          Icon={LinkedInSvg}
          id="linkedin_profile"
          value={personalInfo.linkedIn || ""}
          onChange={(e) => updatePersonalInfo({ linkedIn: e.target.value })}
          placeholder="linkedin.com/in/janedoe"
        />

        {/* Website */}
        <GroupInput
          label="Personal Portfolio / Website URL"
          Icon={Globe}
          id="porfolio_url"
          wrapperClassName="md:col-span-2"
          type="url"
          value={personalInfo.website || ""}
          onChange={(e) => updatePersonalInfo({ website: e.target.value })}
          placeholder="janedoe.dev"
        />
      </main>
    </section>
  );
}

type GroupInput = FC<
  ComponentProps<"input"> & {
    label: string;
    Icon: FC<ComponentProps<"svg">>;
    wrapperClassName?: string;
  }
>;

const GroupInput: GroupInput = ({
  label,
  Icon,
  className,
  wrapperClassName,
  type = "text",
  ...props
}) => {
  return (
    <div className={cn("space-y-1.5", wrapperClassName)}>
      <label
        htmlFor={props.id}
        className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300"
      >
        <Icon className="size-3.75 text-zinc-400" />
        <span>{label}</span>
      </label>
      <input
        type={type}
        className={cn(
          "focus:border-accent transition-300 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:outline-none",
          className,
        )}
        {...props}
      />
    </div>
  );
};
