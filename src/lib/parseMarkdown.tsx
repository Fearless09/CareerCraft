export const parseMarkdown = ({
  markdown,
  title,
}: {
  markdown: string;
  title?: string;
}) => {
  const blocks = markdown.split(/\n\n+/);
  const trimmedTitle = title ? title.trim() : "";
  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("# ")) {
      // Skip main title because we render it in the parent SSR page
      if (
        idx === 0 &&
        !!trimmedTitle &&
        trimmed
          .toLowerCase()
          .includes(trimmedTitle.toLowerCase().substring(0, 10))
      )
        return null;
      return (
        <h2
          key={idx}
          className="font-display text-primary mt-8 mb-4 border-b border-zinc-100 pb-2 text-2xl font-semibold"
        >
          {trimmed.replace("# ", "")}
        </h2>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h3
          key={idx}
          className="font-body text-primary mt-6 mb-3 text-xl font-semibold"
        >
          {trimmed.replace("## ", "")}
        </h3>
      );
    }
    if (trimmed.startsWith("> ")) {
      return (
        <blockquote
          key={idx}
          className="border-accent font-body my-4 rounded-r-xl border-l-4 bg-zinc-100 p-4 leading-relaxed text-zinc-600 italic"
        >
          {trimmed.replace("> ", "")}
        </blockquote>
      );
    }
    if (trimmed.startsWith("- ")) {
      const items = trimmed
        .split("\n")
        .map((line) => line.replace("- ", "").trim());
      return (
        <ul
          key={idx}
          className="my-4 flex list-disc flex-col gap-2 pl-6 text-zinc-500"
        >
          {items.map((item, i) => (
            <li key={i} className="font-body text-base leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed
        .split("\n")
        .map((line) => line.replace(/^\d+\.\s/, "").trim());
      return (
        <ol
          key={idx}
          className="my-4 flex list-decimal flex-col gap-2 pl-6 text-zinc-500"
        >
          {items.map((item, i) => (
            <li key={i} className="font-body text-base leading-relaxed">
              {item}
            </li>
          ))}
        </ol>
      );
    }
    return (
      <p
        key={idx}
        className="font-body my-4 text-base leading-relaxed text-zinc-500"
      >
        {trimmed}
      </p>
    );
  });
};
