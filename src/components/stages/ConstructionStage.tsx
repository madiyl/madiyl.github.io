import { EditableField } from "@/components/common/EditableField";
import { ProgressPill } from "@/components/common/ProgressPill";
import { SectionHeader } from "@/components/common/SectionHeader";
import type {
  ConstructionRoadmapStage,
  ConstructionStageTask,
  ConstructionStatus,
} from "@/types/renovation";
import { createId } from "@/utils/format";

type ConstructionStageProps = {
  construction: ConstructionRoadmapStage[];
  editMode: boolean;
  onChange: (next: ConstructionRoadmapStage[]) => void;
};

const statusOptions: ConstructionStatus[] = ["未开始", "进行中", "已完成", "待复查"];

function getRoadmapStageStatus(tasks: ConstructionStageTask[]): ConstructionStatus {
  if (!tasks.length) return "未开始";

  if (tasks.some((task) => task.status === "进行中")) {
    return "进行中";
  }

  if (tasks.every((task) => task.status === "已完成")) {
    return "已完成";
  }

  if (tasks.some((task) => task.status === "待复查")) {
    return "待复查";
  }

  return "未开始";
}

type ConstructionStatusFieldProps = {
  value: ConstructionStatus;
  editMode: boolean;
  onChange: (value: ConstructionStatus) => void;
};

