import { useEffect, useState } from "react";

const STORAGE_KEY = "practiq-language";

export type Language = "en" | "de";

const dict = {
  en: {
    topnav: {
      navHome: "Home",
      navDiscover: "Discover",
      navHow: "How it works",
      navMatches: "Matches",
      navApplications: "Applications",
      navProfile: "Profile",
      menu: "Menu",
      navigation: "Navigation",
      fullMatches: "Full matches →",
      myQuests: "My quests →",
      footerCopyright: "Practiq © 2026",
      footerTagline: "learn / grow / achieve",
    },
    splash: {
      tagline: "learn / grow / achieve",
    },
    onboarding: {
      step: "Step 01",
      title1: "Choose your",
      title2: "Stack",
      otherPlaceholder: "Enter Others (comma separated)",
      continue: "Continue",
    },
    home: {
      welcomeBack: "Welcome back",
      learn: "Learn,",
      grow: "Grow,",
      achieve: "Achieve",
      heroDescription:
        "The internship platform built for international students in Germany. Match by stack, visa status & language — track every quest from application to offer.",
      browseMatches: "Browse matches",
      trackQuests: "Track quests",
      scroll: "scroll ↓",
      findYourMatch: "Find your match",
      searchInternships: "Search internships",
      searchPlaceholder: "Search by company, skill, city...",
      noMatchesFor: "No matches for",
      howItWorks: "How it works",
      matchApply: "Match.",
      apply: "Apply.",
      getHired: "Get hired.",
      step1Title: "Pick your stack",
      step1Desc: "Tell us what you build with.",
      step2Title: "We match by visa & B1",
      step2Desc: "No more rejections for paperwork.",
      step3Title: "Track every quest",
      step3Desc: "From application to offer.",
      statsStudents: "students matched",
      statsCompanies: "partner companies",
      statsInterview: "interview rate",
      statsLanguage: "language friendly",
      todaysMatches: "Today's matches",
      hotRightNow: "Hot right now",
      seeAll: "See all →",
      visaOk: "Visa ok",
      visaTbd: "Visa: tbd",
      yourQuests: "Your quests",
      trackEveryStepPre: "Track ",
      trackEveryStepMid: "every",
      trackEveryStepPost: " step",
      trackDescription:
        "Applied → In review → Interview → Decision. Watch your applications progress through every stage, in one place.",
      openMyQuests: "Open my quests →",
      todaysQuest: "Today's quest",
      readyToLevelUp: "Ready to level up?",
      startMatching: "Start matching",
      myProfile: "My profile",
      footerTagline: "learn / grow / achieve",
      footerCopyright: "© 2026 Practiq — Built for international students in Germany",
    },
    matches: {
      todaysQuest: "Today's quest",
      matchesFound: "Matches found —",
      filterAll: "All",
      filterVisaOk: "Visa ok",
      filterB1Friendly: "B1 Friendly",
      applied: "Applied",
      close: "Close",
      appliedCheck: "Applied ✓",
      applyNow: "Apply Now",
      visa: "Visa",
      language: "Language",
      city: "City",
      duration: "Duration",
      match: "Match",
      accepted: "Accepted",
      notSupported: "Not supported",
      germanSuffix: "German",
      months6: "6 months",
    },
    applications: {
      yourQuests: "Your quests",
      applications: "Applications:",
      active: "Active",
      daysLeft: "D left",
      advance: "Advance",
      reject: "Reject",
      noActiveApplications: "No active applications yet. Head to Matches to apply.",
      rejected: "Rejected",
      questComplete: "Quest complete",
      rejectedMessage: "Even though it did not work this time, you still got +30 XP. Keep Applying!!",
      remove: "Remove",
    },
    profile: {
      yourProfile: "Your Profile",
      bio: "CS @ TU Berlin ; Backend curious",
      level: "Level 4",
      xp: "240 XP",
      days: "7 days",
      profileStrength: "Profile Strength",
      about: "About",
      email: "Email",
      university: "University",
      visa: "VISA",
      german: "German",
      accepted: "Accepted",
      skills: "Skills",
      preferredCities: "Preferred Cities",
      settings: "Settings",
      notifications: "Notifications",
      language: "Language",
      privacy: "Privacy",
      helpSupport: "Help and Support",
      manage: "Manage",
      on: "ON",
      currentLanguageName: "English",
      logout: "Logout",
    },
    stages: {
      Applied: "Applied",
      "In Review": "In Review",
      Interview: "Interview",
      Decision: "Decision",
    },
    jobRoles: {
      "Backend Intern": "Backend Intern",
      "Data Intern": "Data Intern",
      "Frontend Intern": "Frontend Intern",
      "Mobile Intern (Android)": "Mobile Intern (Android)",
      "iOS Intern": "iOS Intern",
    },
    jobTypes: {
      "Mandatory internship": "Mandatory internship",
    },
  },
  de: {
    topnav: {
      navHome: "Start",
      navDiscover: "Entdecken",
      navHow: "So funktioniert's",
      navMatches: "Matches",
      navApplications: "Bewerbungen",
      navProfile: "Profil",
      menu: "Menü",
      navigation: "Navigation",
      fullMatches: "Alle Matches →",
      myQuests: "Meine Quests →",
      footerCopyright: "Practiq © 2026",
      footerTagline: "lernen / wachsen / erreichen",
    },
    splash: {
      tagline: "lernen / wachsen / erreichen",
    },
    onboarding: {
      step: "Schritt 01",
      title1: "Wähle deinen",
      title2: "Stack",
      otherPlaceholder: "Andere eingeben (kommagetrennt)",
      continue: "Weiter",
    },
    home: {
      welcomeBack: "Willkommen zurück",
      learn: "Lernen,",
      grow: "Wachsen,",
      achieve: "Erreichen",
      heroDescription:
        "Die Praktikumsplattform für internationale Studierende in Deutschland. Match nach Stack, Visum-Status & Sprache — verfolge jede Quest von der Bewerbung bis zum Angebot.",
      browseMatches: "Matches ansehen",
      trackQuests: "Quests verfolgen",
      scroll: "scrollen ↓",
      findYourMatch: "Finde dein Match",
      searchInternships: "Praktika durchsuchen",
      searchPlaceholder: "Suche nach Firma, Skill, Stadt...",
      noMatchesFor: "Keine Treffer für",
      howItWorks: "So funktioniert's",
      matchApply: "Matchen.",
      apply: "Bewerben.",
      getHired: "Angestellt werden.",
      step1Title: "Wähle deinen Stack",
      step1Desc: "Sag uns, womit du entwickelst.",
      step2Title: "Wir matchen nach Visum & B1",
      step2Desc: "Keine Absagen mehr wegen Papierkram.",
      step3Title: "Verfolge jede Quest",
      step3Desc: "Von der Bewerbung bis zum Angebot.",
      statsStudents: "vermittelte Studierende",
      statsCompanies: "Partnerunternehmen",
      statsInterview: "Interview-Quote",
      statsLanguage: "sprachfreundlich",
      todaysMatches: "Heutige Matches",
      hotRightNow: "Gerade angesagt",
      seeAll: "Alle ansehen →",
      visaOk: "Visum ok",
      visaTbd: "Visum: offen",
      yourQuests: "Deine Quests",
      trackEveryStepPre: "Verfolge ",
      trackEveryStepMid: "jeden",
      trackEveryStepPost: " Schritt",
      trackDescription:
        "Beworben → In Prüfung → Interview → Entscheidung. Verfolge den Fortschritt deiner Bewerbungen in jeder Phase, an einem Ort.",
      openMyQuests: "Meine Quests öffnen →",
      todaysQuest: "Heutige Quest",
      readyToLevelUp: "Bereit aufzusteigen?",
      startMatching: "Jetzt matchen",
      myProfile: "Mein Profil",
      footerTagline: "lernen / wachsen / erreichen",
      footerCopyright: "© 2026 Practiq — Für internationale Studierende in Deutschland",
    },
    matches: {
      todaysQuest: "Heutige Quest",
      matchesFound: "Matches gefunden —",
      filterAll: "Alle",
      filterVisaOk: "Visum ok",
      filterB1Friendly: "B1-freundlich",
      applied: "Beworben",
      close: "Schließen",
      appliedCheck: "Beworben ✓",
      applyNow: "Jetzt bewerben",
      visa: "Visum",
      language: "Sprache",
      city: "Stadt",
      duration: "Dauer",
      match: "Match",
      accepted: "Akzeptiert",
      notSupported: "Nicht unterstützt",
      germanSuffix: "Deutsch",
      months6: "6 Monate",
    },
    applications: {
      yourQuests: "Deine Quests",
      applications: "Bewerbungen:",
      active: "Aktiv",
      daysLeft: "T übrig",
      advance: "Weiter",
      reject: "Ablehnen",
      noActiveApplications: "Noch keine aktiven Bewerbungen. Geh zu Matches, um dich zu bewerben.",
      rejected: "Abgelehnt",
      questComplete: "Quest abgeschlossen",
      rejectedMessage: "Auch wenn es dieses Mal nicht geklappt hat, hast du trotzdem +30 XP bekommen. Bleib dran!!",
      remove: "Entfernen",
    },
    profile: {
      yourProfile: "Dein Profil",
      bio: "Informatik @ TU Berlin ; Backend-interessiert",
      level: "Level 4",
      xp: "240 XP",
      days: "7 Tage",
      profileStrength: "Profilstärke",
      about: "Über mich",
      email: "E-Mail",
      university: "Universität",
      visa: "VISUM",
      german: "Deutsch",
      accepted: "Akzeptiert",
      skills: "Fähigkeiten",
      preferredCities: "Bevorzugte Städte",
      settings: "Einstellungen",
      notifications: "Benachrichtigungen",
      language: "Sprache",
      privacy: "Datenschutz",
      helpSupport: "Hilfe & Support",
      manage: "Verwalten",
      on: "AN",
      currentLanguageName: "Deutsch",
      logout: "Abmelden",
    },
    stages: {
      Applied: "Beworben",
      "In Review": "In Prüfung",
      Interview: "Interview",
      Decision: "Entscheidung",
    },
    jobRoles: {
      "Backend Intern": "Backend Praktikum",
      "Data Intern": "Data Praktikum",
      "Frontend Intern": "Frontend Praktikum",
      "Mobile Intern (Android)": "Mobile Praktikum (Android)",
      "iOS Intern": "iOS Praktikum",
    },
    jobTypes: {
      "Mandatory internship": "Pflichtpraktikum",
    },
  },
};

