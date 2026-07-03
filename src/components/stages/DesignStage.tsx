import { useMemo, useState } from "react";
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

const groupMeta: Record<DesignGroupKey, { title: string; description: string }> = {
  floorPlans: {
    title: "平面设计",
    description: "优先记录动线、尺寸、收纳与功能布局决策。",
  },
  elevations: {
    title: "立面设计",
    description: "适合补充柜体比例、灯光节点与局部收口说明。",
  },
  renders: {
    title: "效果图",
    description: "用来沉淀材质、色调和整体氛围方向。",
  },
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

  const previewImages = useMemo(() => {
    if (!previewGroup) return [];

    return design[previewGroup]
      .filter((item) => Boolean(item.imagePath))
      .map((item) => ({
        src: item.imagePath,
        alt: item.title || groupMeta[previewGroup].title,
        caption: item.note,
      }));
  }, [design, previewGroup]);

  const openPreview = (group: DesignGroupKey, assetId: string) => {
    const items = design[group].filter((item) => Boolean(item.imagePath));
    const index = items.findIndex((item) => item.id === assetId);
    if (index === -1) return;
    setPreviewGroup(group);
    setPreviewIndex(index);
  };

  const closePreview = () => {
    setPreviewGroup(null);
    setPreviewIndex(0);
  };

  return (
    <>
      <section id="design" className="rounded-[32px] border border-white/60 bg-mist/80 p-6 shadow-soft sm:p-8">
        <SectionHeader eyebrow="设计阶段" title="把空间气质先定下来" index={2} />

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
                {design[group].map((asset, index) => (
                  <motion.article
                    key={asset.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                    className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-soft"
                  >
                    <ImagePathField
                      value={asset.imagePath}
                      alt={asset.title || groupMeta[group].title}
                      editMode={editMode}
                      previewable
                      onPreview={() => openPreview(group, asset.id)}
                      onChange={(value) =>
                        updateGroup(group, (items) =>
                          items.map((item) =>
                            item.id === asset.id ? { ...item, imagePath: value } : item,
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
                        onChange={(value) =>
                          updateGroup(group, (items) =>
                            items.map((item) =>
                              item.id === asset.id ? { ...item, title: value } : item,
                            ),
                          )
                        }
                        displayClassName="text-lg font-semibold text-ink"
                      />
                      {editMode || asset.note.trim() ? (
                        <EditableField
                          label="说明"
                          value={asset.note}
                          placeholder="记录这张图的重点、版本差异或确认事项"
                          editMode={editMode}
                          multiline
                          onChange={(value) =>
                            updateGroup(group, (items) =>
                              items.map((item) =>
                                item.id === asset.id ? { ...item, note: value } : item,
                              ),
                            )
                          }
                        />
                      ) : null}
                    </div>

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
                ))}
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
        onSelect={(index) => setPreviewIndex(index)}
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
