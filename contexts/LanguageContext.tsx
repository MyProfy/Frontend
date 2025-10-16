// contexts/LanguageContext.tsx
"use client";

import React, { createContext, useState, useCallback, useEffect } from "react";
import i18n from "@/lib/i18n";

export const LanguageContext = createContext<{
    language: string;
    setLanguage: (lang: string) => void;
}>({
    language: "ru",
    setLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguageState] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("language") || "ru";
        }
        return "ru";
    });

    const setLanguage = useCallback((lang: string) => {
        setLanguageState(lang);
        i18n.changeLanguage(lang); 
        if (typeof window !== "undefined") {
            localStorage.setItem("language", lang);
        }
    }, []);

    useEffect(() => {
        i18n.changeLanguage(language); 
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => React.useContext(LanguageContext);