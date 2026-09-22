/**
 * Utility function for merging class names
 * Combines clsx and tailwind-merge for optimal Tailwind CSS class handling
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}