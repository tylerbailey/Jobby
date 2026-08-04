import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merges and deduplicates Tailwind class names. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
