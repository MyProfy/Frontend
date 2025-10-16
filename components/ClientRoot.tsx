// components/ClientRoot.tsx
"use client";

import React from "react";
import  I18nProvider  from "@/contexts/I18nProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
// import "../../frontend/app/globals.css";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </I18nProvider>
  );
}