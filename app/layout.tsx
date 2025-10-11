import type { Metadata } from "next";
import ThemeProvider from "@/contexts/ThemeContext";
import "./globals.css";
import '@/app/globals.css';
import 'flag-icons/css/flag-icons.min.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <ThemeProvider>
            <main>{children}</main>
        </ThemeProvider>
        </body>
        </html>
    );
}
