import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const apiRequest = async <T>(url: string, options?: RequestInit) => {
  return await fetch(url, options).then((r) => r.json() as T);
  // .catch((error) => {
  //   const msg =
  //     error instanceof Error ? error.message : "Something went wrong";
  //   console.error({ msg, error });
  // });
};
