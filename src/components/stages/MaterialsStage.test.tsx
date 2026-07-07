import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MaterialsStage } from "@/components/stages/MaterialsStage";
import type { MaterialItem } from "@/types/renovation";

describe("MaterialsStage", () => {
  const constructionSelected: MaterialItem = {
    id: "construction-selected",
    category: "施工",
    quoteRole: "selected",
    vendor: "梵筑施工 · 半包",
    selection: "",
    budget: 120000,
    actualPrice: 128600,
    note: "水电和木作排期已经锁定，周末复核主材到场顺序。",
    pdfUrl: "/uploads/renovation/docs/construction-quote.pdf",
    excelUrl: "",
    tileQuotes: undefined,
    tileImagePath: undefined,
  };

  const constructionComparison: MaterialItem = {
    ...constructionSelected,
    id: "construction-comparison",
    quoteRole: "comparison",
    vendor: "匠作施工 · 对比",
    actualPrice: 131200,
    pdfUrl: "",
  };

  const tileItem: MaterialItem = {
    id: "tile-1",
    category: "瓷砖",
    vendor: "东鹏瓷砖",
    selection: "",
    budget: 18000,
    actualPrice: 19600,
    note: "客厅和厨房统一木纹砖，卫生间单独切换浅灰砖。",
    pdfUrl: "",
    excelUrl: "",
    tileQuotes: [
      { id: "quote-1", label: "客厅", selection: "木纹砖", price: 8477 },
      { id: "quote-2", label: "厨房", selection: "浅灰砖", price: 5320 },
    ],
    tileImagePath: "/uploads/renovation/materials/tiles-overview.jpg",
  };

  it("renders general browse cards as editorial purchasing summaries", () => {
    const html = renderToStaticMarkup(
      <MaterialsStage
        materials={[constructionSelected, constructionComparison]}
        editMode={false}
        onChange={() => {}}
      />,
    );

    expect(html).toContain("已选方案");
    expect(html).toContain("对比方案");
    expect(html).toContain("梵筑施工 · 半包");
    expect(html).toContain("预算");
    expect(html).toContain("实际价格");
    expect(html).toContain("报价资料");
  });

  it("keeps browse attachments available as archive-style entries", () => {
    const html = renderToStaticMarkup(
      <MaterialsStage materials={[constructionSelected]} editMode={false} onChange={() => {}} />,
    );

    expect(html).toContain("报价资料");
    expect(html).toContain("预览 PDF 附件");
  });

  it("shows tile browse cards with image preview and room-level quote summaries", () => {
    const html = renderToStaticMarkup(
      <MaterialsStage materials={[tileItem]} editMode={false} onChange={() => {}} />,
    );

    expect(html).toContain("点击放大");
    expect(html).toContain("客厅");
    expect(html).toContain("厨房");
    expect(html).toContain("东鹏瓷砖");
    expect(html).toContain("客厅和厨房统一木纹砖");
  });
});
