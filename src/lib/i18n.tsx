"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "fr";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const LangContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  toggle: () => {},
});

const STORAGE_KEY = "jt_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) as Lang | null;
      if (stored === "en" || stored === "fr") setLangState(stored);
      else if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("fr"))
        setLangState("fr");
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    } catch {}
  };

  const toggle = () => setLang(lang === "en" ? "fr" : "en");

  return (
    <LangContext.Provider value={{ lang, setLang, toggle }}>{children}</LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

/** Inline translation component — pick string by current language. */
export function T({ en, fr }: { en: ReactNode; fr: ReactNode }) {
  const { lang } = useLang();
  return <>{lang === "fr" ? fr : en}</>;
}

/** Hook returning a t(en, fr) helper for use inside client components. */
export function useT() {
  const { lang } = useLang();
  return <V,>(en: V, fr: V): V => (lang === "fr" ? fr : en);
}
