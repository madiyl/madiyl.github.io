import { useState } from "react";
import { BudgetSummary } from "@/components/common/BudgetSummary";
import { EditableField } from "@/components/common/EditableField";
import { FilePreviewDialog } from "@/components/common/FilePreviewDialog";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import { ImagePathField } from "@/components/common/ImagePathField";
import { PriceBadge } from "@/components/common/PriceBadge";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { MaterialCategory, MaterialItem } from "@/types/renovation";
import { createId } from "@/utils/format";

type MaterialsStageProps = {
  materials: MaterialItem[];
  editMode: boolean;
  onChange: (next: MaterialItem[]) => void;
};

const categories: MaterialCategory[] = [
  "施工",
  "定制",
  "封窗",
  "瓷砖",
  "木地板",
  "石材",
  "灯光",
  "其它",
];

const attachmentConfig: Partial<
  Record<MaterialCategory, Array<{ key: "pdfUrl"; label: string; type: "pdf"; placeholder: string }>>
> = {
  施工: [
    {
      key: "pdfUrl",
      label: "PDF 文件",
      type: "pdf",
      placeholder: "/uploads/renovation/docs/construction-quote.pdf",
    },
  ],
  定制: [
    {
      key: "pdfUrl",
      label: "PDF 文件",
      type: "pdf",
      placeholder: "/uploads/renovation/docs/customization-quote.pdf",
    },
  ],
  封窗: [
    {
      key: "pdfUrl",
      label: "PDF 文件",
      type: "pdf",
      placeholder: "/uploads/renovation/docs/window-quote.pdf",
    },
  ],
  石材: [
    {
      key: "pdfUrl",
      label: "PDF 文件",
      type: "pdf",
      placeholder: "/uploads/renovation/docs/stone-quote.pdf",
    },
  ],
  灯光: [
    {
      key: "pdfUrl",
      label: "PDF 文件",
      type: "pdf",
      placeholder: "/uploads/renovation/docs/lighting-plan.pdf",
    },
  ],
};

const dualVendorCategories: MaterialCategory[] = ["施工", "定制"];

function isDualVendorCategory(category: MaterialCategory) {
  return dualVendorCategories.includes(category);
}

