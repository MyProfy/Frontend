import type { Metadata } from "next";
import ThemeProvider from "@/contexts/ThemeContext";
import { Providers } from "./providers"; 
import "./globals.css";
import 'flag-icons/css/flag-icons.min.css';

export const metadata: Metadata = {
  title: "MyProfy",
  description: "Platform for services and vacancies",
  icons: {
    icon: "/MyProfyLogo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Providers> 
            <main>{children}</main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
