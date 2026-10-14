import type { AppState, HabitEvent, TimerState } from "./types";
export const topicKey = (topic: string) =>
  topic.trim().replace(/\s+/g, " ").toLocaleLowerCase("tr-TR");
export function studyTopics(events: HabitEvent[]) {
  const groups = new Map<
    string,
    {
      key: string;
      name: string;
      minutes: number;
      sessions: number;
      lastAt: string;
    }
  >();
  for (const e of events.filter((e) => e.type === "study" && e.value > 0)) {
    const name = String(e.data.topic ?? "").trim(),
      key = topicKey(name),
      old = groups.get(key);
    groups.set(key, {
      key,
      name:
        !old || Date.parse(e.at) >= Date.parse(old.lastAt) ? name : old.name,
      minutes: (old?.minutes ?? 0) + e.value,
      sessions: (old?.sessions ?? 0) + 1,
      lastAt:
        old && Date.parse(old.lastAt) > Date.parse(e.at) ? old.lastAt : e.at,
    });
  }
  return [...groups.values()].sort(
    (a, b) => Date.parse(b.lastAt) - Date.parse(a.lastAt),
  );
}
export function renameTopic(
  state: AppState,
  key: string,
  name: string,
): AppState {
  name = name.trim().replace(/\s+/g, " ");
  if (!name || name.length > 150)
    throw Error("Konu adı 1–150 karakter olmalı.");
  const matches = (v: unknown) => typeof v === "string" && topicKey(v) === key;
  const timer = (t: TimerState) =>
    (t.kind === "study" || t.context === "study-break") && matches(t.topic)
      ? { ...t, topic: name }
      : t;
  return {
    ...state,
    events: state.events.map((e) =>
      e.type === "study" &&
      (matches(e.data.topic) || (key === "" && !e.data.topic))
        ? { ...e, data: { ...e.data, topic: name } }
        : e,
    ),
    timer: state.timer ? timer(state.timer) : null,
    timerArchive: state.timerArchive.map(timer),
  };
}
