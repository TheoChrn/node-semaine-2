import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function classVariants(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
