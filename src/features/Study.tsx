import { GuidePlayer } from "../components/GuidePlayer";
import { VideoCard } from "../components/VideoCard";
import { GuideCoach } from "../components/GuideCoach";
import { dailyGuides } from "../content/guides";
import { useState, useEffect } from "react";
import { BookOpen, Check, Play, Coffee } from "lucide-react";
import { useStore } from "../app/Store";
import { localDate, formatTime } from "../domain/dates";
import { StudyTopics } from "./StudyTopics";
import { findTimer, resetTimer } from "../domain/timers";
import { studyTopics } from "../domain/studyTopics";
import { studyPlan } from "../domain/adaptation";
import type { TimerState } from "../domain/types";
import { Timer } from "../components/Timer";
import { Card, Field, Button, Empty } from "../components/UI";
import { dailyTasks, completeTask } from "../domain/tasks";
export function Study({
  sessionId,
  initialBreak = false,
}: {
  sessionId?: string;
  initialBreak?: boolean;
}) {
  const { state, addEvent, update } = useStore(),
    studyTimer = findTimer(state, "study", "study", ""),
    h = state.habits.find((h) => h.id === "study")!,
    today = localDate(),
    records = state.events.filter(
      (e) => e.type === "study" && e.date === today,
    ),
    total = records.reduce((a, e) => a + e.value, 0),
    [topic, setTopic] = useState(
      studyTimer
        ? studyTimer.topic
        : (studyTopics(state.events)[0]?.name ?? ""),
    ),
    [duration, setDuration] = useState(0),
    [breakMode, setBreakMode] = useState(initialBreak),
    [focus, setFocus] = useState(false),
    [topicsOpen, setTopicsOpen] = useState(false),
    [breakMinutes, setBreakMinutes] = useState(3);
  useEffect(() => {
    if (studyTimer) setTopic(studyTimer.topic);
  }, [studyTimer?.topic]);
  const plan = studyPlan(h.target);
  let accounted = 0;
  const completed = plan.map((m) => {
    accounted += m;
    return total >= accounted;
  });
  const nextIndex = completed.findIndex((done) => !done),
    previousMinutes =
      nextIndex < 0 ? 0 : plan.slice(0, nextIndex).reduce((a, m) => a + m, 0),
    suggested =
      nextIndex < 0
        ? (plan.at(-1) ?? 10)
        : Math.max(2, Math.ceil(plan[nextIndex] - (total - previousMinutes)));
  const resetDuration = () => setDuration(0);
  const save = async (timer: TimerState) => {
    const value = (timer.total - timer.remaining) / 60;
    if (value <= 0) return false;
    const id = await addEvent(
      "study",
      value,
      { topic: timer.topic, habitId: "study", sessionTotal: timer.total / 60 },
      timer.date,
      "manual",
      timer.id,
    );
    if (!id) return false;
    resetDuration();
    setFocus(false);
    await update((s) => {
      const actual = s.events
        .filter((e) => e.type === "study" && e.date === timer.date)
        .reduce((a, e) => a + e.value, 0);
      const task = dailyTasks(s, timer.date).find((t) => t.habitId === "study");
      return task && actual >= h.target
        ? completeTask(s, task, "done", undefined, true)
        : s;
    });
    return true;
  };
  return (
    <div className="stack">
      <>
        {!focus && (
          <>
            <GuideCoach module="study" />
            <GuidePlayer guide={dailyGuides.study} compact />
            <div className="module-intro">
              <span className="icon-box sage">
                <BookOpen />
              </span>
              <div>
                <h3>
                  {breakMode ? "Biraz dinlen." : "Sadece başlamak yeter."}
                </h3>
                <p>
                  {breakMode
                    ? "Mola çalışma sürene eklenmez."
                    : "Bugün birkaç dakika bile çalışsan, bu bir başlangıç."}
                </p>
              </div>
            </div>
            {!breakMode && (
              <>
                <Field label="Bugün hangi konuya bakacaksın?">
                  <input
                    disabled={!!studyTimer && !studyTimer.saved}
                    value={
                      studyTimer && !studyTimer.saved ? studyTimer.topic : topic
                    }
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Örn. nörolojik rehabilitasyon"
                    maxLength={150}
                  />
                </Field>
                <div className="session-plan">
                  {plan.map((m, i) => (
                    <span key={i} className={completed[i] ? "completed" : ""}>
                      {completed[i] ? <Check size={14} /> : <Play size={12} />}{" "}
                      {m} dk
                    </span>
                  ))}
                </div>
                <div className="duration-row">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setDuration(2);
                      void update((s) =>
                        s.timer?.kind === "study" && s.timer.saved
                          ? { ...s, timer: null }
                          : s,
                      );
                    }}
                  >
                    Sadece 2 dakika dene
                  </Button>
                  <Field label="Oturum (dk)">
                    <input
                      type="number"
                      min="2"
                      max="120"
                      value={duration || suggested}
                      disabled={!!studyTimer && !studyTimer.saved}
                      onChange={(e) =>
                        setDuration(
                          Math.max(2, Math.min(120, Number(e.target.value))),
                        )
                      }
                    />
                  </Field>
                </div>
              </>
            )}
            {breakMode && (
              <Field label="Mola süresi">
                <select
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Number(e.target.value))}
                >
                  {[2, 3, 4, 5].map((m) => (
                    <option key={m} value={m}>
                      {m} dakika
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </>
        )}
      </>
      {focus && (
        <section className="focus-header" aria-label="Odak görünümü">
          <span className="eyebrow">
            {breakMode ? "MOLA ZAMANI" : "TEK BİR İŞ, KÜÇÜK BİR ADIM"}
          </span>
          <h2>
            {breakMode
              ? "Biraz dinlen."
              : studyTimer?.topic || topic || "Serbest çalışma"}
          </h2>
          <Button variant="ghost" onClick={() => setFocus(false)}>
            Odak görünümünden çık
          </Button>
        </section>
      )}
      <Timer
        key={breakMode ? "break" : "study"}
        sessionId={breakMode === initialBreak ? sessionId : undefined}
        onStart={() => setFocus(true)}
        kind={breakMode ? "routine" : "study"}
        minutes={breakMode ? breakMinutes : duration || suggested}
        habitId={breakMode ? undefined : "study"}
        topic={topic}
        context={breakMode ? "study-break" : ""}
        onComplete={
          breakMode
            ? async () => {
                setFocus(false);
                return true;
              }
            : save
        }
      />
      <div className="button-row">
        <Button variant="secondary" onClick={() => setBreakMode(!breakMode)}>
          {breakMode ? <BookOpen size={17} /> : <Coffee size={17} />}{" "}
          {breakMode ? "Çalışmaya dön" : "2–5 dakika mola"}
        </Button>
      </div>
      <Card className="study-total">
        <div>
          <span className="eyebrow">BUGÜNKÜ NET ÇALIŞMAN</span>
          <h2>
            {Math.round(total)} <small>/ {h.target} dk</small>
          </h2>
        </div>
        <span className="icon-box sage">
          <BookOpen />
        </span>
      </Card>
      {!focus && (
        <>
          <Button
            variant="secondary"
            onClick={() => setTopicsOpen(!topicsOpen)}
          >
            {topicsOpen ? "Konuları kapat" : "Konularımı aç"}
          </Button>
          {topicsOpen && (
            <StudyTopics
              locked={!!studyTimer && !studyTimer.saved}
              onChoose={async (name) => {
                if (await update((s) => resetTimer(s, "study", "study", ""))) {
                  setTopic(name);
                  setDuration(0);
                  setTopicsOpen(false);
                }
              }}
            />
          )}
          <h3>Bugünkü oturumlar</h3>
          {records.length === 0 ? (
            <Empty>
              İlk oturumun burada görünecek. Mola süresi bu toplama eklenmez.
            </Empty>
          ) : (
            records.map((e) => (
              <div key={e.id} className="record-row">
                <span className="record-dot sage" />
                <div>
                  <strong>{String(e.data.topic || "Serbest çalışma")}</strong>
                  <small>{formatTime(e.at)}</small>
                </div>
                <b>{Math.round(e.value * 10) / 10} dk</b>
              </div>
            ))
          )}
          <Button
            variant="ghost"
            disabled={!!studyTimer && !studyTimer.saved}
            onClick={() => setTopic(studyTopics(state.events)[0]?.name ?? "")}
          >
            Son çalıştığım konuya devam et
          </Button>
        </>
      )}
    </div>
  );
}
