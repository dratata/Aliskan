import { it, expect } from "vitest";
import "fake-indexeddb/auto";
import { createInitialState } from "../src/domain/defaults";
import { completeTask, dailyTasks, reconcileTasks } from "../src/domain/tasks";
import { localDate, shiftDate } from "../src/domain/dates";
import { mutateState, loadState, saveState } from "../src/data/database";
it("yeni hedef geçmişte tamamlanmış görevi geri açmaz", () => {
  let s = createInitialState();
  const date = shiftDate(localDate(), -1),
    task = dailyTasks(s, date).find((t) => t.habitId === "study")!;
  s.events = [
    {
      id: "study",
      type: "study",
      value: 10,
      date,
      at: new Date().toISOString(),
      source: "manual",
      data: {},
    },
  ];
  s = completeTask(s, task, "done", undefined, true);
  s.habits[0].target = 20;
  expect(
    reconcileTasks(s).taskStates.find((t) => t.id === task.id)?.status,
  ).toBe("done");
  s.events = [];
  expect(reconcileTasks(s).taskStates).toHaveLength(0);
});
it("eşzamanlı değişiklikler güncel transaction verisine eklenir", async () => {
  await saveState(createInitialState());
  await Promise.all(
    Array.from({ length: 20 }, (_, i) =>
      mutateState((s) => ({
        ...s,
        events: [
          ...s.events,
          {
            id: `water-${i}`,
            type: "water",
            value: 250,
            date: localDate(),
            at: new Date().toISOString(),
            source: "manual",
            data: {},
          },
        ],
      })),
    ),
  );
  expect((await loadState()).events).toHaveLength(20);
});
it("geçersiz transaction eski kayıtları korur ve sonraki yazıyı engellemez", async () => {
  await saveState(createInitialState());
  await expect(
    mutateState((s) => ({ ...s, version: 99 as 1 })),
  ).rejects.toThrow();
  await mutateState((s) => ({ ...s, onboarded: true }));
  expect((await loadState()).onboarded).toBe(true);
  expect((await loadState()).version).toBe(1);
});
import { parseEntry, confirmDraft } from "../src/domain/language";
it("olumsuz cümleyi tamamlanmış alışkanlık olarak yorumlamaz", () => {
  for (const text of [
    "Bugün 6 sigara içmedim.",
    "Bugün 20 dakika ders çalışmadım.",
    "Akşam egzersizimi yapamadım.",
    "Bugün 2 bardak su içmedim.",
  ])
    expect(parseEntry(text)).toBeNull();
});
it("desteklenmeyen tarih ifadesini bugüne yazmaz", () => {
  for (const text of [
    "Yarın 20 dakika ders çalışacağım.",
    "Geçen hafta 20 dakika ders çalıştım.",
    "Önceki gün 6 sigara içtim.",
  ])
    expect(parseEntry(text)).toBeNull();
});
it("gelecekteki kayıt kullanıcı onayında reddedilir", () => {
  const s = createInitialState();
  expect(() =>
    confirmDraft(
      {
        type: "study",
        value: 20,
        date: shiftDate(localDate(), 1),
        data: {},
        needsConfirmation: true,
        message: "",
      },
      s,
      "text",
    ),
  ).toThrow();
});
it("ondalık kilo miktarını tarih sanmaz", () => {
  expect(parseEntry("Bugün 92.5 kilo geldim.")?.value).toBe(92.5);
  expect(parseEntry("Bugün 92,5 kilo geldim.")?.value).toBe(92.5);
});
