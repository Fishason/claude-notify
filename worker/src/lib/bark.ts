export interface BarkMessage {
  title: string;
  body: string;
  group?: string;
  level?: "active" | "timeSensitive" | "passive";
  icon?: string;
  sound?: string;
}

/**
 * Extract the Bark device key from various input formats:
 * - "https://api.day.app/KEY/"
 * - "https://api.day.app/KEY/推送铃声?sound=minuet"
 * - "https://api.day.app/KEY"
 * - "KEY"
 */
export function extractBarkKey(input: string): string {
  const trimmed = input.trim();
  const urlMatch = trimmed.match(/^https?:\/\/api\.day\.app\/([A-Za-z0-9_-]+)/);
  if (urlMatch) return urlMatch[1];
  // Remove trailing slashes and whitespace
  return trimmed.replace(/\/+$/, "");
}

export async function sendBarkNotification(
  barkKey: string,
  message: BarkMessage
): Promise<{ success: boolean; error?: string }> {
  const url = `https://api.day.app/${barkKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  if (!res.ok) {
    const text = await res.text();
    return { success: false, error: `Bark API ${res.status}: ${text}` };
  }

  const data = (await res.json()) as { code: number; message: string };
  if (data.code !== 200) {
    return { success: false, error: `Bark error: ${data.message}` };
  }

  return { success: true };
}
