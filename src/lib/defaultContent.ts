import type {
  ApplianceCategory,
  ApplianceChannel,
  ApplianceStatus,
  CollaboratorGroup,
  ConstructionPhase,
  MaterialCategory,
  MaterialItem,
  PersonProfile,
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
  "烟灶套装",
  "燃气热水器",
];

const applianceChannels: ApplianceChannel[] = ["电商平台", "线下门店", "团购"];
const applianceStatuses: ApplianceStatus[] = ["选品", "加购", "已购"];
const legacyApplianceCategoryMap: Partial<Record<string, ApplianceCategory>> = {
  油烟机: "烟灶套装",
};

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

const collaboratorGroupOrder: CollaboratorGroup[] = ["业主", "Uni工作室", "主材商"];

const defaultPeople: PersonProfile[] = [
  {
    id: "person-owner-male",
    group: "业主",
    role: "男主人",
    name: "Madiyl_",
    avatarPath: "",
    note: "回头可补充微信头像与一句自我介绍。",
  },
  {
    id: "person-owner-female",
    group: "业主",
    role: "女主人",
    name: "怡萍 Elaine",
    avatarPath: "",
    note: "回头可补充微信头像与风格偏好说明。",
  },
  {
    id: "person-uni-designer",
    group: "Uni工作室",
    role: "设计师",
    name: "摇摇乐",
    avatarPath: "",
    note: "回头可补充微信头像与设计定位说明。",
  },
  {
    id: "person-uni-materials",
    group: "Uni工作室",
    role: "主材老师",
    name: "熊熊熊",
    avatarPath: "",
    note: "回头可补充微信头像与主材统筹说明。",
  },
  {
    id: "person-uni-construction",
    group: "Uni工作室",
    role: "施工老师",
    name: "🍀-乐乐乐乐乐乐_",
    avatarPath: "",
    note: "回头可补充微信头像与施工协同说明。",
  },
  {
    id: "person-uni-admin",
    group: "Uni工作室",
    role: "行政老师",
    name: "",
    avatarPath: "",
    note: "回头可补充微信头像与对接说明。",
  },
  {
    id: "vendor-customization",
    group: "主材商",
    role: "定制",
    name: "",
    avatarPath: "",
    note: "记录合作商家、联系人或供货节奏。",
  },
  {
    id: "vendor-window",
    group: "主材商",
    role: "封窗",
    name: "",
    avatarPath: "",
    note: "记录合作商家、联系人或供货节奏。",
  },
  {
    id: "vendor-tile",
    group: "主材商",
    role: "瓷砖",
    name: "",
    avatarPath: "",
    note: "记录合作商家、联系人或供货节奏。",
  },
  {
    id: "vendor-wood-floor",
    group: "主材商",
    role: "木地板",
    name: "",
    avatarPath: "",
    note: "记录合作商家、联系人或供货节奏。",
  },
  {
    id: "vendor-stone",
    group: "主材商",
    role: "石材",
    name: "",
    avatarPath: "",
    note: "记录合作商家、联系人或供货节奏。",
  },
  {
    id: "vendor-lighting",
    group: "主材商",
    role: "灯光",
    name: "",
    avatarPath: "",
    note: "记录合作商家、联系人或供货节奏。",
  },
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
  people: defaultPeople,
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
    channel: index === 0 ? "电商平台" : "线下门店",
    productUrl: "",
    imageDir: index === 0 ? "/uploads/renovation/product/tv" : "",
    budget: index === 0 ? 12000 : 0,
    actualPrice: index === 0 ? 10999 : 0,
    status: index === 0 ? "已购" : "选品",
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
  const partialPeopleById = new Map(
    (partial.people ?? [])
      .filter((item) => Boolean(item?.id))
      .map((item) => [item.id, item]),
  );
  const legacyRoleMapping: Record<
    string,
    { group: CollaboratorGroup; role: string }
  > = {
    男主人: { group: "业主", role: "男主人" },
    女主人: { group: "业主", role: "女主人" },
    设计老师: { group: "Uni工作室", role: "设计师" },
    设计师: { group: "Uni工作室", role: "设计师" },
    预算老师: { group: "Uni工作室", role: "主材老师" },
    主材老师: { group: "Uni工作室", role: "主材老师" },
    施工老师: { group: "Uni工作室", role: "施工老师" },
    行政老师: { group: "Uni工作室", role: "行政老师" },
    定制: { group: "主材商", role: "定制" },
    封窗: { group: "主材商", role: "封窗" },
    瓷砖: { group: "主材商", role: "瓷砖" },
    木地板: { group: "主材商", role: "木地板" },
    石材: { group: "主材商", role: "石材" },
    灯光: { group: "主材商", role: "灯光" },
  };
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
    people: partial.people?.length
      ? defaultPeople.map((person) => {
          const matchedById = partialPeopleById.get(person.id);
          const matched =
            matchedById ??
            partial.people?.find((item) => {
              const mappedLegacyRole = legacyRoleMapping[item.role ?? ""];
              const nextGroup = item.group ?? mappedLegacyRole?.group;
              const nextRole = mappedLegacyRole?.role ?? item.role;

              return nextGroup === person.group && nextRole === person.role;
            });

          return {
            ...person,
            ...matched,
            group: matched?.group ?? person.group,
            role: legacyRoleMapping[matched?.role ?? ""]?.role ?? matched?.role ?? person.role,
            avatarPath: matched?.avatarPath ?? "",
            note: matched?.note ?? person.note,
          };
        }).sort(
          (left, right) =>
            collaboratorGroupOrder.indexOf(left.group) -
              collaboratorGroupOrder.indexOf(right.group) ||
            defaultPeople.findIndex((item) => item.id === left.id) -
              defaultPeople.findIndex((item) => item.id === right.id),
        )
      : base.people,
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
              note: item.note ?? baseMaterial?.note ?? "",
              pdfUrl: item.pdfUrl ?? "",
              excelUrl: item.excelUrl ?? "",
              tileQuotes: item.tileQuotes ?? baseMaterial?.tileQuotes,
              tileImagePath: item.tileImagePath ?? baseMaterial?.tileImagePath,
            };
          })
      : base.materials,
    appliances: partial.appliances?.length
      ? partial.appliances.map((item) => ({
          ...item,
          category:
            legacyApplianceCategoryMap[String(item.category)] ??
            (item.category as ApplianceCategory),
          channel: applianceChannels.includes(item.channel as ApplianceChannel)
            ? (item.channel as ApplianceChannel)
            : "电商平台",
          productUrl: item.productUrl ?? "",
          imageDir: item.imageDir ?? "",
          status: applianceStatuses.includes(item.status as ApplianceStatus)
            ? (item.status as ApplianceStatus)
            : "选品",
        }))
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
