import type {
  ApplianceCategory,
  ConstructionPhase,
  MaterialCategory,
  MaterialItem,
  RenovationPageData,
  SoftCategory,
  TileQuoteItem,
} from "@/types/renovation";

const materialCategories: MaterialCategory[] = [
  "施工",
  "定制",
  "封窗",
  "瓷砖",
  "木地板",
  "石材",
  "灯光",
  "其它",
];

const defaultTileQuotes: TileQuoteItem[] = [
  {
    id: "tile-living-room",
    label: "客厅",
    selection: "木纹砖",
    price: 0,
  },
  {
    id: "tile-kitchen-dining",
    label: "餐厨墙地",
    selection: "灰白砖",
    price: 0,
  },
  {
    id: "tile-feature-wall",
    label: "部分背景墙",
    selection: "马赛克小砖",
    price: 0,
  },
  {
    id: "tile-bathroom-dry",
    label: "公卫干区",
    selection: "哑光小砖",
    price: 0,
  },
];

const applianceCategories: ApplianceCategory[] = [
  "电视",
  "冰箱",
  "洗烘套装",
  "洗碗机",
  "油烟机",
  "燃气灶",
  "燃气热水器",
];

const constructionPhases: ConstructionPhase[] = [
  "成品保护",
  "拆除",
  "新建",
  "地面",
  "顶面",
  "墙面",
  "水电",
  "成品安装",
];

const softCategories: SoftCategory[] = [
  "沙发",
  "茶几",
  "床品",
  "餐桌",
  "厨具",
  "斗柜",
  "床头柜",
];

export const defaultContent: RenovationPageData = {
  meta: {
    title: "装修过程记录",
    subtitle: "把设计、选购、施工与软装选择沉淀成一页清晰记录",
    intro:
      "这是一页按装修顺序梳理的过程笔记。前期设计决定空间基调，中期采购和施工负责把控预算与落地质量，后期软装再把家的氛围慢慢补齐。",
    shareCopy: "一个可持续补充的装修过程记录页，方便自己回看，也方便发给家人朋友同步进度。",
    updatedAt: "2026-07-02T00:00:00.000Z",
  },
  design: {
    floorPlans: [
      {
        id: "design-floor-1",
        group: "floorPlans",
        title: "一版平面动线",
        note: "保留横厅开阔感，重点观察餐厨关系与储物补位。",
        imagePath: "/uploads/renovation/design/floor-plan-01.jpg",
      },
    ],
    elevations: [
      {
        id: "design-elevation-1",
        group: "elevations",
        title: "客厅立面推敲",
        note: "控制柜体比例和留白，预留灯光、插座与隐藏收纳。",
        imagePath: "/uploads/renovation/design/elevation-01.jpg",
      },
    ],
    renders: [
      {
        id: "design-render-1",
        group: "renders",
        title: "客餐厅氛围图",
        note: "低饱和木色和奶油灰做主基调，保证耐看和后期软装延展。",
        imagePath: "/uploads/renovation/design/render-01.jpg",
      },
    ],
  },
  materials: materialCategories.map((category, index) => ({
    id: `material-${index + 1}`,
    category,
    vendor: category === "瓷砖" ? "样板商家：广州 XX 岩板馆" : "待填写商家信息",
    selection: category === "施工" ? "" : "待确认最终选品",
    budget: category === "瓷砖" ? 18000 : 0,
    actualPrice: category === "瓷砖" ? 19600 : 0,
    note:
      category === "瓷砖"
        ? "预算略超，但通铺效果和砖面质感更稳定。"
        : "可记录方案对比、选品理由与议价过程。",
    pdfUrl: "",
    excelUrl: "",
    tileQuotes: category === "瓷砖" ? defaultTileQuotes : undefined,
    tileImagePath:
      category === "瓷砖" ? "/uploads/renovation/materials/tiles-overview.jpg" : undefined,
  })),
  appliances: applianceCategories.map((category, index) => ({
    id: `appliance-${index + 1}`,
    category,
    brandModel: index === 0 ? "示例型号：Sony 85 寸 Mini LED" : "",
    channel: index === 0 ? "京东自营 / 618 活动" : "",
    budget: index === 0 ? 12000 : 0,
    actualPrice: index === 0 ? 10999 : 0,
    status: index === 0 ? "已下单" : "待选购",
    note: index === 0 ? "优先考虑观影和护眼表现。" : "保留给后续补充。",
  })),
  construction: constructionPhases.map((phase, index) => ({
    id: `construction-${index + 1}`,
    phase,
    status: index < 2 ? "已完成" : index === 2 ? "进行中" : "未开始",
    plannedAt: index < 3 ? "2026-08" : "",
    progress: index < 2 ? "现场确认完成，已记录照片。" : index === 2 ? "砌墙定位已放样，待复核尺寸。" : "等待前置工序完成后启动。",
    detail:
      index === 0
        ? "入场当天完成门套、电梯、地砖防护，确保后续运输和施工安全。"
        : "记录工序节点、验收重点和现场照片编号。",
    risk: index === 2 ? "需同步确认空调风口和柜体碰撞。" : "暂无明显风险，持续跟踪。",
  })),
  softFurnishings: softCategories.map((category, index) => ({
    id: `soft-${index + 1}`,
    category,
    name: index === 0 ? "奶油色模块化沙发" : "待挑选商品",
    brand: index === 0 ? "示例店铺：某家居设计品牌" : "",
    budget: index === 0 ? 9500 : 0,
    actualPrice: index === 0 ? 8999 : 0,
    reason: index === 0 ? "线条柔和、落座舒适，和整体木色更协调。" : "记录尺寸、颜色、预算与选购理由。",
    status: index === 0 ? "候选第一优先级" : "待挑选",
    imagePath: index === 0 ? "/uploads/renovation/soft/sofa-01.jpg" : "",
  })),
};

