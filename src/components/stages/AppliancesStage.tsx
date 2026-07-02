import { EditableField } from "@/components/common/EditableField";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { ApplianceCategory, ApplianceItem } from "@/types/renovation";
import { createId } from "@/utils/format";

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
  "油烟机",
  "燃气灶",
  "燃气热水器",
];

export function AppliancesStage({
  appliances,
  editMode,
  onChange,
}: AppliancesStageProps) {
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

  return (
    <section id="appliances" className="rounded-[32px] border border-white/60 bg-[#f4efe7] p-6 shadow-soft sm:p-8">
      <SectionHeader
        eyebrow="电器选购"
        title="把型号和购买节点理成清单"
        index={3}
      />

      <div className="space-y-4">
        {categories.map((category) => {
          const item =
            appliances.find((entry) => entry.category === category) ?? null;

          return (
            <article
              key={category}
              className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-soft"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-ink">{category}</h3>
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
                          channel: "",
                          budget: 0,
                          actualPrice: 0,
                          status: "待选购",
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

              {item ? (
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <EditableField
                    label="品牌型号"
                    value={item.brandModel}
                    placeholder="例如：某品牌 85 寸电视"
                    editMode={editMode}
                    onChange={(value) => updateItem(item.id, "brandModel", value)}
                  />
                  <EditableField
                    label="购买渠道"
                    value={item.channel}
                    placeholder="电商平台 / 线下门店 / 团购"
                    editMode={editMode}
                    onChange={(value) => updateItem(item.id, "channel", value)}
                  />
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
                  <EditableField
                    label="状态"
                    value={item.status}
                    placeholder="待选购 / 已下单 / 已安装"
                    editMode={editMode}
                    onChange={(value) => updateItem(item.id, "status", value)}
                  />
                  <EditableField
                    label="备注"
                    value={item.note}
                    placeholder="记录赠品、配送、安装条件或取舍原因"
                    editMode={editMode}
                    multiline
                    onChange={(value) => updateItem(item.id, "note", value)}
                  />
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
    </section>
  );
}
