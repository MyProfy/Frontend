import type { Metadata } from "next";
import ThemeProvider from "@/contexts/ThemeContext";
import { Providers } from "./providers"; 
import "./globals.css";
import 'flag-icons/css/flag-icons.min.css';
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "myprofy.uz - Платформа, где специалисты и клиенты находят друг друга.",
  description: "MYPROFY.uz - Платформа, где специалисты и клиенты находят друг друга.",
  icons: {
    icon: "/myProfy.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Providers> 
          <Toaster position="top-right" richColors closeButton />
            <main>{children}</main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
