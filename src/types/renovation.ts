export type DesignGroupKey = "floorPlans" | "elevations" | "renders";

export type MaterialCategory =
  | "施工"
  | "定制"
  | "封窗"
  | "瓷砖"
  | "木地板"
  | "石材"
  | "灯光"
  | "窗帘"
  | "其它";

export type ApplianceCategory =
  | "电视"
  | "冰箱"
  | "洗烘套装"
  | "洗碗机"
  | "油烟机"
  | "燃气灶"
  | "燃气热水器";

export type ConstructionPhase =
  | "成品保护"
  | "拆除"
  | "新建"
  | "地面"
  | "顶面"
  | "墙面"
  | "水电"
  | "成品安装";

export type ConstructionStatus = "未开始" | "进行中" | "已完成" | "待复查";

export type SoftCategory =
  | "沙发"
  | "茶几"
  | "床品"
  | "餐桌"
  | "厨具"
  | "斗柜"
  | "床头柜"
  | "其它";

export type SiteMeta = {
  title: string;
  subtitle: string;
  intro: string;
  shareCopy: string;
  updatedAt: string;
};

export type DesignAsset = {
  id: string;
  group: DesignGroupKey;
  title: string;
  note: string;
  imagePath: string;
};

export type MaterialItem = {
  id: string;
  category: MaterialCategory;
  vendor: string;
  selection: string;
  budget: number;
  actualPrice: number;
  note: string;
};

export type ApplianceItem = {
  id: string;
  category: ApplianceCategory;
  brandModel: string;
  channel: string;
  budget: number;
  actualPrice: number;
  status: string;
  note: string;
};

export type ConstructionTask = {
  id: string;
  phase: ConstructionPhase;
  status: ConstructionStatus;
  plannedAt: string;
  progress: string;
  detail: string;
  risk: string;
};

export type SoftFurnishingItem = {
  id: string;
  category: SoftCategory;
  name: string;
  brand: string;
  price: number;
  reason: string;
  status: string;
  imagePath: string;
};

export type RenovationPageData = {
  meta: SiteMeta;
  design: Record<DesignGroupKey, DesignAsset[]>;
  materials: MaterialItem[];
  appliances: ApplianceItem[];
  construction: ConstructionTask[];
  softFurnishings: SoftFurnishingItem[];
};
