import { EditableField } from "@/components/common/EditableField";
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
  "窗帘",
  "其它",
];

export function MaterialsStage({
  materials,
  editMode,
  onChange,
}: MaterialsStageProps) {
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

  return (
    <section id="materials" className="rounded-[32px] border border-white/60 bg-[#f8f4ee] p-6 shadow-soft sm:p-8">
      <SectionHeader
        eyebrow="主材选购"
        title="主材选择与预算结果"
        index={2}
      />

      <div className="space-y-8">
        {categories.map((category) => {
          const items = materials.filter((item) => item.category === category);

          return (
            <div key={category} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-ink">{category}</h3>
                {editMode ? (
                  <button
                    type="button"
                    onClick={() =>
                      onChange([
                        ...materials,
                        {
                          id: createId("material"),
                          category,
                          vendor: "",
                          selection: "",
                          budget: 0,
                          actualPrice: 0,
                          note: "",
                        },
                      ])
                    }
                    className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-white"
                  >
                    新增条目
                  </button>
                ) : null}
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-soft"
                  >
                    <div className="space-y-4">
                      <EditableField
                        label="商家介绍"
                        value={item.vendor}
                        placeholder="商家名称、渠道、联系人或背景"
                        editMode={editMode}
                        multiline
                        onChange={(value) => updateItem(item.id, "vendor", value)}
                      />
                      <EditableField
                        label="最终选品"
                        value={item.selection}
                        placeholder="记录最终型号、材质、颜色或方案"
                        editMode={editMode}
                        onChange={(value) => updateItem(item.id, "selection", value)}
                        displayClassName="text-lg font-semibold text-ink"
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
                          onChange={(value) =>
                            updateItem(item.id, "actualPrice", value)
                          }
                        />
                      </div>
                      <PriceBadge
                        budget={item.budget}
                        actualPrice={item.actualPrice}
                      />
                      <EditableField
                        label="备注"
                        value={item.note}
                        placeholder="记录议价过程、安装要求或后续待办"
                        editMode={editMode}
                        multiline
                        onChange={(value) => updateItem(item.id, "note", value)}
                      />
                    </div>

                    {editMode ? (
                      <button
                        type="button"
                        onClick={() =>
                          onChange(materials.filter((entry) => entry.id !== item.id))
                        }
                        className="mt-4 text-sm font-medium text-[#9a5b49]"
                      >
                        删除这一项
                      </button>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
