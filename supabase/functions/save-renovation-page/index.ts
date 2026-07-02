import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const password = String(body.password ?? "");
    const mode = String(body.mode ?? "save");
    const expectedPassword = Deno.env.get("EDIT_PASSWORD");

    if (!expectedPassword) {
      return jsonResponse(
        {
          ok: false,
          message: "服务端未配置编辑密码。",
        },
        500,
      );
    }

    if (password !== expectedPassword) {
      return jsonResponse(
        {
          ok: false,
          message: "密码错误，请重试。",
        },
        401,
      );
    }

    if (mode === "verify") {
      return jsonResponse({ ok: true });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse(
        {
          ok: false,
          message: "服务端数据库连接未配置完整。",
        },
        500,
      );
    }

    const client = createClient(supabaseUrl, serviceRoleKey);
    const slug = String(body.slug ?? "main");
    const content = body.content ?? {};
    const updatedAt = new Date().toISOString();

    const { error } = await client
      .from("renovation_pages")
      .upsert({
        slug,
        content_json: content,
        updated_at: updatedAt,
      });

    if (error) {
      return jsonResponse(
        {
          ok: false,
          message: error.message,
        },
        500,
      );
    }

    return jsonResponse({
      ok: true,
      updatedAt,
    });
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        message: error instanceof Error ? error.message : "未知错误",
      },
      500,
    );
  }
});

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
