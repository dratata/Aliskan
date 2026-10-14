import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  House,
  Leaf,
  Play,
  ChartNoAxesCombined,
  User,
  Mic,
  ArrowUpRight,
  X,
  RefreshCw,
} from "lucide-react";
import { useStore } from "./Store";
import { Today } from "../features/Today";
import { Habits } from "../features/Habits";
import { Start } from "../features/Start";
import { Profile } from "../features/Profile";
import { Onboarding } from "../features/Onboarding";
import { Study } from "../features/Study";
import { Exercise } from "../features/Exercise";
import { Smoking } from "../features/Smoking";
import { Breathing } from "../features/Breathing";
import { Routine } from "../features/Routine";
import { Nutrition } from "../features/Nutrition";
import { Sleep } from "../features/Sleep";
import { Family } from "../features/Family";
import { Voice } from "../features/Voice";
import { Modal, Button } from "../components/UI";
import { useReminders } from "../platform/notifications";
import { useTimerCompletion } from "../platform/timer";
import { usePwa } from "../platform/pwa";
import type { HabitId } from "../domain/types";
const Insights = lazy(() => import("../features/Insights"));
const tabs = [
  { id: "today", label: "Bugün", icon: House },
  { id: "habits", label: "Alışkanlıklar", icon: Leaf },
  { id: "start", label: "Başlat", icon: Play },
  { id: "insights", label: "Gelişim", icon: ChartNoAxesCombined },
  { id: "profile", label: "Profil", icon: User },
];
const titles: Record<string, string> = {
  study: "Odak zamanı",
  exerciseLunch: "Öğle hareketi",
  exerciseEvening: "Akşam hareketi",
  smoking: "İsteğe bir mola",
  breathing: "Nefesle yavaşla",
  night: "Gece rutinin",
  morning: "Sabah rutinin",
  nutrition: "Beslenme ve farkındalık",
  water: "Su takibin",
  sleep: "Uyku ve enerji",
  family: "Birlikte oyun zamanı",
  voice: "Kolay kayıt",
};
function Shell() {
  const { state, ready, error, clearError } = useStore(),
    [tab, setTab] = useState("today"),
    [module, setModule] = useState<{ id: string; habit?: HabitId } | null>(
      null,
    ),
    reminder = useReminders(),
    timerNotice = useTimerCompletion(),
    pwa = usePwa();
  const open = (id: string, habit?: HabitId) => setModule({ id, habit });
  useEffect(() => {
    const dark =
      state.settings.theme === "dark" ||
      (state.settings.theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    const m = window.matchMedia("(prefers-color-scheme: dark)"),
      listen = () => {
        if (state.settings.theme === "system")
          document.documentElement.dataset.theme = m.matches ? "dark" : "light";
      };
    m.addEventListener("change", listen);
    return () => m.removeEventListener("change", listen);
  }, [state.settings.theme]);
  if (!ready)
    return (
      <div className="loading-screen">
        <span className="brand-mark">a</span>
        <p>Küçük adımların hazırlanıyor…</p>
      </div>
    );
  if (error && !state.onboarded)
    return (
      <main className="fatal-screen">
        <h2>Kayıt deposuna erişemedik</h2>
        <p>{error}</p>
        <Button onClick={() => location.reload()}>Yeniden yükle</Button>
      </main>
    );
  if (!state.onboarded) return <Onboarding />;
  const navigate = (id: string) => {
    setTab(id);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const activeTimer = state.timer && !state.timer.saved;
  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <button className="brand" onClick={() => navigate("today")}>
            <span className="brand-mark">a</span>aliskan
            <span className="brand-dot">.</span>
          </button>
          <span className="topbar-tag">KENDİ HIZINDA, HER GÜN.</span>
          <div className="topbar-actions">
            <button
              className="icon-button"
              aria-label="Sesli veya metinle kayıt"
              onClick={() => open("voice")}
            >
              <Mic size={19} />
            </button>
            <button
              className="avatar"
              aria-label="Profilini aç"
              onClick={() => navigate("profile")}
            >
              {state.profile.name ? (
                state.profile.name[0].toLocaleUpperCase("tr-TR")
              ) : (
                <User size={17} />
              )}
            </button>
          </div>
        </div>
      </header>
      <div className="app-layout">
        <aside className="desktop-nav">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? "active" : ""}
              onClick={() => navigate(t.id)}
            >
              <t.icon size={20} />
              {t.label}
            </button>
          ))}
          <div className="sidebar-note">
            <Leaf size={24} />
            <p>
              Önemli olan bugün
              <br />
              küçük de olsa ilerlemek.
            </p>
            <small>Senin hızın yeterli.</small>
          </div>
        </aside>
        <main className="main-content">
          {error && (
            <div className="alert" role="alert">
              <span>{error}</span>
              <button
                className="icon-button"
                onClick={clearError}
                aria-label="Hatayı kapat"
              >
                <X size={17} />
              </button>
            </div>
          )}
          {pwa.updateAvailable && <CardUpdate apply={pwa.applyUpdate} />}
          <Suspense fallback={<p className="empty">Gelişimin hazırlanıyor…</p>}>
            {tab === "today" ? (
              <Today open={open} />
            ) : tab === "habits" ? (
              <Habits />
            ) : tab === "start" ? (
              <Start open={open} />
            ) : tab === "insights" ? (
              <Insights />
            ) : (
              <Profile />
            )}
          </Suspense>
          <footer className="page-footer">
            Küçük adımlar. Daha iyi günler. <span>aliskan.</span>
          </footer>
        </main>
      </div>
      {activeTimer && !module && (
        <button
          className="active-timer-banner"
          onClick={() =>
            open(
              state.timer!.kind === "study"
                ? "study"
                : state.timer!.kind === "breathing"
                  ? "breathing"
                  : state.timer!.kind === "delay"
                    ? "smoking"
                    : state.timer!.kind === "exercise"
                      ? (state.timer!.habitId ?? "exerciseLunch")
                      : (state.timer!.habitId ?? "night"),
            )
          }
        >
          <span className="live-dot" />
          {state.timer!.remaining === 0
            ? "Oturum tamamlandı · Kaydet"
            : state.timer!.running
              ? "Oturum devam ediyor"
              : "Duraklatılmış oturum"}{" "}
          <ArrowUpRight size={16} />
        </button>
      )}
      <nav className="bottom-nav" aria-label="Ana navigasyon">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`${tab === t.id ? "active" : ""} ${t.id === "start" ? "start-tab" : ""}`}
            onClick={() => navigate(t.id)}
          >
            <span>
              <t.icon size={t.id === "start" ? 22 : 21} strokeWidth={1.7} />
            </span>
            <small>{t.label}</small>
          </button>
        ))}
      </nav>
      {(reminder.message || timerNotice.message) && (
        <div className="reminder-toast" role="status">
          <span>{timerNotice.message || reminder.message}</span>
          <button
            className="icon-button"
            aria-label="Hatırlatmayı kapat"
            onClick={() => {
              reminder.clear();
              timerNotice.clear();
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}
      {module && (
        <Modal
          title={titles[module.id] ?? "Bir küçük adım"}
          onClose={() => setModule(null)}
        >
          <div key={module.id}>
            {module.id === "study" ? (
              <Study />
            ) : module.id.startsWith("exercise") ? (
              <Exercise habitId={module.habit ?? (module.id as HabitId)} />
            ) : module.id === "smoking" ? (
              <Smoking open={open} />
            ) : module.id === "breathing" ? (
              <Breathing />
            ) : module.id === "night" || module.id === "morning" ? (
              <Routine morning={module.id === "morning"} open={open} />
            ) : module.id === "nutrition" || module.id === "water" ? (
              <Nutrition waterOnly={module.id === "water"} />
            ) : module.id === "sleep" ? (
              <Sleep />
            ) : module.id === "family" ? (
              <Family />
            ) : (
              <Voice />
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
function CardUpdate({ apply }: { apply: () => void }) {
  return (
    <div className="update-banner">
      <span>Yeni sürüm hazır. Kayıtların korunarak yenilenebilir.</span>
      <Button variant="secondary" onClick={apply}>
        <RefreshCw size={16} /> Güncelle
      </Button>
    </div>
  );
}
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    if (this.state.error)
      return (
        <main className="fatal-screen">
          <h2>Ekran açılırken bir sorun oldu.</h2>
          <p>Yerel kayıtların silinmedi. Sayfayı yeniden yükleyebilirsin.</p>
          <Button onClick={() => location.reload()}>Yeniden yükle</Button>
        </main>
      );
    return this.props.children;
  }
}
export default function App() {
  return (
    <ErrorBoundary>
      <Shell />
    </ErrorBoundary>
  );
}
