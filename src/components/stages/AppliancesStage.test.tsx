import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AppliancesStage } from "@/components/stages/AppliancesStage";
import type { ApplianceItem } from "@/types/renovation";

describe("AppliancesStage", () => {
  const builtInAppliance: ApplianceItem = {
    id: "appliance-tv",
    category: "电视",
    brandModel: "Sony X90L 85 寸",
    channel: "电商平台",
    productUrl: "https://www.jd.com/product/123.html",
    imageDir: "",
    budget: 12000,
    actualPrice: 10999,
    status: "加购",
    note: "先锁尺寸和安装方式，再对比国补和延保。",
  };

  const customAppliance: ApplianceItem = {
    id: "appliance-projector",
    category: "投影仪",
    brandModel: "极米 Horizon Ultra",
    channel: "线下门店",
    productUrl: "",
    imageDir: "",
    budget: 9999,
    actualPrice: 9299,
    status: "选品",
    note: "重点看亮度、投射距离和白天遮光方案。",
  };

  it("renders built-in appliances as balanced purchasing cards in browse mode", () => {
    const html = renderToStaticMarkup(
      <AppliancesStage appliances={[builtInAppliance]} editMode={false} onChange={() => {}} />,
    );

    expect(html).toContain("Sony X90L 85 寸");
    expect(html).toContain("加购");
    expect(html).toContain("预算");
    expect(html).toContain("实付");
    expect(html).toContain("差额");
    expect(html).toContain("jd.com");
    expect(html).toContain("暂未添加预览图");
  });

  it("renders custom appliances in the dedicated section with the same browse language", () => {
    const html = renderToStaticMarkup(
      <AppliancesStage
        appliances={[builtInAppliance, customAppliance]}
        editMode={false}
        onChange={() => {}}
      />,
    );

    expect(html).toContain("其它电器");
    expect(html).toContain("投影仪");
    expect(html).toContain("极米 Horizon Ultra");
    expect(html).toContain("差额");
  });
});