export function deepCloneDefaultContent() {
  return JSON.parse(JSON.stringify(defaultContent)) as RenovationPageData;
}

export function mergeWithDefaultContent(
  partial?: Partial<RenovationPageData> | null,
) {
  const base = deepCloneDefaultContent();
  const baseMaterialsByCategory = new Map(
    base.materials.map((item) => [item.category, item]),
  );

  if (!partial) return base;

  const materialRoleCounters = new Map<string, number>();
  const normalizeMaterialRole = (item: MaterialItem) => {
    if (item.category !== "施工" && item.category !== "定制") {
      return item.quoteRole;
    }

    if (item.quoteRole) {
      return item.quoteRole;
    }

    const nextIndex = materialRoleCounters.get(item.category) ?? 0;
    materialRoleCounters.set(item.category, nextIndex + 1);

    return nextIndex === 0 ? "selected" : "comparison";
  };

  return {
    ...base,
    ...partial,
    meta: { ...base.meta, ...(partial.meta ?? {}) },
    design: {
      floorPlans: partial.design?.floorPlans?.length
        ? partial.design.floorPlans
        : base.design.floorPlans,
      elevations: partial.design?.elevations?.length
        ? partial.design.elevations
        : base.design.elevations,
      renders: partial.design?.renders?.length
        ? partial.design.renders
        : base.design.renders,
    },
    materials: partial.materials?.length
      ? partial.materials
          .filter((item) => String(item.category) !== "窗帘")
          .map((item) => {
            const baseMaterial = baseMaterialsByCategory.get(item.category);
            return {
              ...(baseMaterial ?? {
                pdfUrl: "",
                excelUrl: "",
              }),
              ...item,
              quoteRole: normalizeMaterialRole(item as MaterialItem),
              pdfUrl: item.pdfUrl ?? "",
              excelUrl: item.excelUrl ?? "",
              tileQuotes: item.tileQuotes ?? baseMaterial?.tileQuotes,
              tileImagePath: item.tileImagePath ?? baseMaterial?.tileImagePath,
            };
          })
      : base.materials,
    appliances: partial.appliances?.length
      ? partial.appliances
      : base.appliances,
    construction: partial.construction?.length
      ? partial.construction
      : base.construction,
    softFurnishings: partial.softFurnishings?.length
      ? partial.softFurnishings.map((item) => ({
          ...item,
          budget: item.budget ?? item.price ?? 0,
          actualPrice: item.actualPrice ?? item.price ?? 0,
        }))
      : base.softFurnishings,
  };
}
