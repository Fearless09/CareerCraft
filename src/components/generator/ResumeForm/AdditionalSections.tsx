"use client";

import React, { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { FilePlus2, Plus, Trash2, PlusCircle, MinusCircle } from "lucide-react";

export default function AdditionalSections() {
  const {
    resumeData,
    addAdditionalSection,
    updateAdditionalSection,
    removeAdditionalSection,
  } = useResume();

  const { additionalSections } = resumeData;
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newSectionTitle.trim();
    if (!title) return;

    addAdditionalSection(title);
    setNewSectionTitle("");
  };

  const handleItemChange = (id: string, index: number, value: string) => {
    const sect = additionalSections.find((s) => s.id === id);
    if (!sect) return;
    const newItems = [...sect.items];
    newItems[index] = value;
    updateAdditionalSection(id, newItems);
  };

  const handleAddItem = (id: string) => {
    const sect = additionalSections.find((s) => s.id === id);
    if (!sect) return;
    updateAdditionalSection(id, [...sect.items, ""]);
  };

  const handleRemoveItem = (id: string, indexToRemove: number) => {
    const sect = additionalSections.find((s) => s.id === id);
    if (!sect) return;
    if (sect.items.length <= 1) return; // Keep at least one item
    const newItems = sect.items.filter((_, idx) => idx !== indexToRemove);
    updateAdditionalSection(id, newItems);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="mb-1 text-lg font-bold text-zinc-100">
          Additional Information
        </h2>
        <p className="text-xs text-zinc-400">
          Create fully custom sections such as volunteering, accomplishments,
          publications, or interests.
        </p>
      </div>

      {/* Quick Add Custom Section Form */}
      <form
        onSubmit={handleCreateSection}
        className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-3"
      >
        <input
          type="text"
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          placeholder="e.g. Volunteering, Interests, Publications"
          className="bg-zinc-855 py-1.8 focus:border-accent flex-1 rounded-lg border border-zinc-800 px-3 text-xs text-zinc-200 transition focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newSectionTitle.trim()}
          className="bg-accent flex shrink-0 cursor-pointer items-center gap-1 rounded-lg px-3.5 py-2 text-xs font-medium text-white shadow transition hover:bg-rose-600 active:scale-95 disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Section</span>
        </button>
      </form>

      {additionalSections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
          <FilePlus2 className="mx-auto mb-2 h-10 w-10 text-zinc-600" />
          <p className="text-sm font-semibold">
            No custom sections created yet.
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Type a title in the input box above to add a dynamic custom list.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {additionalSections.map((sect) => (
            <div
              key={sect.id}
              className="animate-fade-in-up relative space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs font-bold tracking-wide text-zinc-200 uppercase">
                  {sect.title}
                </span>

                <button
                  onClick={() => removeAdditionalSection(sect.id)}
                  title={`Remove ${sect.title}`}
                  className="hover:bg-zinc-850 cursor-pointer rounded-lg p-1.5 text-zinc-500 transition duration-150 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-400">
                    Custom Bullet Information
                  </label>
                  <button
                    onClick={() => handleAddItem(sect.id)}
                    className="text-zinc-450 hover:text-accent flex cursor-pointer items-center gap-1 text-[10px] font-semibold transition"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {sect.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex gap-2">
                      <textarea
                        value={item}
                        onChange={(e) =>
                          handleItemChange(sect.id, itemIdx, e.target.value)
                        }
                        placeholder={`Details for this item (e.g. Volunteer coding instructor at the local community library).`}
                        rows={2}
                        className="bg-zinc-855 focus:border-accent w-full rounded-lg border border-zinc-800 p-2.5 text-xs text-zinc-200 transition focus:outline-none"
                      />
                      <button
                        onClick={() => handleRemoveItem(sect.id, itemIdx)}
                        disabled={sect.items.length <= 1}
                        title="Delete Item"
                        className="text-zinc-650 hover:bg-zinc-850 shrink-0 cursor-pointer self-start rounded-lg p-2 transition hover:text-red-400 disabled:opacity-40"
                      >
                        <MinusCircle className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
