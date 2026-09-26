"use client";

import { useCallback, useState } from "react";
import { getStorageItem, setStorageItem } from "@/lib/storage/local-storage";
import type { StorageValue } from "@/lib/storage/local-storage";

export function useLocalStorage<T extends StorageValue>(
  key: string,
  initialValue: T,
) {
  const [value, setValue] = useState<T>(() =>
    getStorageItem<T>(key, initialValue),
  );

  const updateValue = useCallback(
    (nextValue: T | ((currentValue: T) => T)) => {
      setValue((currentValue) => {
        const resolved =
          typeof nextValue === "function"
            ? (nextValue as (value: T) => T)(currentValue)
            : nextValue;

        setStorageItem(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, updateValue] as const;
}
