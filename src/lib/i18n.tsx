import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fr } from "../locales/fr";
import { de } from "../locales/de";
import { it } from "../locales/it";
import { es } from "../locales/es";

export const LANGS = ["en", "fr", "de", "it", "es"] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_LABELS: Record<Lang, string> = {
  en: "EN",
  fr: "FR",
  de: "DE",
  it: "IT",
  es: "ES",
};

const DICTS: Record<Lang, Record<string, string>> = { en: {}, fr, de, it, es };

const STORAGE_KEY = "edsf.lang";

function isLang(value: string | null | undefined): value is Lang {
  return !!value && (LANGS as readonly string[]).includes(value);
}

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (english: string) => string;
};

const I18nContext = createContext<I18nValue>({
  lang: "en",
  setLang: () => {},
  t: (english) => english,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    let next: Lang | null = null;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLang(stored)) next = stored;
    } catch {
      next = null;
    }
    if (!next) {
      const browser = (window.navigator.language || "en").slice(0, 2).toLowerCase();
      if (isLang(browser)) next = browser;
    }
    if (next && next !== "en") setLangState(next);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
    if (typeof document !== "undefined") document.documentElement.lang = next;
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<I18nValue>(() => {
    const dict = DICTS[lang];
    return {
      lang,
      setLang,
      t: (english: string) => dict[english] ?? english,
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export function useT() {
  return useContext(I18nContext).t;
}
