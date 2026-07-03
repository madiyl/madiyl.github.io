import { useEffect, useMemo, useState } from "react";
import { BudgetSummary } from "@/components/common/BudgetSummary";
import { EditableField } from "@/components/common/EditableField";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import { PriceBadge } from "@/components/common/PriceBadge";
import { SectionHeader } from "@/components/common/SectionHeader";
import type {
  ApplianceCategory,
  ApplianceChannel,
  ApplianceItem,
  ApplianceStatus,
} from "@/types/renovation";
import { createId } from "@/utils/format";
import { loadApplianceImages } from "@/utils/applianceImages";
import { getLinkDisplayPrefix } from "@/utils/url";

type AppliancesStageProps = {
  appliances: ApplianceItem[];
  editMode: boolean;
  onChange: (next: ApplianceItem[]) => void;
};

const categories: ApplianceCategory[] = [
  "电视",
  "冰箱",
  "洗烘套装",
  "洗碗机",
  "烟灶套装",
  "燃气热水器",
];

const channelOptions: ApplianceChannel[] = ["电商平台", "线下门店", "团购"];
const statusOptions: ApplianceStatus[] = ["选品", "加购", "已购"];

type SelectFieldProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  editMode: boolean;
  onChange: (value: T) => void;
};

function SelectField<T extends string>({
  label,
  value,
  options,
  editMode,
  onChange,
}: SelectFieldProps<T>) {
  if (!editMode) {
    return (
      <div className="space-y-2">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
          {label}
        </div>
        <div className="min-h-[1.5rem] text-sm leading-7 text-[#51453a]">{value}</div>
      </div>
    );
  }

  return (
    <label className="block space-y-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm leading-7 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AppliancesStage({
  appliances,
  editMode,
  onChange,
}: AppliancesStageProps) {
  const [imageMap, setImageMap] = useState<Record<string, string[]>>({});
  const [previewCategory, setPreviewCategory] = useState<ApplianceCategory | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const entries = await Promise.all(
        appliances.map(async (item) => {
          if (!item.imageDir.trim()) {
            return [item.id, []] as const;
          }

          try {
            const images = await loadApplianceImages(item.imageDir);
            return [item.id, images] as const;
          } catch {
            return [item.id, []] as const;
          }
        }),
      );

      if (cancelled) return;

      setImageMap(
        Object.fromEntries(entries),
      );
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [appliances]);

  const updateItem = (id: string, key: keyof ApplianceItem, value: string) => {
    onChange(
      appliances.map((item) =>
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

  const previewImages = useMemo(() => {
    if (!previewCategory) return [];

    const item = appliances.find((entry) => entry.category === previewCategory);
    if (!item) return [];

    return (imageMap[item.id] ?? []).map((src, index) => ({
      src,
      alt: `${item.category} 预览图 ${index + 1}`,
      caption: item.brandModel || item.note || "",
    }));
  }, [appliances, imageMap, previewCategory]);

  return (
    <section id="appliances" className="rounded-[32px] border border-white/60 bg-[#f4efe7] p-6 shadow-soft sm:p-8">
      <SectionHeader
        eyebrow="电器选购"
        title="把型号和购买节点理成清单"
        index={4}
      />

      <BudgetSummary
        budget={appliances.reduce((sum, item) => sum + (item.budget || 0), 0)}
        actualPrice={appliances.reduce(
          (sum, item) => sum + (item.actualPrice || 0),
          0,
        )}
        className="mt-6"
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const item =
            appliances.find((entry) => entry.category === category) ?? null;

          return (
            <article
              key={category}
              className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-soft"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-ink">{category}</h3>

                  {item ? (
                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
                        品牌型号
                      </div>
                      {editMode ? (
                        <input
                          value={item.brandModel}
                          onChange={(event) =>
                            updateItem(item.id, "brandModel", event.target.value)
                          }
                          placeholder="例如：某品牌 85 寸电视"
                          className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm leading-7 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                        />
                      ) : (
                        <div className="min-h-[1.75rem] text-base leading-7 text-[#51453a]">
                          {item.brandModel || "待填写"}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                {!item && editMode ? (
                  <button
                    type="button"
                    onClick={() =>
                      onChange([
                        ...appliances,
                        {
                          id: createId("appliance"),
                          category,
                          brandModel: "",
                          channel: "电商平台",
                          productUrl: "",
                          imageDir: "",
                          budget: 0,
                          actualPrice: 0,
                          status: "选品",
                          note: "",
                        },
                      ])
                    }
                    className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-white"
                  >
                    新增条目
                  </button>
                ) : null}

                {item && (imageMap[item.id]?.[0] ?? "") ? (
                  <div className="shrink-0 space-y-2 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewCategory(item.category);
                        setPreviewIndex(0);
                      }}
                      className="group relative h-24 w-24 overflow-hidden rounded-[22px] border border-white/70 bg-[#f6efe6] shadow-soft sm:h-28 sm:w-28"
                    >
                      <img
                        src={imageMap[item.id]?.[0]}
                        alt={`${item.category} 预览首图`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                      <span className="absolute bottom-2 right-2 rounded-full bg-[#2f261f]/68 px-2 py-1 text-[10px] font-medium text-white">
                        放大
                      </span>
                    </button>
                    <div className="text-xs font-medium text-[#8f7d69]">
                      共 {imageMap[item.id].length} 张预览图
                    </div>
                  </div>
                ) : null}
              </div>

              {item ? (
                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <SelectField
                      label="购买渠道"
                      value={item.channel}
                      options={channelOptions}
                      editMode={editMode}
                      onChange={(value) => updateItem(item.id, "channel", value)}
                    />
                    <SelectField
                      label="状态"
                      value={item.status}
                      options={statusOptions}
                      editMode={editMode}
                      onChange={(value) => updateItem(item.id, "status", value)}
                    />
                  </div>
                  {editMode ? (
                    <>
                      <EditableField
                        label="商品链接"
                        value={item.productUrl}
                        placeholder="https://..."
                        editMode={editMode}
                        onChange={(value) => updateItem(item.id, "productUrl", value)}
                      />
                      <EditableField
                        label="图片目录"
                        value={item.imageDir}
                        placeholder="/uploads/renovation/product/..."
                        editMode={editMode}
                        onChange={(value) => updateItem(item.id, "imageDir", value)}
                      />
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
                        商品链接
                      </div>
                      <div className="flex min-h-[2.75rem] items-center justify-between gap-3 rounded-[20px] border border-white/70 bg-[#f8f3ec] px-4 py-2">
                        <div className="min-w-0 text-sm text-[#6f6154]">
                          {item.productUrl ? (
                            <span className="truncate font-medium">
                              {getLinkDisplayPrefix(item.productUrl)}
                            </span>
                          ) : (
                            <span className="text-[#8b7966]">暂无链接</span>
                          )}
                        </div>
                        {item.productUrl ? (
                          <a
                            href={item.productUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex shrink-0 items-center rounded-full border border-line/80 bg-white/70 px-3 py-1.5 text-xs font-medium text-[#6f6154] transition hover:bg-white"
                          >
                            点击跳转
                          </a>
                        ) : null}
                      </div>
                    </div>
                  )}
                  {editMode ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <EditableField
                        label="预算"
                        value={item.budget}
                        placeholder="0"
                        type="number"
                        editMode={editMode}
                        onChange={(value) => updateItem(item.id, "budget", value)}
                      />
                      <EditableField
                        label="成交价"
                        value={item.actualPrice}
                        placeholder="0"
                        type="number"
                        editMode={editMode}
                        onChange={(value) => updateItem(item.id, "actualPrice", value)}
                      />
                    </div>
                  ) : null}
                  <PriceBadge budget={item.budget} actualPrice={item.actualPrice} />
                  {editMode || item.note.trim() ? (
                    <EditableField
                      label="备注"
                      value={item.note}
                      placeholder="记录赠品、配送、安装条件或取舍原因"
                      editMode={editMode}
                      multiline
                      onChange={(value) => updateItem(item.id, "note", value)}
                    />
                  ) : null}
                </div>
              ) : (
                <div className="mt-4 rounded-[24px] bg-[#f7f1ea] px-4 py-5 text-sm leading-7 text-[#8b7966]">
                  暂未填写，可在编辑模式中补充这一类电器的品牌型号与价格信息。
                </div>
              )}
            </article>
          );
        })}
      </div>

      <ImageLightbox
        open={Boolean(previewCategory && previewImages.length)}
        images={previewImages}
        activeIndex={previewIndex}
        onClose={() => setPreviewCategory(null)}
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
    </section>
  );
}
