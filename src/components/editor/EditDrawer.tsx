type EditDrawerProps = {
  open: boolean;
  editMode: boolean;
  password: string;
  authError: string;
  authenticating: boolean;
  isSaving: boolean;
  isDirty: boolean;
  configured: boolean;
  onOpen: () => void;
  onClose: () => void;
  onPasswordChange: (value: string) => void;
  onAuthenticate: () => Promise<void>;
  onSave: () => Promise<void>;
  onReset: () => void;
  onLock: () => void;
};

export function EditDrawer({
  open,
  editMode,
  password,
  authError,
  authenticating,
  isSaving,
  isDirty,
  configured,
  onOpen,
  onClose,
  onPasswordChange,
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
                编辑门禁
              </div>
              <h3 className="text-2xl font-semibold text-ink">输入密码后进入维护模式</h3>
              <p className="text-sm leading-7 text-[#5f5245]">
                首版保存采用 Supabase，图片仍然通过仓库静态路径维护。
              </p>
            </div>

            {!configured ? (
              <div className="mt-6 rounded-3xl bg-[#f2ebe1] px-4 py-3 text-sm leading-7 text-[#7b6755]">
                当前未配置 Supabase 环境变量，编辑保存能力暂不可用。
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <label className="block space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f7d69]">
                    编辑密码
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => onPasswordChange(event.target.value)}
                    className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </label>

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
                    {authenticating ? "验证中..." : "验证并进入编辑"}
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
