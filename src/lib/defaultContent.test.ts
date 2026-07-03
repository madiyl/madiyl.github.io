import { describe, expect, it } from "vitest";
import { mergeWithDefaultContent } from "@/lib/defaultContent";

describe("mergeWithDefaultContent", () => {
  it("maps legacy 油烟机 appliance data into 烟灶套装", () => {
    const data = mergeWithDefaultContent({
      appliances: [
        {
          id: "legacy-hood",
          category: "油烟机" as never,
          brandModel: "老板烟机旧数据",
          channel: "电商平台",
          productUrl: "https://example.com/hood",
          imageDir: "/uploads/renovation/product/hood",
          budget: 6500,
          actualPrice: 6299,
          status: "已购",
          note: "旧分类数据",
        },
      ],
    });

    expect(data.appliances).toHaveLength(1);
    expect(data.appliances[0]?.category).toBe("烟灶套装");
    expect(data.appliances[0]?.brandModel).toBe("老板烟机旧数据");
    expect(data.appliances[0]?.actualPrice).toBe(6299);
    expect(data.appliances[0]?.note).toBe("旧分类数据");
  });

  it("preserves people edits by stable id even when role text changes", () => {
    const data = mergeWithDefaultContent({
      people: [
        {
          id: "person-uni-designer",
          group: "Uni工作室",
          role: "主案设计",
          name: "摇摇乐 Pro",
          avatarPath: "/uploads/renovation/people/designer.jpg",
          note: "这条是刷新后也要保留的自定义信息。",
        },
      ],
    });

    const designer = data.people.find((item) => item.id === "person-uni-designer");

    expect(designer).toBeDefined();
    expect(designer?.group).toBe("Uni工作室");
    expect(designer?.role).toBe("主案设计");
    expect(designer?.name).toBe("摇摇乐 Pro");
    expect(designer?.avatarPath).toBe("/uploads/renovation/people/designer.jpg");
    expect(designer?.note).toBe("这条是刷新后也要保留的自定义信息。");
  });
});
