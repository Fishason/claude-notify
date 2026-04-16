import type { Env, ToggleRequest, Device } from "../types";

export async function handleToggle(
  request: Request,
  env: Env
): Promise<Response> {
  const body = (await request.json()) as ToggleRequest;

  if (!body.machine_id || !body.notify_token || typeof body.active !== "boolean") {
    return Response.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  const device = await env.DB.prepare(
    "SELECT notify_token FROM devices WHERE machine_id = ?"
  )
    .bind(body.machine_id)
    .first<Pick<Device, "notify_token">>();

  if (!device) {
    return Response.json(
      { success: false, error: "Device not found" },
      { status: 404 }
    );
  }

  if (device.notify_token !== body.notify_token) {
    return Response.json(
      { success: false, error: "Invalid token" },
      { status: 403 }
    );
  }

  await env.DB.prepare(
    "UPDATE devices SET is_active = ?, updated_at = datetime('now') WHERE machine_id = ?"
  )
    .bind(body.active ? 1 : 0, body.machine_id)
    .run();

  return Response.json({ success: true, is_active: body.active });
}
