import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MaterialsStage } from "@/components/stages/MaterialsStage";
import type { MaterialItem } from "@/types/renovation";

describe("MaterialsStage", () => {
  it("shows a clickable preview entry for tile images in browse mode", () => {
    const tileItem: MaterialItem = {
      id: "tile-1",
      category: "瓷砖",
      vendor: "测试瓷砖商家",
      selection: "",
      budget: 18000,
      actualPrice: 19600,
      note: "",
      pdfUrl: "",
      tileQuotes: [
        { id: "quote-1", label: "客厅", selection: "木纹砖", price: 8477 },
      ],
      tileImagePath: "/uploads/renovation/materials/tiles-overview.jpg",
    };

    const html = renderToStaticMarkup(
      <MaterialsStage materials={[tileItem]} editMode={false} onChange={() => {}} />,
    );

    expect(html).toContain("点击放大");
  });
});