export type Dict = typeof dict.en;

// Module-level shared state so every component's useLanguage() call stays in
// sync — mirrors the listener pattern in practiq-store.ts's usePractiq().
const listeners = new Set<() => void>();
let language: Language = "en";
let hydrated = false;

function ensureHydrated() {
  if (!hydrated && typeof window !== "undefined") {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored === "en" || stored === "de") language = stored;
    hydrated = true;
  }
}

function setLanguage(next: Language) {
  ensureHydrated();
  language = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, language);
  }
  listeners.forEach((l) => l());
}

export function useLanguage() {
  const [, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ensureHydrated();
    setMounted(true);
    setTick((n) => n + 1);
    const l = () => setTick((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const toggle = () => setLanguage(language === "en" ? "de" : "en");

  // Always render the deterministic SSR default ("en") until mounted, so the
  // client's first paint matches the server and React doesn't throw a
  // hydration mismatch when localStorage has a different saved language.
  const current: Language = mounted ? language : "en";

  return { language: current, toggle, t: dict[current] };
}

export function translateRole(role: string, t: Dict): string {
  return (t.jobRoles as Record<string, string>)[role] ?? role;
}

export function translateType(type: string, t: Dict): string {
  return (t.jobTypes as Record<string, string>)[type] ?? type;
}

export function translateStage(stage: string, t: Dict): string {
  return (t.stages as Record<string, string>)[stage] ?? stage;
}
