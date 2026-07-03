import { describe, expect, it } from "vitest";
import { getLinkDisplayPrefix } from "@/utils/url";

describe("url helpers", () => {
  it("returns hostname without www prefix", () => {
    expect(getLinkDisplayPrefix("https://www.jd.com/product/123")).toBe("jd.com");
  });

  it("returns hostname for nested subdomains", () => {
    expect(getLinkDisplayPrefix("https://item.taobao.com/item.htm?id=1")).toBe(
      "item.taobao.com",
    );
  });

  it("falls back to generic label for invalid urls", () => {
    expect(getLinkDisplayPrefix("not-a-valid-url")).toBe("查看商品");
  });
});
