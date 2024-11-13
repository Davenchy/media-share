import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const likesCountFilter = (likes: number): string => {
  const units = ["", "K", "M", "P"]
  let currentValue = likes

  const val = () =>
    currentValue % 1 === 0 ? currentValue : currentValue.toFixed(1)

  for (let i = 0; i < units.length; i++) {
    if (currentValue >= 1000) {
      currentValue /= 1000
      continue
    }

    return `${val()}${units[i]}`
  }

  return `${val()}${units[units.length - 1]}`
}
