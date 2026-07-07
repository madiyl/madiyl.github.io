import { useEffect } from "react";

type LightboxImage = {
  src: string;
  alt: string;
  caption?: string;
  eyebrow?: string;
  meta?: string;
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
  const counter = `${activeIndex + 1} / ${images.length}`;

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-[rgba(103,90,76,0.32)] backdrop-blur-[10px]"
      onClick={onClose}
    >
      <div className="flex min-h-[100dvh] items-center justify-center px-3 py-4 sm:px-5 sm:py-6">
        <div
          className="flex w-full max-w-[1240px] flex-col rounded-[28px] border border-[rgba(255,255,255,0.72)] bg-[linear-gradient(180deg,rgba(248,244,238,0.98),rgba(239,232,223,0.96))] p-3 shadow-[0_28px_80px_rgba(101,83,63,0.18)] sm:rounded-[32px] sm:p-4"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-2 flex items-start justify-between gap-3 rounded-[20px] border border-[rgba(150,126,101,0.14)] bg-[rgba(255,255,255,0.52)] px-4 py-2 text-[#3d3127]">
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {current.eyebrow ? (
                  <span className="rounded-full bg-[rgba(219,198,174,0.52)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a6547]">
                    {current.eyebrow}
                  </span>
                ) : null}
                <span className="rounded-full bg-[rgba(255,255,255,0.72)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7c6a59]">
                  {current.meta || counter}
                </span>
              </div>

              {current.alt ? (
                <div className="min-w-0">
                  <div className="truncate text-[1.15rem] font-semibold tracking-[-0.025em] text-[#2b221b] sm:text-[1.22rem]">
                    {current.alt}
                  </div>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full border border-[rgba(150,126,101,0.14)] bg-[rgba(255,255,255,0.72)] px-3.5 py-1.5 text-[12px] font-medium text-[#4b3b2f] transition hover:bg-white"
            >
              关闭
            </button>
          </div>

          <div className="relative h-[min(62dvh,640px)] min-h-[380px] flex-none overflow-hidden rounded-[24px] border border-[rgba(153,129,102,0.12)] bg-[radial-gradient(circle_at_center,rgba(250,247,242,0.98),rgba(232,224,214,0.92))] sm:h-[min(68dvh,760px)] sm:rounded-[28px]">
            {images.length > 1 ? (
              <button
                type="button"
                onClick={onPrev}
                className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(150,126,101,0.12)] bg-[rgba(255,255,255,0.78)] text-lg font-medium text-[#5d4b3d] shadow-[0_6px_18px_rgba(125,99,74,0.12)] transition hover:bg-white sm:left-5 sm:h-11 sm:w-11"
                aria-label="上一张"
              >
                ‹
              </button>
            ) : null}

            <div className="absolute inset-0 flex items-center justify-center px-[56px] py-4 sm:px-[72px] sm:py-6">
              <img
                src={current.src}
                alt={current.alt}
                className="block max-h-full max-w-full h-auto w-auto rounded-[18px] object-contain object-center"
              />
            </div>

            {images.length > 1 ? (
              <button
                type="button"
                onClick={onNext}
                className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(150,126,101,0.12)] bg-[rgba(255,255,255,0.78)] text-lg font-medium text-[#5d4b3d] shadow-[0_6px_18px_rgba(125,99,74,0.12)] transition hover:bg-white sm:right-5 sm:h-11 sm:w-11"
                aria-label="下一张"
              >
                ›
              </button>
            ) : null}
          </div>

          {images.length > 1 ? (
            <div className="mt-3 rounded-[22px] border border-[rgba(153,129,102,0.12)] bg-[rgba(255,255,255,0.42)] p-3 sm:rounded-[24px] sm:p-4">
              <div className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a8773]">
                胶片导航
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={`${image.src}-${index}`}
                    type="button"
                    onClick={() => onSelect(index)}
                    className={`w-24 shrink-0 overflow-hidden rounded-[18px] border transition sm:w-28 ${
                      index === activeIndex
                        ? "border-[#c89a67] bg-white shadow-[0_12px_28px_rgba(124,98,73,0.18)]"
                        : "border-[rgba(153,129,102,0.12)] bg-white/50 opacity-75 hover:opacity-100"
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
          ) : null}
        </div>
      </div>
    </div>
  );
}
