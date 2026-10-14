import type { AppState, TimerState, HabitId } from "./types";
import { remainingSeconds } from "./sessions";
export function timerMatches(
  timer: TimerState | null,
  kind: TimerState["kind"],
  habitId: HabitId | undefined,
  context = "",
): boolean {
  return (
    !!timer &&
    timer.kind === kind &&
    timer.habitId === habitId &&
    timer.context === context
  );
}
export function switchTimer(
  state: AppState,
  next: TimerState,
  now: number,
): AppState {
  if (
    state.timer?.id === next.id &&
    state.timer.running &&
    next.running &&
    !state.timer.saved
  )
    return state;
  let archive = state.timerArchive.filter((t) => t.id !== next.id);
  if (state.timer && state.timer.id !== next.id && !state.timer.saved) {
    const t = state.timer;
    archive = [
      ...archive.filter((x) => x.id !== t.id),
      {
        ...t,
        running: false,
        remaining:
          t.running && t.deadline
            ? remainingSeconds(t.deadline, now)
            : t.remaining,
        deadline: null,
      },
    ];
  }
  return { ...state, timer: next, timerArchive: archive };
}
export function resetTimer(
  state: AppState,
  kind: TimerState["kind"],
  habitId: HabitId | undefined,
  context = "",
): AppState {
  return {
    ...state,
    timer: timerMatches(state.timer, kind, habitId, context)
      ? null
      : state.timer,
    timerArchive: state.timerArchive.filter(
      (t) => !timerMatches(t, kind, habitId, context),
    ),
  };
}

export function findTimer(
  state: AppState,
  kind: TimerState["kind"],
  habitId: HabitId | undefined,
  context = "",
  id?: string,
): TimerState | null {
  const matches = (t: TimerState) =>
    timerMatches(t, kind, habitId, context) && (!id || t.id === id);
  return (
    (state.timer && matches(state.timer)
      ? state.timer
      : [...state.timerArchive].reverse().find(matches)) ?? null
  );
}
export type TimerRoute = { id: string; habit?: HabitId; mode?: "break" };
export function timerRoute(timer: TimerState): TimerRoute | null {
  if (timer.kind === "study") return { id: "study", habit: "study" };
  if (timer.context === "study-break") return { id: "study", mode: "break" };
  if (timer.kind === "breathing") return { id: "breathing" };
  if (timer.kind === "delay") return { id: "smoking", habit: "smoking" };
  if (timer.habitId) return { id: timer.habitId, habit: timer.habitId };
  return null;
}
