import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export async function getAllRecords() {
  const res = await fetch("https://registryapi-dev.azurewebsites.net/api/TAR/find"); // or your real endpoint
  const json = await res.json();
  return json.records || json; // check your API response shape
}