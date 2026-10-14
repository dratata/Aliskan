import { useEffect, useRef, type ReactNode } from "react";
import {
  BookOpen,
  Dumbbell,
  Cigarette,
  Heart,
  Moon,
  Sun,
  Droplets,
  Utensils,
  Wind,
  X,
  ChevronRight,
  Check,
  Plus,
  type LucideIcon,
} from "lucide-react";
import type { HabitId } from "../domain/types";
export const habitIcons: Record<HabitId, LucideIcon> = {
  study: BookOpen,
  exerciseLunch: Dumbbell,
  exerciseEvening: Dumbbell,
  smoking: Cigarette,
  family: Heart,
  night: Moon,
  morning: Sun,
  water: Droplets,
  nutrition: Utensils,
};
export const habitColors: Record<HabitId, string> = {
  study: "sage",
  exerciseLunch: "peach",
  exerciseEvening: "peach",
  smoking: "lavender",
  family: "pink",
  night: "blue",
  morning: "yellow",
  water: "blue",
  nutrition: "yellow",
};
export function HabitIcon({ id }: { id: HabitId }) {
  const Icon = habitIcons[id];
  return (
    <span className={`icon-box ${habitColors[id]}`}>
      <Icon size={21} strokeWidth={1.7} />
    </span>
  );
}
export function Button({
  children,
  onClick,
  variant = "",
  disabled = false,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      className={`button ${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`card ${className}`}>{children}</section>;
}
export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <BookOpen size={22} />
      </span>
      <p>{children}</p>
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null),
    close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement,
      old = document.body.style.overflow;
    const token = crypto.randomUUID();
    history.pushState({ ...history.state, aliskanDialog: token }, "");
    let fromBack = false;
    const back = () => {
      if (history.state?.aliskanDialog !== token) {
        fromBack = true;
        close.current();
      }
    };
    window.addEventListener("popstate", back);
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const siblings: Array<{ node: HTMLElement; inert: boolean }> = [];
    let node: HTMLElement | null = ref.current?.parentElement ?? null;
    while (node && node !== document.body) {
      for (const sibling of Array.from(node.parentElement?.children ?? [])) {
        if (sibling !== node && sibling instanceof HTMLElement) {
          siblings.push({ node: sibling, inert: sibling.inert });
          sibling.inert = true;
        }
      }
      node = node.parentElement;
    }
    const items = () =>
      Array.from(
        ref.current?.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex="0"]',
        ) ?? [],
      ).filter(
        (el) =>
          el.getClientRects().length > 0 &&
          getComputedStyle(el).visibility !== "hidden",
      );
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close.current();
      }
      if (e.key === "Tab") {
        const list = items(),
          first = list[0],
          last = list.at(-1);
        if (!first) {
          e.preventDefault();
          return;
        }
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last?.focus();
        } else if (
          !e.shiftKey &&
          (document.activeElement === last ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.body.style.overflow = old;
      for (const sibling of siblings) sibling.node.inert = sibling.inert;
      document.removeEventListener("keydown", handle);
      window.removeEventListener("popstate", back);
      if (!fromBack && history.state?.aliskanDialog === token) history.back();
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">KENDİNE AYIRDIĞIN ZAMAN</span>
            <h2>{title}</h2>
          </div>
          <button className="icon-button" aria-label="Kapat" onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
export function StepDots({
  count,
  current,
}: {
  count: number;
  current: number;
}) {
  return (
    <div className="step-dots" aria-label={`${current + 1} / ${count} adım`}>
      {Array.from({ length: count }, (_, i) => (
        <i key={i} className={i <= current ? "done" : ""} />
      ))}
    </div>
  );
}
export function SectionTitle({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {action}
    </div>
  );
}
export { Wind, ChevronRight, Check, Plus };
