import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const unitFormatter = (
  units: string[],
  steps: number,
  valueFilter: (value: number) => string,
  value: number,
): string => {
  let current = value
  let index = 0

  for (index = 0; index < units.length; index++)
    if (current >= steps) current /= steps
    else break

  return `${valueFilter(current)} ${units[index]}`
}

export const likesFormat = (likes: number) =>
  unitFormatter(
    ["", "K", "M", "P"],
    1000,
    n => n.toFixed(n % 1 === 0 ? 0 : 1),
    likes,
  )

export const sizeFormat = (bytes: number) =>
  unitFormatter(
    ["Bytes", "KB", "MB", "GB", "TB"],
    1024,
    n => n.toFixed(1),
    bytes,
  )
