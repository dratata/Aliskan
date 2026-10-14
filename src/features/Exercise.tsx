import { GuidePlayer } from "../components/GuidePlayer";
import { VideoCard } from "../components/VideoCard";
import { GuideCoach } from "../components/GuideCoach";
import { exerciseGuides } from "../content/guides";
import { useState, useRef } from "react";
import { Check, ChevronRight, ShieldCheck } from "lucide-react";
import { useStore } from "../app/Store";
import { exerciseProgram } from "../content/exercises";
import { Illustration } from "../components/Illustration";
import { Button, Field, StepDots, Card } from "../components/UI";
import { Timer } from "../components/Timer";
import type { HabitId } from "../domain/types";
import { resetTimer, timerMatches } from "../domain/timers";
import { remainingSeconds } from "../domain/sessions";
import { dailyTasks, completeTask } from "../domain/tasks";
import { localDate } from "../domain/dates";
export function Exercise({ habitId = "exerciseLunch" }: { habitId?: HabitId }) {
  const { state, addEvent, update } = useStore(),
    h = state.habits.find((h) => h.id === habitId)!,
    [step, setStep] = useState(state.guideProgress[habitId] ?? 0),
    [effort, setEffort] = useState(3),
    [pain, setPain] = useState(false),
    [saved, setSaved] = useState(false),
    [alternative, setAlternative] = useState(false),
    [done, setDone] = useState(
      (state.guideProgress[habitId] ?? 0) >= exerciseProgram(h.target).length,
    ),
    [assessment, setAssessment] = useState(false),
    [rest, setRest] = useState(state.guideProgress[`${habitId}:rest`] === 1),
    [actualDuration, setActualDuration] = useState(""),
    program = exerciseProgram(h.target),
    move = program[Math.min(step, program.length - 1)];
  const actualMinutes =
    program.reduce((a, e) => a + e.seconds + e.rest, 0) / 60;
  const sessionId = useRef(crypto.randomUUID()),
    saving = useRef(false),
    [busy, setBusy] = useState(false);
  const save = async () => {
    if (saving.current) return;
    saving.current = true;
    setBusy(true);
    const minutes = Number(actualDuration);
    if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 120) {
      saving.current = false;
      setBusy(false);
      return;
    }
    const id = await addEvent(
      "exercise",
      minutes,
      {
        habitId,
        effort,
        pain,
        durationBasis: "session",
        movements: program.map((e) => e.id),
      },
      undefined,
      "manual",
      sessionId.current,
    );
    if (!id) {
      saving.current = false;
      setBusy(false);
      return;
    }
    const task = dailyTasks(state, localDate()).find(
      (t) => t.habitId === habitId,
    );
    if (task && minutes >= h.target)
      await update((s) => completeTask(s, task, "done", undefined, true));
    await update((s) => ({
      ...s,
      guideProgress: {
        ...s.guideProgress,
        [habitId]: 0,
        [`${habitId}:rest`]: 0,
        [`${habitId}:seconds`]: 0,
      },
    }));
    setSaved(true);
    saving.current = false;
    setBusy(false);
  };
  const nextMove = async () => {
    const next = step + 1,
      needsRest = next < program.length && move.rest > 0;
    const ok = await update((s) => {
      const t = timerMatches(s.timer, "exercise", habitId, `move-${step}`)
        ? s.timer
        : s.timerArchive.find((t) =>
            timerMatches(t, "exercise", habitId, `move-${step}`),
          );
      const measured = t
        ? t.total -
          (t.running && t.deadline
            ? remainingSeconds(t.deadline, Date.now())
            : t.remaining)
        : 0;
      return {
        ...resetTimer(s, "exercise", habitId, `move-${step}`),
        guideProgress: {
          ...s.guideProgress,
          [habitId]: next,
          [`${habitId}:rest`]: needsRest ? 1 : 0,
          [`${habitId}:seconds`]:
            (s.guideProgress[`${habitId}:seconds`] ?? 0) + measured,
        },
      };
    });
    if (!ok) return;
    setAlternative(false);
    setStep(next);
    setRest(needsRest);
    if (next >= program.length) setDone(true);
  };
  const endRest = async () => {
    if (
      await update((s) => ({
        ...resetTimer(s, "routine", habitId, `rest-${step}`),
        guideProgress: { ...s.guideProgress, [`${habitId}:rest`]: 0 },
      }))
    )
      setRest(false);
  };
  if (rest)
    return (
      <div className="stack rest-screen">
        <span className="eyebrow">HAREKETLER ARASI MOLA</span>
        <h2>Biraz dinlen, nefesin rahatlasın.</h2>
        <p className="lead">
          Sırada: {move.name}. Hazır olduğunda devam et; molayı uzatabilirsin.
        </p>
        <Timer
          kind="routine"
          habitId={habitId}
          context={`rest-${step}`}
          minutes={program[Math.max(0, step - 1)].rest / 60}
          onComplete={async () => true}
        />
        <Button onClick={() => void endRest()}>Dinlenmeyi geç</Button>
        <p className="help">Bu mola tek başına egzersiz kaydı oluşturmaz.</p>
      </div>
    );
  if (saved)
    return (
      <div className="completed-screen">
        <span className="completed-icon">
          <Check />
        </span>
        <h2>Vücuduna zaman ayırdın.</h2>
        <p>
          {Math.round(Number(actualDuration) * 10) / 10} dakika hareket
          kaydedildi.{" "}
          {pain
            ? "Ağrı yaşadığın için yükü artırmayacağız. Ağrıyı tetikleyen hareketi bırakıp değerlendirme yapabilirsin."
            : "Yarın yine küçük, ulaşılabilir bir adımla devam edebilirsin."}
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            sessionId.current = crypto.randomUUID();
            setSaved(false);
            setDone(false);
            setStep(0);
            setActualDuration("");
          }}
        >
          Rehberi yeniden aç
        </Button>
      </div>
    );
  return (
    <div className="stack">
      <GuideCoach module={habitId} />
      <div className="soft-note">
        <ShieldCheck size={19} />
        <p>
          Konuşabileceğin rahat tempoda kal. Göğüs ağrısı, belirgin nefes
          darlığı veya baş dönmesinde dur ve uygun değerlendirme al. Hareket
          ağrı vermemeli.
        </p>
      </div>
      <button
        className="text-button"
        onClick={() => setAssessment(!assessment)}
      >
        Egzersiz geçmişi ve kısıtlarım {assessment ? "−" : "+"}
      </button>
      {assessment && (
        <Card>
          <p className="help">
            İsteğe bağlı. Belirtiler veya mevcut tıbbi kısıtlar varsa programı
            buna göre bireysel değerlendir.
          </p>
          {(
            ["exerciseHistory", "pain", "restrictions", "equipment"] as const
          ).map((key, i) => (
            <Field
              key={key}
              label={
                [
                  "Egzersiz geçmişi",
                  "Mevcut ağrı / sakatlık",
                  "Kardiyovasküler veya diğer kısıtlar",
                  "Ekipmanlar",
                ][i]
              }
            >
              <input
                defaultValue={state.profile[key]}
                onBlur={(e) =>
                  void update((s) => ({
                    ...s,
                    profile: { ...s.profile, [key]: e.target.value },
                  }))
                }
              />
            </Field>
          ))}
        </Card>
      )}
      {state.profile.pain || state.profile.restrictions ? (
        <p className="warning-note">
          Profilinde ağrı veya kısıt bilgisi var. Bu genel rehber kişisel
          rehabilitasyon reçetesi değildir; uygun hareket ve yükü
          değerlendirmeden artırma.
        </p>
      ) : null}
      {!done ? (
        <>
          <div className="guide-heading">
            <span className="eyebrow">
              HAREKET {step + 1} / {program.length}
            </span>
            <span className="pill">
              {h.title} · yaklaşık {Math.round(actualMinutes)} dk
            </span>
          </div>
          <StepDots count={program.length} current={step} />
          <h2>{move.name}</h2>
          <GuidePlayer
            key={`${habitId}-${step}`}
            guide={exerciseGuides[move.id]}
          />
          <VideoCard id={exerciseGuides[move.id].videoId} />
          <p className="lead">{move.position}</p>
          <ol className="guide-steps">
            {move.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <div className="exercise-specs">
            <span>
              <b>{move.reps}</b>Tekrar
            </span>
            <span>
              <b>{move.sets} set</b>Set
            </span>
            <span>
              <b>{move.seconds} sn</b>Süre
            </span>
            <span>
              <b>{move.rest} sn</b>Dinlenme
            </span>
          </div>
          <p className="help">{move.safety}</p>
          <Button
            variant="secondary"
            onClick={() => setAlternative(!alternative)}
          >
            Alternatif hareket {alternative ? "−" : "+"}
          </Button>
          {alternative && <Card>{move.alternative}</Card>}
          <Timer
            key={`${habitId}-${step}`}
            kind="exercise"
            habitId={habitId}
            context={`move-${step}`}
            minutes={move.seconds / 60}
            topic={move.name}
            onComplete={async () => true}
          />
          <Button onClick={() => void nextMove()}>
            {step + 1 === program.length
              ? "Hareketleri bitirdim"
              : "Hareket tamam · Sıradaki"}{" "}
            <ChevronRight size={18} />
          </Button>
          <p className="help">
            Sonraki hareketten önce {move.rest} saniye mola ver. İhtiyaç
            duyarsan molayı uzat.
          </p>
          <Button variant="ghost" onClick={() => setDone(true)}>
            Burada bitir ve yaptığım süreyi kaydet
          </Button>
        </>
      ) : (
        <>
          <h2>Nasıl hissettin?</h2>
          <Field label="Gerçekte yaptığın süre (dk)">
            <input
              type="number"
              min="0.5"
              max="120"
              step="0.5"
              required
              value={actualDuration}
              onChange={(e) => setActualDuration(e.target.value)}
              placeholder="Örn. 3"
            />
          </Field>
          <p className="help">
            Hareket ve kısa molalar dahil gerçekten ayırdığın süreyi gir; uzun
            araları ekleme. Planlanan {Math.round(actualMinutes)} dakika
            kendiliğinden kaydedilmez.
            {state.guideProgress[`${habitId}:seconds`]
              ? ` Hareket sayacı ile ölçülen: ${Math.round(state.guideProgress[`${habitId}:seconds`] / 6) / 10} dk.`
              : ""}
          </p>
          <p className="lead">
            Sonraki hedefi tamamlama kadar toleransın da belirler.
          </p>
          <Field label={`Algılanan zorlanma: ${effort} / 10`}>
            <input
              type="range"
              min="0"
              max="10"
              value={effort}
              onChange={(e) => setEffort(Number(e.target.value))}
            />
          </Field>
          <label className="check-label">
            <input
              type="checkbox"
              checked={pain}
              onChange={(e) => setPain(e.target.checked)}
            />{" "}
            Hareket sırasında ağrı oldu
          </label>
          <Button
            disabled={
              busy ||
              !actualDuration ||
              Number(actualDuration) <= 0 ||
              Number(actualDuration) > 120
            }
            onClick={() => void save()}
          >
            Egzersizi kaydet
          </Button>
        </>
      )}
    </div>
  );
}
