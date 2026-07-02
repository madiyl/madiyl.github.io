import clsx from "clsx";
import type { ConstructionStatus } from "@/types/renovation";

type ProgressPillProps = {
  status: ConstructionStatus;
};

const statusClasses: Record<ConstructionStatus, string> = {
  未开始: "bg-white text-[#8e7d6b]",
  进行中: "bg-[#efe4d6] text-[#7c654f]",
  已完成: "bg-[#e7eee1] text-[#576248]",
  待复查: "bg-[#f3e3de] text-[#9a5b49]",
};

export function ProgressPill({ status }: ProgressPillProps) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        statusClasses[status],
      )}
    >
      {status}
    </span>
  );
}
