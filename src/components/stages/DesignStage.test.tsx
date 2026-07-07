import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DesignStage } from "@/components/stages/DesignStage";
import type { RenovationPageData } from "@/types/renovation";

describe("DesignStage", () => {
  it("renders cover-card browse cues and preview entry text", () => {
    const design: RenovationPageData["design"] = {
      floorPlans: [
        {
          id: "design-floor-1",
          group: "floorPlans",
          title: "客餐厅平面方案",
          note: "先看动线、收纳和岛台关系。",
          imagePath: "/uploads/renovation/design/floor-01.jpg",
        },
      ],
      elevations: [],
      renders: [],
    };

    const html = renderToStaticMarkup(
      <DesignStage design={design} editMode={false} onChange={() => {}} />,
    );

    expect(html).toContain("Layout Study");
    expect(html).toContain("点击进入大图预览");
    expect(html).toContain("客餐厅平面方案");
    expect(html).toContain("平面设计");
  });
});
