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
        className="relative w-full max-w-[1320px] rounded-[36px] border border-white/15 bg-[#e8e0d5] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 rounded-full bg-white/88 px-4 py-2 text-sm font-medium text-ink shadow-soft transition hover:bg-white"
        >
          关闭
        </button>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr),172px]">
          <div className="flex min-h-[72vh] flex-col rounded-[30px] bg-[#e3dbcf] p-4 sm:p-5">
            <div className="flex-1">
              <div className="relative flex h-full min-h-[56vh] items-center justify-center overflow-hidden rounded-[28px] bg-[#ebe5dc] px-4 py-6 sm:px-6">
                <img
                  src={current.src}
                  alt={current.alt}
                  className="max-h-[58vh] w-full object-contain"
                />

                {images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={onPrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 text-sm font-medium text-ink shadow-soft transition hover:bg-white"
                    >
                      上一张
                    </button>
                    <button
                      type="button"
                      onClick={onNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 text-sm font-medium text-ink shadow-soft transition hover:bg-white"
                    >
                      下一张
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            {(current.alt || current.caption) && (
              <div className="mt-4 rounded-[26px] bg-white/68 px-5 py-4 sm:px-6 sm:py-5">
                {current.alt ? (
                  <div className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                    {current.alt}
                  </div>
                ) : null}
                {current.caption ? (
                  <div className="mt-2 text-sm leading-7 text-[#6b5f54] sm:text-base">
                    {current.caption}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="space-y-3 rounded-[28px] bg-[#e3dbcf] p-3 sm:p-4">
            <div className="px-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8f7d69]">
              缩略图
            </div>
            <div className="grid max-h-[72vh] grid-cols-3 gap-3 overflow-auto lg:grid-cols-1">
              {images.map((image, index) => (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  onClick={() => onSelect(index)}
                  className={`overflow-hidden rounded-[22px] border bg-white/50 transition ${
                    index === activeIndex
                      ? "border-accent shadow-soft"
                      : "border-white/30 opacity-80 hover:opacity-100"
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
