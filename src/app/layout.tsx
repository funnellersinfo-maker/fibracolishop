import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fibra Coli | Bienestar Digestivo Natural para Mujeres en Colombia",
  description: "Suplemento de fibra natural que combate el estreñimiento, la inflamación abdominal y los gases. Pago contra entrega en toda Colombia. Más de 12,000 clientas satisfechas.",
  keywords: ["Fibra Coli", "fibra natural", "estreñimiento", "inflamación abdominal", "gases", "digestión", "suplemento Colombia", "bienestar digestivo"],
  authors: [{ name: "Fibra Coli Colombia" }],
  openGraph: {
    title: "Fibra Coli | Bienestar Digestivo Natural",
    description: "Recupera tu bienestar digestivo de forma natural. Pago contra entrega en toda Colombia.",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
