"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { upload } from "@vercel/blob/client";
import {
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  Calendar,
  Clock,
  ImageIcon,
  Upload,
  TagIcon,
} from "lucide-react";
import { apiRequest, cn, getPostCatColor } from "@/lib/utils";
import Image from "next/image";
import { Blog, blogCategories, BlogInsert, BlogPost } from "@/db/schema";
import { useUI } from "@/context";
import DeleteModal from "@/components/shared/DeletModal";
import AddnUpdateModalWrapper from "@/components/shared/AddnUpdateModalWrapper";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { parseMarkdown } from "@/lib/parseMarkdown";
import { Loader } from "@/components/shared/Loader";

type Mode = "edit" | "preview";

const emptyForm = (cat: Blog["category"]): BlogInsert => ({
  category: cat,
  content: "",
  excerpt: "",
  publishDate: new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
  readTime: "5 min read",
  slug: "",
  title: "",
  image: "",
});

export default function AdminBlogsPage() {
  const { data: session } = useSession();
  const { data, mutate, isLoading } = useSWR<{ posts: BlogPost[] }>(
    "/api/blogs",
    apiRequest,
  );
  const { addToast } = useUI();
  const searchParams = useSearchParams();
  const action = searchParams.get("action");

  // Modal State
  const [editSlug, setEditSlug] = useState<BlogPost["slug"] | null>(null);
  const [formData, setFormData] = useState<BlogInsert | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Delete State
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const postsList = data?.posts || [];

  // Handle URL search action check
  useEffect(() => {
    if (action === "new") handleOpenAdd();
  }, [action]);

  const handleOpenAdd = () => {
    if (editSlug) setEditSlug(null);
    setFormData(emptyForm("Resume"));
    if (uploadProgress) setUploadProgress(null);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditSlug(post.slug);
    setFormData({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      publishDate: post.publishDate,
      readTime: post.readTime,
      image: post.image || "",
      content: post.content,
    });
    if (uploadProgress) setUploadProgress(null);
  };

  const handleFormChange = (data: Partial<BlogInsert>) => {
    setFormData((prev) => {
      if (!prev) return { ...emptyForm("Resume"), ...data };
      return { ...prev, ...data };
    });
  };

  // Derive Slug
  useEffect(() => {
    if (!formData?.title) return;
    if (!editSlug && formData.title.trim()) {
      const slugified = formData.title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => {
        if (!prev) return { ...emptyForm("Resume"), slug: slugified };
        return { ...prev, slug: slugified };
      });
    }
  }, [formData?.title, editSlug]);

  // Vercel Blob client upload
  const handleImageUpload = async (file: File) => {
    setUploadProgress(0);

    try {
      const fileName = "blog/" + file.name;
      const newBlob = await upload(fileName, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        onUploadProgress: (progressEvent) => {
          setUploadProgress(Math.round(progressEvent.percentage));
        },
      });

      setFormData((prev) => {
        if (!prev) return { ...emptyForm("Resume"), image: newBlob.url };
        return { ...prev, image: newBlob.url };
      });
      addToast("Image uploaded successfully", "success");
    } catch (err: any) {
      console.error(err);
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to upload image to Vercel Blob";
      addToast(msg, "error");
    } finally {
      setUploadProgress(null);
    }
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);

    const url = editSlug
      ? `/api/admin/blogs?slug=${editSlug}`
      : "/api/admin/blogs";
    const method = editSlug ? "PUT" : "POST";

    try {
      await apiRequest(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      await mutate();

      addToast(
        `Blog article ${editSlug ? "updated" : "created"} successfully`,
        "success",
      );
      setFormData(null);
    } catch (err: any) {
      const msg =
        err instanceof Error
          ? err.message
          : `Failed to ${editSlug ? "update" : "create"} blog article`;
      addToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPost) return;
    setIsDeleting(true);

    try {
      await apiRequest<{ success: boolean; post: Blog }>(
        `/api/admin/blogs?slug=${deletingPost.slug}`,
        { method: "DELETE" },
      );
      await mutate();

      addToast("Blog article deleted successfully", "success");
      setDeletingPost(null);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete blog article";
      addToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <header className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div>
          <h1 className="font-display flex items-center justify-center gap-2 text-3xl font-extrabold tracking-tight text-zinc-900 md:justify-start">
            <MessageSquare className="text-accent mt-0.5 size-6" />
            Manage Career Articles
          </h1>
          <p className="mt-1 max-w-xl text-sm text-balance text-zinc-500">
            Write guides, resume reviews, or job market insights for the
            CareerCraft blog page.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-accent hover:bg-accent/90 transition-300 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md active:scale-95"
        >
          <Plus className="size-4" />
          Compose Post
        </button>
      </header>

      {/* Blogs Listing Grid */}
      <>
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader length={12} />
            <span className="text-xs font-medium text-zinc-500">
              Loading articles...
            </span>
          </div>
        ) : postsList.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 px-4 py-8 text-center">
            <MessageSquare className="text-accent mb-3 size-10" />
            <h3 className="text-sm font-bold text-zinc-800">
              No blog articles found
            </h3>
            <p className="mt-1 max-w-xs text-xs text-zinc-400">
              Create your first article or execute the seeding script to
              populate.
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {postsList.map((post) => (
              <article
                key={post.slug}
                className="group transition-300 flex flex-col overflow-clip rounded-2xl border border-zinc-200 bg-white shadow hover:shadow-md"
              >
                <div className="relative flex aspect-video overflow-clip bg-zinc-50 text-zinc-400">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="100%"
                      className="transition-300 object-cover object-center group-hover:scale-105"
                    />
                  ) : (
                    <ImageIcon className="m-auto size-10 text-zinc-300" />
                  )}

                  {/* Category Badge overlay */}
                  <span
                    className={cn(
                      "absolute top-4 left-4 z-1 flex items-center justify-center gap-1 rounded-md border px-2 py-0.5 text-[9px] font-extrabold tracking-wider uppercase shadow backdrop-blur-sm",
                      getPostCatColor(post.category),
                    )}
                  >
                    <TagIcon className="size-3" />
                    {post.category}
                  </span>

                  {/* Edit overlay on hover */}
                  {(session?.user.id === post.authorId ||
                    session?.user.isSuperAdmin) && (
                    <div className="transition-300 absolute inset-0 flex items-center justify-center gap-2 bg-zinc-900/30 opacity-0 group-hover:opacity-100 [&_svg]:size-3.5">
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="transition-300 flex cursor-pointer items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-800 hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-50"
                        disabled={isSubmitting}
                      >
                        <Edit2 />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingPost(post)}
                        className="transition-300 flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-700 shadow hover:bg-red-100 disabled:pointer-events-none disabled:opacity-50"
                        disabled={isSubmitting}
                      >
                        <Trash2 />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between p-6 pt-4">
                  <div>
                    <h3 className="font-display group-hover:text-accent transition-300 text-base leading-normal font-bold text-zinc-900">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-normal text-zinc-500">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-2 text-[11px] font-semibold text-zinc-400 [&_svg]:size-3.5">
                    <span className="flex items-center gap-1">
                      <Calendar />
                      {post.publishDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </>

      {/* Create / Edit Article Slide-over Modal */}
      <AddnUpdateModal
        editSlug={editSlug}
        formData={formData}
        isSubmitting={isSubmitting}
        onCancel={() => setFormData(null)}
        onChange={(data) => handleFormChange(data)}
        onSubmit={() => handleFormSubmit()}
        onUpload={(file) => handleImageUpload(file)}
        uploadProgress={uploadProgress}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isDeleting={isDeleting}
        onCancel={() => setDeletingPost(null)}
        onDelete={handleDelete}
        itemTitle={deletingPost?.title}
        modalTitle="Remove Career Post"
      />
    </section>
  );
}

const modes: Mode[] = ["edit", "preview"];

const AddnUpdateModal = ({
  editSlug,
  formData,
  isSubmitting,
  onCancel,
  onChange,
  onSubmit,
  onUpload,
  uploadProgress,
}: {
  formData: BlogInsert | null;
  editSlug: BlogPost["slug"] | null;
  onCancel: () => void;
  onSubmit: () => Promise<void>;
  onChange: (data: Partial<BlogInsert>) => void;
  onUpload: (file: File) => void;
  uploadProgress: number | null;
  isSubmitting: boolean;
}) => {
  const [mode, setMode] = useState<Mode>("edit");

  return (
    <AddnUpdateModalWrapper isOpen={!!formData} width="896px">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-lg font-bold text-zinc-900">
            {editSlug ? "Modify Career Post" : "Draft New Article"}
          </h3>

          <div className="grid h-6 w-30 grid-cols-2 overflow-clip rounded-lg border border-zinc-200 bg-zinc-100 p-0.5">
            {modes.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  if (m === mode) return;
                  setMode(m);
                }}
                className={cn(
                  "transition-300 cursor-pointer rounded-md text-[10px] font-bold text-zinc-500 capitalize",
                  {
                    "bg-white font-extrabold text-zinc-900 shadow-xs":
                      mode === m,
                  },
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            if (mode == "preview") setMode("edit");
            onCancel();
          }}
          className="transition-300 cursor-pointer rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
        >
          <X className="size-5" />
        </button>
      </header>

      {!!formData && (
        <>
          {mode === "edit" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
              className="mt-6 grid flex-1 grid-cols-1 gap-6 overflow-y-auto md:grid-cols-12"
            >
              {/* Left Column (Metadata) */}
              <main className="space-y-4 md:col-span-4">
                <div>
                  <label
                    htmlFor="blog-title"
                    className="mb-1.5 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
                  >
                    Post Title
                  </label>
                  <input
                    type="text"
                    required
                    id="blog-title"
                    value={formData.title}
                    onChange={(e) => onChange({ title: e.target.value })}
                    placeholder="Draft catchy SEO title"
                    className="transition-300 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-zinc-400 focus:outline-none disabled:pointer-events-none"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label
                    htmlFor="blog-slug"
                    className="mb-1.5 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
                  >
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    id="blog-slug"
                    disabled={!!editSlug || isSubmitting}
                    value={formData.slug}
                    onChange={(e) => onChange({ slug: e.target.value })}
                    placeholder="auto-derived-url-slug"
                    className="transition-300 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-zinc-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  />
                </div>

                <main className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="blog-category"
                      className="mb-1.5 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
                    >
                      Category
                    </label>
                    <select
                      id="blog-category"
                      value={formData.category}
                      onChange={(e) =>
                        onChange({
                          category: e.target.value as BlogPost["category"],
                        })
                      }
                      className={cn(
                        "transition-300 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-2 text-xs text-zinc-900 focus:outline-transparent disabled:pointer-events-none",
                        getPostCatColor(formData.category),
                      )}
                      disabled={isSubmitting}
                    >
                      {blogCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="blog-read-time"
                      className="mb-1.5 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
                    >
                      Read Time
                    </label>
                    <input
                      id="blog-read-time"
                      type="text"
                      required
                      value={formData.readTime}
                      onChange={(e) => onChange({ readTime: e.target.value })}
                      placeholder="e.g. 6 min read"
                      className="transition-300 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-zinc-400 focus:outline-none disabled:pointer-events-none"
                      disabled={isSubmitting}
                    />
                  </div>
                </main>

                <div>
                  <label
                    htmlFor="blog-excerpt"
                    className="mb-1.5 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
                  >
                    Post Excerpt
                  </label>
                  <textarea
                    id="blog-excerpt"
                    required
                    rows={4}
                    value={formData.excerpt}
                    onChange={(e) => onChange({ excerpt: e.target.value })}
                    placeholder="Compelling abstract hook..."
                    className="transition-300 w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-zinc-400 focus:outline-none disabled:pointer-events-none"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Vercel Blob Image Upload with Progress Bar */}
                <div className="border-t border-zinc-200 pt-3">
                  <label
                    htmlFor="blog-image"
                    className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
                  >
                    Cover Image
                  </label>
                  <div className="group transition-300 relative flex aspect-video cursor-pointer flex-col items-center justify-center overflow-clip rounded-xl border border-dashed border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100">
                    {formData.image ? (
                      <>
                        <Image
                          src={formData.image}
                          alt="Blog Cover Preview"
                          fill
                          sizes="100%"
                          className="object-cover object-center"
                        />
                        {!isSubmitting && (
                          <div className="transition-300 absolute inset-0 flex bg-zinc-900/35 opacity-0 group-hover:opacity-100">
                            <span className="m-auto rounded border border-zinc-300 bg-zinc-900/90 px-2 py-1 text-[10px] font-extrabold text-white">
                              Change Cover
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <Upload className="mb-1 size-5.5 text-zinc-400" />
                        <span className="text-[10px] font-semibold text-zinc-500">
                          Upload cover image
                        </span>
                      </>
                    )}
                    <input
                      id="blog-image"
                      disabled={isSubmitting}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUpload(file);
                      }}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </div>

                  {/* Byte transfer progress bar */}
                  {uploadProgress !== null && (
                    <div className="mt-3.5 space-y-1.5">
                      <div className="flex items-center justify-between font-mono text-[9px] text-zinc-500">
                        <span>Uploading to Vercel Blob...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-1 w-full overflow-clip rounded-full bg-zinc-100">
                        <div
                          className="bg-accent transition-300 h-full rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </main>

              {/* Right Column (Markdown Content Editor) */}
              <main className="min-h0 flex flex-col md:col-span-8">
                <label
                  htmlFor="blog-content"
                  className="mb-1.5 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
                >
                  Article Content (Markdown body)
                </label>
                <textarea
                  required
                  id="blog-content"
                  value={formData.content}
                  onChange={(e) => onChange({ content: e.target.value })}
                  placeholder={`# Markdown Header 1\n\nDraft the long-form career advice or guide here in standard Markdown...`}
                  className="transition-300 min-h-[350px] w-full flex-1 resize-none rounded-xl border border-zinc-200 bg-zinc-50 p-4 font-mono text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none disabled:pointer-events-none"
                  disabled={isSubmitting}
                />
              </main>

              {/* Actions footer inside grid for clean layout */}
              <main className="mt-auto flex justify-end gap-3 border-t border-zinc-200 pt-3 md:col-span-12">
                <button
                  type="button"
                  onClick={() => onCancel()}
                  disabled={isSubmitting}
                  className="transition-300 cursor-pointer rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadProgress !== null}
                  className="bg-accent hover:bg-accent/90 transition-300 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    "Save Article"
                  )}
                </button>
              </main>
            </form>
          )}

          {mode === "preview" && (
            <section className="mt-6 flex flex-1 flex-col overflow-y-auto">
              <article className="prose prose-zinc mx-auto w-full max-w-3xl flex-1 space-y-6 py-6">
                <span
                  className={cn(
                    "block w-max rounded border px-2 py-0.5 text-[9px] font-extrabold uppercase",
                    getPostCatColor(formData.category),
                  )}
                >
                  {formData.category}
                </span>
                <h1 className="font-display text-3xl font-extrabold text-zinc-900">
                  {formData.title || "Untitled Article"}
                </h1>
                <p className="text-sm text-zinc-500 italic">
                  {formData.excerpt || "Excerpt hook will render here..."}
                </p>

                {formData.image && (
                  <div className="relative aspect-video w-full overflow-clip rounded-2xl bg-zinc-50">
                    <Image
                      src={formData.image}
                      alt="Cover Preview"
                      fill
                      sizes="100%"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="border-t border-zinc-200 font-sans text-xs leading-relaxed whitespace-pre-wrap text-zinc-700">
                  {formData.content ? (
                    parseMarkdown({
                      markdown: formData.content,
                      title: formData.title,
                    })
                  ) : (
                    <p className="pt-6">
                      Write some markdown in the editor to see it render...
                    </p>
                  )}
                </div>
              </article>

              {/* Actions footer inside grid for clean layout */}
              <main className="mx-auto mt-auto flex w-full max-w-3xl justify-end gap-3 border-t border-zinc-200 pt-3 md:col-span-12">
                <button
                  onClick={() => {
                    setMode("edit");
                    onCancel();
                  }}
                  disabled={isSubmitting}
                  className="transition-300 cursor-pointer rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting || uploadProgress !== null}
                  className="bg-accent hover:bg-accent/90 transition-300 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 disabled:opacity-50"
                  onClick={async () => {
                    await onSubmit();
                    setMode("edit");
                  }}
                >
                  {isSubmitting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    "Save Article"
                  )}
                </button>
              </main>
            </section>
          )}
        </>
      )}
    </AddnUpdateModalWrapper>
  );
};
