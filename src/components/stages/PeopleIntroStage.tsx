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
  const groupMeta: Record<
    CollaboratorGroup,
    {
      eyebrow: string;
      description: string;
      accent: string;
      panelClassName: string;
    }
  > = {
    业主: {
      eyebrow: "居住需求",
      description: "记录最终使用者的偏好、决策方式和生活习惯。",
      accent: "text-[#8a6243]",
      panelClassName: "bg-[#f7efe4]",
    },
    Uni工作室: {
      eyebrow: "统筹协作",
      description: "把设计、主材、施工和行政对接的人连成一张协作图。",
      accent: "text-[#6f5a7a]",
      panelClassName: "bg-[#f3eef8]",
    },
    主材商: {
      eyebrow: "供应网络",
      description: "按品类记录主材合作方，方便回看谁负责哪一段。",
      accent: "text-[#46645a]",
      panelClassName: "bg-[#edf5f1]",
    },
  };

  const groupedPeople = (Object.keys(groupMeta) as CollaboratorGroup[]).map((group) => ({
    group,
    items: people.filter((person) => person.group === group),
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
      className="rounded-[32px] border border-white/60 bg-[#f7f2ea] p-6 shadow-soft sm:p-8"
    >
      <SectionHeader
        eyebrow="人员介绍"
        title="把这次装修里一起协作的人先认识一下"
        index={1}
      />

      <div className="space-y-6">
        {groupedPeople.map(({ group, items }) => {
          const meta = groupMeta[group];

          return (
            <section
              key={group}
              className={`rounded-[30px] border border-white/70 p-5 shadow-soft sm:p-6 ${meta.panelClassName}`}
            >
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-[0.2em] ${meta.accent}`}>
                    {meta.eyebrow}
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                    {group}
                  </h3>
                </div>
                <div className="max-w-2xl text-sm leading-7 text-[#65594d]">
                  {meta.description}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {items.map((person, index) => (
                  <article
                    key={person.id}
                    className="relative overflow-hidden rounded-[26px] border border-white/80 bg-white/88 p-4 shadow-soft"
                  >
                    <div className="pointer-events-none absolute inset-x-4 top-4 h-px bg-[linear-gradient(90deg,rgba(160,139,118,0.12),rgba(160,139,118,0.52),rgba(160,139,118,0.12))]" />
                    {index < items.length - 1 ? (
                      <div className="pointer-events-none absolute right-[-8px] top-1/2 hidden h-px w-5 -translate-y-1/2 bg-[linear-gradient(90deg,rgba(160,139,118,0.1),rgba(160,139,118,0.45))] xl:block" />
                    ) : null}

                    <ImagePathField
                      value={person.avatarPath}
                      alt={person.name || person.role}
                      editMode={editMode}
                      onChange={(value) => updatePerson(person.id, "avatarPath", value)}
                      ratioClassName="aspect-[1/1]"
                    />

                    <div className="mt-4 space-y-3">
                      <EditableField
                        label="角色"
                        value={person.role}
                        placeholder="例如：男主人"
                        editMode={editMode}
                        onChange={(value) => updatePerson(person.id, "role", value)}
                      />
                      <EditableField
                        label="名称"
                        value={person.name}
                        placeholder="例如：Madiyl_"
                        editMode={editMode}
                        onChange={(value) => updatePerson(person.id, "name", value)}
                        displayClassName="text-lg font-semibold text-ink"
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
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
