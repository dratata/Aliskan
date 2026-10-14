export interface RoutineStep {
  id: string;
  title: string;
  time: string;
  minutes: number;
  kind: "routine" | "breathing" | "exercise";
}
export const defaultMorningSteps: RoutineStep[] = [
  {
    id: "wake",
    title: "Yavaşça uyan",
    time: "08:00",
    minutes: 1,
    kind: "routine",
  },
  {
    id: "water",
    title: "Bir bardak su",
    time: "08:02",
    minutes: 1,
    kind: "routine",
  },
  {
    id: "teeth",
    title: "Dişlerini fırçala",
    time: "08:05",
    minutes: 2,
    kind: "routine",
  },
  {
    id: "move",
    title: "Nazik mobilizasyon",
    time: "08:10",
    minutes: 2,
    kind: "exercise",
  },
  {
    id: "light",
    title: "Gün ışığına çık",
    time: "08:15",
    minutes: 3,
    kind: "routine",
  },
  {
    id: "plan",
    title: "Günün küçük hedeflerine bak",
    time: "08:20",
    minutes: 1,
    kind: "routine",
  },
];
