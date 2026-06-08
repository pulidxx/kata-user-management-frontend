"use client";

import { useState } from "react";
import {
  FiX,
  FiUser,
  FiMail,
  FiLock,
  FiShield,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ROLE_LABELS, type Role } from "@/shared/types/common.types";
import type { User } from "@/features/users/types/user.types";
import { Spinner } from "@/shared/components/feedback/spinner";

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
    .matches(/[^A-Za-z0-9]/, "Debe incluir un símbolo especial"),
  role: Yup.string()
    .oneOf(["admin", "asesor", "consulta"])
    .required("El rol es requerido"),
});

const schemaEdit = Yup.object({
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
    .optional(),
  role: Yup.string()
    .oneOf(["admin", "asesor", "consulta"])
    .required("El rol es requerido"),
});

export function UserFormModal({
  user,
  onClose,
  onSubmit,
}: {
  user?: User;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    password?: string;
    role: Role;
  }) => Promise<void>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const isEdit = !!user;

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {isEdit ? "Editar usuario" : "Crear usuario"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-lg p-1 hover:bg-muted"
          >
            <FiX size={20} />
          </button>
        </div>

        <Formik
          initialValues={{
            name: user?.name ?? "",
            email: user?.email ?? "",
            password: "",
            role: user?.role ?? ("asesor" as Role),
          }}
          validationSchema={isEdit ? schemaEdit : schema}
          onSubmit={async (values, { setSubmitting }) => {
            setError(null);
            try {
              const data: {
                name: string;
                email: string;
                password?: string;
                role: Role;
              } = {
                name: values.name,
                email: values.email,
                role: values.role,
              };
              if (values.password || !isEdit) {
                data.password = values.password;
              }
              await onSubmit(data);
              onClose();
            } catch (err) {
              setError(
                err instanceof Error
                  ? err.message
                  : "Error al guardar el usuario.",
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, values }) => (
            <Form className="space-y-4" noValidate>
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
                  Correo electrónico
                </label>
                <div className="relative">
                  <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Field
                    id="email"
                    name="email"
                    type="email"
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
                  Contraseña{" "}
                  {isEdit && (
                    <span className="text-muted-foreground">
                      (opcional, dejar vacío para mantener)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
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
                  htmlFor="role"
                  className="mb-1 block text-sm font-medium"
                >
                  <FiShield className="inline mr-1" size={14} />
                  Rol
                </label>
                <Field
                  as="select"
                  id="role"
                  name="role"
                  className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                >
                  {(["admin", "asesor", "consulta"] as Role[]).map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="role"
                  component="p"
                  className="mt-1 text-xs text-destructive"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size={16} />
                      Guardando...
                    </>
                  ) : isEdit ? (
                    "Actualizar"
                  ) : (
                    "Crear usuario"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
