import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const VALID_LABELS = [
  "feedback",
  "bug",
  "feature-request",
  "question",
  "improvement",
  "documentation",
  "ui/ux",
] as const;

const feedbackSchema = z.object({
  title: z
    .string({ error: "A feedback title is required." })
    .trim()
    .min(1, "A feedback title is required.")
    .max(120, "Title must be 120 characters or fewer."),
  description: z
    .string({ error: "A feedback description is required." })
    .trim()
    .min(1, "A feedback description is required."),
  label: z.enum(VALID_LABELS).default("feedback"),
  reporter: z
    .string()
    .trim()
    .max(100, "Reporter must be 100 characters or fewer.")
    .default("Anonymous"),
});

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Validate env vars are configured
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    console.error(
      "[Feedback API] Missing GitHub environment variables. Check GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO in .env.local",
    );
    return NextResponse.json(
      { error: "Feedback service is not configured." },
      { status: 503 },
    );
  }

  let rawBody: unknown;

  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = feedbackSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.message ?? "Invalid input.",
        details: z.treeifyError(parsed.error),
      },
      { status: 400 },
    );
  }

  const { title, description, label, reporter } = parsed.data;
  const issueBody = `${description}

-----------------------------
**Submitted by:** ${reporter}
**Source:** CareerCraft Feedback Widget
**Date:** ${new Date().toUTCString()}`;

  try {
    const githubRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body: issueBody,
          labels: [label],
        }),
      },
    );

    if (!githubRes.ok) {
      const errData = await githubRes.json().catch(() => ({}));
      console.error("[Feedback API] GitHub API error:", errData);
      return NextResponse.json(
        { error: "Failed to submit feedback. Please try again later." },
        { status: 502 },
      );
    }

    const issue = await githubRes.json();

    return NextResponse.json(
      {
        success: true,
        issueNumber: issue.number,
        issueUrl: issue.html_url,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[Feedback API] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
