import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | boolean | undefined | null | Record<string, boolean>)[]) {
  return twMerge(clsx(inputs));
}
