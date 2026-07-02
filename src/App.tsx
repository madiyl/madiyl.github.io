import "./App.css";
import { EditDrawer } from "@/components/editor/EditDrawer";
import { useEditMode } from "@/hooks/useEditMode";
import { useRenovationData } from "@/hooks/useRenovationData";
import { isSupabaseConfigured } from "@/lib/supabase";
import { RenovationJourneyPage } from "@/pages/RenovationJourneyPage";

function App() {
  const {
    data,
    isLoading,
    isSaving,
    isDirty,
    error,
    bannerMessage,
    updatedAt,
    updateData,
    resetChanges,
    save,
  } = useRenovationData();
  const {
    drawerOpen,
    editMode,
    password,
    authError,
    authenticating,
    setDrawerOpen,
    setPassword,
    authenticate,
    lock,
  } = useEditMode();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="rounded-[28px] border border-white/70 bg-white/80 px-6 py-5 text-sm text-[#6b5b4d] shadow-soft">
          正在加载装修记录内容...
        </div>
      </div>
    );
  }

  return (
    <>
      <RenovationJourneyPage
        data={data}
        editMode={editMode}
        error={error}
        bannerMessage={bannerMessage}
        updatedAt={updatedAt}
        onChange={updateData}
      />

      <EditDrawer
        open={drawerOpen}
        editMode={editMode}
        password={password}
        authError={authError}
        authenticating={authenticating}
        isSaving={isSaving}
        isDirty={isDirty}
        configured={isSupabaseConfigured}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
        onPasswordChange={setPassword}
        onAuthenticate={authenticate}
        onSave={() => save(password)}
        onReset={resetChanges}
        onLock={lock}
      />
    </>
  );
}

export default App;
