import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { exportClientsToCSV } from "@/features/clients/utils/export";
import { apiExportClients } from "@/features/clients/services/clientService";

vi.mock("@/features/clients/services/clientService", () => ({
  apiExportClients: vi.fn(),
}));

describe("exportClientsToCSV", () => {
  const mockedApiExportClients = vi.mocked(apiExportClients);
  const blob = new Blob(["id,name\n1,Cliente"], { type: "text/csv" });

  let anchor: HTMLAnchorElement;
  const originalCreateElement = document.createElement.bind(document);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-08T12:00:00.000Z"));
    mockedApiExportClients.mockResolvedValue(blob);

    anchor = originalCreateElement("a");
    vi.spyOn(anchor, "click").mockImplementation(() => undefined);
    vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
      if (tagName === "a") {
        return anchor;
      }

      return originalCreateElement(tagName);
    });
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn().mockReturnValue("blob:clientes"),
      revokeObjectURL: vi.fn(),
    } as unknown as typeof URL);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("solicita la exportación, descarga el CSV y libera la URL", async () => {
    await exportClientsToCSV({ status: "Activo", search: "bogota" });

    expect(mockedApiExportClients).toHaveBeenCalledWith({
      status: "Activo",
      search: "bogota",
    });
    expect(anchor.download).toBe("clientes_2026-06-08.csv");
    expect(anchor.click).toHaveBeenCalledTimes(1);
    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:clientes");
  });
});