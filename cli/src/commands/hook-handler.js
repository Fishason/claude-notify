const fs = require("fs");
const path = require("path");
const os = require("os");
const { loadConfig } = require("../config");
const { notify } = require("../api");

const SESSIONS_DIR = path.join(os.homedir(), ".claude", "sessions");

/**
 * Find session name by matching session_id from hook context
 * against Claude Code's session files in ~/.claude/sessions/
 */
function findSessionName(sessionId) {
  try {
    if (!sessionId || !fs.existsSync(SESSIONS_DIR)) return null;

    const files = fs.readdirSync(SESSIONS_DIR);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const data = JSON.parse(
          fs.readFileSync(path.join(SESSIONS_DIR, file), "utf-8")
        );
        if (data.sessionId === sessionId && data.name) {
          return data.name;
        }
      } catch {
        // skip malformed files
      }
    }
  } catch {
    // ignore errors
  }
  return null;
}

async function hookHandlerCommand() {
  // Called by Claude Code hooks via stdin JSON.
  // MUST always exit 0 to avoid Claude Code reporting hook failures.
  try {
    const config = loadConfig();
    if (!config) return;

    // Read hook context from stdin
    let stdinData = "";
    if (!process.stdin.isTTY) {
      stdinData = await new Promise((resolve) => {
        let data = "";
        process.stdin.setEncoding("utf-8");
        process.stdin.on("data", (chunk) => (data += chunk));
        process.stdin.on("end", () => resolve(data));
        setTimeout(() => resolve(data), 3000);
      });
    }

    let cwd = process.cwd();
    let sessionName = null;

    if (stdinData) {
      try {
        const context = JSON.parse(stdinData);
        if (context.cwd) cwd = context.cwd;
        // Try to find session name from Claude Code session files
        if (context.session_id) {
          sessionName = findSessionName(context.session_id);
        }
      } catch {
        // Ignore JSON parse errors
      }
    }

    await notify(config.worker_url, {
      machine_id: config.machine_id,
      notify_token: config.notify_token,
      cwd,
      session_name: sessionName,
    });
  } catch {
    // Silently ignore all errors
  }
}

module.exports = hookHandlerCommand;
