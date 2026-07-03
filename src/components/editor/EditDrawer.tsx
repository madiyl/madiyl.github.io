type EditDrawerProps = {
  open: boolean;
  editMode: boolean;
  authError: string;
  authenticating: boolean;
  isSaving: boolean;
  isDirty: boolean;
  configured: boolean;
  onOpen: () => void;
  onClose: () => void;
  onAuthenticate: () => Promise<void>;
  onSave: () => Promise<void>;
  onReset: () => void;
  onLock: () => void;
};

export function EditDrawer({
  open,
  editMode,
  authError,
  authenticating,
  isSaving,
  isDirty,
  configured,
  onOpen,
  onClose,
  onAuthenticate,
  onSave,
  onReset,
  onLock,
}: EditDrawerProps) {
  return (
    <>
      <button
        type="button"
        onClick={editMode ? onLock : onOpen}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-float transition hover:-translate-y-0.5"
      >
        {editMode ? "退出编辑" : "进入编辑"}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-[#271f19]/20 backdrop-blur-sm">
          <div className="absolute right-4 top-4 w-full max-w-md rounded-[28px] border border-white/60 bg-mist p-6 shadow-float sm:right-6 sm:top-6">
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                维护面板
              </div>
              <h3 className="text-2xl font-semibold text-ink">当前为临时免密维护模式</h3>
              <p className="text-sm leading-7 text-[#5f5245]">
                进入编辑与保存改动都暂时不需要输入密码，后续可再恢复门禁。
              </p>
            </div>

            {!configured ? (
              <div className="mt-6 rounded-3xl bg-[#f2ebe1] px-4 py-3 text-sm leading-7 text-[#7b6755]">
                当前未配置 Supabase 环境变量，编辑保存能力暂不可用。
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {authError ? (
                  <div className="rounded-2xl bg-[#f6e8e1] px-4 py-3 text-sm text-[#8d5646]">
                    {authError}
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={authenticating}
                    onClick={() => void onAuthenticate()}
                    className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {authenticating ? "进入中..." : "直接进入编辑"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-line px-5 py-3 text-sm font-medium text-ink transition hover:bg-white"
                  >
                    关闭
                  </button>
                </div>
              </div>
            )}

            {editMode ? (
              <div className="mt-8 rounded-[24px] border border-line bg-white/80 p-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={!isDirty || isSaving}
                    onClick={() => void onSave()}
                    className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? "保存中..." : "保存当前改动"}
                  </button>
                  <button
                    type="button"
                    disabled={!isDirty || isSaving}
                    onClick={onReset}
                    className="rounded-full border border-line px-5 py-3 text-sm font-medium text-ink transition hover:bg-[#f7f2ec] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    撤销未保存改动
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
