import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMemory(bytes: number) {
  if (bytes < 1024) {
    // Less than 1 KB, keep in bytes
    return `${bytes} B`;
  } else if (bytes < 1024 ** 2) {
    // Convert to KB
    return `${(bytes / 1024).toFixed(0)} KB`;
  } else if (bytes < 1024 ** 3) {
    // Convert to MB
    return `${(bytes / 1024 ** 2).toFixed(0)} MB`;
  } else {
    // Convert to GB
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  }
}
