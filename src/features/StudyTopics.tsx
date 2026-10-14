import { useState } from "react";
import { useStore } from "../app/Store";
import { studyTopics, renameTopic } from "../domain/studyTopics";
import { Button, Card, Field, Empty } from "../components/UI";
export function StudyTopics({
  onChoose,
  locked,
}: {
  onChoose: (topic: string) => void;
  locked: boolean;
}) {
  const { state, update } = useStore(),
    [query, setQuery] = useState(""),
    [editing, setEditing] = useState<string | null>(null),
    [name, setName] = useState(""),
    [message, setMessage] = useState("");
  const topics = studyTopics(state.events).filter((t) =>
    (t.name || "Konusuz çalışma")
      .toLocaleLowerCase("tr-TR")
      .includes(query.toLocaleLowerCase("tr-TR")),
  );
  return (
    <section className="stack topic-library" aria-label="Çalışma konuların">
      <div>
        <h3>Konuların, kaldığın yerden.</h3>
        <p className="help">
          Toplamlar yalnız kaydettiğin net çalışmadan hesaplanır.
        </p>
      </div>
      <Field label="Konu ara">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Konu adı"
        />
      </Field>
      {locked && (
        <p className="help">
          Yeni konu seçmeden önce mevcut çalışma oturumunu kaydet veya sıfırla.
        </p>
      )}
      {message && (
        <p role="status" className="success-note">
          {message}
        </p>
      )}
      {topics.length === 0 ? (
        <Empty>İlk konu kaydın burada görünecek.</Empty>
      ) : (
        topics.map((t) => (
          <Card key={t.key}>
            <h3>{t.name || "Konusuz çalışma"}</h3>
            <p>
              {Math.round(t.minutes * 10) / 10} dk net · {t.sessions} kayıt
            </p>
            <p className="help">
              Son çalışma: {new Date(t.lastAt).toLocaleDateString("tr-TR")}
            </p>
            <div className="button-row">
              <Button
                variant="secondary"
                disabled={locked}
                onClick={() => onChoose(t.name)}
              >
                {/* separate accessible label for each topic */}
                <span
                  aria-label={`Bu konuya çalış: ${t.name || "Konusuz çalışma"}`}
                >
                  Bu konuya çalış: {t.name || "Konusuz çalışma"}
                </span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setEditing(t.key);
                  setName(t.name);
                }}
              >
                Adını düzenle
              </Button>
            </div>
            {editing === t.key && (
              <form
                className="stack"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (await update((s) => renameTopic(s, t.key, name))) {
                    setEditing(null);
                    setMessage(
                      "Konu adı güncellendi; süreler ve kayıtlar korundu.",
                    );
                  }
                }}
              >
                <Field label="Yeni konu adı">
                  <input
                    required
                    maxLength={150}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>
                <Button type="submit">Konu adını kaydet</Button>
                <Button variant="ghost" onClick={() => setEditing(null)}>
                  Vazgeç
                </Button>
              </form>
            )}
          </Card>
        ))
      )}
    </section>
  );
}
