import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ConstructionStage } from "@/components/stages/ConstructionStage";
import type { ConstructionRoadmapStage } from "@/types/renovation";

describe("ConstructionStage", () => {
  it("renders editable roadmap fields and grouped task cards", () => {
    const construction: ConstructionRoadmapStage[] = [
      {
        id: "prep",
        label: "前期工程",
        schedule: "2026-08",
        estimate: "8天",
        tasks: [
          {
            id: "task-1",
            title: "成品保护",
            status: "已完成",
            schedule: "2026-08",
            progress: "已完成保护。",
            detail: "现场防护完成。",
            risk: "",
          },
          {
            id: "task-2",
            title: "拆除交底",
            status: "进行中",
            schedule: "2026-08",
            progress: "拆除交底中。",
            detail: "待确认拆改边界。",
            risk: "",
          },
        ],
      },
      {
        id: "water",
        label: "水电阶段",
        schedule: "2026-09",
        estimate: "15天",
        tasks: [
          {
            id: "task-3",
            title: "水电交底",
            status: "未开始",
            schedule: "2026-09",
            progress: "",
            detail: "",
            risk: "",
          },
        ],
      },
      {
        id: "tile",
        label: "泥工阶段",
        schedule: "2026-10",
        estimate: "29天",
        tasks: [],
      },
      {
        id: "wood",
        label: "木工阶段",
        schedule: "2026-10",
        estimate: "10天",
        tasks: [],
      },
      {
        id: "paint",
        label: "腻子墙漆",
        schedule: "2026-11",
        estimate: "21天",
        tasks: [],
      },
      {
        id: "install",
        label: "安装收尾",
        schedule: "2026-12",
        estimate: "20天",
        tasks: [],
      },
      {
        id: "furniture",
        label: "家具入住",
        schedule: "安装后",
        estimate: "待定",
        tasks: [],
      },
    ];

    const html = renderToStaticMarkup(
      <ConstructionStage construction={construction} editMode={false} onChange={() => {}} />,
    );

    expect(html).toContain("前期工程");
    expect(html).toContain("水电阶段");
    expect(html).toContain("泥工阶段");
    expect(html).toContain("家具入住");
    expect(html).toContain("排期");
    expect(html).toContain("估时");
    expect(html).toContain("拆除交底");
    expect(html).toContain("进行中");
    expect(html).toContain("已完成");
  });
});
