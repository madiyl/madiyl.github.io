import clsx from "clsx";
import { formatCurrency } from "@/utils/format";

type BudgetSummaryProps = {
  budget: number;
  actualPrice: number;
  className?: string;
};

export function BudgetSummary({
  budget,
  actualPrice,
  className,
}: BudgetSummaryProps) {
  const delta = actualPrice - budget;
  const deltaLabel =
    delta === 0
      ? "与预算持平"
      : delta > 0
        ? `超出 ${formatCurrency(delta)}`
        : `节省 ${formatCurrency(Math.abs(delta))}`;

  return (
    <div
      className={clsx(
        "grid gap-3 rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-soft sm:grid-cols-3",
        className,
      )}
    >
      <div className="rounded-[22px] bg-[#f6efe6] px-4 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
          总预算
        </div>
        <div className="mt-2 text-2xl font-semibold text-ink">
          {formatCurrency(budget)}
        </div>
      </div>
      <div className="rounded-[22px] bg-[#f3f0e7] px-4 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c7e68]">
          总支出
        </div>
        <div className="mt-2 text-2xl font-semibold text-ink">
          {formatCurrency(actualPrice)}
        </div>
      </div>
      <div className="rounded-[22px] bg-white px-4 py-4 shadow-soft">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#92735a]">
          差额
        </div>
        <div className="mt-2 text-lg font-semibold text-ink">{deltaLabel}</div>
      </div>
    </div>
  );
}
