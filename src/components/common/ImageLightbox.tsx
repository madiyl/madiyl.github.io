import { useEffect } from "react";

type LightboxImage = {
  src: string;
  alt: string;
  caption?: string;
};

type ImageLightboxProps = {
  open: boolean;
  images: LightboxImage[];
  activeIndex: number;
  onClose: () => void;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

export function ImageLightbox({
  open,
  images,
  activeIndex,
  onClose,
  onSelect,
  onPrev,
  onNext,
}: ImageLightboxProps) {
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && images.length > 1) onPrev();
      if (event.key === "ArrowRight" && images.length > 1) onNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [images.length, onClose, onNext, onPrev, open]);

  if (!open || images.length === 0) return null;

  const current = images[activeIndex] ?? images[0];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#201914]/82 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl rounded-[32px] border border-white/15 bg-[#f6f0e7] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/85 px-3 py-2 text-sm font-medium text-ink shadow-soft transition hover:bg-white"
        >
          关闭
        </button>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr),180px]">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-[28px] bg-[#ede3d5]">
              <img
                src={current.src}
                alt={current.alt}
                className="max-h-[76vh] w-full object-contain"
              />

              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={onPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-4 py-3 text-sm font-medium text-ink shadow-soft transition hover:bg-white"
                  >
                    上一张
                  </button>
                  <button
                    type="button"
                    onClick={onNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-4 py-3 text-sm font-medium text-ink shadow-soft transition hover:bg-white"
                  >
                    下一张
                  </button>
                </>
              ) : null}
            </div>

            {(current.alt || current.caption) && (
              <div className="rounded-[24px] bg-white/85 px-4 py-3">
                <div className="text-base font-semibold text-ink">{current.alt}</div>
                {current.caption ? (
                  <div className="mt-1 text-sm leading-7 text-[#5f5245]">
                    {current.caption}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
              缩略图
            </div>
            <div className="grid max-h-[76vh] grid-cols-3 gap-3 overflow-auto lg:grid-cols-1">
              {images.map((image, index) => (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  onClick={() => onSelect(index)}
                  className={`overflow-hidden rounded-[20px] border transition ${
                    index === activeIndex
                      ? "border-accent shadow-soft"
                      : "border-white/40 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
