import { useEffect, useRef, useState } from "react";
import { useStore } from "../app/Store";
import { inTimeWindow } from "../domain/dates";
let soundContext: AudioContext | null = null;
export function unlockTimerSound(enabled: boolean) {
  if (!enabled) return;
  try {
    soundContext ??= new AudioContext();
    void soundContext.resume().catch(() => {});
  } catch {}
}
function playEndSound() {
  try {
    if (!soundContext || soundContext.state !== "running") return;
    const osc = soundContext.createOscillator(),
      gain = soundContext.createGain();
    osc.connect(gain);
    gain.connect(soundContext.destination);
    gain.gain.value = 0.07;
    osc.frequency.value = 660;
    osc.start();
    osc.stop(soundContext.currentTime + 0.3);
  } catch {}
}
export function useTimerCompletion() {
  const { state, update } = useStore(),
    seen = useRef(new Set<string>()),
    [message, setMessage] = useState("");
  useEffect(() => {
    const check = async () => {
      const timer = state.timer;
      if (
        !timer ||
        !timer.running ||
        !timer.deadline ||
        timer.saved ||
        Date.now() < timer.deadline ||
        seen.current.has(timer.id) ||
        document.visibilityState !== "visible"
      )
        return;
      seen.current.add(timer.id);
      let completed = false;
      const saved = await update((s) => {
        if (
          s.timer?.id === timer.id &&
          s.timer.running &&
          !s.timer.saved &&
          s.timer.deadline !== null &&
          s.timer.deadline <= Date.now()
        ) {
          completed = true;
          return {
            ...s,
            timer: { ...s.timer, remaining: 0, running: false, deadline: null },
          };
        }
        return s;
      });
      if (!saved || !completed) {
        seen.current.delete(timer.id);
        return;
      }
      setMessage("Oturumun tamamlandı. Kaydını tamamlamak için rehberi aç.");
      const quiet = inTimeWindow(
        new Date().toTimeString().slice(0, 5),
        state.settings.quietStart,
        state.settings.quietEnd,
      );
      if (state.settings.sound && !quiet) playEndSound();
      if (
        state.settings.notifications &&
        !quiet &&
        "Notification" in window &&
        Notification.permission === "granted"
      )
        navigator.serviceWorker?.ready
          .then((r) =>
            r.showNotification("Oturum tamamlandı", {
              body: "Küçük bir adım daha. Kaydını rehberden tamamlayabilirsin.",
              tag: timer.id,
            }),
          )
          .catch(() => {});
    };
    void check();
    const i = setInterval(() => void check(), 500);
    document.addEventListener("visibilitychange", check);
    return () => {
      clearInterval(i);
      document.removeEventListener("visibilitychange", check);
    };
  }, [state.timer, state.settings]);
  return { message, clear: () => setMessage("") };
}
