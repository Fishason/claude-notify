import type { Env, BindRequest, Device } from "../types";
import { sendBarkNotification, extractBarkKey } from "../lib/bark";

export async function handleBind(
  request: Request,
  env: Env
): Promise<Response> {
  const body = (await request.json()) as BindRequest;

  if (!body.machine_id || !body.bark_key) {
    return Response.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Smart extract: user might paste full Bark URL instead of just the key
  const barkKey = extractBarkKey(body.bark_key);

  if (!barkKey) {
    return Response.json(
      { success: false, error: "Invalid Bark key format" },
      { status: 400 }
    );
  }

  const device = await env.DB.prepare(
    "SELECT machine_id, machine_name FROM devices WHERE machine_id = ?"
  )
    .bind(body.machine_id)
    .first<Pick<Device, "machine_id" | "machine_name">>();

  if (!device) {
    return Response.json(
      { success: false, error: "Device not found. Run 'claude-notify init' first." },
      { status: 404 }
    );
  }

  const iconUrl = new URL("/icon.jpg?v=3", request.url).href;

  // Verify bark_key by sending a test notification
  const testResult = await sendBarkNotification(barkKey, {
    title: "Claude Notify",
    body: `Bound to: ${device.machine_name}`,
    group: "claude-notify",
    level: "timeSensitive",
    icon: iconUrl,
    sound: "telegraph",
    url: "termius://",
  });

  if (!testResult.success) {
    return Response.json(
      { success: false, error: `Invalid Bark key: ${testResult.error}` },
      { status: 400 }
    );
  }

  await env.DB.prepare(
    "UPDATE devices SET bark_key = ?, is_active = 1, updated_at = datetime('now') WHERE machine_id = ?"
  )
    .bind(barkKey, body.machine_id)
    .run();

  return Response.json({
    success: true,
    message: "Binding complete. Test notification sent.",
  });
}
