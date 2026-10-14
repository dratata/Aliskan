import { useRef, useState } from "react";
import { Moon, Sun, Check } from "lucide-react";
import { useStore } from "../app/Store";
import { sleepMinutes, localDate } from "../domain/dates";
import { Field, Button, Card, Empty } from "../components/UI";
import type { HabitEvent } from "../domain/types";
const optionalNumber = (value: unknown) =>
  typeof value === "number" ? String(value) : "";
export function Sleep() {
  const { state, update, addEvent } = useStore();
  const latest = (date: string) =>
    state.events
      .filter((e) => e.type === "sleep" && e.date === date)
      .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))[0];
  const existing = latest(localDate());
  const [date, setDate] = useState(localDate()),
    [bed, setBed] = useState(String(existing?.data.bed ?? "00:00")),
    [asleep, setAsleep] = useState(String(existing?.data.asleep ?? "00:30")),
    [wake, setWake] = useState(String(existing?.data.wake ?? "08:00")),
    [quality, setQuality] = useState(optionalNumber(existing?.data.quality)),
    [morningEnergy, setMorningEnergy] = useState(
      optionalNumber(existing?.data.energy),
    ),
    [energy, setEnergy] = useState(""),
    [stress, setStress] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    saving = useRef(false);
  const total = sleepMinutes(asleep, wake),
    record = latest(date);
  const selectDate = (day: string) => {
    setDate(day);
    const e = latest(day);
    setBed(String(e?.data.bed ?? "00:00"));
    setAsleep(String(e?.data.asleep ?? "00:30"));
    setWake(String(e?.data.wake ?? "08:00"));
    setQuality(optionalNumber(e?.data.quality));
    setMorningEnergy(optionalNumber(e?.data.energy));
    setMessage("");
  };
  const score = (
    label: string,
    value: string,
    set: (v: string) => void,
    max: number,
    min = 0,
  ) => (
    <Field label={label}>
      <select value={value} onChange={(e) => set(e.target.value)}>
        <option value="">Değerlendirmedim</option>
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
          <option value={n} key={n}>
            {n} / {max}
          </option>
        ))}
      </select>
    </Field>
  );
  const save = async () => {
    if (saving.current) return;
    if (total <= 0 || total > 1080) {
      setMessage(
        "Uyku süresini kontrol et; aynı saat veya 18 saatten fazla görünüyor.",
      );
      return;
    }
    saving.current = true;
    setBusy(true);
    let updated = false;
    try {
      const ok = await update((s) => {
        const prior = s.events
          .filter((e) => e.type === "sleep" && e.date === date)
          .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))[0];
        updated = !!prior;
        const data: HabitEvent["data"] = { ...prior?.data, bed, asleep, wake };
        delete data.quality;
        delete data.energy;
        if (quality !== "") data.quality = Number(quality);
        if (morningEnergy !== "") data.energy = Number(morningEnergy);
        const event: HabitEvent = {
          id: prior?.id ?? crypto.randomUUID(),
          type: "sleep",
          date,
          at: new Date().toISOString(),
          value: total,
          source: "manual",
          data,
        };
        return {
          ...s,
          events: prior
            ? s.events.map((e) => (e.id === prior.id ? event : e))
            : [...s.events, event],
        };
      });
      if (ok)
        setMessage(
          updated ? "Uyku kaydın güncellendi." : "Uyku kaydın eklendi.",
        );
    } finally {
      saving.current = false;
      setBusy(false);
    }
  };
  return (
    <div className="stack">
      <div className="module-intro">
        <span className="icon-box blue">
          <Moon />
        </span>
        <div>
          <h3>Gece nasıl geçti?</h3>
          <p>Tahminlerin yeterli. Kusursuz ölçüm gerekmiyor.</p>
        </div>
      </div>
      <form
        className="stack"
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <Field label="Uyandığın gün">
          <input
            type="date"
            max={localDate()}
            required
            value={date}
            onChange={(e) => selectDate(e.target.value)}
          />
        </Field>
        {record && (
          <p className="soft-note">
            Bu gece için kayıt var. Kaydettiğinde aynı kaydı güncelleyeceğiz.
          </p>
        )}
        <div className="form-grid">
          <Field label="Yatağa giriş">
            <input
              type="time"
              required
              value={bed}
              onChange={(e) => setBed(e.target.value)}
            />
          </Field>
          <Field label="Tahmini uykuya dalış">
            <input
              type="time"
              required
              value={asleep}
              onChange={(e) => setAsleep(e.target.value)}
            />
          </Field>
          <Field label="Uyanma saati">
            <input
              type="time"
              required
              value={wake}
              onChange={(e) => setWake(e.target.value)}
            />
          </Field>
        </div>
        <Card className="study-total">
          <div>
            <span className="eyebrow">TAHMİNİ UYKU SÜRESİ</span>
            <h2>
              {Math.floor(total / 60)} <small>saat {total % 60} dk</small>
            </h2>
          </div>
          <Moon />
        </Card>
        <p className="help">
          Kayıt uyandığın güne aittir. Uyku ve his puanlarını boş bırakırsan
          tahmini puan eklemeyiz.
        </p>
        {score("Uyku kalitesi (isteğe bağlı)", quality, setQuality, 5, 1)}
        {score(
          "Sabah enerjin (isteğe bağlı)",
          morningEnergy,
          setMorningEnergy,
          10,
        )}
        <Button type="submit" disabled={busy}>
          {busy
            ? "Kaydediliyor…"
            : record
              ? "Uyku kaydını güncelle"
              : "Uykuyu kaydet"}
        </Button>
      </form>
      {message && (
        <p role="status" className="success-note">
          <Check size={16} />
          {message}
        </p>
      )}
      <Card>
        <div className="module-intro">
          <span className="icon-box yellow">
            <Sun />
          </span>
          <div>
            <h3>Şimdi nasıl hissediyorsun?</h3>
            <p>Sabah enerjinden bağımsız, şu anki hissini not et.</p>
          </div>
        </div>
        {score("Şimdiki enerji", energy, setEnergy, 10)}
        {score("Şimdiki stres", stress, setStress, 10)}
        <Button
          variant="secondary"
          disabled={busy || (energy === "" && stress === "")}
          onClick={async () => {
            setBusy(true);
            try {
              if (
                await addEvent(
                  "mood",
                  energy !== "" ? Number(energy) : Number(stress),
                  {
                    ...(energy !== "" ? { energy: Number(energy) } : {}),
                    ...(stress !== "" ? { stress: Number(stress) } : {}),
                  },
                )
              )
                setMessage("Enerji ve stres kaydın eklendi.");
            } finally {
              setBusy(false);
            }
          }}
        >
          Günlük his kaydı
        </Button>
      </Card>
      <h3>Son uykular</h3>
      {state.events.every((e) => e.type !== "sleep") ? (
        <Empty>Henüz uyku kaydın yok.</Empty>
      ) : (
        [...state.events]
          .filter((e) => e.type === "sleep")
          .sort(
            (a, b) =>
              b.date.localeCompare(a.date) ||
              Date.parse(b.at) - Date.parse(a.at),
          )
          .slice(0, 7)
          .map((e) => (
            <div className="record-row" key={e.id}>
              <span className="record-dot blue" />
              <div>
                <strong>
                  {e.date} · {String(e.data.asleep)} – {String(e.data.wake)}
                </strong>
                <small>
                  Kalite {e.data.quality ?? "—"}/5 · Enerji{" "}
                  {e.data.energy ?? "—"}/10
                </small>
              </div>
              <b>
                {Math.floor(e.value / 60)} sa {Math.round(e.value % 60)} dk
              </b>
            </div>
          ))
      )}
    </div>
  );
}
