import { deepCloneDefaultContent, mergeWithDefaultContent } from "@/lib/defaultContent";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { RenovationPageData } from "@/types/renovation";

const PAGE_SLUG = "main";

export type LoadContentResult = {
  data: RenovationPageData;
  updatedAt: string;
  isRemote: boolean;
  message?: string;
};

export async function loadRenovationPageData(): Promise<LoadContentResult> {
  if (!isSupabaseConfigured || !supabase) {
    const fallback = deepCloneDefaultContent();
    return {
      data: fallback,
      updatedAt: fallback.meta.updatedAt,
      isRemote: false,
      message: "尚未配置 Supabase，当前展示的是本地默认内容。",
    };
  }

  const { data, error } = await supabase
    .from("renovation_pages")
    .select("content_json, updated_at")
    .eq("slug", PAGE_SLUG)
    .maybeSingle();

  if (error) {
    const fallback = deepCloneDefaultContent();
    return {
      data: fallback,
      updatedAt: fallback.meta.updatedAt,
      isRemote: false,
      message: "在线内容读取失败，已回退到默认内容。",
    };
  }

  const merged = mergeWithDefaultContent(
    (data?.content_json as Partial<RenovationPageData> | undefined) ?? undefined,
  );
  const updatedAt = data?.updated_at ?? merged.meta.updatedAt;

  return {
    data: {
      ...merged,
      meta: {
        ...merged.meta,
        updatedAt,
      },
    },
    updatedAt,
    isRemote: true,
  };
}

export async function verifyEditPassword(password?: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("未配置 Supabase，暂时无法在线验证编辑密码。");
  }

  const { data, error } = await supabase.functions.invoke("save-renovation-page", {
    body: {
      mode: "verify",
      password: password ?? "",
    },
  });

  if (error) {
    throw new Error(error.message || "密码校验失败。");
  }

  if (!data?.ok) {
    throw new Error("密码错误，请重试。");
  }

  return true;
}

export async function saveRenovationPageData(
  payload: RenovationPageData,
  password?: string,
) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("未配置 Supabase，暂时无法在线保存。");
  }

  const { data, error } = await supabase.functions.invoke("save-renovation-page", {
    body: {
      mode: "save",
      slug: PAGE_SLUG,
      password: password ?? "",
      content: payload,
    },
  });

  if (error) {
    throw new Error(error.message || "保存失败，请稍后重试。");
  }

  if (!data?.ok) {
    throw new Error(data?.message || "保存失败，请检查密码或后端配置。");
  }

  return {
    updatedAt: data.updatedAt as string,
  };
}
