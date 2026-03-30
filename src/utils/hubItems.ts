import type { LucideIcon } from "lucide-react";
import { hubItemIcons } from "@/utils/hubItemIcons";

export type HubItemStatus = "已完成" | "规划中";
export type HubItemKind = "攻略" | "工具";

export type HubItem = {
  id: string;
  title: string;
  description: string;
  kind: HubItemKind;
  status: HubItemStatus;
  href: string;
  icon: LucideIcon;
};

export type HubItemRow = {
  id: string;
  title: string;
  description: string;
  kind: HubItemKind;
  status: HubItemStatus;
  href: string;
  icon: keyof typeof hubItemIcons;
  order_index: number | null;
};

export const hubItems: HubItem[] = [
  {
    id: "weekend-flowers",
    title: "周末赏花攻略",
    description: "北京周边春季赏花路线与排雷指南",
    kind: "攻略",
    status: "已完成",
    href: "./tools/weekend-flowers.html",
    icon: hubItemIcons.Flower2,
  },
  {
    id: "qingming-roadtrip",
    title: "清明自驾游计划",
    description: "3天2夜周边自驾行程表与物资清单",
    kind: "攻略",
    status: "规划中",
    href: "./tools/qingming-roadtrip.html",
    icon: hubItemIcons.Car,
  },
  {
    id: "renovation-budget",
    title: "装修预算计算器",
    description: "软硬装费用明细预估与超支预警",
    kind: "工具",
    status: "已完成",
    href: "./tools/renovation-budget.html",
    icon: hubItemIcons.Calculator,
  },
];
