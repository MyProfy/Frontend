"use client";

import React from "react";
import I18nProvider from "@/contexts/I18nProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function ClientRoot({ children }: { children: React.ReactNode }) {

  return (
      <I18nProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </I18nProvider>
  );
}
