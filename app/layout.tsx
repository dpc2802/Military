import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "SGB MILITARY SHOP",
  description: "Artículos militares y equipo táctico en Colombia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${oswald.variable} font-body bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
