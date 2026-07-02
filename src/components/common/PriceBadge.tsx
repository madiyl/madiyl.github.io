import { formatCurrency } from "@/utils/format";

type PriceBadgeProps = {
  budget: number;
  actualPrice: number;
};

export function PriceBadge({ budget, actualPrice }: PriceBadgeProps) {
  const delta = actualPrice - budget;
  const deltaLabel =
    delta === 0
      ? "与预算持平"
      : delta > 0
        ? `超出 ${formatCurrency(delta)}`
        : `节省 ${formatCurrency(Math.abs(delta))}`;

  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <span className="rounded-full bg-[#efe4d6] px-3 py-1 font-medium text-[#7c654f]">
        预算 {formatCurrency(budget)}
      </span>
      <span className="rounded-full bg-[#edeadd] px-3 py-1 font-medium text-[#5d624f]">
        实付 {formatCurrency(actualPrice)}
      </span>
      <span className="rounded-full bg-white px-3 py-1 font-medium text-[#92735a] shadow-sm">
        {deltaLabel}
      </span>
    </div>
  );
}
