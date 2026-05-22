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
    <section className="space-y-6">
      <header>
        <h2 className="mb-1 text-lg font-bold text-zinc-100">
          Additional Information
        </h2>
        <p className="text-sm text-balance text-zinc-400">
          Create fully custom sections such as volunteering, accomplishments,
          publications, or interests.
        </p>
      </header>

      {/* Quick Add Custom Section Form */}
      <form
        onSubmit={handleCreateSection}
        className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-3"
      >
        <label htmlFor="new-section-input" className="sr-only">
          New Section Title
        </label>
        <input
          id="new-section-input"
          type="text"
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          placeholder="e.g. Volunteering, Interests, Publications"
          className="focus:border-accent transition-300 flex-1 rounded-lg border border-zinc-800 bg-zinc-800/40 px-3 py-1.75 text-xs text-zinc-200 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newSectionTitle.trim()}
          className="bg-accent transition-300 flex shrink-0 cursor-pointer items-center gap-1 rounded-lg px-3.5 py-2 text-xs font-medium text-white shadow hover:bg-rose-600 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
          <Plus className="size-3.5" />
          <span>Create Section</span>
        </button>
      </form>

      {additionalSections.length === 0 ? (
        <main
          id="no-additional-information"
          className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500"
        >
          <FilePlus2 className="mx-auto mb-2 size-10 text-zinc-600" />
          <p className="text-sm font-semibold">
            No custom sections created yet.
          </p>
          <p className="mt-1 text-xs">
            Type a title in the input box above to add a dynamic custom list.
          </p>
        </main>
      ) : (
        <section className="space-y-6">
          {additionalSections.map((sect, index) => (
            <main
              id={`additional-section-${index + 1}`}
              key={sect.id}
              className="relative space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs font-bold tracking-wide text-zinc-200 uppercase">
                  {sect.title}
                </span>

                <button
                  onClick={() => removeAdditionalSection(sect.id)}
                  title={`Remove ${sect.title}`}
                  className="transition-300 shrink-0 cursor-pointer rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* Items List */}
              <main className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-400">
                    Custom Bullet Information
                  </label>
                  <button
                    onClick={() => handleAddItem(sect.id)}
                    className="hover:text-accent transition-300 flex shrink-0 cursor-pointer items-center gap-1 text-[10px] font-semibold text-zinc-400"
                  >
                    <PlusCircle className="size-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <ul
                  id={`additional-sectioon-${index + 1}-lists`}
                  className="space-y-2"
                >
                  {sect.items.map((item, itemIdx) => (
                    <li
                      id={`additional-section-${index + 1}-${itemIdx + 1}`}
                      key={itemIdx}
                      className="flex gap-2"
                    >
                      <textarea
                        id={`additional-section-${index + 1}-${itemIdx + 1}-input`}
                        value={item}
                        onChange={(e) =>
                          handleItemChange(sect.id, itemIdx, e.target.value)
                        }
                        placeholder={`Details for this item (e.g. Volunteer coding instructor at the local community library).`}
                        rows={2.5}
                        className="focus:border-accent transition-300 w-full rounded-lg border border-zinc-800 bg-zinc-800 p-2.5 text-xs text-zinc-200 focus:outline-none"
                      />
                      <button
                        onClick={() => handleRemoveItem(sect.id, itemIdx)}
                        disabled={sect.items.length <= 1}
                        title="Delete Item"
                        className="transition-300 mt-0.5 shrink-0 cursor-pointer self-start rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-red-400 disabled:pointer-events-none disabled:opacity-40"
                      >
                        <MinusCircle className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </main>
            </main>
          ))}
        </section>
      )}
    </section>
  );
}
