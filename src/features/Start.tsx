import {
  ArrowUpRight,
  Wind,
  Mic,
  Moon,
  Utensils,
  Heart,
  BookOpen,
  Dumbbell,
  Cigarette,
  Sun,
} from "lucide-react";
import { Card } from "../components/UI";
import type { HabitId } from "../domain/types";
import { useStore } from "../app/Store";
const modules = [
  {
    id: "study",
    habit: "study",
    title: "Odaklan",
    sub: "Bir konu, küçük bir başlangıç.",
    icon: BookOpen,
    color: "sage",
    tag: "10 DK İLE BAŞLA",
  },
  {
    id: "exerciseLunch",
    habit: "exerciseLunch",
    title: "Öğle hareketi",
    sub: "Vücuduna nazikçe alan aç.",
    icon: Dumbbell,
    color: "peach",
    tag: "REHBERLİ HAREKET",
  },
  {
    id: "exerciseEvening",
    habit: "exerciseEvening",
    title: "Akşam hareketi",
    sub: "Akşamına küçük bir hareket molası.",
    icon: Dumbbell,
    color: "peach",
    tag: "REHBERLİ HAREKET",
  },
  {
    id: "breathing",
    title: "Nefes al",
    sub: "Biraz yavaşla. Buradasın.",
    icon: Wind,
    color: "blue",
    tag: "3 DAKİKALIK MOLA",
  },
  {
    id: "family",
    habit: "family",
    title: "Birlikte oyna",
    sub: "Küçük oyunlar, güzel anlar.",
    icon: Heart,
    color: "pink",
    tag: "60 FARKLI ETKİNLİK",
  },
  {
    id: "smoking",
    habit: "smoking",
    title: "İsteğe bir mola",
    sub: "Sigara isteği gelip geçebilir.",
    icon: Cigarette,
    color: "lavender",
    tag: "5 DAKİKA ERTELE",
  },
  {
    id: "nutrition",
    habit: "nutrition",
    title: "Beslenme ve su",
    sub: "Bedenini dinle, gününü kaydet.",
    icon: Utensils,
    color: "yellow",
    tag: "YARGILAMADAN TAKİP",
  },
  {
    id: "night",
    habit: "night",
    title: "Günü kapat",
    sub: "Uykuna sakin bir geçiş.",
    icon: Moon,
    color: "blue",
    tag: "GECE RUTİNİ",
  },
  {
    id: "morning",
    habit: "morning",
    title: "Güne başla",
    sub: "Hazır olduğunda küçük bir rutin.",
    icon: Sun,
    color: "yellow",
    tag: "SABAH RUTİNİ",
  },
  {
    id: "voice",
    title: "Konuş veya yaz",
    sub: "Gününü kendi kelimelerinle anlat.",
    icon: Mic,
    color: "sage",
    tag: "KOLAY KAYIT",
  },
];
export function Start({
  open,
}: {
  open: (id: string, habit?: HabitId) => void;
}) {
  const { state } = useStore();
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">KÜÇÜK BİR BAŞLANGIÇ</span>
        <h1>Şimdi sana ne iyi gelir?</h1>
        <p>Birini seç. Gerisini adım adım birlikte yapalım.</p>
      </div>
      <div className="start-grid">
        {modules.map((m) => (
          <button
            key={m.id}
            className="start-card"
            onClick={() => open(m.id, m.habit as HabitId | undefined)}
          >
            <span className={`icon-box ${m.color}`}>
              <m.icon size={24} />
            </span>
            <span className="eyebrow">
              {["study", "exerciseLunch", "exerciseEvening"].includes(m.id)
                ? `${state.habits.find((h) => h.id === m.habit)?.target ?? 10} DK HEDEFİN`
                : m.tag}
            </span>
            <h2>{m.title}</h2>
            <p>{m.sub}</p>
            <ArrowUpRight className="start-arrow" size={22} />
          </button>
        ))}
      </div>
      <Card className="soft-note">
        Bugünkü planından bağımsız olarak da bir oturum başlatabilirsin.
        Tamamladığında kaydın gelişimine eklenir.
      </Card>
    </>
  );
}
