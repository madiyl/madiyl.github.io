import { EditableField } from "@/components/common/EditableField";
import { ProgressPill } from "@/components/common/ProgressPill";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { ConstructionPhase, ConstructionStatus, ConstructionTask } from "@/types/renovation";
import { createId } from "@/utils/format";

type ConstructionStageProps = {
  construction: ConstructionTask[];
  editMode: boolean;
  onChange: (next: ConstructionTask[]) => void;
};

const phases: ConstructionPhase[] = [
  "成品保护",
  "拆除",
  "新建",
  "地面",
  "顶面",
  "墙面",
  "水电",
  "成品安装",
];

export function ConstructionStage({
  construction,
  editMode,
  onChange,
}: ConstructionStageProps) {
  const updateItem = (id: string, key: keyof ConstructionTask, value: string) => {
    onChange(
      construction.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    );
  };

  return (
    <section id="construction" className="rounded-[32px] border border-white/60 bg-[#f8f3ea] p-6 shadow-soft sm:p-8">
      <SectionHeader
        eyebrow="施工流程"
        title="把节点、进度和风险一起管起来"
        index={5}
      />

      <div className="space-y-5">
        {phases.map((phase, index) => {
          const item = construction.find((entry) => entry.phase === phase) ?? null;

          return (
            <article
              key={phase}
              className="grid gap-5 rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-soft lg:grid-cols-[120px,1fr]"
            >
              <div className="relative flex items-start gap-4 lg:flex-col">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efe4d6] text-sm font-semibold text-[#7c654f]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-ink">{phase}</h3>
                  {item ? <ProgressPill status={item.status} /> : null}
                </div>
              </div>

              {item ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <EditableField
                    label="状态"
                    value={item.status}
                    placeholder="未开始 / 进行中 / 已完成 / 待复查"
                    editMode={editMode}
                    onChange={(value) =>
                      updateItem(item.id, "status", value as ConstructionStatus)
                    }
                  />
                  <EditableField
                    label="计划时间"
                    value={item.plannedAt}
                    placeholder="例如：2026-08"
                    editMode={editMode}
                    onChange={(value) => updateItem(item.id, "plannedAt", value)}
                  />
                  <EditableField
                    label="实际进度"
                    value={item.progress}
                    placeholder="记录现场进度与下一步安排"
                    editMode={editMode}
                    multiline
                    onChange={(value) => updateItem(item.id, "progress", value)}
                  />
                  <EditableField
                    label="关键细节"
                    value={item.detail}
                    placeholder="记录验收点、尺寸或照片索引"
                    editMode={editMode}
                    multiline
                    onChange={(value) => updateItem(item.id, "detail", value)}
                  />
                  <div className="md:col-span-2">
                    <EditableField
                      label="风险 / 待办"
                      value={item.risk}
                      placeholder="记录风险点、协调事项与复查要求"
                      editMode={editMode}
                      multiline
                      onChange={(value) => updateItem(item.id, "risk", value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-[24px] bg-[#f7f1ea] px-4 py-5 text-sm leading-7 text-[#8b7966]">
                  暂未填写该工序节点，可在编辑模式中新增。
                </div>
              )}

              {!item && editMode ? (
                <button
                  type="button"
                  onClick={() =>
                    onChange([
                      ...construction,
                      {
                        id: createId("construction"),
                        phase,
                        status: "未开始",
                        plannedAt: "",
                        progress: "",
                        detail: "",
                        risk: "",
                      },
                    ])
                  }
                  className="lg:col-start-2 lg:justify-self-start rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-white"
                >
                  新增节点
                </button>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
