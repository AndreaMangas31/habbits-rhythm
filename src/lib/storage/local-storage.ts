export type StorageValue =
  | string
  | number
  | boolean
  | null
  | Record<string, unknown>
  | unknown[];

export const STORAGE_KEYS = {
  habits: "flowhabit:habits",
  checkIns: "flowhabit:checkins",
  notes: "flowhabit:notes",
  initialized: "flowhabit:initialized",
} as const;

function canUseLocalStorage() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

export function getStorageItem<T>(key: string, fallback: T): T {
  if (!canUseLocalStorage()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (raw === null) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Failed to parse localStorage key "${key}"`, error);
    return fallback;
  }
}

export function setStorageItem<T extends StorageValue>(key: string, value: T) {
  if (!canUseLocalStorage()) {
    return false;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to write localStorage key "${key}"`, error);
    return false;
  }
}

export function removeStorageItem(key: string) {
  if (!canUseLocalStorage()) {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove localStorage key "${key}"`, error);
    return false;
  }
}
