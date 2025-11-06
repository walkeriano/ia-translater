import { Geist, Geist_Mono, Iceberg } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const icebergSans = Iceberg({
  variable: "--font-iceberg-sans",
  subsets: ["latin"],
  weight:"400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI - TRANSLATE",
  description: "AI - TRANSLATE",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${icebergSans.variable} ${geistMono.variable}`}>
        <main>
        {children}
        </main>
        <footer>
          Ai Translator
        </footer>
      </body>
    </html>
  );
}
