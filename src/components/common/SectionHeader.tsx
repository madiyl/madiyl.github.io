type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  index: number;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  index,
}: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          {String(index).padStart(2, "0")} · {eyebrow}
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
      </div>
      {description ? (
        <p className="max-w-2xl text-sm leading-7 text-[#5f5245] md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
