import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function interpolate(obj: any, context: Record<string, any> = {}): any {
  if (typeof obj === "string") {
    return obj.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const val = context ? context[key.trim()] : undefined;
      return val !== undefined && val !== null ? String(val) : "";
    });
  } else if (Array.isArray(obj)) {
    return obj.map((item) => interpolate(item, context));
  } else if (obj !== null && typeof obj === "object") {
    const result: Record<string, any> = {};
    for (const key in obj) {
      result[key] = interpolate(obj[key], context);
    }
    return result;
  }
  return obj;
}
