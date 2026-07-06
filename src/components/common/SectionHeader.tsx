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
    <div className="mb-8 border-b border-[rgba(157,136,114,0.16)] pb-6 md:mb-10 md:pb-7">
      <div className="grid gap-5 lg:grid-cols-[auto,minmax(0,1fr),minmax(280px,420px)] lg:items-end">
        <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#a18061]">
            Chapter
          </div>
          <div className="font-serif text-3xl leading-none text-[#6a5847] sm:text-4xl">
            {String(index).padStart(2, "0")}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8d755c]">
            {eyebrow}
          </div>
          <h2 className="max-w-4xl font-serif text-[2rem] font-semibold leading-[1.05] tracking-tight text-[#211b15] sm:text-[2.45rem]">
            {title}
          </h2>
        </div>

        <div className="space-y-3 lg:justify-self-end">
          <div className="h-px w-16 bg-[rgba(157,136,114,0.28)]" />
          <p className="max-w-md text-sm leading-7 text-[#5f5245] md:text-[15px]">
            {description ?? `${eyebrow}的信息会按记录顺序重新排版，保证浏览时更容易抓住重点。`}
          </p>
        </div>
      </div>
    </div>
  );
}
