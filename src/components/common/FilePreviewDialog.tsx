type FilePreviewDialogProps = {
  open: boolean;
  url: string;
  title: string;
  fileType: "pdf" | "excel";
  onClose: () => void;
};

export function FilePreviewDialog({
  open,
  url,
  title,
  fileType,
  onClose,
}: FilePreviewDialogProps) {
  if (!open || !url) return null;

  const fileLabel = fileType === "excel" ? "Excel 预览" : "PDF 预览";

  return (
    <div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-[#201914]/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-[32px] border border-white/15 bg-[#f6f0e7] shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line bg-white/70 px-5 py-4">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f7d69]">
              {fileLabel}
            </div>
            <div className="truncate text-lg font-semibold text-ink">{title}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink shadow-soft transition hover:bg-[#f7f2ec]"
          >
            关闭
          </button>
        </div>

        <iframe title={title} src={url} className="h-full w-full bg-white" />
      </div>
    </div>
  );
}
