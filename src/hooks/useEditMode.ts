import { useMemo, useState } from "react";
import { verifyEditPassword } from "@/lib/contentApi";

export function useEditMode() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authenticating, setAuthenticating] = useState(false);

  const canSubmit = useMemo(
    () => password.trim().length > 0 && !authenticating,
    [authenticating, password],
  );

  const authenticate = async () => {
    setAuthenticating(true);
    setAuthError("");

    try {
      await verifyEditPassword(password);
      setEditMode(true);
      setDrawerOpen(false);
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "密码校验失败，请重试。",
      );
    } finally {
      setAuthenticating(false);
    }
  };

  const lock = () => {
    setEditMode(false);
    setPassword("");
    setAuthError("");
    setDrawerOpen(false);
  };

  return {
    drawerOpen,
    editMode,
    password,
    authError,
    authenticating,
    canSubmit,
    setDrawerOpen,
    setPassword,
    authenticate,
    lock,
  };
}
