import type { Env } from "./types";
import { handleRegister } from "./routes/api-register";
import { handleStatus } from "./routes/api-status";
import { handleBind } from "./routes/api-bind";
import { handleNotify } from "./routes/api-notify";
import { handleToggle } from "./routes/api-toggle";
import { renderBindPage } from "./routes/bind-page";
import { handleIcon } from "./routes/icon";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    // CORS headers for binding page fetch calls
    const corsHeaders = {
      "Access-Control-Allow-Origin": url.origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      let response: Response;

      // Icon
      if (method === "GET" && pathname === "/icon.svg") {
        return handleIcon();
      }

      // Binding page (HTML)
      if (method === "GET" && pathname === "/bind") {
        const machineId = url.searchParams.get("id");
        if (!machineId) {
          return new Response("Missing id parameter", { status: 400 });
        }
        const html = renderBindPage(machineId, url.origin);
        return new Response(html, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      // API routes
      if (method === "POST" && pathname === "/api/register") {
        response = await handleRegister(request, env);
      } else if (method === "GET" && pathname === "/api/status") {
        response = await handleStatus(request, env);
      } else if (method === "POST" && pathname === "/api/bind") {
        response = await handleBind(request, env);
      } else if (method === "POST" && pathname === "/api/notify") {
        response = await handleNotify(request, env);
      } else if (method === "POST" && pathname === "/api/toggle") {
        response = await handleToggle(request, env);
      } else if (method === "POST" && pathname === "/api/toggle-public") {
        // Public toggle from binding page (no notify_token needed)
        // Security: only accessible if you know the machine_id (from QR code)
        response = await handleTogglePublic(request, env);
      } else {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      // Add CORS headers to all API responses
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Internal error";
      return Response.json({ success: false, error: msg }, { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;

// Simplified toggle that doesn't require notify_token (for binding page use)
async function handleTogglePublic(
  request: Request,
  env: Env
): Promise<Response> {
  const body = (await request.json()) as { machine_id: string; active: boolean };

  if (!body.machine_id || typeof body.active !== "boolean") {
    return Response.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  const device = await env.DB.prepare(
    "SELECT machine_id FROM devices WHERE machine_id = ?"
  )
    .bind(body.machine_id)
    .first();

  if (!device) {
    return Response.json(
      { success: false, error: "Device not found" },
      { status: 404 }
    );
  }

  await env.DB.prepare(
    "UPDATE devices SET is_active = ?, updated_at = datetime('now') WHERE machine_id = ?"
  )
    .bind(body.active ? 1 : 0, body.machine_id)
    .run();

  return Response.json({ success: true, is_active: body.active });
}
