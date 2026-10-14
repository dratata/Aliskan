import type { AppState, HabitEvent } from "./types";
import { shiftDate } from "./dates";
export function latestDailyEvents(
  events: HabitEvent[],
  type: HabitEvent["type"],
) {
  const byDay = new Map<string, HabitEvent>();
  for (const event of events.filter((e) => e.type === type)) {
    const previous = byDay.get(event.date);
    if (!previous || Date.parse(event.at) >= Date.parse(previous.at))
      byDay.set(event.date, event);
  }
  return [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date));
}
export function summarize(state: AppState, start: string, end: string) {
  const events = state.events.filter((e) => e.date >= start && e.date <= end);
  const sleeps = latestDailyEvents(events, "sleep");
  const sum = (type: HabitEvent["type"]) =>
    events.filter((e) => e.type === type).reduce((a, e) => a + e.value, 0);
  return {
    sleepHours: sleeps.length
      ? sleeps.reduce((n, e) => n + e.value, 0) / sleeps.length / 60
      : null,
    sleepNights: sleeps.length,
    studyMinutes: sum("study"),
    studyDays: new Set(
      events.filter((e) => e.type === "study").map((e) => e.date),
    ).size,
    exerciseMinutes: sum("exercise"),
    cigarettes: sum("smoking"),
    water: sum("water"),
    familyMinutes: sum("family"),
    familySessions: events.filter((e) => e.type === "family").length,
    breathingMinutes: sum("breathing"),
    recordedDays: new Set(events.map((e) => e.date)).size,
  };
}
export function chartData(state: AppState, end: string, days: number) {
  return Array.from({ length: days }, (_, i) => {
    const date = shiftDate(end, i - days + 1),
      events = state.events.filter((e) => e.date === date);
    const sum = (type: HabitEvent["type"]) => {
      const e = events.filter((e) => e.type === type);
      return e.length
        ? Math.round(e.reduce((a, e) => a + e.value, 0) * 10) / 10
        : null;
    };
    const latest = (type: HabitEvent["type"]) =>
      events
        .filter((e) => e.type === type)
        .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
        .at(-1);
    return {
      date,
      label: new Date(date + "T12:00").toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
      }),
      study: sum("study"),
      exercise: sum("exercise"),
      smoking: sum("smoking"),
      water: sum("water"),
      weight: latest("weight")?.value ?? null,
      sleep: latest("sleep")
        ? Math.round((latest("sleep")!.value / 60) * 10) / 10
        : null,
      family: sum("family"),
      energy:
        latest("mood")?.data.energy ?? latest("sleep")?.data.energy ?? null,
      stress: latest("mood")?.data.stress ?? null,
      night:
        events.filter((e) => e.type === "routine" && e.data.routine === "night")
          .length || null,
    };
  });
}
