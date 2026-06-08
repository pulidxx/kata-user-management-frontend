"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FiX } from "react-icons/fi";
import {
  CLIENT_STATUSES,
  DOCUMENT_TYPES,
  type Client,
} from "@/features/clients/types/client.types";
import { Spinner } from "@/shared/components/feedback/spinner";

const schema = Yup.object({
  fullName: Yup.string().required("El nombre es obligatorio"),
  documentType: Yup.string().required("Requerido"),
  documentNumber: Yup.string()
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .required("El documento es obligatorio"),
  email: Yup.string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  phone: Yup.string()
    .min(10, "Mínimo 10 caracteres")
    .required("El teléfono es obligatorio"),
  city: Yup.string().required("La ciudad es obligatoria"),
  address: Yup.string().required("La dirección es obligatoria"),
  birthDate: Yup.date()
    .max(new Date(), "La fecha no puede ser futura")
    .required("La fecha de nacimiento es obligatoria"),
  status: Yup.string().required("El estado es obligatorio"),
});

type FormValues = Omit<Client, "id" | "ownerId" | "createdAt" | "updatedAt">;

export function ClientFormModal({
  open,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  initial?: Client;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
}) {
  if (!open) return null;

  const initialValues: FormValues = {
    fullName: initial?.fullName ?? "",
    documentType: initial?.documentType ?? "CC",
    documentNumber: initial?.documentNumber ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    city: initial?.city ?? "",
    address: initial?.address ?? "",
    birthDate: initial?.birthDate ?? "",
    status: initial?.status ?? "Contactado",
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="client-form-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="client-form-title" className="text-lg font-bold">
            {initial ? "Editar cliente" : "Nuevo cliente"}
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
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await onSubmit(values);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="grid gap-4 sm:grid-cols-2" noValidate>
              <div className="sm:col-span-2">
                <label
                  htmlFor="fullName"
                  className="mb-1 block text-sm font-medium"
                >
                  Nombre completo
                </label>
                <Field id="fullName" name="fullName" className={inputClass} />
                <ErrorMessage
                  name="fullName"
                  component="p"
                  className="mt-1 text-xs text-destructive"
                />
              </div>

              <div>
                <label
                  htmlFor="documentType"
                  className="mb-1 block text-sm font-medium"
                >
                  Tipo de documento
                </label>
                <Field
                  as="select"
                  id="documentType"
                  name="documentType"
                  className={inputClass}
                >
                  {DOCUMENT_TYPES.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="documentType"
                  component="p"
                  className="mt-1 text-xs text-destructive"
                />
              </div>

              <div>
                <label
                  htmlFor="documentNumber"
                  className="mb-1 block text-sm font-medium"
                >
                  Número de documento
                </label>
                <Field
                  id="documentNumber"
                  name="documentNumber"
                  inputMode="numeric"
                  className={inputClass}
                />
                <ErrorMessage
                  name="documentNumber"
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
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className={inputClass}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-xs text-destructive"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-1 block text-sm font-medium"
                >
                  Teléfono
                </label>
                <Field id="phone" name="phone" className={inputClass} />
                <ErrorMessage
                  name="phone"
                  component="p"
                  className="mt-1 text-xs text-destructive"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-1 block text-sm font-medium"
                >
                  Ciudad
                </label>
                <Field id="city" name="city" className={inputClass} />
                <ErrorMessage
                  name="city"
                  component="p"
                  className="mt-1 text-xs text-destructive"
                />
              </div>

              <div>
                <label
                  htmlFor="birthDate"
                  className="mb-1 block text-sm font-medium"
                >
                  Fecha de nacimiento
                </label>
                <Field
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  className={inputClass}
                />
                <ErrorMessage
                  name="birthDate"
                  component="p"
                  className="mt-1 text-xs text-destructive"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-1 block text-sm font-medium"
                >
                  Dirección
                </label>
                <Field id="address" name="address" className={inputClass} />
                <ErrorMessage
                  name="address"
                  component="p"
                  className="mt-1 text-xs text-destructive"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="status"
                  className="mb-1 block text-sm font-medium"
                >
                  Estado
                </label>
                <Field
                  as="select"
                  id="status"
                  name="status"
                  className={inputClass}
                >
                  {CLIENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="status"
                  component="p"
                  className="mt-1 text-xs text-destructive"
                />
              </div>

              <div className="sm:col-span-2 mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-secondary disabled:opacity-60"
                >
                  {isSubmitting && <Spinner size={16} />}
                  {initial ? "Guardar cambios" : "Crear cliente"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
