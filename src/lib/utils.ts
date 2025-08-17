import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidFileContent(data: unknown): data is Epub {
  // Basic validation: check it's a non-null object (not an array)
  return typeof data === 'object' && data !== null && !Array.isArray(data);
}

export function safeRandomUUID(): string {
  return crypto.randomUUID();
}