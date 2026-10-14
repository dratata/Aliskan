import { useEffect, useRef, useState } from "react";
import { Mic, Square, Check, Undo2 } from "lucide-react";
import { useStore } from "../app/Store";
import { parseEntry, confirmDraft } from "../domain/language";
import {
  createRecognition,
  speechSupported,
  type SpeechRecognitionLike,
} from "../platform/speech";
import { Button, Field, Card } from "../components/UI";
import type { EntryDraft } from "../domain/types";
import { localDate, sleepMinutes } from "../domain/dates";
import { dailyTasks, completeTask } from "../domain/tasks";
export function Voice() {
  const { state, update, removeEvent } = useStore(),
    [text, setText] = useState(""),
    [listening, setListening] = useState(false),
    [draft, setDraft] = useState<EntryDraft | null>(null),
    [message, setMessage] = useState(""),
    [lastId, setLastId] = useState<string | null>(null),
    [source, setSource] = useState<"voice" | "text">("text"),
    ref = useRef<SpeechRecognitionLike | null>(null),
    [busy, setBusy] = useState(false);
  useEffect(() => () => ref.current?.abort(), []);
  const listen = () => {
    if (listening) {
      ref.current?.stop();
      return;
    }
    const r = createRecognition();
    if (!r) {
      setMessage(
        "Bu tarayıcıda konuşma tanıma yok. Metin yazarak aynı şekilde kaydedebilirsin.",
      );
      return;
    }
    r.lang = "tr-TR";
    r.interimResults = false;
    r.continuous = false;
    r.onresult = (e) => {
      setText(
        Array.from(e.results)
          .map((x) => x[0].transcript)
          .join(" "),
      );
      setSource("voice");
      setDraft(null);
    };
    r.onerror = (e) => {
      setListening(false);
      setMessage(
        e.error === "not-allowed"
          ? "Mikrofon izni verilmedi. Metin girişi kullanabilir veya tarayıcı iznini değiştirebilirsin."
          : "Ses tanınamadı. Tekrar dene veya metin yaz.",
      );
    };
    r.onend = () => setListening(false);
    ref.current = r;
    try {
      r.start();
      setListening(true);
      setMessage("");
    } catch {
      setMessage("Mikrofon başlatılamadı. Metin girişi kullanılabilir.");
    }
  };
  const preview = () => {
    const d = parseEntry(text);
    if (d?.type === "exercise" && d.data.assumedDuration) {
      d.value = state.habits.find((h) => h.id === d.data.habitId)?.target ?? 5;
    }
    setDraft(d);
    setMessage(
      d
        ? ""
        : "Bu ifadeyi güvenle yorumlayamadım. “Bugün 20 dakika ders çalıştım” gibi süre ve etkinliği belirt.",
    );
  };
  const save = async () => {
    if (!draft || busy) return;
    setBusy(true);
    try {
      const event = confirmDraft(draft, state, source);
      const ok = await update((s) => {
        const e = confirmDraft(draft, s, source);
        e.id = event.id;
        let next = { ...s, events: [...s.events, e] };
        const habitId =
          draft.type === "study"
            ? "study"
            : draft.type === "exercise"
              ? String(draft.data.habitId)
              : draft.type === "family"
                ? "family"
                : draft.type === "water"
                  ? "water"
                  : undefined;
        const task = dailyTasks(s, draft.date).find(
          (t) => t.habitId === habitId,
        );
        if (task) {
          const total = next.events
            .filter(
              (x) =>
                x.type === draft.type &&
                x.date === draft.date &&
                (draft.type !== "exercise" || x.data.habitId === habitId),
            )
            .reduce((a, x) => a + x.value, 0);
          if (total >= task.target)
            next = completeTask(next, task, "done", undefined, true);
        }
        return next;
      });
      if (ok) {
        setLastId(event.id);
        setMessage("Onayladığın kayıt eklendi. İstersen geri alabilirsin.");
        setDraft(null);
        setText("");
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Kayıt oluşturulamadı.");
    }
    setBusy(false);
  };
  return (
    <div className="stack">
      <div className="voice-hero">
        <button
          className={`mic-button ${listening ? "listening" : ""}`}
          onClick={listen}
          disabled={!speechSupported()}
          aria-label={listening ? "Dinlemeyi durdur" : "Mikrofonu başlat"}
        >
          {listening ? <Square size={27} /> : <Mic size={32} />}
        </button>
        <h2>{listening ? "Dinliyorum…" : "Gününü kendi sözlerinle anlat."}</h2>
        <p>
          {speechSupported()
            ? "Mikrofona dokun veya aşağıya yaz. Kayıttan önce her zaman onayını alacağız."
            : "Bu tarayıcıda konuşma tanıma desteklenmiyor. Aşağıya yazarak aynı giriş katmanını kullanabilirsin."}
        </p>
      </div>
      <Field label="Konuşma / metin">
        <textarea
          value={text}
          rows={4}
          maxLength={500}
          placeholder="Bugün 20 dakika ders çalıştım."
          onChange={(e) => {
            setText(e.target.value);
            setSource("text");
            setDraft(null);
          }}
        />
      </Field>
      <div className="example-chips">
        {[
          "Bugün 6 sigara içtim.",
          "Akşam egzersizimi yaptım.",
          "Bugün kızımla 15 dakika oyun oynadık.",
          "Dün gece birde yattım, sabah sekizde kalktım.",
        ].map((s) => (
          <button
            key={s}
            onClick={() => {
              setText(s);
              setSource("text");
              setDraft(null);
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <Button disabled={!text.trim()} onClick={preview}>
        Kaydı önizle
      </Button>
      {message && (
        <p role="status" className="success-note">
          {message}
        </p>
      )}
      {draft && (
        <Card className="draft-preview">
          <span className="eyebrow">KAYDETMEDEN ÖNCE KONTROL ET</span>
          <h3>
            {
              {
                study: "Ders çalışma",
                exercise: "Egzersiz",
                smoking: "Sigara",
                water: "Su",
                weight: "Kilo",
                sleep: "Uyku",
                family: "Birlikte oyun",
                breathing: "Nefes",
                meal: "Öğün",
                snack: "Atıştırma",
                routine: "Rutin",
                mood: "Enerji / stres",
              }[draft.type]
            }{" "}
            kaydı
          </h3>
          <p>{draft.message}</p>
          <Field label="Kayıt günü">
            <input
              type="date"
              value={draft.date}
              max={localDate()}
              required
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            />
          </Field>
          <Field
            label={
              draft.type === "sleep"
                ? "Toplam uyku (dakika)"
                : draft.type === "smoking"
                  ? "Günlük toplam (adet)"
                  : draft.type === "water"
                    ? "Su (ml)"
                    : draft.type === "weight"
                      ? "Kilo (kg)"
                      : "Süre (dakika)"
            }
          >
            <input
              type="number"
              min={draft.type === "smoking" ? 0 : 1}
              max={
                draft.type === "water"
                  ? 5000
                  : draft.type === "sleep"
                    ? 1080
                    : draft.type === "smoking"
                      ? 100
                      : 400
              }
              step="0.1"
              readOnly={draft.type === "sleep"}
              value={draft.value}
              onChange={(e) =>
                setDraft({ ...draft, value: Number(e.target.value) })
              }
            />
          </Field>
          {draft.type === "sleep" && (
            <div className="form-grid">
              {["asleep", "wake"].map((k) => (
                <Field
                  key={k}
                  label={k === "asleep" ? "Uykuya dalış" : "Uyanma"}
                >
                  <input
                    type="time"
                    value={String(draft.data[k])}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        value: sleepMinutes(
                          k === "asleep"
                            ? e.target.value
                            : String(draft.data.asleep),
                          k === "wake"
                            ? e.target.value
                            : String(draft.data.wake),
                        ),
                        data: { ...draft.data, [k]: e.target.value },
                      })
                    }
                  />
                </Field>
              ))}
            </div>
          )}
          {draft.type === "exercise" && (
            <>
              <Field label={`Zorlanma: ${Number(draft.data.effort ?? 3)} / 10`}>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={Number(draft.data.effort ?? 3)}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      data: { ...draft.data, effort: Number(e.target.value) },
                    })
                  }
                />
              </Field>
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={draft.data.pain === true}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      data: { ...draft.data, pain: e.target.checked },
                    })
                  }
                />{" "}
                Ağrı oldu
              </label>
            </>
          )}
          <details>
            <summary>Teknik kayıt ayrıntısını göster</summary>
            <pre>
              {JSON.stringify(
                {
                  type: draft.type,
                  ...(["study", "exercise", "family", "breathing"].includes(
                    draft.type,
                  )
                    ? { duration_minutes: draft.value }
                    : { value: draft.value }),
                  date: draft.date,
                  source,
                  ...draft.data,
                },
                null,
                2,
              )}
            </pre>
          </details>
          <Button
            disabled={busy || draft.value < 0 || !draft.date}
            onClick={() => void save()}
          >
            <Check size={17} /> Onayla ve kaydet
          </Button>
        </Card>
      )}
      {lastId && (
        <Button
          variant="secondary"
          onClick={async () => {
            if (await removeEvent(lastId)) {
              setLastId(null);
              setMessage(
                "Son kayıt geri alındı. Bu kayda bağlı görev ilerlemesi güncellendi.",
              );
            }
          }}
        >
          <Undo2 size={17} /> Son kaydı geri al
        </Button>
      )}
      <p className="help">
        Ses tanıma tarayıcı hizmetini kullanabilir; sesin cihaz dışında
        işlenmesi tarayıcı sağlayıcısına bağlıdır. Metin yorumlama cihazda
        yapılır. ChatGPT sohbetinden otomatik veri aktarımı yoktur.
      </p>
    </div>
  );
}