export function MaterialsStage({
  materials,
  editMode,
  onChange,
}: MaterialsStageProps) {
  const [previewImageItemId, setPreviewImageItemId] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<{
    title: string;
    url: string;
    type: "pdf";
  } | null>(null);

  const normalizedMaterials = categories.reduce<MaterialItem[]>(
    (accumulator, category) => {
      const items = materials.filter((item) => item.category === category);

      if (!isDualVendorCategory(category)) {
        accumulator.push(...items);
        return accumulator;
      }

      const selectedItems = items.filter((item) => item.quoteRole === "selected");
      const comparisonItems = items.filter((item) => item.quoteRole !== "selected");
      const normalizedItems: MaterialItem[] = [...selectedItems, ...comparisonItems].map(
        (item, index) => ({
          ...item,
          quoteRole: index === 0 ? "selected" : "comparison",
        }),
      );

      accumulator.push(...normalizedItems);
      return accumulator;
    },
    [],
  );

  const summaryMaterials = normalizedMaterials.filter((item) => {
    if (!isDualVendorCategory(item.category)) {
      return true;
    }

    return item.quoteRole === "selected";
  });

  const updateItem = (id: string, key: keyof MaterialItem, value: string) => {
    onChange(
      materials.map((item) =>
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

  const createMaterialDraft = (category: MaterialCategory): MaterialItem => {
    const existingItems = normalizedMaterials.filter((item) => item.category === category);
    const nextRole =
      isDualVendorCategory(category) && existingItems.some((item) => item.quoteRole === "selected")
        ? "comparison"
        : "selected";

    return {
      id: createId("material"),
      category,
      quoteRole: isDualVendorCategory(category) ? nextRole : undefined,
      vendor: "",
      selection: "",
      budget: 0,
      actualPrice: 0,
      note: "",
      pdfUrl: "",
      excelUrl: "",
      tileQuotes: undefined,
      tileImagePath: undefined,
    };
  };

  const updateTileQuote = (
    id: string,
    quoteId: string,
    key: "selection" | "price",
    value: string,
  ) => {
    onChange(
      materials.map((item) =>
        item.id === id
          ? {
              ...item,
              tileQuotes: (item.tileQuotes ?? []).map((quote) =>
                quote.id === quoteId
                  ? {
                      ...quote,
                      [key]: key === "price" ? Number(value || 0) : value,
                    }
                  : quote,
              ),
            }
          : item,
      ),
    );
  };

  const openPreview = (
    item: MaterialItem,
    key: "pdfUrl",
    type: "pdf",
  ) => {
    const url = item[key];
    if (!url) return;

    setPreviewFile({
      title: item.vendor || `${item.category}附件预览`,
      url,
      type,
    });
  };

  const renderAttachmentSection = (item: MaterialItem) => {
    const fields = attachmentConfig[item.category];
    if (!fields?.length) return null;

    return (
      <div className="space-y-3">
        {fields.map((field) => {
          const value = item[field.key];

          if (!editMode && !value) {
            return null;
          }

          return (
          <div key={`${item.id}-${field.key}`} className="space-y-3">
            {editMode ? (
              <EditableField
                label={field.label}
                value={value}
                placeholder={field.placeholder}
                editMode={editMode}
                onChange={(value) => updateItem(item.id, field.key, value)}
              />
            ) : (
              <div className="space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
                  {field.label}
                </div>
              </div>
            )}
            {value ? (
              <button
                type="button"
                onClick={() => openPreview(item, field.key, field.type)}
                className="flex w-full items-center justify-between rounded-[22px] border border-line bg-[#f6efe6] px-4 py-3 text-left text-sm text-ink transition hover:bg-white"
              >
                <span className="font-medium">预览 PDF 附件</span>
                <span className="text-[#8f7d69]">点击查看</span>
              </button>
            ) : null}
          </div>
        )})}
      </div>
    );
  };

  const renderGeneralCard = (item: MaterialItem) => (
    <article
      key={item.id}
      className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-soft"
    >
      <div className="space-y-4">
        {isDualVendorCategory(item.category) ? (
          <div
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              item.quoteRole === "selected"
                ? "bg-[#efe1cf] text-[#8a5d35]"
                : "bg-[#ece8e1] text-[#6f675e]"
            }`}
          >
            {item.quoteRole === "selected" ? "已选方案" : "对比方案"}
          </div>
        ) : null}
        <EditableField
          label="商家介绍"
          value={item.vendor}
          placeholder="商家名称、渠道、联系人或背景"
          editMode={editMode}
          multiline
          onChange={(value) => updateItem(item.id, "vendor", value)}
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
            label="实际价格"
            value={item.actualPrice}
            placeholder="0"
            editMode={editMode}
            type="number"
            onChange={(value) => updateItem(item.id, "actualPrice", value)}
          />
        </div>
        <PriceBadge budget={item.budget} actualPrice={item.actualPrice} />
        {editMode || item.note.trim() ? (
          <EditableField
            label="备注"
            value={item.note}
            placeholder="记录议价过程、安装要求或后续待办"
            editMode={editMode}
            multiline
            onChange={(value) => updateItem(item.id, "note", value)}
          />
        ) : null}
        {renderAttachmentSection(item)}
      </div>

      {editMode ? (
        <button
          type="button"
          onClick={() => onChange(materials.filter((entry) => entry.id !== item.id))}
          className="mt-4 text-sm font-medium text-[#9a5b49]"
        >
          删除这一项
        </button>
      ) : null}
    </article>
  );

  const renderTileCard = (item: MaterialItem) => (
    <article
      key={item.id}
      className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-soft"
    >
      <div className="space-y-5">
        <EditableField
          label="商家介绍"
          value={item.vendor}
          placeholder="商家名称、渠道、联系人或背景"
          editMode={editMode}
          multiline
          onChange={(value) => updateItem(item.id, "vendor", value)}
        />

        <div className="grid gap-3 rounded-[24px] border border-line bg-[#faf6f1] p-3 md:grid-cols-2 xl:grid-cols-4">
          {(item.tileQuotes ?? []).map((quote) => (
            <div
              key={quote.id}
              className="rounded-[20px] border border-line bg-white/75 px-4 py-4"
            >
              <div className="space-y-3">
                <div className="text-sm font-semibold text-[#7c6a58]">{quote.label}</div>
                <EditableField
                  label="材料"
                  value={quote.selection}
                  placeholder="填写砖型或材质"
                  editMode={editMode}
                  onChange={(value) =>
                    updateTileQuote(item.id, quote.id, "selection", value)
                  }
                />
                <EditableField
                  label="报价"
                  value={quote.price}
                  placeholder="0"
                  editMode={editMode}
                  type="number"
                  onChange={(value) =>
                    updateTileQuote(item.id, quote.id, "price", value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

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
            onChange={(value) => updateItem(item.id, "actualPrice", value)}
          />
        </div>

        <PriceBadge budget={item.budget} actualPrice={item.actualPrice} />

        {editMode || item.note.trim() ? (
          <EditableField
            label="备注"
            value={item.note}
            placeholder="记录铺贴方式、损耗、收口或预算口径"
            editMode={editMode}
            multiline
            onChange={(value) => updateItem(item.id, "note", value)}
          />
        ) : null}

        <ImagePathField
          value={item.tileImagePath ?? ""}
          alt="瓷砖示意图"
          editMode={editMode}
          onChange={(value) => updateItem(item.id, "tileImagePath", value)}
          ratioClassName="aspect-[16/8]"
          previewable
          onPreview={() => setPreviewImageItemId(item.id)}
          zoomOnHover={false}
        />
      </div>

      {editMode ? (
        <button
          type="button"
          onClick={() => onChange(materials.filter((entry) => entry.id !== item.id))}
          className="mt-4 text-sm font-medium text-[#9a5b49]"
        >
          删除这一项
        </button>
      ) : null}
    </article>
  );

  return (
    <section id="materials" className="rounded-[34px] border border-[rgba(255,255,255,0.74)] bg-[linear-gradient(180deg,rgba(248,244,238,0.95),rgba(244,238,230,0.88))] p-6 shadow-soft sm:p-8">
      <SectionHeader
        eyebrow="主材选购"
        title="主材选择与预算结果"
        index={3}
        description="这一章优先看清预算结果、方案对比和附件证据，再回到每一类材料的细节。"
      />

      <BudgetSummary
        budget={summaryMaterials.reduce((sum, item) => sum + (item.budget || 0), 0)}
        actualPrice={summaryMaterials.reduce(
          (sum, item) => sum + (item.actualPrice || 0),
          0,
        )}
        className="mt-6"
      />

      <div className="mt-8 space-y-8">
        {categories.map((category) => {
          const items = normalizedMaterials.filter((item) => item.category === category);
          const canAddItem =
            editMode &&
            category !== "瓷砖" &&
            (!isDualVendorCategory(category) || items.length < 2);

          return (
            <div key={category} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-ink">{category}</h3>
                {canAddItem ? (
                  <button
                    type="button"
                    onClick={() =>
                      onChange([
                        ...materials,
                        createMaterialDraft(category),
                      ])
                    }
                    className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-white"
                  >
                    新增条目
                  </button>
                ) : null}
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {items.map((item) =>
                  item.category === "瓷砖" ? renderTileCard(item) : renderGeneralCard(item),
                )}
              </div>
            </div>
          );
        })}
      </div>

      <FilePreviewDialog
        open={Boolean(previewFile?.url)}
        url={previewFile?.url ?? ""}
        title={previewFile?.title ?? "附件预览"}
        fileType={previewFile?.type ?? "pdf"}
        onClose={() => setPreviewFile(null)}
      />

      <ImageLightbox
        open={Boolean(previewImageItemId)}
        images={
          previewImageItemId
            ? [
                {
                  src:
                    materials.find((item) => item.id === previewImageItemId)?.tileImagePath ??
                    "",
                  alt: "瓷砖示意图",
                  caption:
                    materials.find((item) => item.id === previewImageItemId)?.note ?? "",
                },
              ].filter((image) => image.src)
            : []
        }
        activeIndex={0}
        onClose={() => setPreviewImageItemId(null)}
        onSelect={() => {}}
        onPrev={() => {}}
        onNext={() => {}}
      />
    </section>
  );
}
