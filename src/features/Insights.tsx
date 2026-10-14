import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  BookOpen,
  Dumbbell,
  Heart,
  Cigarette,
  ArrowUpRight,
} from "lucide-react";
import { useStore } from "../app/Store";
import { localDate, shiftDate } from "../domain/dates";
import { summarize, chartData } from "../domain/analytics";
import { Card, SectionTitle, Empty, Field } from "../components/UI";
const chartChoices = [
  { key: "study", name: "Ders çalışma", unit: "dk", color: "#6a8563" },
  { key: "exercise", name: "Egzersiz", unit: "dk", color: "#c79870" },
  { key: "smoking", name: "Sigara", unit: "adet", color: "#9e8faf" },
  { key: "water", name: "Su", unit: "ml", color: "#789aab" },
  { key: "weight", name: "Kilo", unit: "kg", color: "#b2a06d" },
  { key: "sleep", name: "Uyku", unit: "saat", color: "#7983a9" },
  { key: "family", name: "Birlikte oyun", unit: "dk", color: "#c08f96" },
  { key: "energy", name: "Enerji", unit: "/10", color: "#a69e59" },
  { key: "stress", name: "Stres", unit: "/10", color: "#9f879a" },
  { key: "night", name: "Gece rutini", unit: "adım", color: "#7a859c" },
];
export default function Insights() {
  const { state } = useStore(),
    [days, setDays] = useState(7),
    [metric, setMetric] = useState("study"),
    end = localDate(),
    start = shiftDate(end, -days + 1),
    summary = summarize(state, start, end),
    previous = summarize(state, shiftDate(start, -days), shiftDate(start, -1)),
    chart = chartData(state, end, days),
    choice = chartChoices.find((c) => c.key === metric)!,
    hasRecords = state.events.some((e) => e.date >= start && e.date <= end),
    hasPrevious = state.events.some(
      (e) =>
        e.type === "study" &&
        e.date >= shiftDate(start, -days) &&
        e.date < start,
    );
  const weekly = summarize(state, shiftDate(end, -6), end),
    weeklyGoal = state.settings.weeklyStudyGoal;
  const weights = state.events
      .filter((e) => e.type === "weight" && e.date >= start && e.date <= end)
      .sort((a, b) => a.date.localeCompare(b.date)),
    sleepRecords = state.events.filter(
      (e) => e.type === "sleep" && e.date >= start && e.date <= end,
    ),
    avgSleep = sleepRecords.length
      ? sleepRecords.reduce((a, e) => a + e.value, 0) / sleepRecords.length / 60
      : null;
  const cigarettes = state.events
      .filter(
        (e) =>
          e.type === "smoking" &&
          e.value > 0 &&
          e.date >= start &&
          e.date <= end,
      )
      .sort((a, b) => a.at.localeCompare(b.at)),
    intervals = cigarettes
      .slice(1)
      .map((e, i) => ({
        start: cigarettes[i].at,
        end: e.at,
        hours:
          (new Date(e.at).getTime() - new Date(cigarettes[i].at).getTime()) /
          3600000,
      }));
  const maxInterval = intervals.length
    ? Math.max(...intervals.map((i) => i.hours))
    : null;
  const routineDays = new Set(
    state.events
      .filter(
        (e) =>
          e.type === "routine" &&
          e.data.routine === "night" &&
          e.date >= start &&
          e.date <= end,
      )
      .map((e) => e.date),
  );
  const fullNights = Array.from(routineDays).filter((d) =>
    state.nightSteps.every((step) =>
      state.events.some(
        (e) =>
          e.type === "routine" &&
          e.date === d &&
          e.data.step === step.id &&
          e.data.routine === "night",
      ),
    ),
  ).length;
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">KÜÇÜK ADIMLARIN BÜYÜK RESMİ</span>
        <h1>Gelişimin</h1>
        <p>Yalnızca senin kaydettiğin gerçek anlar.</p>
      </div>
      <div className="segmented">
        {[
          [1, "Bugün"],
          [7, "Haftalık"],
          [30, "Aylık"],
        ].map(([v, l]) => (
          <button
            key={v}
            className={days === v ? "selected" : ""}
            onClick={() => setDays(Number(v))}
          >
            {l}
          </button>
        ))}
      </div>
      <Card className="insights-summary">
        <TrendingUp size={24} />
        <span className="eyebrow">BU DÖNEME BİR BAKIŞ</span>
        <h2>
          {summary.studyDays
            ? `${summary.studyDays} gün kendine bir çalışma alanı açtın.`
            : hasRecords
              ? "Kaydettiğin her an, kendini tanımanın bir parçası."
              : "Hikayen ilk kaydınla başlayacak."}
        </h2>
        <p>
          {summary.studyDays
            ? `${Math.round(summary.studyMinutes)} dakika net çalışma.${hasPrevious ? ` Önceki döneme göre ${Math.abs(Math.round(summary.studyMinutes - previous.studyMinutes))} dakika ${summary.studyMinutes >= previous.studyMinutes ? "fazla" : "daha az"}.` : " Karşılaştırma için önceki dönemde yeterli kayıt yok."}`
            : "Grafikler kayıt eklediğinde oluşur. Kayıt olmayan günler başarısızlık değildir."}
        </p>
      </Card>
      <section
        className="card weekly-goal"
        aria-label="Haftalık çalışma hedefi"
      >
        <span className="eyebrow">SON 7 GÜN · NET ÇALIŞMA</span>
        <div className="habit-top">
          <h3>
            {Math.round(weekly.studyMinutes)} / {weeklyGoal} dk
          </h3>
          <span className="pill">{weekly.studyDays} gün çalıştın</span>
        </div>
        {weeklyGoal > 0 && (
          <div
            className="linear-progress"
            role="progressbar"
            aria-label="Haftalık hedef ilerlemesi"
            aria-valuemin={0}
            aria-valuemax={weeklyGoal}
            aria-valuenow={Math.min(
              weeklyGoal,
              Math.round(weekly.studyMinutes),
            )}
          >
            <i
              style={{
                width: `${Math.min(100, (weekly.studyMinutes / weeklyGoal) * 100)}%`,
              }}
            />
          </div>
        )}
        <p className="help">
          {weeklyGoal === 0
            ? "Haftalık hedefi profilinden belirleyebilirsin."
            : weekly.studyMinutes >= weeklyGoal
              ? "Bu haftaki hedefin tamamlandı. Dilersen burada kal; dinlenmek de planın parçası."
              : `Kalan ${Math.ceil(weeklyGoal - weekly.studyMinutes)} dakikayı küçük oturumlara bölebilirsin.`}
        </p>
      </section>
      <div className="stat-grid">
        {[
          {
            title: "Net çalışma",
            value: summary.studyMinutes,
            unit: "dk",
            icon: BookOpen,
            color: "sage",
            type: "study",
          },
          {
            title: "Hareket zamanı",
            value: summary.exerciseMinutes,
            unit: "dk",
            icon: Dumbbell,
            color: "peach",
            type: "exercise",
          },
          {
            title: "Birlikte oyun",
            value: summary.familyMinutes,
            unit: "dk",
            icon: Heart,
            color: "pink",
            type: "family",
          },
          {
            title: "Sigara kayıtları",
            value: summary.cigarettes,
            unit: "adet",
            icon: Cigarette,
            color: "lavender",
            type: "smoking",
          },
        ].map((m) => (
          <Card key={m.title}>
            <span className={`icon-box ${m.color}`}>
              <m.icon size={20} />
            </span>
            <p>{m.title}</p>
            <h2>
              {state.events.some(
                (e) => e.type === m.type && e.date >= start && e.date <= end,
              )
                ? Math.round(m.value)
                : "—"}{" "}
              <small>{m.unit}</small>
            </h2>
          </Card>
        ))}
      </div>
      <SectionTitle
        title="Gün gün ilerlemen"
        sub="Boş günler eksik veri olarak gösterilir."
      />
      <Card className="chart-card">
        <Field label="Gösterilecek kayıt">
          <select value={metric} onChange={(e) => setMetric(e.target.value)}>
            {chartChoices.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name} ({c.unit})
              </option>
            ))}
          </select>
        </Field>
        {chart.some((d) => (d as Record<string, unknown>)[metric] !== null) ? (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={230}>
              {["weight", "sleep", "energy", "stress"].includes(metric) ? (
                <LineChart data={chart}>
                  <CartesianGrid vertical={false} stroke="var(--line)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={20}
                  />
                  <YAxis
                    width={35}
                    tick={{ fontSize: 11 }}
                    domain={
                      metric === "weight"
                        ? ["dataMin - 1", "dataMax + 1"]
                        : [0, "auto"]
                    }
                  />
                  <Tooltip
                    formatter={(v) => [`${v} ${choice.unit}`, choice.name]}
                    contentStyle={{
                      borderRadius: 12,
                      background: "var(--card)",
                      color: "var(--ink)",
                    }}
                  />
                  <Line
                    dataKey={metric}
                    stroke={choice.color}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    connectNulls={false}
                  />
                </LineChart>
              ) : (
                <BarChart data={chart}>
                  <CartesianGrid vertical={false} stroke="var(--line)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={20}
                  />
                  <YAxis width={35} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => [`${v} ${choice.unit}`, choice.name]}
                    contentStyle={{
                      borderRadius: 12,
                      background: "var(--card)",
                      color: "var(--ink)",
                    }}
                  />
                  <Bar
                    dataKey={metric}
                    fill={choice.color}
                    radius={[5, 5, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <Empty>
            Bu dönem için {choice.name.toLocaleLowerCase("tr-TR")} kaydı yok.
          </Empty>
        )}
      </Card>
      <SectionTitle title="Yaşamına dair küçük işaretler" />
      <div className="detail-stats">
        <Card>
          <span className="eyebrow">UYKU ORTALAMASI</span>
          <h2>
            {avgSleep === null ? "—" : avgSleep.toFixed(1)} <small>saat</small>
          </h2>
          <p>
            {sleepRecords.length} kayıt üzerinden. Düzenlilik, kaydedilen uyku
            saatleriyle değerlendirilir.
          </p>
          {sleepRecords.length >= 2 && (
            <small>
              Uykuya dalış saatleri:{" "}
              {sleepRecords.map((e) => String(e.data.asleep)).join(" · ")}
            </small>
          )}
        </Card>
        <Card>
          <span className="eyebrow">KİLO DEĞİŞİMİ</span>
          <h2>
            {weights.length >= 2
              ? `${weights.at(-1)!.value - weights[0].value > 0 ? "+" : ""}${(weights.at(-1)!.value - weights[0].value).toFixed(1)}`
              : "—"}{" "}
            <small>kg</small>
          </h2>
          <p>Bu dönemdeki ilk ve son ölçüm. En az iki ölçüm gerekir.</p>
        </Card>
        <Card>
          <span className="eyebrow">GECE RUTİNİ</span>
          <h2>
            {routineDays.size
              ? Math.round((fullNights / routineDays.size) * 100)
              : "—"}{" "}
            <small>%</small>
          </h2>
          <p>
            {routineDays.size
              ? `${routineDays.size} kayıtlı gece içinde ${fullNights} tam rutin.`
              : "Henüz gece adımı kaydı yok."}
          </p>
        </Card>
        <Card>
          <span className="eyebrow">BU DÖNEMDE KAYITLAR ARASI ARA</span>
          <h2>
            {maxInterval === null ? "—" : Math.round(maxInterval * 10) / 10}{" "}
            <small>saat</small>
          </h2>
          <p>
            Sigara kayıt zamanları arasındaki ara; kayıt dışındaki tüketimi veya
            toplu kaydın içim saatlerini ölçmez.
          </p>
        </Card>
      </div>
      <Card className="soft-note">
        <ArrowUpRight size={19} />
        <p>
          {summary.recordedDays} günde kayıt var. Hedefe ulaşmasan da kaydetmek
          kendini anlamanı kolaylaştırır. Eksik kayıtları başarı ya da
          başarısızlık diye saymıyoruz.
        </p>
      </Card>
    </>
  );
}