function ConstructionStatusField({
  value,
  editMode,
  onChange,
}: ConstructionStatusFieldProps) {
  if (!editMode) {
    return (
      <div className="space-y-2">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
          状态
        </div>
        <div>
          <ProgressPill status={value} />
        </div>
      </div>
    );
  }

  return (
    <label className="block space-y-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
        状态
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as ConstructionStatus)}
        className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm leading-7 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ConstructionStage({
  construction,
  editMode,
  onChange,
}: ConstructionStageProps) {
  const updateStage = (
    stageId: string,
    key: keyof Pick<ConstructionRoadmapStage, "schedule" | "estimate">,
    value: string,
  ) => {
    onChange(
      construction.map((stage) =>
        stage.id === stageId ? { ...stage, [key]: value } : stage,
      ),
    );
  };

  const updateTask = (
    stageId: string,
    taskId: string,
    key: keyof ConstructionStageTask,
    value: string,
  ) => {
    onChange(
      construction.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              tasks: stage.tasks.map((task) =>
                task.id === taskId ? { ...task, [key]: value } : task,
              ),
            }
          : stage,
      ),
    );
  };

  const addTask = (stageId: string) => {
    onChange(
      construction.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              tasks: [
                ...stage.tasks,
                {
                  id: createId("construction-task"),
                  title: "",
                  status: "未开始",
                  schedule: "",
                  progress: "",
                  detail: "",
                  risk: "",
                },
              ],
            }
          : stage,
      ),
    );
  };

  const removeTask = (stageId: string, taskId: string) => {
    onChange(
      construction.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              tasks: stage.tasks.filter((task) => task.id !== taskId),
            }
          : stage,
      ),
    );
  };

  return (
    <section id="construction" className="rounded-[34px] border border-[rgba(255,255,255,0.74)] bg-[linear-gradient(180deg,rgba(248,243,234,0.96),rgba(242,235,226,0.88))] p-6 shadow-soft sm:p-8">
      <SectionHeader
        eyebrow="施工流程"
        title="把节点、进度和风险一起管起来"
        index={5}
        description="先读顶部的大阶段节奏，再往下看每个阶段里的任务、时间和风险记录。"
      />

      <div className="mt-6 rounded-[28px] border border-white/70 bg-white/75 p-4 shadow-soft sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
              施工 roadmap
            </div>
            <div className="mt-1 text-sm leading-6 text-[#6a5a4b]">
              先按大阶段看计划位置，再往下展开具体工序节点。
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex min-w-max gap-3 pb-1">
            {construction.map((stage, index) => {
              const aggregatedStatus = getRoadmapStageStatus(stage.tasks);

              return (
              <div key={stage.id} className="flex items-stretch gap-3">
                <div className="w-[156px] rounded-[24px] border border-white/80 bg-[#fcfaf7] px-4 py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
                    阶段 {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-2 text-base font-semibold text-ink">{stage.label}</div>
                  <div className="mt-3">
                    <ProgressPill status={aggregatedStatus} />
                  </div>
                  <div className="mt-4 space-y-3">
                    <EditableField
                      label="排期"
                      value={stage.schedule}
                      placeholder="待排期"
                      editMode={editMode}
                      onChange={(value) => updateStage(stage.id, "schedule", value)}
                    />
                    <EditableField
                      label="估时"
                      value={stage.estimate}
                      placeholder="例如：15天"
                      editMode={editMode}
                      onChange={(value) => updateStage(stage.id, "estimate", value)}
                    />
                  </div>
                </div>
                {index < construction.length - 1 ? (
                  <div className="flex items-center">
                    <div className="h-px w-6 bg-[#d8cbbb]" />
                  </div>
                ) : null}
              </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {construction.map((stage, index) => {
          const aggregatedStatus = getRoadmapStageStatus(stage.tasks);

          return (
            <section
              key={stage.id}
              className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-soft"
            >
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="relative flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efe4d6] text-sm font-semibold text-[#7c654f]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-ink">{stage.label}</h3>
                    <ProgressPill status={aggregatedStatus} />
                  </div>
                </div>

                <div className="grid gap-3 rounded-[22px] border border-white/70 bg-[#fcfaf7] px-4 py-3 sm:grid-cols-2 sm:px-5">
                  <EditableField
                    label="排期"
                    value={stage.schedule}
                    placeholder="待排期"
                    editMode={editMode}
                    onChange={(value) => updateStage(stage.id, "schedule", value)}
                  />
                  <EditableField
                    label="估时"
                    value={stage.estimate}
                    placeholder="例如：15天"
                    editMode={editMode}
                    onChange={(value) => updateStage(stage.id, "estimate", value)}
                  />
                </div>
              </div>

              {stage.tasks.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {stage.tasks.map((task) => (
                    <article
                      key={task.id}
                      className="rounded-[24px] border border-white/75 bg-[#fcfaf7] p-4 shadow-soft"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <EditableField
                            label="任务"
                            value={task.title}
                            placeholder="例如：卫生间防水验收"
                            editMode={editMode}
                            onChange={(value) => updateTask(stage.id, task.id, "title", value)}
                            displayClassName="text-base font-semibold text-ink"
                          />
                        </div>
                        {editMode ? (
                          <button
                            type="button"
                            onClick={() => removeTask(stage.id, task.id)}
                            className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-[#6f6154] transition hover:bg-white"
                          >
                            删除
                          </button>
                        ) : null}
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <ConstructionStatusField
                          value={task.status}
                          editMode={editMode}
                          onChange={(value) => updateTask(stage.id, task.id, "status", value)}
                        />
                        <EditableField
                          label="时间"
                          value={task.schedule}
                          placeholder="例如：4月22日-5月31日"
                          editMode={editMode}
                          onChange={(value) => updateTask(stage.id, task.id, "schedule", value)}
                        />
                      </div>

                      <div className="mt-4 space-y-4">
                        <EditableField
                          label="实际进度"
                          value={task.progress}
                          placeholder="记录现场进度与下一步安排"
                          editMode={editMode}
                          multiline
                          onChange={(value) => updateTask(stage.id, task.id, "progress", value)}
                        />
                        {editMode || task.detail.trim() ? (
                          <EditableField
                            label="关键细节"
                            value={task.detail}
                            placeholder="记录验收点、尺寸、到场或复尺信息"
                            editMode={editMode}
                            multiline
                            onChange={(value) => updateTask(stage.id, task.id, "detail", value)}
                          />
                        ) : null}
                        {editMode || task.risk.trim() ? (
                          <EditableField
                            label="风险 / 待办"
                            value={task.risk}
                            placeholder="记录风险点、协调事项与复查要求"
                            editMode={editMode}
                            multiline
                            onChange={(value) => updateTask(stage.id, task.id, "risk", value)}
                          />
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-[24px] bg-[#f7f1ea] px-4 py-5 text-sm leading-7 text-[#8b7966]">
                  暂未填写该阶段任务，可在编辑模式中新增。
                </div>
              )}

              {editMode ? (
                <button
                  type="button"
                  onClick={() => addTask(stage.id)}
                  className="mt-4 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-white"
                >
                  新增任务
                </button>
              ) : null}
            </section>
          );
        })}
      </div>
    </section>
  );
}
