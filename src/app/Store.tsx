import { ZodError } from "zod";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { loadState, mutateState } from "../data/database";
import { createInitialState } from "../domain/defaults";
import { eventSchema, type AppState, type HabitEvent } from "../domain/types";
import { localDate } from "../domain/dates";
interface Store {
  state: AppState;
  ready: boolean;
  error: string;
  update: (fn: (s: AppState) => AppState) => Promise<boolean>;
  addEvent: (
    type: HabitEvent["type"],
    value: number,
    data?: HabitEvent["data"],
    date?: string,
    source?: HabitEvent["source"],
    id?: string,
  ) => Promise<string | null>;
  removeEvent: (id: string) => Promise<boolean>;
  clearError: () => void;
}
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(createInitialState),
    [ready, setReady] = useState(false),
    [error, setError] = useState("");
  const current = useRef(state),
    queue = useRef(Promise.resolve()),
    healthy = useRef(false),
    channel = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    let disposed = false;
    const refresh = () => {
      queue.current = queue.current.then(async () => {
        try {
          const s = await loadState();
          if (disposed) return;
          current.current = s;
          setState(s);
          healthy.current = true;
          setReady(true);
        } catch {
          if (!disposed) {
            setError(
              "Yerel kayıtlar açılamadı. Verileri silmeden yeniden yüklemeyi dene.",
            );
            setReady(true);
          }
        }
      });
    };
    refresh();
    if ("BroadcastChannel" in window) {
      const c = new BroadcastChannel("aliskan-state");
      channel.current = c;
      c.onmessage = refresh;
    }
    const visible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", visible);
    window.addEventListener("focus", refresh);
    return () => {
      disposed = true;
      channel.current?.close();
      channel.current = null;
      document.removeEventListener("visibilitychange", visible);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  const update = (fn: (s: AppState) => AppState): Promise<boolean> =>
    new Promise((resolve) => {
      queue.current = queue.current.then(async () => {
        if (!healthy.current) {
          setError(
            "Veri deposu açılamadı; kayıt yapılmadı. Sayfayı yeniden yükle.",
          );
          resolve(false);
          return;
        }
        try {
          const next = await mutateState(fn);
          current.current = next;
          setState(next);
          channel.current?.postMessage({ type: "changed" });
          resolve(true);
        } catch (e) {
          setError(
            e instanceof ZodError
              ? "Girdi geçerli değil. Miktar, tarih ve saatleri kontrol et. Kayıtlar değiştirilmedi."
              : "Kayıt saklanamadı. Cihaz depolamasını ve tarayıcı izinlerini kontrol et; tekrar dene.",
          );
          resolve(false);
        }
      });
    });
  const addEvent: Store["addEvent"] = async (
    type,
    value,
    data = {},
    date = localDate(),
    source = "manual",
    id = crypto.randomUUID(),
  ) => {
    const event = eventSchema.parse({
      id,
      type,
      value,
      data,
      date,
      source,
      at: new Date().toISOString(),
    });
    return (await update((s) =>
      s.events.some((e) => e.id === id)
        ? s
        : { ...s, events: [...s.events, event] },
    ))
      ? id
      : null;
  };
  return (
    <Context.Provider
      value={{
        state,
        ready,
        error,
        update,
        addEvent,
        removeEvent: async (id) =>
          update((s) => ({
            ...s,
            events: s.events.filter((e) => e.id !== id),
          })),
        clearError: () => setError(""),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useStore() {
  const store = useContext(Context);
  if (!store) throw new Error("StoreProvider eksik");
  return store;
}
