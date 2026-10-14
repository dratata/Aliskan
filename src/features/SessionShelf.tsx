import { useEffect, useState } from "react";
import { useStore } from "../app/Store";
import { timerRoute } from "../domain/timers";
import { remainingSeconds } from "../domain/sessions";
import type { OpenModule } from "../app/navigation";
export function SessionShelf({ open }: { open: OpenModule }) {
  const { state } = useStore(),
    [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const sessions = [
    ...(state.timer ? [state.timer] : []),
    ...state.timerArchive,
  ].filter(
    (t) =>
      !t.saved &&
      timerRoute(t) &&
      (["study", "breathing", "delay"].includes(t.kind) ||
        t.context === "study-break"),
  );
  if (!sessions.length) return null;
  return (
    <section className="card session-shelf" aria-label="Yarım kalan oturumlar">
      <span className="eyebrow">KALDIĞIN YERDEN</span>
      <h3>Başladığın adımlar burada.</h3>
      <p className="help">
        Geçişte duraklatılmış süreler korunur; mola net çalışmana eklenmez.
      </p>
      {sessions.map((t) => {
        const route = timerRoute(t)!,
          remaining =
            t.running && t.deadline
              ? remainingSeconds(t.deadline, now)
              : t.remaining,
          title =
            t.context === "study-break"
              ? "Çalışma molası"
              : t.topic ||
                {
                  study: "Çalışma",
                  breathing: "Nefes",
                  delay: "Sigara erteleme",
                  exercise: "Hareket",
                  routine: "Rutin",
                }[t.kind];
        return (
          <button
            key={t.id}
            className="session-resume"
            aria-label={`Devam et: ${title}`}
            onClick={() =>
              open(route.id, route.habit, { timerId: t.id, mode: route.mode })
            }
          >
            <span>
              <strong>{title}</strong>
              <small>
                {t.date} ·{" "}
                {remaining === 0
                  ? "Tamamlandı; kaydını bitir"
                  : t.running
                    ? "Devam ediyor"
                    : "Duraklatıldı"}
              </small>
            </span>
            <b>
              {Math.floor(remaining / 60)}:
              {String(remaining % 60).padStart(2, "0")}
            </b>
          </button>
        );
      })}
    </section>
  );
}
