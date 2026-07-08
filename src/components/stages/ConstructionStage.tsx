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

function getRoadmapStageMetrics(tasks: ConstructionStageTask[]) {
  return {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === "已完成").length,
    active: tasks.filter((task) => task.status === "进行中").length,
    reviewing: tasks.filter((task) => task.status === "待复查").length,
  };
}

function getDisplayText(value: string, fallback: string) {
  const trimmed = value.trim();
  return trimmed || fallback;
}

function getTaskBrowseSummary(task: ConstructionStageTask) {
  return (
    task.progress.trim() ||
    task.detail.trim() ||
    task.risk.trim() ||
    "待补充现场进度、关键节点和需要协调的事项。"
  );
}

function getStageBrowseSummary(stage: ConstructionRoadmapStage) {
  const activeTask = stage.tasks.find((task) => task.status === "进行中");
  if (activeTask) {
    return `当前重点盯 ${activeTask.title}，把时间和落地节奏放在一起看。`;
  }

  const reviewTask = stage.tasks.find((task) => task.status === "待复查");
  if (reviewTask) {
    return `这一段有待复查项，先把 ${reviewTask.title} 核清。`;
  }

  if (!stage.tasks.length) {
    return "先把这一阶段的排期、估时和关键任务补齐。";
  }

  if (stage.tasks.every((task) => task.status === "已完成")) {
    return "这一阶段已经收口，保留记录方便后面回看。";
  }

  return "把任务、时间和现场记录收在同一张阶段卡里。";
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
  const totalTaskCount = construction.reduce((sum, stage) => sum + stage.tasks.length, 0);
  const activeTaskCount = construction.reduce(
    (sum, stage) =>
      sum + stage.tasks.filter((task) => task.status === "进行中").length,
    0,
  );
  const reviewTaskCount = construction.reduce(
    (sum, stage) =>
      sum + stage.tasks.filter((task) => task.status === "待复查").length,
    0,
  );

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
        title="把施工节奏梳成一页路书"
        index={5}
        description="先看阶段推进，再往下翻每一段任务、时间和现场记录。"
      />

      <div className="mt-6 overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(251,247,241,0.92))] p-4 shadow-soft sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
              施工 roadmap
            </div>
            <div className="mt-2 text-[1.08rem] font-semibold tracking-[-0.02em] text-ink sm:text-[1.18rem]">
              先把阶段顺序看清，再往下展开每段任务。
            </div>
            <div className="mt-2 text-sm leading-7 text-[#6a5a4b]">
              把排期、估时和阶段状态先压成一条清晰的施工轴，下面的任务卡再接着记录现场进度和风险。
            </div>
          </div>

          {!editMode ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "任务总数", value: `${totalTaskCount} 项` },
                { label: "进行中", value: `${activeTaskCount} 项` },
                { label: "待复查", value: `${reviewTaskCount} 项` },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[20px] border border-white/80 bg-[#fcfaf7] px-4 py-3"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b8a76]">
                    {stat.label}
                  </div>
                  <div className="mt-2 text-base font-semibold tracking-[-0.02em] text-ink">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-5 overflow-x-auto">
          <div className="flex min-w-max items-stretch gap-3 pb-1">
            {construction.map((stage, index) => {
              const aggregatedStatus = getRoadmapStageStatus(stage.tasks);
              const metrics = getRoadmapStageMetrics(stage.tasks);

              return (
                <div key={stage.id} className="flex items-stretch gap-3">
                  <div className="w-[188px] rounded-[24px] border border-white/80 bg-[#fcfaf7] px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
                          阶段 {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="mt-2 text-base font-semibold tracking-[-0.02em] text-ink">
                          {stage.label}
                        </div>
                      </div>
                      <ProgressPill status={aggregatedStatus} />
                    </div>

                    <div className="mt-4 grid gap-3">
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

                    {!editMode ? (
                      <div className="mt-4 flex items-center justify-between rounded-[16px] border border-[#eee4d8] bg-[#f8f1e9] px-3 py-2 text-xs font-medium text-[#746555]">
                        <span>任务 {metrics.total} 项</span>
                        <span>已完 {metrics.completed} 项</span>
                      </div>
                    ) : null}
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
          const metrics = getRoadmapStageMetrics(stage.tasks);

          return (
            <section
              key={stage.id}
              className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-soft"
            >
              {editMode ? (
                <>
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
                            <button
                              type="button"
                              onClick={() => removeTask(stage.id, task.id)}
                              className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-[#6f6154] transition hover:bg-white"
                            >
                              删除
                            </button>
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

                  <button
                    type="button"
                    onClick={() => addTask(stage.id)}
                    className="mt-4 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-white"
                  >
                    新增任务
                  </button>
                </>
              ) : (
                <div className="grid gap-5 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
                  <div className="rounded-[26px] border border-white/80 bg-[linear-gradient(180deg,rgba(252,248,243,0.98),rgba(246,239,230,0.92))] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
                          阶段 {String(index + 1).padStart(2, "0")}
                        </div>
                        <h3 className="mt-2 text-[1.15rem] font-semibold tracking-[-0.02em] text-ink">
                          {stage.label}
                        </h3>
                      </div>
                      <ProgressPill status={aggregatedStatus} />
                    </div>

                    <div className="mt-4 text-sm leading-7 text-[#6f6256]">
                      {getStageBrowseSummary(stage)}
                    </div>

                    <div className="mt-5 overflow-hidden rounded-[22px] border border-[#eadfce] bg-white/80">
                      <div className="grid sm:grid-cols-3">
                        {[
                          {
                            label: "排期",
                            value: getDisplayText(stage.schedule, "待排期"),
                          },
                          {
                            label: "估时",
                            value: getDisplayText(stage.estimate, "待补充"),
                          },
                          {
                            label: "任务数",
                            value: `${metrics.total} 项`,
                          },
                        ].map((stat, statIndex) => (
                          <div
                            key={stat.label}
                            className={`px-4 py-4 ${
                              statIndex === 0 ? "" : "border-t border-[#eadfce] sm:border-l sm:border-t-0"
                            }`}
                          >
                            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b8a76]">
                              {stat.label}
                            </div>
                            <div className="mt-2 text-sm font-semibold text-ink">
                              {stat.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#f4ece2] px-3 py-1 text-xs font-medium text-[#7a6a58]">
                        已完 {metrics.completed} 项
                      </span>
                      {metrics.active ? (
                        <span className="rounded-full bg-[#efe4d6] px-3 py-1 text-xs font-medium text-[#7c654f]">
                          进行中 {metrics.active} 项
                        </span>
                      ) : null}
                      {metrics.reviewing ? (
                        <span className="rounded-full bg-[#f3e3de] px-3 py-1 text-xs font-medium text-[#9a5b49]">
                          待复查 {metrics.reviewing} 项
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {stage.tasks.length ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {stage.tasks.map((task) => (
                        <article
                          key={task.id}
                          className="rounded-[24px] border border-white/75 bg-[#fcfaf7] p-4 shadow-soft"
                        >
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b8a76]">
                                  任务
                                </div>
                                <div className="mt-2 text-base font-semibold tracking-[-0.02em] text-ink">
                                  {getDisplayText(task.title, "待补充任务名称")}
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <ProgressPill status={task.status} />
                                <span className="rounded-full border border-[#eadfce] bg-white/80 px-3 py-1 text-xs font-medium text-[#756756]">
                                  {getDisplayText(task.schedule, "待排期")}
                                </span>
                              </div>
                            </div>

                            <div className="rounded-[20px] border border-[#eadfce] bg-white/80 px-4 py-3">
                              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b8a76]">
                                现场进度
                              </div>
                              <div className="mt-2 text-sm leading-7 text-[#5c4f42]">
                                {getTaskBrowseSummary(task)}
                              </div>
                            </div>

                            {task.detail.trim() || task.risk.trim() ? (
                              <div className="grid gap-3">
                                {task.detail.trim() ? (
                                  <div className="rounded-[18px] border border-[#eee3d5] bg-[#f9f3ec] px-4 py-3">
                                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b8a76]">
                                      关键细节
                                    </div>
                                    <div className="mt-2 text-sm leading-7 text-[#665849]">
                                      {task.detail}
                                    </div>
                                  </div>
                                ) : null}
                                {task.risk.trim() ? (
                                  <div className="rounded-[18px] border border-[#f0ddd6] bg-[#fbf2ef] px-4 py-3">
                                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a06a57]">
                                      风险 / 待办
                                    </div>
                                    <div className="mt-2 text-sm leading-7 text-[#7c5b4e]">
                                      {task.risk}
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[220px] items-center rounded-[24px] border border-dashed border-[#e8dccd] bg-[#fbf6ef] px-5 py-6 text-sm leading-7 text-[#8b7966]">
                      这一阶段还没有展开任务，先把 roadmap 的排期和估时定下来，后面再往里补现场记录。
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </section>
  );
}
