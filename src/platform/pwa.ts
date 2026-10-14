import { useEffect, useRef, useState } from "react";
export function usePwa() {
  const [updateAvailable, setUpdateAvailable] = useState(false),
    registration = useRef<ServiceWorkerRegistration | null>(null),
    applying = useRef(false);
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !import.meta.env.PROD) return;
    let disposed = false;
    const onChange = () => {
      if (applying.current) location.reload();
    };
    const check = () => {
      if (document.visibilityState === "visible")
        void registration.current?.update().catch(() => {});
    };
    const found = () => {
      const r = registration.current,
        worker = r?.installing;
      worker?.addEventListener("statechange", () => {
        if (
          !disposed &&
          worker.state === "installed" &&
          navigator.serviceWorker.controller
        )
          setUpdateAvailable(true);
      });
    };
    navigator.serviceWorker.addEventListener("controllerchange", onChange);
    navigator.serviceWorker
      .register("/sw.js")
      .then((r) => {
        if (disposed) return;
        registration.current = r;
        if (r.waiting) setUpdateAvailable(true);
        r.addEventListener("updatefound", found);
        found();
      })
      .catch(() => {});
    const interval = setInterval(check, 60 * 60 * 1000);
    document.addEventListener("visibilitychange", check);
    return () => {
      disposed = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", check);
      registration.current?.removeEventListener("updatefound", found);
      navigator.serviceWorker.removeEventListener("controllerchange", onChange);
    };
  }, []);
  return {
    updateAvailable,
    applyUpdate: () => {
      const worker = registration.current?.waiting;
      if (worker) {
        applying.current = true;
        worker.postMessage({ type: "SKIP_WAITING" });
      }
    },
  };
}
