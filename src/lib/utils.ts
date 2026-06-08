import { Blog } from "@/db/schema";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const apiRequest = async <T>(url: string, options?: RequestInit) => {
  const request = await fetch(url, options)
    .then(async (r) => {
      if (!r.ok) {
        const { error } = await r.json();
        throw new Error(error ?? "Something went wrong");
      }
      return r.json() as T;
    })
    .catch((error) => {
      const msg =
        error instanceof Error ? error.message : "Something went wrong";
      throw new Error(msg);
    });

  return request;
};

export const getPostCatColor = (cat: Blog["category"]) => {
  switch (cat) {
    case "Career":
      return "border-accent/15 bg-accent/10 text-accent";
    case "Interview":
      return "border-rose-100 bg-rose-50 text-rose-700";
    case "Job Search":
      return "border-sky-100 bg-sky-50 text-sky-700";
    case "Negotiation":
      return "border-emerald-100 bg-emerald-50 text-emerald-700";
    case "Resume":
      return "border-indigo-100 bg-indigo-50 text-indigo-700";
    default:
      return "border-primary/15 bg-primary/10 text-primary";
  }
};
