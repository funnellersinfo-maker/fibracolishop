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

/* ═══════════════════════════════════════════════════════════════════
   META PIXEL — Instalación profesional
   
   ─── PIXEL ID ───
   ▸ Actual: 1289231602942427
   ▸ Para cambiar: Modifica el valor en las 3 ubicaciones marcadas abajo
   
   ─── EVENTOS QUE DISPARA ESTE SCRIPT ───
   ▸ PageView — Se dispara inmediatamente al cargar (baseline)
   
   ─── EVENTOS ADICIONALES (disparados desde meta-tracking.ts) ───
   ▸ ViewContent — Al cargar la landing (componente MetaTracker)
   ▸ Lead — Al hacer clic en cualquier CTA
   
   ─── CAPI ───
   ▸ Los eventos también se envían server-side via /api/meta-conversions
   ▸ Con el mismo event_id para deduplicación automática
   
   ─── PRUEBA ───
   ▸ Ejecuta window.__metaTest() en la consola del navegador
   ═══════════════════════════════════════════════════════════════════ */

const META_PIXEL_ID = '1289231602942427' // ← PIXEL ID: Cambiar aquí (ubicación 1/3)

const metaPixelScript = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* ─── Meta Pixel Base Code ───
            PIXEL ID ubicación 2/3 — Cambiar también aquí si modificas el Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: metaPixelScript,
          }}
        />
        {/* Noscript fallback for PageView — PIXEL ID ubicación 3/3 */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Base Code */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
