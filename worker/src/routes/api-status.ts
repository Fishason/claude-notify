import type { Env, Device } from "../types";

export async function handleStatus(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const machineId = url.searchParams.get("id");

  if (!machineId) {
    return Response.json(
      { success: false, error: "Missing id parameter" },
      { status: 400 }
    );
  }

  const device = await env.DB.prepare(
    "SELECT machine_name, bark_key, is_active FROM devices WHERE machine_id = ?"
  )
    .bind(machineId)
    .first<Pick<Device, "machine_name" | "bark_key" | "is_active">>();

  if (!device) {
    return Response.json(
      { success: false, error: "Device not found" },
      { status: 404 }
    );
  }

  return Response.json({
    success: true,
    bound: device.bark_key !== null,
    is_active: device.is_active === 1,
    machine_name: device.machine_name,
  });
}
