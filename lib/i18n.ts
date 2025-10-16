"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import ru from "../locales/ru.json";
import uz from "../locales/uz.json";


const getInitialLanguage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("lang") || "ru";
  }
  return "ru"; 
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      uz: { translation: uz },
    },
    lng: getInitialLanguage(),
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on("languageChanged", (lang) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("lang", lang);
  }
});

export default i18n;
