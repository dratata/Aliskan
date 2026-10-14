import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Mic,
  Plus,
  Sparkles,
  Clock,
  CalendarDays,
} from "lucide-react";
import { useState } from "react";
import { useLocalDay, useLocalClock } from "../platform/day";
import { useStore } from "../app/Store";
import { dailyTasks, completeTask, nextTask } from "../domain/tasks";
import { dateLabel, localDate } from "../domain/dates";
import { proposeAdaptation } from "../domain/adaptation";
import type { HabitId, Task } from "../domain/types";
import {
  Card,
  HabitIcon,
  SectionTitle,
  Button,
  Modal,
  Field,
  Empty,
} from "../components/UI";
import { Plant } from "../components/Illustration";
export function Today({
  open,
}: {
  open: (module: string, habit?: HabitId) => void;
}) {
  const { state, update, addEvent } = useStore(),
    [selected, setSelected] = useState<Task | null>(null),
    [time, setTime] = useState(""),
    [waterBusy, setWaterBusy] = useState(false),
    [waterId, setWaterId] = useState<string | null>(null),
    [quickMessage, setQuickMessage] = useState(""),
    [view, setView] = useState("remaining"),
    clock = useLocalClock(),
    today = useLocalDay(),
    tasks = dailyTasks(state, today),
    done = tasks.filter((t) => t.status === "done").length,
    progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const study = state.events
      .filter((e) => e.date === today && e.type === "study")
      .reduce((a, e) => a + e.value, 0),
    water = state.events
      .filter((e) => e.date === today && e.type === "water")
      .reduce((a, e) => a + e.value, 0),
    smoke = state.events
      .filter((e) => e.date === today && e.type === "smoking")
      .reduce((a, e) => a + e.value, 0);
  const proposals = proposeAdaptation(state),
    next = nextTask(tasks, clock),
    visibleTasks =
      view === "all"
        ? tasks
        : tasks.filter((t) => t.status === "pending" || t.status === "snoozed");
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            {dateLabel(today).toLocaleUpperCase("tr-TR")}
          </span>
          <h1>
            {state.profile.name
              ? `Merhaba, ${state.profile.name.split(" ")[0]}`
              : "Bugün, kendin için."}
            <span className="heading-dot">✦</span>
          </h1>
          <p>Mükemmel olmak zorunda değilsin. Bir adım yeter.</p>
        </div>
        <button
          className="icon-button heading-calendar"
          onClick={() => open("sleep")}
          aria-label="Uyku ve günlük kayıt"
        >
          <CalendarDays size={21} />
        </button>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-tag">
            <Sparkles size={14} /> KÜÇÜK ADIMLAR, İYİ GÜNLER
          </span>
          <h2>
            {done === 0 ? (
              <>
                Bugün biraz
                <br />
                kendine yaklaş.
              </>
            ) : done === tasks.length ? (
              <>
                Küçük adımların
                <br />
                bir güne dönüştü.
              </>
            ) : (
              <>
                Bir adım attın.
                <br />
                Gerisi kendi hızında.
              </>
            )}
          </h2>
          <p>
            {done === 0
              ? "Başlamak için büyük bir enerjiye ihtiyacın yok. Yalnızca birkaç dakika."
              : `${done} alışkanlığına zaman ayırdın. Yaptığın her şey ilerlemenin bir parçası.`}
          </p>
          <button
            onClick={() => {
              const task = next;
              if (task) open(task.habitId, task.habitId);
              else open("breathing");
            }}
          >
            Küçük bir adımla başla <ArrowUpRight size={17} />
          </button>
        </div>
        <Plant />
      </section>
      <div className="daily-progress">
        <div
          className="progress-ring"
          style={{ "--angle": `${progress * 3.6}deg` } as React.CSSProperties}
        >
          <span>
            {progress}
            <small>%</small>
          </span>
        </div>
        <div>
          <h3>Her küçük adım sayılır</h3>
          <p>
            <strong>{done}</strong> / {tasks.length} günlük adım tamamlandı
          </p>
        </div>
        <span className="progress-decoration">✦</span>
      </div>
      {next && (
        <section className="card next-step" aria-label="Sıradaki küçük adım">
          <HabitIcon id={next.habitId} />
          <div>
            <span className="eyebrow">SIRADAKİ KÜÇÜK ADIM</span>
            <strong className="next-title">{next.title}</strong>
            <p>
              {next.time} · {next.target} {next.unit}
            </p>
          </div>
          <button
            className="icon-button"
            aria-label="Sıradaki adımı aç"
            onClick={() => open(next.habitId, next.habitId)}
          >
            <ArrowUpRight size={21} />
          </button>
        </section>
      )}
      <SectionTitle
        title="Bugünün akışı"
        sub="Birer birer, kendi ritminde."
        action={
          <span className="pill">
            {
              tasks.filter(
                (t) => t.status === "pending" || t.status === "snoozed",
              ).length
            }{" "}
            adım kaldı
          </span>
        }
      />
      <div className="segmented task-filter" aria-label="Günlük plan görünümü">
        <button
          aria-pressed={view === "remaining"}
          className={view === "remaining" ? "selected" : ""}
          onClick={() => setView("remaining")}
        >
          Kalan adımlar
        </button>
        <button
          aria-pressed={view === "all"}
          className={view === "all" ? "selected" : ""}
          onClick={() => setView("all")}
        >
          Tüm adımlar
        </button>
      </div>
      <div className="timeline">
        {visibleTasks.length === 0 ? (
          <Empty>
            {tasks.length === 0
              ? "Bugün için aktif alışkanlık yok. Alışkanlıklar sekmesinden ekleyebilirsin."
              : "Şimdilik kalan adım yok. Tamamladıklarını ve ertelediklerini Tüm adımlar’dan görebilirsin."}
          </Empty>
        ) : (
          visibleTasks.map((task) => (
            <div key={task.id} className={`task-row ${task.status}`}>
              <div className="task-time">
                <span>{task.time}</span>
                <i />
              </div>
              <div className="task-card">
                <button
                  className="task-main"
                  onClick={() => open(task.habitId, task.habitId)}
                >
                  <HabitIcon id={task.habitId} />
                  <div>
                    <h3>{task.title}</h3>
                    <p>
                      {task.status === "done"
                        ? "Bugün kendine bu zamanı ayırdın"
                        : task.status === "skipped"
                          ? "Bugün olmadı; yarın yeniden deneyebilirsin"
                          : `${task.target} ${task.unit} · ${task.habitId === "study" ? "Sadece başlamak yeter" : task.habitId === "family" ? "Ekransız, birlikte bir an" : "Küçük ve ulaşılabilir"}`}
                    </p>
                  </div>
                  {task.status === "done" ? (
                    <span className="done-mark">
                      <Check size={17} />
                    </span>
                  ) : (
                    <ChevronRight size={17} className="muted" />
                  )}
                </button>
                <div className="task-footer">
                  <button onClick={() => open(task.habitId, task.habitId)}>
                    {task.status === "done" ? "Yeniden aç" : "Başlat"}{" "}
                    <ArrowUpRight size={13} />
                  </button>
                  <button
                    onClick={() => {
                      setSelected(task);
                      setTime(task.time);
                    }}
                    aria-label={`${task.title} seçenekleri`}
                  >
                    •••
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <SectionTitle
        title="Gününe bir not düş"
        sub="Küçük kayıtlar, büyük resmi görmeni sağlar."
      />
      <div className="quick-grid">
        <button
          disabled={waterBusy}
          aria-busy={waterBusy}
          onClick={async () => {
            setWaterBusy(true);
            try {
              const id = await addEvent("water", 250);
              if (id) {
                await update((s) => {
                  const task = dailyTasks(s, localDate()).find(
                    (t) => t.habitId === "water",
                  );
                  return task
                    ? completeTask(s, task, "done", undefined, true)
                    : s;
                });
                setWaterId(id);
                setQuickMessage("250 ml su eklendi.");
              }
            } finally {
              setWaterBusy(false);
            }
          }}
        >
          <span className="quick-icon blue">💧</span>
          <strong>{waterBusy ? "Kaydediliyor…" : "Su ekle"}</strong>
          <small>
            {water} / {state.settings.waterGoal} ml
          </small>
          <Plus size={16} />
        </button>
        <button onClick={() => open("smoking", "smoking")}>
          <span className="quick-icon lavender">↘</span>
          <strong>Sigara kaydı</strong>
          <small>Bugün {smoke} adet</small>
          <Plus size={16} />
        </button>
        <button onClick={() => open("voice")}>
          <span className="quick-icon sage">
            <Mic size={21} />
          </span>
          <strong>Konuş veya yaz</strong>
          <small>Gününü kolayca kaydet</small>
          <ChevronRight size={16} />
        </button>
      </div>
      {quickMessage && (
        <div className="quick-feedback" role="status">
          <span>{quickMessage}</span>
          {waterId && (
            <button
              className="text-button"
              onClick={async () => {
                if (
                  await update((s) => ({
                    ...s,
                    events: s.events.filter((e) => e.id !== waterId),
                  }))
                ) {
                  setWaterId(null);
                  setQuickMessage("Su kaydı geri alındı.");
                }
              }}
            >
              Geri al
            </button>
          )}
        </div>
      )}
      <Card className="coach-note">
        <span className="coach-star">✧</span>
        <div>
          <span className="eyebrow">SANA KÜÇÜK BİR HATIRLATMA</span>
          <p>
            {study > 0
              ? `Bugün ${Math.round(study)} dakika çalıştın. Zaman ayırmayı başardın; hedefin tamamı olmasa da bu süre değerli.`
              : state.habits.find((h) => h.id === "study")?.active
                ? `Bugün yalnızca ${state.habits.find((h) => h.id === "study")?.target ?? 10} dakika ile başlayabilirsin. Başlamanın zor geldiği günler için 2 dakika deneme seçeneği de var.`
                : next
                  ? `${next.title} için ${next.target} ${next.unit} ayırabilirsin. Bugün zor geliyorsa planını küçültmek de bir seçenektir.`
                  : "Bugün kendine alan açabilirsin. İstersen kısa bir nefes molasıyla devam et."}
          </p>
        </div>
      </Card>
      {proposals.map((p) => (
        <Card className="proposal" key={p.id}>
          <Sparkles size={20} />
          <h3>
            {state.habits.find((h) => h.id === p.habitId)?.title}: {p.target} dk
            önerisi
          </h3>
          <p>{p.reason}</p>
          <div className="button-row">
            <Button
              onClick={() =>
                void update((s) => ({
                  ...s,
                  habits: s.habits.map((h) =>
                    h.id === p.habitId
                      ? { ...h, target: p.target, level: p.level }
                      : h,
                  ),
                  acceptedProposals: [...s.acceptedProposals, p.id],
                }))
              }
            >
              Kabul et
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                void update((s) => ({
                  ...s,
                  rejectedProposals: [...s.rejectedProposals, p.id],
                }))
              }
            >
              Şimdilik koru
            </Button>
          </div>
        </Card>
      ))}
      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <p className="lead">Bugün nasıl ilerlemek istersin?</p>
          <div className="stack">
            {selected.status !== "pending" && (
              <>
                <Button
                  variant="secondary"
                  onClick={async () => {
                    if (
                      await update((s) => ({
                        ...s,
                        taskStates: s.taskStates.filter(
                          (t) => t.id !== selected.id,
                        ),
                      }))
                    )
                      setSelected(null);
                  }}
                >
                  İşareti geri al
                </Button>
                <p className="help">
                  Yalnız günlük plan işareti kaldırılır; süre ve alışkanlık
                  kayıtların korunur.
                </p>
              </>
            )}
            <Button
              onClick={async () => {
                if (await update((s) => completeTask(s, selected, "done")))
                  setSelected(null);
              }}
            >
              <Check size={17} /> Tamamladım
            </Button>
            <p className="help">
              Bu seçenek görevi işaretler. Süre ve ayrıntılı kayıt için ilgili
              rehberden oturumu tamamla.
            </p>
            <Field label="Erteleme saati">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </Field>
            <Button
              variant="secondary"
              onClick={async () => {
                if (
                  await update((s) =>
                    completeTask(s, selected, "snoozed", time),
                  )
                )
                  setSelected(null);
              }}
            >
              <Clock size={17} /> Ertele
            </Button>
            <Button
              variant="ghost"
              onClick={async () => {
                if (await update((s) => completeTask(s, selected, "skipped")))
                  setSelected(null);
              }}
            >
              Bugün yapamayacağım
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
