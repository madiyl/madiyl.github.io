import { useCallback, useEffect, useMemo, useState } from "react";
import { deepCloneDefaultContent } from "@/lib/defaultContent";
import {
  loadRenovationPageData,
  saveRenovationPageData,
} from "@/lib/contentApi";
import type { RenovationPageData } from "@/types/renovation";

export function useRenovationData() {
  const [data, setData] = useState<RenovationPageData>(deepCloneDefaultContent());
  const [savedSnapshot, setSavedSnapshot] = useState<RenovationPageData>(
    deepCloneDefaultContent(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [bannerMessage, setBannerMessage] = useState("");
  const [updatedAt, setUpdatedAt] = useState(data.meta.updatedAt);

  useEffect(() => {
    const run = async () => {
      try {
        const result = await loadRenovationPageData();
        setData(result.data);
        setSavedSnapshot(result.data);
        setUpdatedAt(result.updatedAt);
        setBannerMessage(result.message ?? "");
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "内容加载失败，请稍后重试。",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void run();
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(data) !== JSON.stringify(savedSnapshot),
    [data, savedSnapshot],
  );

  const updateData = useCallback((next: RenovationPageData) => {
    setData(next);
  }, []);

  const resetChanges = useCallback(() => {
    setData(savedSnapshot);
    setError("");
  }, [savedSnapshot]);

  const save = useCallback(
    async (password: string) => {
      setIsSaving(true);
      setError("");

      try {
        const response = await saveRenovationPageData(data, password);
        const next = {
          ...data,
          meta: {
            ...data.meta,
            updatedAt: response.updatedAt,
          },
        };
        setData(next);
        setSavedSnapshot(next);
        setUpdatedAt(response.updatedAt);
        setBannerMessage("已保存到线上内容。");
      } catch (saveError) {
        setError(
          saveError instanceof Error ? saveError.message : "保存失败，请重试。",
        );
        throw saveError;
      } finally {
        setIsSaving(false);
      }
    },
    [data],
  );

  return {
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
    setError,
    setBannerMessage,
  };
}
