import { EditableField } from "@/components/common/EditableField";
import { ImagePathField } from "@/components/common/ImagePathField";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { CollaboratorGroup, PersonProfile } from "@/types/renovation";

type PeopleIntroStageProps = {
  people: PersonProfile[];
  editMode: boolean;
  onChange: (next: PersonProfile[]) => void;
};

export function PeopleIntroStage({
  people,
  editMode,
  onChange,
}: PeopleIntroStageProps) {
  const normalizeRole = (role: string) => role.replace(/老师/g, "").trim();
  const getGroupOrder = (group: CollaboratorGroup, person: PersonProfile) => {
    const normalizedRole = normalizeRole(person.role);

    if (group === "Uni工作室") {
      switch (normalizedRole) {
        case "设计":
        case "设计师":
          return 0;
        case "主材":
          return 1;
        case "施工":
          return 2;
        case "行政":
          return 3;
        default:
          return 99;
      }
    }

    return 99;
  };

  const getFallbackInitials = (person: PersonProfile) => {
    const source = (person.name || person.role).trim();
    if (!source) return "成员";

    const ascii = source.replace(/[^A-Za-z0-9]/g, "");
    if (ascii) {
      return ascii.slice(0, 2).toUpperCase();
    }

    return source.slice(0, 2);
  };

  const getFallbackTone = (group: CollaboratorGroup) => {
    switch (group) {
      case "业主":
        return "from-[#f4dfc7] via-[#fbf3ea] to-[#ead8c2]";
      case "Uni工作室":
        return "from-[#e5d9f1] via-[#f7f2fb] to-[#ded2eb]";
      case "主材商":
        return "from-[#dcebe2] via-[#f3faf6] to-[#d4e4dc]";
      default:
        return "from-[#efe4d6] via-[#f9f5ef] to-[#e8e3d8]";
    }
  };

  const getRelationLabel = (person: PersonProfile) => {
    const normalizedRole = normalizeRole(person.role);

    if (normalizedRole === "设计" || normalizedRole === "设计师") {
      return "设计把控";
    }

    if (normalizedRole === "施工") {
      return "施工落地";
    }

    if (normalizedRole === "行政") {
      return "Uni对接";
    }

    switch (person.id) {
      case "person-owner-male":
        return "主决策";
      case "person-owner-female":
        return "需求共识";
      case "person-uni-materials":
        return "选材联动";
      default:
        if (person.group === "业主") {
          return "协作成员";
        }
        if (person.group === "Uni工作室") {
          return "协同节点";
        }
        return "";
    }
  };

  const groupMeta: Record<
    CollaboratorGroup,
    {
      eyebrow: string;
      description: string;
      summaryLabel: string;
      summaryHint: string;
      hubTitle: string;
      hubDescription: string;
      hubPersonId?: string;
      hubFallbackName: string;
      accent: string;
      panelClassName: string;
      badgeClassName: string;
    }
  > = {
    业主: {
      eyebrow: "居住需求",
      description: "记录最终使用者的偏好、决策方式和生活习惯。",
      summaryLabel: "协作重点",
      summaryHint: "先把居住习惯、预算边界和优先级对齐。",
      hubTitle: "主节点",
      hubDescription: "围绕核心决策者收敛生活需求、预算判断和关键取舍。",
      hubPersonId: "person-owner-male",
      hubFallbackName: "业主中枢",
      accent: "text-[#8a6243]",
      panelClassName: "bg-[#f7efe4]",
      badgeClassName: "bg-[#f1dfca] text-[#8a6243]",
    },
    Uni工作室: {
      eyebrow: "统筹协作",
      description: "把设计、主材、施工和行政对接的人连成一张协作图。",
      summaryLabel: "协作重点",
      summaryHint: "方案、选材、施工和排期在这里集中对表。",
      hubTitle: "主节点",
      hubDescription: "以设计师为中心串起方案、选材和施工落地的协作链路。",
      hubPersonId: "person-uni-designer",
      hubFallbackName: "设计统筹",
      accent: "text-[#6f5a7a]",
      panelClassName: "bg-[#f3eef8]",
      badgeClassName: "bg-[#e4daf1] text-[#6f5a7a]",
    },
    主材商: {
      eyebrow: "供应网络",
      description: "按品类记录主材合作方，方便回看谁负责哪一段。",
      summaryLabel: "协作重点",
      summaryHint: "供货节奏、补货窗口和联系人都需要集中留痕。",
      hubTitle: "主节点",
      hubDescription: "由施工端统筹主材衔接，集中串联各品类商家的到货、补货和现场配合。",
      hubFallbackName: "施工 🍀-乐乐乐乐乐乐_",
      accent: "text-[#46645a]",
      panelClassName: "bg-[#edf5f1]",
      badgeClassName: "bg-[#d9ebe2] text-[#46645a]",
    },
  };

  const groupedPeople = (Object.keys(groupMeta) as CollaboratorGroup[]).map((group) => ({
    group,
    items: people
      .filter((person) => person.group === group)
      .sort(
        (left, right) =>
          getGroupOrder(group, left) - getGroupOrder(group, right) ||
          people.findIndex((person) => person.id === left.id) -
            people.findIndex((person) => person.id === right.id),
      ),
  }));

  const updatePerson = (
    id: string,
    key: keyof PersonProfile,
    value: string,
  ) => {
    onChange(
      people.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    );
  };

  return (
    <section
      id="people"
      className="rounded-[34px] border border-[rgba(255,255,255,0.74)] bg-[linear-gradient(180deg,rgba(247,242,234,0.95),rgba(243,236,227,0.88))] p-6 shadow-soft sm:p-8"
    >
      <SectionHeader
        eyebrow="人员介绍"
        title="把这次装修里一起协作的人先认识一下"
        index={1}
        description="这一章更像协作地图：先看角色关系，再看每个人手上的信息和备注。"
      />

      <div className="space-y-6">
        {groupedPeople.map(({ group, items }) => {
          const meta = groupMeta[group];
          const hubPerson =
            group === "主材商"
              ? people.find((person) => normalizeRole(person.role) === "施工")
              : meta.hubPersonId
                ? people.find((person) => person.id === meta.hubPersonId)
                : undefined;
          const hubName = hubPerson
            ? `${normalizeRole(hubPerson.role)} ${hubPerson.name}`.trim()
            : meta.hubFallbackName;

          return (
            <section
              key={group}
              className={`rounded-[30px] border border-white/70 p-5 shadow-soft sm:p-6 ${meta.panelClassName}`}
            >
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-3">
                  <div className={`text-xs font-semibold uppercase tracking-[0.2em] ${meta.accent}`}>
                    {meta.eyebrow}
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                    {group}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-[13px]">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 font-semibold ${meta.badgeClassName}`}
                    >
                      {items.length} 位协作成员
                    </span>
                    <span className="text-[#7a6b5c]">{meta.summaryHint}</span>
                  </div>
                  <div className="max-w-2xl text-sm leading-7 text-[#65594d]">
                    {meta.description}
                  </div>
                </div>

                <div className="grid gap-2 rounded-[22px] border border-white/70 bg-white/60 px-4 py-3 text-sm text-[#65594d] shadow-soft sm:px-5">
                  <div className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${meta.accent}`}>
                    {meta.hubTitle}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-ink">
                      {hubName}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${meta.badgeClassName}`}>
                      网络中心
                    </span>
                  </div>
                  <div className="max-w-xl leading-6">
                    {meta.hubDescription}
                  </div>
                  <div className="text-[13px] leading-6 text-[#7a6b5c]">
                    {meta.summaryLabel}：{meta.summaryHint}
                  </div>
                </div>
              </div>

              <div className="relative">
                {items.length > 1 ? (
                  <div className="pointer-events-none absolute bottom-5 left-[26px] top-5 w-px bg-[linear-gradient(180deg,rgba(160,139,118,0.08),rgba(160,139,118,0.42),rgba(160,139,118,0.08))] xl:hidden" />
                ) : null}

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {items.map((person) => {
                    const isHub = meta.hubPersonId === person.id;
                    const relationLabel = getRelationLabel(person);

                    return (
                      <article
                        key={person.id}
                        className={`relative overflow-hidden rounded-[26px] border bg-white/88 p-4 shadow-soft ${
                          isHub
                            ? "border-white/90 ring-1 ring-white/70"
                            : "border-white/80"
                        }`}
                      >
                        {person.avatarPath ? (
                          <ImagePathField
                            value={person.avatarPath}
                            alt={person.name || person.role}
                            editMode={editMode}
                            onChange={(value) => updatePerson(person.id, "avatarPath", value)}
                            ratioClassName="aspect-[1/1]"
                          />
                        ) : (
                          <div className="space-y-3">
                            <div
                              className={`flex aspect-square items-center justify-center rounded-[24px] border border-white/70 bg-gradient-to-br ${getFallbackTone(person.group)} text-lg font-semibold tracking-[0.18em] text-[#5c4e43] shadow-soft`}
                            >
                              {getFallbackInitials(person)}
                            </div>
                            {editMode ? (
                              <label className="block space-y-2">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
                                  图片路径
                                </span>
                                <input
                                  value={person.avatarPath}
                                  onChange={(event) =>
                                    updatePerson(person.id, "avatarPath", event.target.value)
                                  }
                                  placeholder="/uploads/renovation/..."
                                  className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm leading-7 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                                />
                              </label>
                            ) : null}
                          </div>
                        )}

                        <div className="mt-4 space-y-3">
                          <EditableField
                            label="名称"
                            value={person.name}
                            placeholder={editMode ? "例如：Madiyl_" : "待补充联系人"}
                            editMode={editMode}
                            onChange={(value) => updatePerson(person.id, "name", value)}
                            displayClassName="text-lg font-semibold text-ink"
                          />
                          {!editMode ? (
                            <div className="flex flex-wrap items-center gap-2">
                              {isHub ? (
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${meta.badgeClassName}`}>
                                  主节点
                                </span>
                              ) : null}
                              {relationLabel ? (
                                <span className="inline-flex items-center rounded-full bg-[#f8f3ec] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a6b5c]">
                                  {relationLabel}
                                </span>
                              ) : null}
                            </div>
                          ) : null}
                          {editMode && relationLabel ? (
                            <div className="rounded-[18px] bg-[#f8f3ec] px-3.5 py-3 text-sm leading-7 text-[#51453a]">
                              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
                                协作标签
                              </div>
                              <div className="mt-1">{isHub ? `主节点 · ${relationLabel}` : relationLabel}</div>
                            </div>
                          ) : null}
                          <EditableField
                            label="角色"
                            value={person.role}
                            placeholder="例如：男主人"
                            editMode={editMode}
                            onChange={(value) => updatePerson(person.id, "role", value)}
                            displayClassName="text-sm font-medium text-[#7b6856]"
                          />
                          {editMode || person.note.trim() ? (
                            <EditableField
                              label="备注"
                              value={person.note}
                              placeholder="记录这位协作方的分工、沟通方式或一句介绍"
                              editMode={editMode}
                              multiline
                              onChange={(value) => updatePerson(person.id, "note", value)}
                            />
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
