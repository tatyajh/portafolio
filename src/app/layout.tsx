import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Caveat, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Las tres tipografías del diseño (Inter para el cuerpo, Playfair
// Display para títulos, Caveat para las notas manuscritas) se cargaban
// con un @import de Google Fonts dentro del CSS. Eso funciona, pero es
// una petición externa que bloquea el render: si tarda o el navegador
// la bloquea, el texto cae a las genéricas `serif`/`cursive` — que en
// Android son tipografías decentes y en Windows son Times New Roman y
// Comic Sans. De ahí que el sitio se viera distinto en escritorio.
//
// Con next/font quedan autohospedadas junto al sitio: mismo resultado
// en todos los dispositivos, sin petición a terceros y sin salto de
// fuente al cargar.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portafolio - Tatiana Alejandra",
  description: "Portafolio interactivo de diseño de modas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${playfair.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
