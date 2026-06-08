import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}

export function calculateMonthlyRequirement(target: number, current: number, deadline: string): number {
  const remaining = target - current;
  if (remaining <= 0) return 0;
  
  const today = new Date();
  const targetDate = new Date(deadline);
  const diffInMonths = (targetDate.getFullYear() - today.getFullYear()) * 12 + (targetDate.getMonth() - today.getMonth());
  
  return diffInMonths <= 0 ? remaining : remaining / diffInMonths;
}

export function calculateDailyRequirement(target: number, current: number, deadline: string): number {
  const remaining = target - current;
  if (remaining <= 0) return 0;
  
  const today = new Date();
  const targetDate = new Date(deadline);
  const diffInTime = targetDate.getTime() - today.getTime();
  const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
  
  return diffInDays <= 0 ? remaining : remaining / diffInDays;
}
