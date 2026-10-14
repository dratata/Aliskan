import { GuidePlayer } from "../components/GuidePlayer";
import { VideoCard } from "../components/VideoCard";
import { GuideCoach } from "../components/GuideCoach";
import { dailyGuides } from "../content/guides";
import { useRef, useState } from "react";
import { Check, Moon, Sun, ChevronRight } from "lucide-react";
import { useStore } from "../app/Store";
import { localDate } from "../domain/dates";
import { dailyTasks, completeTask } from "../domain/tasks";
import { resetTimer } from "../domain/timers";
import { Button, Field, Card, StepDots } from "../components/UI";
import { Timer } from "../components/Timer";
import type { RoutineStep } from "../content/routines";
const descriptions: Record<string, string> = {
  phone:
    "Telefonunu ulaşması zor bir yere bırak. Bu adımı kendin işaretlersin.",
  teeth:
    "Dişlerinin bütün yüzeylerini nazikçe fırçala. Süre boyunca tek bir işe odaklan.",
  stretch:
    "Ağrısız bir aralıkta omuzlarını yuvarla ve baldırlarını nazikçe esnet.",
  breath:
    "Rahat bir pozisyon al. 4 saniye al, 4 saniye ver; nefes tutmak zorunda değilsin.",
  book: "Sakin bir müzik aç veya birkaç sayfa kitap oku. Bildirimlerden uzak kısa bir ara.",
  ready: "Yarın için gerekenleri hazırla, ışıkları azalt.",
  wake: "Acele etmeden otur, günün nasıl başladığını fark et.",
  water:
    "Küçük bir bardak su iç. Su kaydını Beslenme ekranında ekleyebilirsin.",
  move: "Omuzlarını hafifçe yuvarla ve yerinde kısa yürüyüş yap.",
  light: "Birkaç dakika doğal gün ışığı al. Güneşe doğrudan bakma.",
  plan: "Bugünün ekranına dön, ilk küçük adımını seç.",
};
export function Routine({
  morning = false,
  open,
}: {
  morning?: boolean;
  open: (id: string) => void;
}) {
  const { state, update } = useStore(),
    id = morning ? "morning" : "night",
    steps = morning ? state.morningSteps : state.nightSteps,
    prefix = `routine:${id}:`;
  const resume = Object.keys(state.guideProgress)
    .filter(
      (k) =>
        k.startsWith(prefix) &&
        /^\d{4}-\d{2}-\d{2}$/.test(k.slice(prefix.length)) &&
        k.slice(prefix.length) <= localDate() &&
        state.guideProgress[k] < steps.length,
    )
    .sort()
    .at(-1);
  const [date, setDate] = useState(resume?.slice(prefix.length) ?? localDate()),
    [step, setStep] = useState<number | null>(
      resume ? state.guideProgress[resume] : null,
    ),
    [edit, setEdit] = useState(false),
    [draft, setDraft] = useState<RoutineStep[]>([]),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    saving = useRef(false);
  const key = `${prefix}${date}`,
    completed = (sid: string) =>
      state.events.some(
        (e) =>
          e.type === "routine" &&
          e.date === date &&
          e.data.routine === id &&
          e.data.step === sid,
      );
  const startStep = async (index: number) => {
    if (!date || date > localDate()) return;
    if (
      await update((s) => ({
        ...s,
        guideProgress: { ...s.guideProgress, [key]: index },
      }))
    )
      setStep(index);
  };
  const mark = async (index: number) => {
    if (saving.current) return;
    saving.current = true;
    setBusy(true);
    try {
      const ok = await update((s) => {
        const list = morning ? s.morningSteps : s.nightSteps,
          st = list[index];
        if (!st) return s;
        const eventId = `${date}:${id}:${st.id}`,
          events = s.events.some((e) => e.id === eventId)
            ? s.events
            : [
                ...s.events,
                {
                  id: eventId,
                  type: "routine" as const,
                  date,
                  at: new Date().toISOString(),
                  value: st.minutes,
                  source: "manual" as const,
                  data: { routine: id, step: st.id },
                },
              ];
        const guideProgress = { ...s.guideProgress };
        if (index + 1 < list.length) guideProgress[key] = index + 1;
        else delete guideProgress[key];
        let next = {
          ...resetTimer(s, "routine", id, st.id),
          events,
          guideProgress,
        };
        if (
          list.every((st) =>
            events.some(
              (e) =>
                e.type === "routine" &&
                e.date === date &&
                e.data.routine === id &&
                e.data.step === st.id,
            ),
          )
        ) {
          const task = dailyTasks(next, date).find((t) => t.habitId === id);
          if (task) next = completeTask(next, task, "done", undefined, true);
        }
        return next;
      });
      if (ok) setStep(index + 1 < steps.length ? index + 1 : null);
    } finally {
      saving.current = false;
      setBusy(false);
    }
  };
  const move = (index: number, direction: number) => {
    const list = [...draft];
    [list[index], list[index + direction]] = [
      list[index + direction],
      list[index],
    ];
    setDraft(list);
  };
  const saveSettings = async () => {
    const total = draft.reduce((n, s) => n + s.minutes, 0);
    if (morning && total > 30) {
      setMessage(
        "Sabah rutininin toplamı en fazla 30 dakika olabilir. Süreleri küçült.",
      );
      return;
    }
    if (
      await update((s) => ({
        ...s,
        ...(morning ? { morningSteps: draft } : { nightSteps: draft }),
        habits: s.habits.map((h) =>
          h.id === id
            ? {
                ...h,
                time: draft[0].time,
                ...(morning
                  ? { target: total, max: Math.max(h.max, total) }
                  : {}),
              }
            : h,
        ),
      }))
    ) {
      setEdit(false);
      setMessage("Rutin ayarların kaydedildi.");
    }
  };
  return (
    <div className="stack">
      <GuideCoach module={id} />
      <div className="module-intro">
        <span className={`icon-box ${morning ? "yellow" : "blue"}`}>
          {morning ? <Sun /> : <Moon />}
        </span>
        <div>
          <h3>
            {morning ? "Güne yumuşak bir başlangıç." : "Günü sakin kapatalım."}
          </h3>
          <p>
            {morning
              ? "Hazır olduğunda alışkanlıklardan etkinleştirebilirsin."
              : `Hedef yatış: ${state.profile.bedtime}. Saatleri kendi akşamına uydur.`}
          </p>
        </div>
      </div>
      <div className="routine-progress">
        <b>
          {steps.filter((s) => completed(s.id)).length} / {steps.length}
        </b>
        <span>adım · {steps.reduce((n, s) => n + s.minutes, 0)} dk plan</span>
      </div>
      {message && (
        <p role="status" className="success-note">
          {message}
        </p>
      )}
      {date !== localDate() && (
        <p className="soft-note">
          {date} günü başladığın rutine devam ediyorsun. Gece yarısını geçsen de
          adımlar bu günde kalır.
        </p>
      )}
      {step === null ? (
        <>
          <Field label="Rutin günü">
            <input
              type="date"
              max={localDate()}
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          {date !== localDate() && (
            <Button
              variant="secondary"
              onClick={() => {
                setDate(localDate());
                setMessage("");
              }}
            >
              Bugünün rutinine geç
            </Button>
          )}
          <div className="stack">
            {steps.map((s, i) => (
              <button
                disabled={!date || date > localDate()}
                className={`routine-step ${completed(s.id) ? "done" : ""}`}
                key={s.id}
                onClick={() => void startStep(i)}
              >
                <span>{s.time}</span>
                <div>
                  <strong>{s.title}</strong>
                  <small>{s.minutes} dakika</small>
                </div>
                {completed(s.id) ? (
                  <Check size={19} />
                ) : (
                  <ChevronRight size={19} />
                )}
              </button>
            ))}
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setDraft(steps.map((s) => ({ ...s })));
              setEdit(!edit);
              setMessage("");
            }}
          >
            Saatleri ve sırayı düzenle
          </Button>
          {edit && (
            <form
              className="stack"
              onSubmit={(e) => {
                e.preventDefault();
                void saveSettings();
              }}
            >
              {draft.map((s, i) => (
                <Card key={s.id}>
                  <Field label={s.title}>
                    <input
                      type="time"
                      required
                      value={s.time}
                      onChange={(e) =>
                        setDraft(
                          draft.map((x) =>
                            x.id === s.id ? { ...x, time: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field label="Süre (dk)">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      required
                      value={s.minutes}
                      onChange={(e) =>
                        setDraft(
                          draft.map((x) =>
                            x.id === s.id
                              ? { ...x, minutes: Number(e.target.value) }
                              : x,
                          ),
                        )
                      }
                    />
                  </Field>
                  <div className="button-row">
                    <Button
                      variant="ghost"
                      disabled={i === 0}
                      onClick={() => move(i, -1)}
                    >
                      ↑ Yukarı
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={i === draft.length - 1}
                      onClick={() => move(i, 1)}
                    >
                      ↓ Aşağı
                    </Button>
                  </div>
                </Card>
              ))}
              <Button type="submit">Rutin ayarlarını kaydet</Button>
              <Button variant="ghost" onClick={() => setEdit(false)}>
                Vazgeç
              </Button>
            </form>
          )}
          <Button variant="ghost" onClick={() => open("sleep")}>
            Uyku kaydı ekle
          </Button>
        </>
      ) : (
        <>
          <StepDots
            count={steps.length}
            current={Math.min(step, steps.length - 1)}
          />
          <span className="eyebrow">RUTİN GÜNÜ · {date}</span>
          <h2>{steps[Math.min(step, steps.length - 1)].title}</h2>
          <p className="lead">
            {descriptions[steps[step]?.id] ??
              "Bu kısa zamanı sakin ve dikkatini tek bir işe vererek geçir."}
          </p>
          <GuidePlayer
            key={steps[step]?.id}
            guide={dailyGuides[steps[step]?.id] ?? dailyGuides.ready}
          />
          <VideoCard id={dailyGuides[steps[step]?.id]?.videoId} />
          {steps[step]?.kind === "breathing" ? (
            <Button onClick={() => open("breathing")}>
              Animasyonlu nefes rehberini aç
            </Button>
          ) : (
            <Timer
              key={steps[step]?.id}
              kind="routine"
              habitId={id}
              context={steps[step]?.id}
              topic={steps[step]?.title}
              minutes={steps[step]?.minutes ?? 1}
              onComplete={async () => true}
            />
          )}
          <Button disabled={busy} onClick={() => void mark(step)}>
            <Check size={17} /> Bu adımı tamamladım
          </Button>
          <Button variant="ghost" onClick={() => setStep(null)}>
            Rutin adımlarına dön
          </Button>
        </>
      )}
    </div>
  );
}
