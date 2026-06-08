"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useAuth } from "@/core/auth/AuthContext";
import { useToast } from "@/shared/components/feedback/toast";
import { Spinner } from "@/shared/components/feedback/spinner";
import { ApiError } from "@/shared/types/api.types";

const schema = Yup.object({
  name: Yup.string()
    .min(3, "Mínimo 3 caracteres")
    .required("El nombre es requerido"),
  email: Yup.string()
    .email("Formato de correo inválido")
    .required("El correo es requerido"),
  password: Yup.string()
    .min(8, "Mínimo 8 caracteres")
    .matches(/[A-Z]/, "Debe incluir una mayúscula")
    .matches(/[0-9]/, "Debe incluir un número")
    .matches(/[^A-Za-z0-9]/, "Debe incluir un símbolo especial")
    .required("La contraseña es requerida"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
});

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const { notify } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <FiArrowLeft /> Volver al inicio
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-bold">Crear cuenta</h1>

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting }) => {
              setError(null);
              try {
                await register({
                  name: values.name,
                  email: values.email,
                  password: values.password,
                });
                notify("Registro realizado exitosamente", "success");
                router.replace("/login");
              } catch (err) {
                const msg =
                  err instanceof ApiError
                    ? err.message
                    : "Error al registrarse.";
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
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium"
                  >
                    Nombre completo
                  </label>
                  <div className="relative">
                    <FiUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Juan Pérez"
                      className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="mt-1 text-xs text-destructive"
                  />
                </div>

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
                      autoComplete="new-password"
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

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1 block text-sm font-medium"
                  >
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      aria-label={
                        showConfirmPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
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
                  Registrarse
                </button>
              </Form>
            )}
          </Formik>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
