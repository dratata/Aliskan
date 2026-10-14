import { useState } from "react";
import { useStore } from "../app/Store";
import { Card, HabitIcon, Button, Modal, Field } from "../components/UI";
import type { Habit } from "../domain/types";
import { clockMinutes } from "../domain/dates";
export function Habits() {
  const { state, update } = useStore(),
    [editing, setEditing] = useState<Habit | null>(null);
  const days = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">KENDİ RİTMİNİ BUL</span>
        <h1>Alışkanlıkların</h1>
        <p>Hepsi birden değil. Sana iyi gelenleri seç.</p>
      </div>
      <div className="habit-list">
        {state.habits.map((h) => (
          <Card key={h.id} className={!h.active ? "inactive" : ""}>
            <div className="habit-top">
              <HabitIcon id={h.id} />
              <div>
                <h3>{h.title}</h3>
                <p>
                  {h.time} ·{" "}
                  {h.id === "morning"
                    ? state.morningSteps.reduce((n, s) => n + s.minutes, 0)
                    : h.target}{" "}
                  {h.unit}
                  {h.id === "morning" && !h.active ? " · Hazır olduğunda" : ""}
                </p>
              </div>
              <button
                className={`toggle ${h.active ? "on" : ""}`}
                role="switch"
                aria-checked={h.active}
                aria-label={`${h.title} etkinleştir`}
                onClick={() =>
                  void update((s) => ({
                    ...s,
                    habits: s.habits.map((x) =>
                      x.id === h.id ? { ...x, active: !x.active } : x,
                    ),
                  }))
                }
              >
                <i />
              </button>
            </div>
            <div className="habit-bottom">
              <span>{h.active ? "Günlük planında" : "Şimdilik pasif"}</span>
              <button
                className="text-button"
                onClick={() => setEditing({ ...h })}
              >
                Hedef ve saatleri düzenle
              </button>
            </div>
          </Card>
        ))}
      </div>
      {editing && (
        <Modal title={editing.title} onClose={() => setEditing(null)}>
          <form
            className="stack"
            onSubmit={async (e) => {
              e.preventDefault();
              if (
                await update((s) => {
                  const key =
                    editing.id === "morning"
                      ? "morningSteps"
                      : editing.id === "night"
                        ? "nightSteps"
                        : null;
                  const shifted = key
                    ? s[key].map((step) => {
                        const minutes =
                          (((clockMinutes(step.time) +
                            clockMinutes(editing.time) -
                            clockMinutes(s[key][0].time)) %
                            1440) +
                            1440) %
                          1440;
                        return {
                          ...step,
                          time: `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`,
                        };
                      })
                    : null;
                  return {
                    ...s,
                    habits: s.habits.map((h) =>
                      h.id === editing.id ? editing : h,
                    ),
                    ...(key ? { [key]: shifted } : {}),
                  };
                })
              )
                setEditing(null);
            }}
          >
            <Field label="Planlanan saat">
              <input
                type="time"
                required
                value={editing.time}
                onChange={(e) =>
                  setEditing({ ...editing, time: e.target.value })
                }
              />
            </Field>
            <Field label={`Güncel hedef (${editing.unit})`}>
              <input
                type="number"
                min="1"
                step={editing.id.startsWith("exercise") ? "0.5" : "1"}
                max={editing.max}
                required
                readOnly={editing.id === "morning"}
                value={
                  editing.id === "morning"
                    ? state.morningSteps.reduce((n, s) => n + s.minutes, 0)
                    : editing.target
                }
                onChange={(e) =>
                  setEditing({ ...editing, target: Number(e.target.value) })
                }
              />
            </Field>
            {editing.id === "morning" && (
              <p className="help">
                Toplam süre sabah rutininin adımlarından hesaplanır. Başlat →
                Güne başla ekranında süreleri düzenleyebilirsin.
              </p>
            )}
            <p className="help">
              Başlangıç: {editing.initial} {editing.unit} · Üst sınır:{" "}
              {editing.max} {editing.unit}. Artışlar sana önerilir,
              kendiliğinden uygulanmaz.
            </p>
            <div>
              <span className="field-label">Tekrar günleri</span>
              <div className="day-selector">
                {days.map((d, i) => (
                  <button
                    type="button"
                    aria-pressed={editing.days.includes(i)}
                    key={d}
                    className={editing.days.includes(i) ? "selected" : ""}
                    onClick={() =>
                      setEditing({
                        ...editing,
                        days: editing.days.includes(i)
                          ? editing.days.filter((x) => x !== i)
                          : [...editing.days, i],
                      })
                    }
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <label className="check-label">
              <input
                type="checkbox"
                checked={editing.remind}
                onChange={(e) =>
                  setEditing({ ...editing, remind: e.target.checked })
                }
              />{" "}
              Uygulama açıkken hatırlat
            </label>
            <Button type="submit">Değişiklikleri kaydet</Button>
          </form>
        </Modal>
      )}
    </>
  );
}
