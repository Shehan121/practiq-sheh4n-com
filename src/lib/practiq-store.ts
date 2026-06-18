import { useEffect, useState } from "react";

const KEY = "practiq-state-v1";

export type AppStage = "Applied" | "In Review" | "Interview" | "Decision";
export const STAGES: AppStage[] = ["Applied", "In Review", "Interview", "Decision"];

export interface JobMatch {
  id: string;
  company: string;
  role: string;
  type: string;
  city: string;
  language: string; // e.g. "B1", "B2"
  visaOk: boolean;
  skills: string[];
  badge?: "Rare";
  match: number;
}

export interface Application {
  id: string;
  company: string;
  role: string;
  daysLeft: number;
  stageIndex: number; // 0..3
  status: "active" | "rejected";
}

export interface PractiqState {
  name: string;
  skills: string[];
  onboarded: boolean;
  applications: Application[];
}

const DEFAULT_STATE: PractiqState = {
  name: "Amir",
  skills: [],
  onboarded: false,
  applications: [
    { id: "n26", company: "N26", role: "Backend Intern", daysLeft: 4, stageIndex: 2, status: "active" },
    { id: "dh", company: "Delivery Hero", role: "Data Intern", daysLeft: 9, stageIndex: 1, status: "active" },
    { id: "zal", company: "Zalando", role: "iOS Intern", daysLeft: 0, stageIndex: 3, status: "rejected" },
  ],
};

export const JOBS: JobMatch[] = [
  { id: "n26", company: "N26", role: "Backend Intern", type: "Mandatory internship", city: "Berlin", language: "B1", visaOk: true, skills: ["Python", "Kotlin", "AWS"], badge: "Rare", match: 96 },
  { id: "dh", company: "Delivery Hero", role: "Data Intern", type: "Mandatory internship", city: "Berlin", language: "B1", visaOk: true, skills: ["Python", "SQL", "Airflow"], badge: "Rare", match: 91 },
  { id: "cel", company: "Celonis", role: "Frontend Intern", type: "Mandatory internship", city: "Munich", language: "B2", visaOk: true, skills: ["JS", "React", "CSS"], match: 88 },
  { id: "tr", company: "Trade Republic", role: "Mobile Intern (Android)", type: "Mandatory internship", city: "Munich", language: "B2", visaOk: false, skills: ["Kotlin", "Java"], match: 82 },
];

function read(): PractiqState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

const listeners = new Set<() => void>();
let state: PractiqState = DEFAULT_STATE;
let hydrated = false;

function ensureHydrated() {
  if (!hydrated && typeof window !== "undefined") {
    state = read();
    hydrated = true;
  }
}

function setState(updater: (s: PractiqState) => PractiqState) {
  ensureHydrated();
  state = updater(state);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

export function usePractiq() {
  const [, setTick] = useState(0);
  useEffect(() => {
    ensureHydrated();
    setTick((n) => n + 1);
    const l = () => setTick((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return {
    state,
    setSkills: (skills: string[]) => setState((s) => ({ ...s, skills, onboarded: true })),
    advanceStage: (id: string) =>
      setState((s) => ({
        ...s,
        applications: s.applications.map((a) =>
          a.id === id && a.status === "active"
            ? { ...a, stageIndex: Math.min(3, a.stageIndex + 1) }
            : a,
        ),
      })),
    reset: () => setState(() => ({ ...DEFAULT_STATE, onboarded: false })),
  };
}