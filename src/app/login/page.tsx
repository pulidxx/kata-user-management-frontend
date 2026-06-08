"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FiMail,
  FiLock,
  FiArrowLeft,
  FiMoon,
  FiSun,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useAuth } from "@/core/auth/AuthContext";
import { useToast } from "@/shared/components/feedback/toast";
import { Spinner } from "@/shared/components/feedback/spinner";
import { ApiError } from "@/shared/types/api.types";
import { useTheme } from "@/shared/hooks/useTheme";

const schema = Yup.object({
  email: Yup.string()
    .email("Formato de correo inválido")
    .required("El correo es requerido"),
  password: Yup.string().required("La contraseña es requerida"),
});

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { notify } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <FiArrowLeft /> Volver al inicio
          </Link>
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-border p-2 hover:bg-muted"
            aria-label={
              theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"
            }
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <img
              src="/logo-banco-bogota.svg"
              alt="Banco de Bogotá"
              className="h-9 w-9"
            />
            <span className="text-lg font-bold">Portal BdB</span>
          </div>
          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresa tus credenciales para continuar.
          </p>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting }) => {
              setError(null);
              try {
                const user = await login(values.email, values.password);
                notify(`Bienvenido, ${user.name}`, "success");
                router.replace("/dashboard");
              } catch (err) {
                const msg =
                  err instanceof ApiError
                    ? err.message
                    : "Error al iniciar sesión.";
                setError(msg);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-6 space-y-4" noValidate>
                {error && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium"
                  >
                    Correo
                  </label>
                  <div className="relative">
                    <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="correo@bdb.com"
                      className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-1 text-xs text-destructive"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1 block text-sm font-medium"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-1 text-xs text-destructive"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-secondary disabled:opacity-60"
                >
                  {isSubmitting && <Spinner size={16} />}
                  Iniciar sesión
                </button>
              </Form>
            )}
          </Formik>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
