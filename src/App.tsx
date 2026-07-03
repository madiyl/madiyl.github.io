import { useState } from "react";
import "./App.css";
import { EditDrawer } from "@/components/editor/EditDrawer";
import { ExitEditConfirmDialog } from "@/components/editor/ExitEditConfirmDialog";
import { useEditMode } from "@/hooks/useEditMode";
import { useRenovationData } from "@/hooks/useRenovationData";
import { isSupabaseConfigured } from "@/lib/supabase";
import { RenovationJourneyPage } from "@/pages/RenovationJourneyPage";

function App() {
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const [isExitSaving, setIsExitSaving] = useState(false);
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
    authError,
    authenticating,
    setDrawerOpen,
    authenticate,
    lock,
  } = useEditMode();

  const handleExitEditRequest = () => {
    if (!isDirty) {
      lock();
      return;
    }

    setExitConfirmOpen(true);
  };

  const handleSaveAndExit = async () => {
    setIsExitSaving(true);

    try {
      await save();
      setExitConfirmOpen(false);
      lock();
    } catch {
      setExitConfirmOpen(false);
    } finally {
      setIsExitSaving(false);
    }
  };

  const handleDiscardAndExit = () => {
    resetChanges();
    setExitConfirmOpen(false);
    lock();
  };

  const handleContinueEditing = () => {
    setExitConfirmOpen(false);
  };

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
        authError={authError}
        authenticating={authenticating}
        isSaving={isSaving}
        isDirty={isDirty}
        configured={isSupabaseConfigured}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
        onAuthenticate={authenticate}
        onSave={() => save()}
        onReset={resetChanges}
        onLock={handleExitEditRequest}
      />

      <ExitEditConfirmDialog
        open={exitConfirmOpen}
        isSaving={isExitSaving}
        onSaveAndExit={() => void handleSaveAndExit()}
        onDiscardAndExit={handleDiscardAndExit}
        onContinueEditing={handleContinueEditing}
      />
    </>
  );
}

export default App;
