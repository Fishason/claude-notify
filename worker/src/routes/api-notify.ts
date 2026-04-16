import type { Env, NotifyRequest, Device } from "../types";
import { sendBarkNotification } from "../lib/bark";

const DEBOUNCE_SECONDS = 5;

export async function handleNotify(
  request: Request,
  env: Env
): Promise<Response> {
  const body = (await request.json()) as NotifyRequest;

  if (!body.machine_id || !body.notify_token) {
    return Response.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  const device = await env.DB.prepare(
    "SELECT * FROM devices WHERE machine_id = ?"
  )
    .bind(body.machine_id)
    .first<Device>();

  if (!device) {
    return Response.json(
      { success: false, error: "Device not found" },
      { status: 404 }
    );
  }

  // Authenticate
  if (device.notify_token !== body.notify_token) {
    return Response.json(
      { success: false, error: "Invalid token" },
      { status: 403 }
    );
  }

  // Check if notifications are paused
  if (!device.is_active) {
    return Response.json({ success: true, message: "Notifications paused, skipped" });
  }

  // Check if bound
  if (!device.bark_key) {
    return Response.json(
      { success: false, error: "No Bark key bound. Scan QR code to bind." },
      { status: 400 }
    );
  }

  // Debounce: skip if last notification was within DEBOUNCE_SECONDS
  if (device.last_notified_at) {
    const lastTime = new Date(device.last_notified_at + "Z").getTime();
    const now = Date.now();
    if (now - lastTime < DEBOUNCE_SECONDS * 1000) {
      return Response.json({ success: true, message: "Debounced, skipped" });
    }
  }

  const iconUrl = new URL("/icon.jpg", request.url).href;

  // Use session name (/rename) if available, otherwise fall back to directory name
  const sessionName = body.session_name;
  const cwd = body.cwd || "unknown";
  const projectName = cwd.split("/").filter(Boolean).pop() || cwd;

  const title = "Claude Code 已完成";
  const notifyBody = sessionName
    ? `${sessionName}`
    : `📂 ${projectName}`;

  const result = await sendBarkNotification(device.bark_key, {
    title,
    body: notifyBody,
    group: "claude-code",
    level: "timeSensitive",
    icon: iconUrl,
  });

  if (!result.success) {
    return Response.json(
      { success: false, error: result.error },
      { status: 502 }
    );
  }

  // Update last_notified_at
  await env.DB.prepare(
    "UPDATE devices SET last_notified_at = datetime('now') WHERE machine_id = ?"
  )
    .bind(body.machine_id)
    .run();

  return Response.json({ success: true, message: "Notification sent" });
}
