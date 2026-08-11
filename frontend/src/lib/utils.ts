import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes with conditional logic */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format time ago from Date or ISO string */
export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

/** Get initials from name */
export function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

/** Format currency in INR */
export function inr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** Role to theme class */
export function roleTheme(role: string): string {
  const themes: Record<string, string> = {
    admin: 'theme-admin',
    family_head: 'theme-head',
    family_member: 'theme-member',
    helper: 'theme-helper',
    blind: 'theme-admin', // blind uses brand orange
  };
  return themes[role] || 'theme-admin';
}
