import clsx from "clsx";

type ImagePathFieldProps = {
  value: string;
  alt: string;
  caption?: string;
  editMode: boolean;
  onChange: (value: string) => void;
  ratioClassName?: string;
  previewable?: boolean;
  onPreview?: () => void;
};

export function ImagePathField({
  value,
  alt,
  caption,
  editMode,
  onChange,
  ratioClassName = "aspect-[4/3]",
  previewable = false,
  onPreview,
}: ImagePathFieldProps) {
  const canPreview = previewable && Boolean(value) && Boolean(onPreview);

  return (
    <div className="space-y-3">
      {canPreview ? (
        <button
          type="button"
          onClick={onPreview}
          className={clsx(
            "group relative block w-full overflow-hidden rounded-[24px] border border-white/60 bg-white/65 text-left shadow-soft",
            ratioClassName,
          )}
        >
          <img
            src={value}
            alt={alt}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute right-3 top-3 rounded-full bg-[#2f261f]/68 px-3 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
            点击放大
          </span>
        </button>
      ) : (
        <div
          className={clsx(
            "relative overflow-hidden rounded-[24px] border border-white/60 bg-white/65 shadow-soft",
            ratioClassName,
          )}
        >
          {value ? (
            <img
              src={value}
              alt={alt}
              className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#efe4d6] via-[#f9f5ef] to-[#e8e3d8] px-6 text-center text-sm text-[#8b7966]">
              暂未添加图片
            </div>
          )}
        </div>
      )}

      {caption ? (
        <div className="text-sm leading-7 text-[#5f5245]">{caption}</div>
      ) : null}

      {editMode ? (
        <label className="block space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
            图片路径
          </span>
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="/uploads/renovation/..."
            className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm leading-7 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>
      ) : null}
    </div>
  );
}
