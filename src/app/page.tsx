"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiMoon,
  FiSun,
  FiUsers,
  FiShield,
  FiFilter,
  FiDownload,
  FiLock,
  FiChevronRight,
  FiTrendingUp,
  FiPieChart,
} from "react-icons/fi";
import { useTheme } from "@/shared/hooks/useTheme";

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: FiUsers,
      title: "Directorio de Clientes",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      icon: FiShield,
      title: "Perfiles y Permisos",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      icon: FiTrendingUp,
      title: "Seguimiento en Tiempo Real",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      icon: FiDownload,
      title: "Exportación Normativa",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];

  const stats = [
    { value: "99.9%", label: "Disponibilidad" },
    { value: "500+", label: "Usuarios Activos" },
    { value: "24/7", label: "Soporte" },
  ];

  const particles = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    }));
  }, [mounted]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-white p-1 shadow-sm">
              <img
                src="/logo-banco-bogota.svg"
                alt="Banco de Bogotá"
                className="h-7 w-7"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none tracking-tight">
                Portal BdB
              </span>
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-1">
                Gestión Comercial
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? (
                <FiSun className="h-4 w-4" />
              ) : (
                <FiMoon className="h-4 w-4" />
              )}
            </button>
            <div className="h-4 w-px bg-border/60"></div>
            <Link
              href="/login"
              className="group inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
              <FiLock className="mr-2 h-4 w-4 opacity-70" />
              Ingresar al portal
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        >
          <div
            className="absolute inset-0 -z-20"
            style={{
              transform: mounted ? `translateY(${scrollY * 0.5}px)` : "none",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background"></div>
          </div>

          <div
            className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"
            style={{
              transform: mounted
                ? `translate(${scrollY * 0.3}px, ${scrollY * 0.2}px)`
                : "none",
            }}
          ></div>
          <div
            className="absolute top-1/3 -left-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -z-10"
            style={{
              transform: mounted
                ? `translate(${-scrollY * 0.2}px, ${scrollY * 0.15}px)`
                : "none",
            }}
          ></div>

          <div
            className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-primary/20 rounded-lg rotate-12 -z-10"
            style={{
              transform: mounted
                ? `translate(${scrollY * 0.15}px, ${scrollY * 0.1}px) rotate(${12 + scrollY * 0.05}deg)`
                : "rotate(12deg)",
            }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/4 w-24 h-24 border-2 border-blue-500/20 rounded-full -z-10"
            style={{
              transform: mounted
                ? `translate(${-scrollY * 0.1}px, ${scrollY * 0.2}px)`
                : "none",
            }}
          ></div>

          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-primary/30 rounded-full -z-10 animate-float"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                transform: mounted ? `translateY(${scrollY * 0.05}px)` : "none",
              }}
            ></div>
          ))}

          <div
            className="absolute inset-0 -z-15 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, #80808012 1px, transparent 1px), linear-gradient(to bottom, #80808012 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              transform: mounted ? `translateY(${scrollY * 0.1}px)` : "none",
            }}
          ></div>

          <div
            className="container mx-auto max-w-screen-xl px-6 text-center relative z-10"
            style={{
              transform: mounted ? `translateY(${scrollY * 0.3}px)` : "none",
              opacity: mounted ? Math.max(0, 1 - scrollY / 500) : 1,
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary mb-6">
              <FiPieChart className="h-4 w-4" />
              Sistema de Gestión Comercial
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Lorem ipsum dolor{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">sit amet</span>
                <span className="absolute -inset-1 bg-primary/10 blur-lg"></span>
              </span>{" "}
              consectetur
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-14 w-full items-center justify-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
              >
                Iniciar sesión con credenciales
                <FiChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            <div className="mt-20 flex justify-center">
              <div className="flex flex-col items-center gap-2 animate-bounce">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Descubre más
                </div>
                <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
                  <div className="w-1 h-2 bg-muted-foreground/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-24 md:py-32 bg-muted/20">
          <div className="container mx-auto max-w-screen-xl px-6">
            <div className="mb-16 max-w-2xl">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
                Módulos del Sistema
              </h2>
              <h3 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
                Herramientas operativas
              </h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Plataforma integral diseñada para optimizar la gestión comercial
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-8 shadow-sm transition-all hover:border-primary/50 hover:shadow-xl hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>

                  <div className="relative">
                    <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h4 className="mb-3 text-lg font-bold">{feature.title}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-24 md:py-32 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-10"
            style={{
              transform: mounted
                ? `translateY(${(scrollY - 1000) * 0.3}px)`
                : "none",
            }}
          ></div>

          <div className="container mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="mt-10">
              <Link
                href="/login"
                className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-10 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
              >
                Acceder ahora
                <FiChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <div className="flex items-center gap-3">
            <img
              src="/logo-banco-bogota.svg"
              alt="Logo"
              className="h-5 w-5 grayscale opacity-50"
            />
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Banco de Bogotá. Uso exclusivo
              interno.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Mesa de Ayuda
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Políticas de Seguridad
            </Link>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
