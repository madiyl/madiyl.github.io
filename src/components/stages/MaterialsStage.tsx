import { useState } from "react";
import { BudgetSummary } from "@/components/common/BudgetSummary";
import { EditableField } from "@/components/common/EditableField";
import { FilePreviewDialog } from "@/components/common/FilePreviewDialog";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import { ImagePathField } from "@/components/common/ImagePathField";
import { PriceBadge } from "@/components/common/PriceBadge";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { MaterialCategory, MaterialItem } from "@/types/renovation";
import { createId, formatCurrency } from "@/utils/format";

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

function formatMaterialBrowseSummary(item: MaterialItem) {
  const note = item.note.trim();
  if (note) {
    return note;
  }

  switch (item.category) {
    case "施工":
      return "把报价口径、施工边界和落地节奏放在一起看。";
    case "定制":
      return "把柜体预算、材质方向和安装节点放在一起看。";
    case "封窗":
      return "先看窗型方案、玻璃配置和边界处理。";
    case "木地板":
      return "把颜色样本、铺贴方向和损耗口径顺一遍。";
    case "石材":
      return "把纹理选择、加工范围和收口关系并排看。";
    case "灯光":
      return "把灯具清单、预算结果和回路关系压在一起看。";
    default:
      return "把价格结果、资料附件和备注信息放在一起看。";
  }
}

function formatTileBrowseSummary(item: MaterialItem) {
  const note = item.note.trim();
  if (note) {
    return note;
  }

  return "把空间报价、砖型选择和铺贴范围放在一起看。";
}

function getAttachmentBrowseLabel(item: MaterialItem) {
  switch (item.category) {
    case "施工":
    case "定制":
      return "报价资料";
    case "灯光":
      return "灯光资料";
    case "石材":
      return "石材资料";
    default:
      return "附件资料";
  }
}

function getBudgetDeltaLabel(budget: number, actualPrice: number) {
  const delta = actualPrice - budget;

  if (delta === 0) {
    return formatCurrency(0);
  }

  if (delta > 0) {
    return formatCurrency(delta);
  }

  return `-${formatCurrency(Math.abs(delta))}`;
}

function renderBudgetResultStrip(budget: number, actualPrice: number) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e8dccd] bg-[linear-gradient(180deg,rgba(252,248,243,0.98),rgba(247,240,231,0.96))]">
      <div className="grid sm:grid-cols-3">
        {[
          { label: "预算", value: formatCurrency(budget) },
          { label: "实际价格", value: formatCurrency(actualPrice) },
          { label: "超出", value: getBudgetDeltaLabel(budget, actualPrice) },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className={`px-4 py-4 sm:px-5 sm:py-5 ${
              index === 0 ? "" : "border-t border-[#e8dccd] sm:border-l sm:border-t-0"
            }`}
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b8a76]">
              {stat.label}
            </div>
            <div className="mt-2 text-[1.05rem] font-semibold tracking-[-0.02em] text-ink sm:text-[1.12rem]">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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

          if (editMode) {
            return (
              <div key={`${item.id}-${field.key}`} className="space-y-3">
                <EditableField
                  label={field.label}
                  value={value}
                  placeholder={field.placeholder}
                  editMode={editMode}
                  onChange={(nextValue) => updateItem(item.id, field.key, nextValue)}
                />
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
            );
          }

          return (
            <button
              key={`${item.id}-${field.key}`}
              type="button"
              onClick={() => openPreview(item, field.key, field.type)}
              className="flex w-full items-center justify-between rounded-[22px] border border-[#e9dfd2] bg-[#f8f2ea] px-4 py-3 text-left transition hover:bg-white"
            >
              <div className="space-y-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a8771]">
                  {getAttachmentBrowseLabel(item)}
                </div>
                <div className="text-sm font-medium text-ink">预览 PDF 附件</div>
              </div>
              <span className="text-sm text-[#8f7d69]">打开</span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderGeneralCard = (item: MaterialItem) => (
    <article
      key={item.id}
      className={`rounded-[30px] border p-5 shadow-soft transition sm:p-6 ${
        !editMode && item.quoteRole === "selected"
          ? "border-[#eadcc8] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(247,240,230,0.94))]"
          : "border-white/70 bg-white/88"
      }`}
    >
      {editMode ? (
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
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            {isDualVendorCategory(item.category) ? (
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  item.quoteRole === "selected"
                    ? "bg-[#efe1cf] text-[#8a5d35]"
                    : "bg-[#ece8e1] text-[#6f675e]"
                }`}
              >
                {item.quoteRole === "selected" ? "已选方案" : "对比方案"}
              </span>
            ) : null}
            <span className="inline-flex rounded-full bg-[#f5ede4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8f7d69]">
              {item.category}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-[1.1rem] font-semibold tracking-[-0.02em] text-ink">
              {item.vendor.trim() || `${item.category}待补充商家`}
            </div>
            <div className="text-sm leading-7 text-[#6f6256]">
              {formatMaterialBrowseSummary(item)}
            </div>
          </div>

          {renderBudgetResultStrip(item.budget, item.actualPrice)}

          {renderAttachmentSection(item)}
        </div>
      )}

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
      className="rounded-[30px] border border-white/70 bg-white/88 p-5 shadow-soft sm:p-6"
    >
      {editMode ? (
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
      ) : (
        <div className="space-y-5">
          <div className="space-y-2">
            <span className="inline-flex rounded-full bg-[#f5ede4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8f7d69]">
              瓷砖
            </span>
            <div className="text-[1.1rem] font-semibold tracking-[-0.02em] text-ink">
              {item.vendor.trim() || "待补充瓷砖商家"}
            </div>
          </div>

          <ImagePathField
            value={item.tileImagePath ?? ""}
            alt="瓷砖示意图"
            editMode={false}
            onChange={() => {}}
            ratioClassName="aspect-[16/9]"
            previewable
            onPreview={() => setPreviewImageItemId(item.id)}
            zoomOnHover={false}
          />

          <div className="grid gap-3 rounded-[24px] border border-[#eee3d5] bg-[#fcf8f3] p-3 md:grid-cols-2 xl:grid-cols-4">
            {(item.tileQuotes ?? []).map((quote) => (
              <div key={quote.id} className="rounded-[18px] bg-white/88 px-4 py-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#9b8a76]">
                  {quote.label}
                </div>
                <div className="mt-2 text-sm font-semibold text-ink">
                  {quote.selection || "待补充材料"}
                </div>
                <div className="mt-3 text-sm text-[#6f6256]">
                  {formatCurrency(quote.price)}
                </div>
              </div>
            ))}
          </div>

          {renderBudgetResultStrip(item.budget, item.actualPrice)}

          <div className="rounded-[18px] border border-[#eee3d5] bg-[#fcf8f3] px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#9b8a76]">备注</div>
            <div className="mt-2 text-sm leading-6 text-[#6f6256]">
              {formatTileBrowseSummary(item)}
            </div>
          </div>
        </div>
      )}

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
        description="这一章优先看清预算、方案对比和附件细节。"
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
