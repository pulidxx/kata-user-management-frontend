import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/features/clients/components/status-badge";

describe("StatusBadge", () => {
  it("renderiza el estado con el texto y estilos esperados", () => {
    render(<StatusBadge status="Activo" />);

    const badge = screen.getByText("Activo");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-green-500/15");
    expect(badge).toHaveClass("text-green-600");
  });
});