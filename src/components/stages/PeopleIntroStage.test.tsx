import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PeopleIntroStage } from "@/components/stages/PeopleIntroStage";
import type { PersonProfile } from "@/types/renovation";

describe("PeopleIntroStage", () => {
  it("renders group hub summary and collaboration labels in browse mode", () => {
    const people: PersonProfile[] = [
      {
        id: "person-owner-male",
        group: "业主",
        role: "男主人",
        name: "Madiyl_",
        avatarPath: "",
        note: "负责整体预算与关键决策。",
      },
      {
        id: "person-owner-female",
        group: "业主",
        role: "女主人",
        name: "Elaine",
        avatarPath: "",
        note: "负责居住需求与生活细节。",
      },
      {
        id: "person-uni-designer",
        group: "Uni工作室",
        role: "设计师",
        name: "摇摇乐",
        avatarPath: "",
        note: "负责平面方案和整体风格统筹。",
      },
      {
        id: "vendor-tile",
        group: "主材商",
        role: "瓷砖",
        name: "瓷砖商家",
        avatarPath: "",
        note: "负责供货与补货节奏。",
      },
    ];

    const html = renderToStaticMarkup(
      <PeopleIntroStage people={people} editMode={false} onChange={() => {}} />,
    );

    expect(html).toContain("主节点");
    expect(html).toContain("施工 🍀-乐乐乐乐乐乐_");
    expect(html).toContain("2 位协作成员");
    expect(html).toContain("主决策");
    expect(html).toContain("设计把控");
    expect(html).not.toContain("供应协同");
  });
});
