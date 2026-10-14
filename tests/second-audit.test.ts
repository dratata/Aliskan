import { it, expect } from "vitest";
import { createInitialState } from "../src/domain/defaults";
import { mergeStates, validateBackup } from "../src/data/backup";
import { completeTask, dailyTasks, reconcileTasks } from "../src/domain/tasks";
import { localDate } from "../src/domain/dates";
it("eski yedek aynı kimlikteki düzeltilmiş kaydı ezmez", () => {
  const current = createInitialState(),
    old = createInitialState();
  const e = {
    id: "same",
    type: "study" as const,
    date: localDate(),
    at: new Date().toISOString(),
    value: 20,
    source: "manual" as const,
    data: {},
  };
  current.events = [e];
  old.events = [
    { ...e, value: 10 },
    { ...e, id: "new" },
  ];
  const result = mergeStates(current, old);
  expect(result.events.find((e) => e.id === "same")?.value).toBe(20);
  expect(result.events).toHaveLength(2);
});
it("eski yedeğe düzenlenebilir sabah adımları eklenir", () => {
  const old = createInitialState() as any;
  delete old.morningSteps;
  const restored = validateBackup(old) as any;
  expect(restored.morningSteps?.map((s: any) => s.id)).toEqual([
    "wake",
    "water",
    "teeth",
    "move",
    "light",
    "plan",
  ]);
  expect(restored.events).toEqual(old.events);
});
it("sabah adımı geri alınınca otomatik tamamlama kaldırılır", () => {
  let s = createInitialState();
  s.habits.find((h) => h.id === "morning")!.active = true;
  const task = dailyTasks(s, localDate()).find((t) => t.habitId === "morning")!;
  s = completeTask(s, task, "done", undefined, true);
  expect(reconcileTasks(s).taskStates).toHaveLength(0);
});
import { summarize } from "../src/domain/analytics";
it("eski mükerrer uyku kaydı gece ortalamasını iki kez etkilemez", () => {
  const s = createInitialState(),
    date = localDate();
  s.events = [
    {
      id: "old",
      type: "sleep",
      date,
      at: "2026-10-14T06:00:00Z",
      value: 420,
      source: "manual",
      data: { asleep: "01:00", wake: "08:00" },
    },
    {
      id: "new",
      type: "sleep",
      date,
      at: "2026-10-14T07:00:00Z",
      value: 480,
      source: "manual",
      data: { asleep: "01:00", wake: "09:00" },
    },
  ];
  expect((summarize(s, date, date) as any).sleepHours).toBe(8);
  expect(s.events).toHaveLength(2);
});
