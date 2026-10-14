import { stateSchema, type AppState } from "../domain/types";
import { localDate } from "../domain/dates";
export function validateBackup(value: unknown): AppState {
  return stateSchema.parse(value);
}
export function mergeStates(current: AppState, incoming: AppState): AppState {
  const uniq = <T extends { id: string }>(a: T[], b: T[]) => [
    ...a,
    ...b.filter((x) => !a.some((existing) => existing.id === x.id)),
  ];
  return {
    ...current,
    events: uniq(current.events, incoming.events),
    taskStates: uniq(current.taskStates, incoming.taskStates),
  };
}
export function downloadBackup(state: AppState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aliskan-yedek-${localDate()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function previewMerge(current: AppState, incoming: AppState) {
  const existing = new Map(current.events.map((e) => [e.id, e]));
  const canonical = (value: unknown) =>
    JSON.stringify(value, (_, v) =>
      v && typeof v === "object" && !Array.isArray(v)
        ? Object.fromEntries(
            Object.entries(v).sort(([a], [b]) => a.localeCompare(b)),
          )
        : v,
    );
  return {
    newRecords: incoming.events.filter((e) => !existing.has(e.id)).length,
    duplicateRecords: incoming.events.filter((e) => existing.has(e.id)).length,
    conflictingRecords: incoming.events.filter(
      (e) =>
        existing.has(e.id) && canonical(e) !== canonical(existing.get(e.id)),
    ).length,
  };
}
