import type { Env, RegisterRequest } from "../types";

export async function handleRegister(
  request: Request,
  env: Env
): Promise<Response> {
  const body = (await request.json()) as RegisterRequest;

  if (!body.machine_id || !body.notify_token || !body.machine_name) {
    return Response.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Check if machine already exists
  const existing = await env.DB.prepare(
    "SELECT machine_id FROM devices WHERE machine_id = ?"
  )
    .bind(body.machine_id)
    .first();

  if (existing) {
    // Update existing record (re-init scenario)
    await env.DB.prepare(
      "UPDATE devices SET notify_token = ?, machine_name = ?, updated_at = datetime('now') WHERE machine_id = ?"
    )
      .bind(body.notify_token, body.machine_name, body.machine_id)
      .run();

    return Response.json({ success: true, message: "Device updated" });
  }

  await env.DB.prepare(
    "INSERT INTO devices (machine_id, notify_token, machine_name) VALUES (?, ?, ?)"
  )
    .bind(body.machine_id, body.notify_token, body.machine_name)
    .run();

  return Response.json({ success: true, message: "Device registered" });
}
