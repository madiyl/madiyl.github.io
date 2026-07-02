import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate, slugify } from "@/utils/format";

describe("format helpers", () => {
  it("formats CNY without decimals", () => {
    expect(formatCurrency(10999)).toMatch(/10[,，]999/);
  });

  it("formats date in zh-CN style", () => {
    expect(formatDate("2026-07-02T00:00:00.000Z")).toContain("2026");
  });

  it("slugifies labels", () => {
    expect(slugify("Design Stage")).toBe("design-stage");
  });
});
