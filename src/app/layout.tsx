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
  title: "Portal BdB — Gestión de Clientes",
  description:
    "Plataforma del Banco de Bogotá para administrar clientes, controlar permisos por roles, búsquedas avanzadas, filtros y estados.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/logo-banco-bogota.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/logo-banco-bogota.svg",
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
