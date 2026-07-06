import { useMemo, useState } from "react";
import { BudgetSummary } from "@/components/common/BudgetSummary";
import { EditableField } from "@/components/common/EditableField";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import { ImagePathField } from "@/components/common/ImagePathField";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { SoftCategory, SoftFurnishingItem } from "@/types/renovation";
import { createId } from "@/utils/format";

type SoftFurnishingStageProps = {
  items: SoftFurnishingItem[];
  editMode: boolean;
  onChange: (next: SoftFurnishingItem[]) => void;
};

const categories: SoftCategory[] = [
  "沙发",
  "茶几",
  "床品",
  "餐桌",
  "厨具",
  "斗柜",
  "床头柜",
  "其它",
];

export function SoftFurnishingStage({
  items,
  editMode,
  onChange,
}: SoftFurnishingStageProps) {
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  const updateItem = (
    id: string,
    key: keyof SoftFurnishingItem,
    value: string,
  ) => {
    onChange(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [key]:
                key === "budget" || key === "actualPrice"
                  ? Number(value || 0)
                  : value,
            }
          : item,
      ),
    );
  };

  const previewImages = useMemo(
    () =>
      items
        .filter((item) => Boolean(item.imagePath))
        .map((item) => ({
          src: item.imagePath,
          alt: item.name || item.category,
          caption: item.reason,
        })),
    [items],
  );

  const openPreview = (id: string) => {
    const index = items
      .filter((item) => Boolean(item.imagePath))
      .findIndex((item) => item.id === id);
    if (index === -1) return;
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  return (
    <>
      <section id="soft" className="rounded-[34px] border border-[rgba(255,255,255,0.74)] bg-[linear-gradient(180deg,rgba(251,247,241,0.96),rgba(246,240,233,0.88))] p-6 shadow-soft sm:p-8">
        <SectionHeader
          eyebrow="软装选取"
          title="最后把家的气质慢慢拼起来"
          index={6}
          description="这一章更像生活方式收尾：先看整体候选，再回到每件单品的预算和理由。"
        />

        <BudgetSummary
          budget={items.reduce((sum, item) => sum + (item.budget || 0), 0)}
          actualPrice={items.reduce(
            (sum, item) => sum + (item.actualPrice || 0),
            0,
          )}
          className="mt-6"
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-soft"
            >
              <ImagePathField
                value={item.imagePath}
                alt={item.name || item.category}
                editMode={editMode}
                previewable
                onPreview={() => openPreview(item.id)}
                onChange={(value) => updateItem(item.id, "imagePath", value)}
              />

              <div className="mt-4 space-y-3">
                <EditableField
                  label="品类"
                  value={item.category}
                  placeholder="例如：沙发"
                  editMode={editMode}
                  onChange={(value) => updateItem(item.id, "category", value)}
                />
                <EditableField
                  label="商品名"
                  value={item.name}
                  placeholder="记录具体商品名或候选方案"
                  editMode={editMode}
                  onChange={(value) => updateItem(item.id, "name", value)}
                  displayClassName="text-lg font-semibold text-ink"
                />
                <EditableField
                  label="品牌 / 店铺"
                  value={item.brand}
                  placeholder="品牌、店铺或购买渠道"
                  editMode={editMode}
                  onChange={(value) => updateItem(item.id, "brand", value)}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <EditableField
                    label="预算"
                    value={item.budget}
                    placeholder="0"
                    editMode={editMode}
                    type="number"
                    onChange={(value) => updateItem(item.id, "budget", value)}
                  />
                  <EditableField
                    label="实付"
                    value={item.actualPrice}
                    placeholder="0"
                    editMode={editMode}
                    type="number"
                    onChange={(value) =>
                      updateItem(item.id, "actualPrice", value)
                    }
                  />
                </div>
                {editMode || item.reason.trim() ? (
                  <EditableField
                    label="选购理由"
                    value={item.reason}
                    placeholder="记录尺寸、材质、颜色或使用感考虑"
                    editMode={editMode}
                    multiline
                    onChange={(value) => updateItem(item.id, "reason", value)}
                  />
                ) : null}
                <EditableField
                  label="状态"
                  value={item.status}
                  placeholder="待挑选 / 候选第一优先级 / 已定"
                  editMode={editMode}
                  onChange={(value) => updateItem(item.id, "status", value)}
                />
              </div>

              {editMode ? (
                <button
                  type="button"
                  onClick={() => onChange(items.filter((entry) => entry.id !== item.id))}
                  className="mt-4 text-sm font-medium text-[#9a5b49]"
                >
                  删除这一项
                </button>
              ) : null}
            </article>
          ))}
        </div>

        {editMode ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  onChange([
                    ...items,
                    {
                      id: createId("soft"),
                      category,
                      name: "",
                      brand: "",
                      budget: 0,
                      actualPrice: 0,
                      reason: "",
                      status: "待挑选",
                      imagePath: "",
                    },
                  ])
                }
                className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-white"
              >
                新增 {category}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <ImageLightbox
        open={previewOpen && previewImages.length > 0}
        images={previewImages}
        activeIndex={previewIndex}
        onClose={() => setPreviewOpen(false)}
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
