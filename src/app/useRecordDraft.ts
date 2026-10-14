import { useState } from "react";
// Read untouched fields from the latest store; retain only explicit user edits.
export function useRecordDraft<T extends object>(source: T) {
  const [patch, setPatch] = useState<Partial<T>>({});
  const value = { ...source, ...patch };
  return {
    value,
    patch,
    dirty: Object.keys(patch).some(
      (key) => patch[key as keyof T] !== source[key as keyof T],
    ),
    setValue: (next: T) =>
      setPatch(
        Object.fromEntries(
          Object.entries(next).filter(
            ([key, value]) => value !== source[key as keyof T],
          ),
        ) as Partial<T>,
      ),
    reset: () => setPatch({}),
  };
}
