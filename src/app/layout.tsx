import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/shared/components/layout/providers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Portal BdB — Gestión de Clientes",
    template: "%s | Portal BdB",
  },
  description:
    "Plataforma del Banco de Bogotá para administrar clientes, controlar permisos por roles, búsquedas avanzadas, filtros y estados.",
  generator: "Next.js",
  applicationName: "Portal BdB",
  authors: [{ name: "Banco de Bogotá" }],
  keywords: [
    "CRM",
    "Banco de Bogotá",
    "gestión de clientes",
    "administración",
    "portal interno",
  ],
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/logo-banco-bogota.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/logo-banco-bogota.svg",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Portal BdB",
    title: "Portal BdB — Gestión de Clientes",
    description:
      "Plataforma del Banco de Bogotá para administrar clientes, controlar permisos por roles, búsquedas avanzadas, filtros y estados.",
    images: [
      {
        url: "/logo-banco-bogota.svg",
        width: 1200,
        height: 630,
        alt: "Portal BdB - Banco de Bogotá",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Portal BdB — Gestión de Clientes",
    description: "Plataforma del Banco de Bogotá para administrar clientes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
