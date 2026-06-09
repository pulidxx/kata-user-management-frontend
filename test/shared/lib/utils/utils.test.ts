import { describe, expect, it, vi } from "vitest";
import { cn } from "@/shared/lib/utils/utils";
import { formatDate } from "@/features/clients/utils/export";

describe("cn", () => {
  it("combina y resuelve clases de Tailwind en conflicto", () => {
    expect(cn("p-2", "p-4", "text-sm")).toBe("p-4 text-sm");
  });

  it("ignora valores falsy y concatena clases válidas", () => {
    expect(cn("bg-red-500", false, null, undefined, "text-white")).toBe(
      "bg-red-500 text-white",
    );
  });
});

describe("formatDate", () => {
  it("formatea la fecha usando es-CO", () => {
    const toLocaleDateStringSpy = vi
      .spyOn(Date.prototype, "toLocaleDateString")
      .mockReturnValue("8 jun 2026");

    expect(formatDate("2026-06-08T00:00:00.000Z")).toBe("8 jun 2026");
    expect(toLocaleDateStringSpy).toHaveBeenCalledWith("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  });
});