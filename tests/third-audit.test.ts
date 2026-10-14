import { it, expect } from "vitest";
import { createInitialState } from "../src/domain/defaults";
import { localDate } from "../src/domain/dates";
import { switchTimer } from "../src/domain/timers";
import { exerciseProgram } from "../src/content/exercises";
it("aynı çalışan sayacı yeniden başlatmak süreyi uzatmaz", () => {
  const s = createInitialState();
  s.timer = {
    id: "s",
    kind: "study",
    habitId: "study",
    context: "",
    topic: "Konu",
    date: localDate(),
    total: 600,
    remaining: 600,
    running: true,
    deadline: 600000,
    saved: false,
  };
  const result = switchTimer(s, { ...s.timer, deadline: 720000 }, 120000);
  expect(result.timer?.deadline).toBe(600000);
});
it("bir dakikalık hareket planı kuvvet tekrarlarını sıkıştırmaz", () => {
  const p = exerciseProgram(1);
  expect(p.map((m) => m.id)).toEqual(["march"]);
  expect(p.reduce((n, m) => n + m.seconds + m.rest, 0)).toBe(60);
});
it("iki dakikalık planda kontrollü mobilizasyon seçilir", () => {
  const p = exerciseProgram(2);
  expect(p.every((m) => ["march", "shoulder"].includes(m.id))).toBe(true);
  expect(p.reduce((n, m) => n + m.seconds + m.rest, 0)).toBe(120);
});
import { studyTopics, renameTopic, topicKey } from "../src/domain/studyTopics";
import {
  loadBackupInfo,
  writeBackupInfo,
  backupDue,
} from "../src/data/backupInfo";
import { saveState, loadState } from "../src/data/database";
import "fake-indexeddb/auto";
it("konu geçmişi Türkçe adları birleştirir ve yalnız gerçek süreyi toplar", () => {
  const s = createInitialState();
  s.events = [
    {
      id: "1",
      type: "study",
      date: localDate(),
      at: "2026-10-14T12:00:00Z",
      value: 2,
      source: "manual",
      data: { topic: "İnme" },
    },
    {
      id: "2",
      type: "study",
      date: localDate(),
      at: "2026-10-14T13:00:00Z",
      value: 3,
      source: "manual",
      data: { topic: "  inme  " },
    },
    {
      id: "3",
      type: "water",
      date: localDate(),
      at: "2026-10-14T12:00:00Z",
      value: 250,
      source: "manual",
      data: {},
    },
  ];
  expect(studyTopics(s.events)).toHaveLength(1);
  expect(studyTopics(s.events)[0].minutes).toBe(5);
});
it("konu adı düzenleme kimlik, tarih ve çalışma süresini korur", () => {
  const s = createInitialState();
  s.events = [
    {
      id: "1",
      type: "study",
      date: localDate(),
      at: "2026-10-14T12:00:00Z",
      value: 20,
      source: "manual",
      data: { topic: "İnme" },
    },
  ];
  const result = renameTopic(s, topicKey("İnme"), "Nörolojik rehabilitasyon");
  expect(result.events[0]).toEqual({
    ...s.events[0],
    data: { topic: "Nörolojik rehabilitasyon" },
  });
  expect(s.events[0].data.topic).toBe("İnme");
});
it("yedek metadata yazımı alışkanlık verilerini değiştirmez", async () => {
  const s = createInitialState();
  s.profile.name = "Korunan profil";
  await saveState(s);
  await writeBackupInfo({ preparedAt: "2026-10-14T12:00:00Z", records: 4 });
  expect((await loadState()).profile.name).toBe("Korunan profil");
  expect((await loadBackupInfo()).records).toBe(4);
});
it("yedek hatırlatması yeni kayıtta ve bir haftada, erteleme tarihine uyar", () => {
  const info = { preparedAt: null, records: 0, dismissUntil: null };
  expect(backupDue(info, 0, new Date(2026, 9, 14))).toBe(false);
  expect(backupDue(info, 1, new Date(2026, 9, 14))).toBe(true);
  expect(
    backupDue(
      { ...info, dismissUntil: "2026-10-15" },
      1,
      new Date(2026, 9, 14),
    ),
  ).toBe(false);
  expect(
    backupDue(
      { ...info, preparedAt: "2026-10-14T12:00:00Z" },
      1,
      new Date("2026-10-20T12:00:00Z"),
    ),
  ).toBe(false);
  expect(
    backupDue(
      { ...info, preparedAt: "2026-10-14T12:00:00Z" },
      1,
      new Date("2026-10-21T12:00:00Z"),
    ),
  ).toBe(true);
});
