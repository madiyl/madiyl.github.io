import { KeyboardEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { EditableField } from "@/components/common/EditableField";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import { ImagePathField } from "@/components/common/ImagePathField";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { DesignAsset, DesignGroupKey, RenovationPageData } from "@/types/renovation";
import { createId } from "@/utils/format";

type DesignStageProps = {
  design: RenovationPageData["design"];
  editMode: boolean;
  onChange: (next: RenovationPageData["design"]) => void;
};

const groupMeta: Record<
  DesignGroupKey,
  {
    title: string;
    description: string;
    eyebrow: string;
    chipClassName: string;
    panelClassName: string;
  }
> = {
  floorPlans: {
    title: "平面设计",
    description: "先把动线、尺寸和收纳判断压成同一张图。",
    eyebrow: "Layout Study",
    chipClassName: "bg-[rgba(241,226,209,0.92)] text-[#8a6547]",
    panelClassName:
      "bg-[linear-gradient(180deg,rgba(247,241,233,0.98),rgba(242,234,224,0.92))]",
  },
  elevations: {
    title: "立面设计",
    description: "把比例、灯光和局部收口集中回看。",
    eyebrow: "Elevation Review",
    chipClassName: "bg-[rgba(235,225,214,0.92)] text-[#755b48]",
    panelClassName:
      "bg-[linear-gradient(180deg,rgba(248,242,235,0.98),rgba(240,231,221,0.92))]",
  },
  renders: {
    title: "效果图",
    description: "用氛围图确认材质、色调和整体情绪。",
    eyebrow: "Atmosphere Draft",
    chipClassName: "bg-[rgba(228,221,211,0.92)] text-[#6a5d52]",
    panelClassName:
      "bg-[linear-gradient(180deg,rgba(247,240,233,0.98),rgba(238,230,220,0.92))]",
  },
};

const buildDesignBrowseSummary = (
  title: string,
  group: DesignGroupKey,
  fallback: string,
) => {
  const normalizedTitle = title.trim();

  if (!normalizedTitle) return fallback;

  if (normalizedTitle.includes("平面")) {
    return "把动线、尺度和收纳顺一遍。";
  }
  if (normalizedTitle.includes("客餐厅")) {
    return "看客餐厅的开阔感有没有立住。";
  }
  if (normalizedTitle.includes("客厅")) {
    return "留白、光感和重心先看这里。";
  }
  if (normalizedTitle.includes("沙发背景墙")) {
    return "先拿捏背景墙的比例和灯带。";
  }
  if (normalizedTitle.includes("电视背景墙")) {
    return "看看留白和材质拼接够不够干净。";
  }
  if (normalizedTitle.includes("水吧台")) {
    return "台面转折和柜体衔接看这一张。";
  }
  if (normalizedTitle.includes("厨房岛台")) {
    return "把岛台尺度和边界感压稳。";
  }
  if (normalizedTitle.includes("生活阳台")) {
    return "把分区节奏和柜体关系理顺。";
  }
  if (normalizedTitle.includes("主卧阳台")) {
    return "光线进来的层次先看这里。";
  }
  if (normalizedTitle.includes("主卧")) {
    return "床位、灯光和安静感放一起看。";
  }
  if (normalizedTitle.includes("衣柜")) {
    return "分缝、开门和侧边收口再对一眼。";
  }

  if (group === "elevations") {
    return `把${normalizedTitle}的比例和收口捋顺。`;
  }
  if (group === "renders") {
    return `用${normalizedTitle}摸一摸材质和氛围。`;
  }
  if (group === "floorPlans") {
    return `把${normalizedTitle}的布局和动线走一遍。`;
  }

  return fallback;
};

export function DesignStage({ design, editMode, onChange }: DesignStageProps) {
  const [previewGroup, setPreviewGroup] = useState<DesignGroupKey | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  const updateGroup = (
    group: DesignGroupKey,
    updater: (items: DesignAsset[]) => DesignAsset[],
  ) => {
    onChange({
      ...design,
      [group]: updater(design[group]),
    });
  };

  const previewImages: {
    src: string;
    alt: string;
    caption?: string;
    eyebrow?: string;
    meta?: string;
  }[] = useMemo(() => {
    if (!previewGroup) return [];

    return design[previewGroup]
      .filter((item: DesignAsset) => Boolean(item.imagePath))
      .map((item: DesignAsset, index: number, items: DesignAsset[]) => ({
        src: item.imagePath,
        alt: item.title || groupMeta[previewGroup].title,
        caption: item.note,
        eyebrow: groupMeta[previewGroup].title,
        meta: `${index + 1} / ${items.length}`,
      }));
  }, [design, previewGroup]);

  const openPreview = (group: DesignGroupKey, assetId: string) => {
    const items = design[group].filter((item: DesignAsset) => Boolean(item.imagePath));
    const index = items.findIndex((item: DesignAsset) => item.id === assetId);
    if (index === -1) return;
    setPreviewGroup(group);
    setPreviewIndex(index);
  };

  const closePreview = () => {
    setPreviewGroup(null);
    setPreviewIndex(0);
  };

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    group: DesignGroupKey,
    assetId: string,
    canPreview: boolean,
  ) => {
    if (!canPreview) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPreview(group, assetId);
    }
  };

  return (
    <>
      <section id="design" className="rounded-[34px] border border-[rgba(255,255,255,0.74)] bg-[linear-gradient(180deg,rgba(248,244,239,0.96),rgba(243,237,230,0.88))] p-6 shadow-soft sm:p-8">
        <SectionHeader
          eyebrow="设计阶段"
          title="把空间气质先定下来"
          index={2}
          description="平面、立面和氛围图一起收拢成一套更完整的空间判断。"
        />

        <div className="space-y-10">
          {(Object.keys(groupMeta) as DesignGroupKey[]).map((group) => (
            <div key={group} className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-ink">
                    {groupMeta[group].title}
                  </h3>
                  <p className="mt-1 text-sm leading-7 text-[#5f5245]">
                    {groupMeta[group].description}
                  </p>
                </div>

                {editMode ? (
                  <button
                    type="button"
                    onClick={() =>
                      updateGroup(group, (items) => [
                        ...items,
                        {
                          id: createId(group),
                          group,
                          title: "",
                          note: "",
                          imagePath: "",
                        },
                      ])
                    }
                    className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-white"
                  >
                    新增图片
                  </button>
                ) : null}
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {design[group].map((asset: DesignAsset, index: number) => {
                  const meta = groupMeta[group];
                  const canPreview = !editMode && Boolean(asset.imagePath);
                  const displayTitle =
                    asset.title.trim() || `${meta.title} · 方案 ${index + 1}`;
                  const displaySummary =
                    asset.note.trim() ||
                    buildDesignBrowseSummary(displayTitle, group, meta.description);

                  return (
                    <motion.article
                      key={asset.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ duration: 0.35, delay: index * 0.04 }}
                      role={canPreview ? "button" : undefined}
                      tabIndex={canPreview ? 0 : undefined}
                      onClick={
                        canPreview ? () => openPreview(group, asset.id) : undefined
                      }
                      onKeyDown={(event) =>
                        handleCardKeyDown(event, group, asset.id, canPreview)
                      }
                      className={`overflow-hidden rounded-[30px] border border-white/70 shadow-soft transition ${
                        editMode
                          ? "bg-white/82 p-4"
                          : `${meta.panelClassName} ${
                              canPreview
                                ? "cursor-zoom-in hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(98,79,60,0.12)] focus:outline-none focus:ring-2 focus:ring-[rgba(141,111,82,0.28)]"
                                : ""
                            }`
                      }`}
                    >
                      {editMode ? (
                        <>
                          <ImagePathField
                            value={asset.imagePath}
                            alt={asset.title || groupMeta[group].title}
                            editMode={editMode}
                            previewable
                            onPreview={() => openPreview(group, asset.id)}
                            onChange={(value: string) =>
                              updateGroup(group, (items) =>
                                items.map((item) =>
                                  item.id === asset.id
                                    ? { ...item, imagePath: value }
                                    : item,
                                ),
                              )
                            }
                          />

                          <div className="mt-4 space-y-3">
                            <EditableField
                              label="标题"
                              value={asset.title}
                              placeholder="例如：客厅立面推敲"
                              editMode={editMode}
                              onChange={(value: string) =>
                                updateGroup(group, (items) =>
                                  items.map((item) =>
                                    item.id === asset.id
                                      ? { ...item, title: value }
                                      : item,
                                  ),
                                )
                              }
                              displayClassName="text-lg font-semibold text-ink"
                            />
                            {(editMode || asset.note.trim()) && (
                              <EditableField
                                label="说明"
                                value={asset.note}
                                placeholder="记录这张图的重点、版本差异或确认事项"
                                editMode={editMode}
                                multiline
                                onChange={(value: string) =>
                                  updateGroup(group, (items) =>
                                    items.map((item) =>
                                      item.id === asset.id
                                        ? { ...item, note: value }
                                        : item,
                                    ),
                                  )
                                }
                              />
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="relative">
                            <ImagePathField
                              value={asset.imagePath}
                              alt={displayTitle}
                              editMode={false}
                              onChange={(_: string) => {}}
                              previewable={false}
                              zoomOnHover={false}
                              ratioClassName="aspect-[4/3]"
                            />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(28,22,18,0),rgba(28,22,18,0.78))] px-5 pb-5 pt-12">
                              <div className="text-[1.18rem] font-semibold tracking-[-0.025em] text-white">
                                {displayTitle}
                              </div>
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span
                                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${meta.chipClassName}`}
                                >
                                  {meta.eyebrow}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 px-5 py-5">
                            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-7 text-[#6b5f54]">
                              {displaySummary}
                            </div>
                          </div>
                        </>
                      )}

                      {editMode ? (
                        <button
                          type="button"
                          onClick={() =>
                            updateGroup(group, (items) =>
                              items.filter((item) => item.id !== asset.id),
                            )
                          }
                          className="mt-4 text-sm font-medium text-[#9a5b49]"
                        >
                          删除这一项
                        </button>
                      ) : null}
                    </motion.article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <ImageLightbox
        open={Boolean(previewGroup && previewImages.length)}
        images={previewImages}
        activeIndex={previewIndex}
        onClose={closePreview}
        onSelect={(index: number) => setPreviewIndex(index)}
        onPrev={() =>
          setPreviewIndex((current) =>
            current === 0 ? previewImages.length - 1 : current - 1,
          )
        }
        onNext={() =>
          setPreviewIndex((current) =>
            current === previewImages.length - 1 ? 0 : current + 1,
          )
        }
      />
    </>
  );
}
