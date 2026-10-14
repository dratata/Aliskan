import type { AppState, Task } from "./types";
import { clockMinutes } from "./dates";
export function dailyTasks(state: AppState, date: string): Task[] {
  const day = new Date(date + "T12:00").getDay();
  return state.habits
    .filter((h) => h.active && h.days.includes(day))
    .map((h) => {
      const id = `${date}:${h.id}`;
      const saved = state.taskStates.find((t) => t.id === id);
      let time = saved?.time ?? h.time;
      if (h.id === "family") {
        const a = clockMinutes(state.profile.childAwakeStart),
          b = clockMinutes(state.profile.childAwakeEnd);
        if (a < b && (clockMinutes(time) < a || clockMinutes(time) >= b))
          time = state.profile.childAwakeStart;
      }
      return {
        id,
        habitId: h.id,
        date,
        title: h.title,
        time,
        target: h.target,
        unit: h.unit,
        status: saved?.status ?? "pending",
      } as Task;
    })
    .sort((a, b) => a.time.localeCompare(b.time));
}
export function completeTask(
  state: AppState,
  task: Task,
  status: "done" | "skipped" | "snoozed",
  time?: string,
  derived = false,
): AppState {
  return {
    ...state,
    taskStates: [
      ...state.taskStates.filter((t) => t.id !== task.id),
      {
        id: task.id,
        date: task.date,
        habitId: task.habitId,
        status,
        derived,
        target: task.target,
        ...(time ? { time } : {}),
      },
    ],
  };
}

export function reconcileTasks(state: AppState): AppState {
  return {
    ...state,
    taskStates: state.taskStates.filter((task) => {
      if (!task.derived || task.status !== "done") return true;
      const h = state.habits.find((h) => h.id === task.habitId)!;
      const events = state.events.filter((e) => e.date === task.date);
      let total = 0;
      if (task.habitId === "study")
        total = events
          .filter((e) => e.type === "study")
          .reduce((a, e) => a + e.value, 0);
      else if (task.habitId.startsWith("exercise"))
        total = events
          .filter(
            (e) => e.type === "exercise" && e.data.habitId === task.habitId,
          )
          .reduce((a, e) => a + e.value, 0);
      else if (task.habitId === "water")
        total = events
          .filter((e) => e.type === "water")
          .reduce((a, e) => a + e.value, 0);
      else if (task.habitId === "family")
        total = events
          .filter((e) => e.type === "family")
          .reduce((a, e) => a + e.value, 0);
      else if (task.habitId === "nutrition")
        total = events.filter(
          (e) => e.type === "meal" || e.type === "snack",
        ).length;
      else if (task.habitId === "night")
        return state.nightSteps.every((st) =>
          events.some(
            (e) =>
              e.type === "routine" &&
              e.data.routine === "night" &&
              e.data.step === st.id,
          ),
        );
      else return true;
      return total >= (task.target ?? h.target);
    }),
  };
}

// Adopt old completion targets before an update changes the habit goal.
export function snapshotTaskTargets(state: AppState): AppState {
  return {
    ...state,
    taskStates: state.taskStates.map((task) =>
      task.derived && task.target === undefined
        ? {
            ...task,
            target: state.habits.find((h) => h.id === task.habitId)!.target,
          }
        : task,
    ),
  };
}
