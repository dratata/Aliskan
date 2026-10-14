import { useState } from "react";
import { Pencil, Trash2, Check } from "lucide-react";
import { useStore } from "../app/Store";
import type { HabitEvent } from "../domain/types";
import { eventTypes } from "../domain/types";
import { localDate, formatTime, sleepMinutes } from "../domain/dates";
import { Card, Button, Field, Empty } from "../components/UI";
const labels: Record<HabitEvent["type"], string> = {
  study: "Çalışma",
  exercise: "Egzersiz",
  smoking: "Sigara",
  water: "Su",
  weight: "Kilo",
  meal: "Öğün",
  snack: "Atıştırma",
  sleep: "Uyku",
  breathing: "Nefes",
  family: "Birlikte oyun",
  routine: "Rutin",
  mood: "Enerji / stres",
};
const units: Record<HabitEvent["type"], string> = {
  study: "dk",
  exercise: "dk",
  smoking: "adet",
  water: "ml",
  weight: "kg",
  meal: "kayıt",
  snack: "kayıt",
  sleep: "dk",
  breathing: "dk",
  family: "dk",
  routine: "dk",
  mood: "/10",
};
export function History() {
  const { state, update, removeEvent } = useStore(),
    [filter, setFilter] = useState("all"),
    [day, setDay] = useState(""),
    [editing, setEditing] = useState<HabitEvent | null>(null),
    [time, setTime] = useState(""),
    [message, setMessage] = useState(""),
    [limit, setLimit] = useState(50);
  const matches = [...state.events]
    .sort((a, b) => b.date.localeCompare(a.date) || b.at.localeCompare(a.at))
    .filter(
      (e) =>
        (filter === "all" || e.type === filter) && (!day || e.date === day),
    );
  const records = matches.slice(0, limit);
  const editData = (key: string, value: string | number | boolean) => {
    if (!editing) return;
    const data = { ...editing.data, [key]: value };
    setEditing({
      ...editing,
      data,
      value:
        editing.type === "sleep"
          ? sleepMinutes(String(data.asleep), String(data.wake))
          : editing.value,
    });
  };
  return (
    <div className="stack">
      <div className="form-grid">
        <Field label="Kayıt türü">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setLimit(50);
            }}
          >
            <option value="all">Tüm kayıtlar</option>
            {eventTypes.map((t) => (
              <option key={t} value={t}>
                {labels[t]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Gün (boş: tümü)">
          <input
            type="date"
            max={localDate()}
            value={day}
            onChange={(e) => {
              setDay(e.target.value);
              setLimit(50);
            }}
          />
        </Field>
      </div>
      {message && <p className="success-note">{message}</p>}
      {editing && (
        <Card>
          <form
            className="stack"
            onSubmit={async (e) => {
              e.preventDefault();
              const at = new Date(`${editing.date}T${time}`);
              if (Number.isNaN(at.getTime())) {
                setMessage("Tarih ve saati kontrol et.");
                return;
              }
              if (
                await update((s) => ({
                  ...s,
                  events: s.events.map((x) =>
                    x.id === editing.id
                      ? { ...editing, at: at.toISOString() }
                      : x,
                  ),
                }))
              ) {
                setEditing(null);
                setMessage("Kayıt düzenlendi.");
              }
            }}
          >
            <h3>{labels[editing.type]} kaydını düzenle</h3>
            <div className="form-grid">
              <Field label="Kayıt tarihi">
                <input
                  type="date"
                  max={localDate()}
                  required
                  value={editing.date}
                  onChange={(e) =>
                    setEditing({ ...editing, date: e.target.value })
                  }
                />
              </Field>
              <Field label="Kayıt saati">
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </Field>
            </div>
            <Field label={`Miktar (${units[editing.type]})`}>
              <input
                type="number"
                min="0"
                max="10000"
                step="0.1"
                required
                readOnly={editing.type === "sleep"}
                value={editing.value}
                onChange={(e) =>
                  setEditing({ ...editing, value: Number(e.target.value) })
                }
              />
            </Field>
            {(["topic", "description", "trigger", "activityName"] as const)
              .filter((k) => typeof editing.data[k] === "string")
              .map((k) => (
                <Field
                  key={k}
                  label={
                    {
                      topic: "Konu",
                      description: "Açıklama",
                      trigger: "Tetikleyici",
                      activityName: "Etkinlik",
                    }[k]
                  }
                >
                  <input
                    value={String(editing.data[k])}
                    onChange={(e) => editData(k, e.target.value)}
                  />
                </Field>
              ))}
            {editing.type === "sleep" && (
              <div className="form-grid">
                {(["bed", "asleep", "wake"] as const).map((k) => (
                  <Field
                    key={k}
                    label={
                      {
                        bed: "Yatağa giriş",
                        asleep: "Uykuya dalış",
                        wake: "Uyanma",
                      }[k]
                    }
                  >
                    <input
                      type="time"
                      value={String(editing.data[k] ?? "00:00")}
                      required
                      onChange={(e) => editData(k, e.target.value)}
                    />
                  </Field>
                ))}
              </div>
            )}
            {[
              "effort",
              "urge",
              "stress",
              "energy",
              "quality",
              "stressBefore",
              "stressAfter",
              "hunger",
              "fullness",
            ]
              .filter((k) => typeof editing.data[k] === "number")
              .map((k) => (
                <Field
                  key={k}
                  label={
                    (
                      {
                        effort: "Zorlanma",
                        urge: "Sigara isteği",
                        stress: "Stres",
                        energy: "Enerji",
                        quality: "Uyku kalitesi",
                        stressBefore: "Önceki stres",
                        stressAfter: "Sonraki stres",
                        hunger: "Açlık",
                        fullness: "Tokluk",
                      } as Record<string, string>
                    )[k]
                  }
                >
                  <input
                    type="number"
                    min="0"
                    max={k === "quality" ? 5 : 10}
                    value={Number(editing.data[k])}
                    onChange={(e) => editData(k, Number(e.target.value))}
                  />
                </Field>
              ))}
            {editing.type === "exercise" && (
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={editing.data.pain === true}
                  onChange={(e) => editData("pain", e.target.checked)}
                />{" "}
                Ağrı oldu
              </label>
            )}
            <Button type="submit">
              <Check size={17} /> Kaydı güncelle
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Vazgeç
            </Button>
          </form>
        </Card>
      )}
      {records.length === 0 ? (
        <Empty>Bu seçim için kayıt yok.</Empty>
      ) : (
        records.map((e) => (
          <div key={e.id}>
            <div className="record-row">
              <div>
                <strong>
                  {labels[e.type]} · {e.value.toFixed(e.value % 1 ? 1 : 0)}{" "}
                  {units[e.type]}
                </strong>
                <small>
                  {e.date} · {formatTime(e.at)}
                  {e.data.topic ? ` · ${String(e.data.topic)}` : ""}
                </small>
              </div>
              <button
                className="icon-button"
                aria-label={`${labels[e.type]} kaydını düzenle`}
                onClick={() => {
                  setEditing({ ...e, data: { ...e.data } });
                  setTime(formatTime(e.at));
                }}
              >
                <Pencil size={16} />
              </button>
              <button
                className="icon-button"
                aria-label={`${labels[e.type]} kaydını sil`}
                onClick={async () => {
                  if (
                    window.confirm("Bu kaydı silmek ister misin?") &&
                    (await removeEvent(e.id))
                  )
                    setMessage("Kayıt silindi.");
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
            {typeof e.data.photo === "string" && e.data.photo && (
              <img
                className="meal-photo"
                src={e.data.photo}
                alt="Yerel kaydedilmiş öğün"
              />
            )}
          </div>
        ))
      )}
      <p className="help" role="status">
        {matches.length} kayıt bulundu · {records.length} kayıt gösteriliyor.
      </p>
      {records.length < matches.length && (
        <Button variant="secondary" onClick={() => setLimit((n) => n + 50)}>
          Daha fazla kayıt göster
        </Button>
      )}
    </div>
  );
}
