import { useEffect, useState } from "react";
import { localDate } from "../domain/dates";
export function useLocalDay() {
  const [day, setDay] = useState(localDate);
  useEffect(() => {
    const check = () => setDay(localDate());
    const i = setInterval(check, 1000);
    document.addEventListener("visibilitychange", check);
    window.addEventListener("focus", check);
    return () => {
      clearInterval(i);
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("focus", check);
    };
  }, []);
  return day;
}
export function useLocalClock() {
  const [clock, setClock] = useState(() =>
    new Date().toTimeString().slice(0, 5),
  );
  useEffect(() => {
    const check = () => setClock(new Date().toTimeString().slice(0, 5));
    const i = setInterval(check, 30000);
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      clearInterval(i);
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);
  return clock;
}
