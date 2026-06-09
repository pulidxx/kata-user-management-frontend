"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiMoon,
  FiSun,
  FiUsers,
  FiShield,
  FiLock,
  FiChevronRight,
  FiPieChart,
  FiUserPlus,
  FiSearch,
  FiFileText,
  FiActivity,
  FiDatabase,
  FiZap,
  FiCheckCircle,
  FiEye,
  FiPenTool,
} from "react-icons/fi";
import { useTheme } from "@/shared/hooks/useTheme";

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    toggleTheme();

    requestAnimationFrame(() => {
      const isDark = document.documentElement.classList.contains("dark");
      const shouldBeDark = nextTheme === "dark";

      if (isDark !== shouldBeDark) {
        document.documentElement.classList.toggle("dark", shouldBeDark);
        localStorage.setItem("theme", nextTheme);
      }
    });
  };

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { value: "24/7", label: "Disponible", icon: FiActivity },
    { value: "100%", label: "Centralizado", icon: FiDatabase },
    { value: "En línea", label: "Tiempo real", icon: FiZap },
  ];

  const particles = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 15 + 10,
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
                Gestión de Clientes
              </span>
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-1">
                Banco de Bogotá
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleThemeToggle}
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

          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-primary/20 -z-10 animate-float"
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

          <div className="container mx-auto max-w-screen-xl px-6 relative z-10">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-12 mb-8">
                <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary backdrop-blur-sm">
                  <FiPieChart className="h-4 w-4" />
                  <span>Plataforma Corporativa</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  <span className="text-xs">v1.0</span>
                </div>
              </div>

              <div className="lg:col-span-8">
                <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl md:text-8xl leading-[1.1]">
                  Gestión integral de{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-primary">clientes</span>
                    <span className="absolute -inset-2 bg-primary/10 blur-xl"></span>
                  </span>
                </h1>
              </div>

              <div className="lg:col-span-4">
                <div className="flex flex-col gap-4">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-4 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-4 transition-all hover:border-primary/30 hover:bg-card/60"
                    >
                      <div className="rounded-xl bg-primary/10 p-2.5 text-primary group-hover:scale-110 transition-transform">
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 mt-6">
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Registre, consulte y administre su base de clientes de manera
                  centralizada. Una solución diseñada para optimizar la gestión
                  comercial del Banco de Bogotá con rapidez y seguridad.
                </p>
              </div>

              <div className="lg:col-span-5 mt-6">
                <Link
                  href="/login"
                  className="group inline-flex h-14 w-full md:w-auto items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
                >
                  Comenzar a gestionar
                  <FiChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <div className="w-0.5 h-12 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0"></div>
            </div>
          </div>
        </section>

        <section className="relative py-24 md:py-32">
          <div className="container mx-auto max-w-screen-xl px-6">
            <div className="max-w-2xl mb-16">
              <div className="flex items-center gap-2 text-primary mb-4">
                <div className="h-px w-8 bg-primary/50"></div>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Core Features
                </span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
                Capacidades del sistema
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Todo lo que necesita para administrar sus clientes en una plataforma completa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
              <div className="md:col-span-2 md:row-span-2 group relative rounded-3xl border border-border/40 bg-gradient-to-br from-primary/5 via-background to-background p-8 transition-all hover:border-primary/30 hover:shadow-2xl">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative h-full flex flex-col">
                  <div className="mb-8 rounded-2xl bg-primary/10 p-4 text-primary w-fit group-hover:scale-110 transition-transform">
                    <FiUserPlus className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Registro de Clientes</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ingrese y almacene información completa de nuevos clientes: datos personales, 
                    contacto, dirección y documentos de identificación.
                  </p>
                  <div className="mt-6 flex items-center text-sm text-primary/70 group-hover:text-primary transition-colors">
                    <span>Gestión optimizada</span>
                    <FiChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="group relative rounded-3xl border border-border/40 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
                <div className="rounded-xl bg-purple-500/10 p-3 text-purple-500 w-fit mb-4">
                  <FiSearch className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">Consulta Avanzada</h3>
                <p className="text-sm text-muted-foreground">
                  Localice clientes por nombre, documento, teléfono o correo.
                </p>
              </div>

              <div className="group relative rounded-3xl border border-border/40 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
                <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-500 w-fit mb-4">
                  <FiUsers className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">Directorio Centralizado</h3>
                <p className="text-sm text-muted-foreground">
                  Visualice todo su portafolio de clientes en una sola vista.
                </p>
              </div>

              <div className="md:col-span-1 group relative rounded-3xl border border-border/40 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-xl">
                <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500 w-fit mb-4">
                  <FiFileText className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">Historial y Seguimiento</h3>
                <p className="text-sm text-muted-foreground">
                  Acceda al detalle completo de cada cliente: fecha de registro, 
                  interacciones y notas comerciales.
                </p>
              </div>

              <div className="md:col-span-2 group relative rounded-3xl border border-border/40 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent p-6 transition-all hover:border-primary/30 hover:shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      <FiEye className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Interfaz Intuitiva y Rápida</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Diseñada para que usted pueda registrar y consultar clientes en segundos, 
                      sin complicaciones técnicas. Enfoque en lo que realmente importa: su gestión comercial.
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1">
                        <FiCheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-muted-foreground">Sin curva de aprendizaje</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiCheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-muted-foreground">Resultados inmediatos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-background to-background -z-10"></div>
          
          <div className="container mx-auto max-w-screen-xl px-6">
            <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-border/40 bg-background/60 backdrop-blur-md">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary w-fit mb-6">
                  <FiShield className="h-3 w-3" />
                  <span>Certificación Bancaria</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
                  ¿Listo para optimizar su gestión comercial?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Acceda al sistema y comience a registrar y consultar clientes de
                  manera rápida, segura y centralizada.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/login"
                    className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
                  >
                    Acceder ahora
                    <FiChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-primary/5 to-primary/3 p-8 md:p-12 flex items-center justify-center min-h-[300px]">
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  <div className="rounded-2xl bg-background/80 backdrop-blur-md border border-border/40 p-4 text-center shadow-lg transition-all hover:scale-105">
                    <div className="text-3xl font-bold text-primary">+50%</div>
                    <div className="text-xs text-muted-foreground mt-1">Eficiencia</div>
                    <div className="mt-2 h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-primary/40 rounded-full"></div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-background/80 backdrop-blur-md border border-border/40 p-4 text-center shadow-lg transition-all hover:scale-105">
                    <div className="text-3xl font-bold text-primary">24/7</div>
                    <div className="text-xs text-muted-foreground mt-1">Disponibilidad</div>
                    <div className="mt-2 h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-primary/40 rounded-full"></div>
                    </div>
                  </div>
                  <div className="col-span-2 rounded-2xl bg-background/80 backdrop-blur-md border border-border/40 p-4 text-center shadow-lg transition-all hover:scale-105">
                    <div className="flex items-center justify-center gap-2">
                      <FiPenTool className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Registro en segundos</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Flujo optimizado</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-muted/20 mt-16">
        <div className="container mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <div className="flex items-center gap-3">
            <img
              src="/logo-banco-bogota.svg"
              alt="Logo"
              className="h-5 w-5 grayscale opacity-50"
            />
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Banco de Bogotá - Gestión de Clientes
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Soporte
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Políticas de Seguridad
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              API Status
            </Link>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          75% {
            transform: translateY(10px) translateX(-5px);
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}