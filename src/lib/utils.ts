import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMemory(bytes: number) {
  if (bytes < 1024) {
    // Less than 1 KB, keep in bytes
    return `${bytes.toFixed(0)} B`;
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

import { useEffect, useState } from "react";

function getItemFromLocalStorage(key: string) {
  if (typeof window === "undefined") return null;

  const item = window.localStorage.getItem(key);
  if (item) return JSON.parse(item) as unknown;

  return null;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState(
    getItemFromLocalStorage(key) ?? initialValue,
  );

  useEffect(() => {
    // Retrieve from localStorage
    const item = getItemFromLocalStorage(key);
    if (item) setStoredValue(item);
  }, [key]);

  const setValue = (value: T) => {
    // Save state
    setStoredValue(value);
    // Save to localStorage
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue as T, setValue];
}
