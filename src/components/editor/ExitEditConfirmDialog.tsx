type ExitEditConfirmDialogProps = {
  open: boolean;
  isSaving: boolean;
  onSaveAndExit: () => void;
  onDiscardAndExit: () => void;
  onContinueEditing: () => void;
};

export function ExitEditConfirmDialog({
  open,
  isSaving,
  onSaveAndExit,
  onDiscardAndExit,
  onContinueEditing,
}: ExitEditConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-[#271f19]/28 backdrop-blur-sm">
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-[28px] border border-white/60 bg-mist p-6 shadow-float">
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              未保存改动
            </div>
            <h3 className="text-2xl font-semibold text-ink">你有未保存的修改</h3>
            <p className="text-sm leading-7 text-[#5f5245]">
              退出前请选择保存当前改动，或放弃这次尚未保存的编辑内容。
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isSaving}
              onClick={onSaveAndExit}
              className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "保存中..." : "保存并退出"}
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={onDiscardAndExit}
              className="rounded-full border border-line px-5 py-3 text-sm font-medium text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              不保存退出
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={onContinueEditing}
              className="rounded-full border border-transparent px-5 py-3 text-sm font-medium text-[#6f6256] transition hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-60"
            >
              继续编辑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
