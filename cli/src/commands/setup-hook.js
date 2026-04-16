const fs = require("fs");
const path = require("path");
const os = require("os");
const { requireConfig } = require("../config");

const CLAUDE_SETTINGS = path.join(os.homedir(), ".claude", "settings.json");

function getHookCommand() {
  try {
    const binPath = require.resolve("../../bin/claude-notify.js");
    return `node ${binPath}`;
  } catch {
    return "claude-notify";
  }
}

async function setupHookCommand(options) {
  requireConfig();

  let settings = {};
  if (fs.existsSync(CLAUDE_SETTINGS)) {
    try { settings = JSON.parse(fs.readFileSync(CLAUDE_SETTINGS, "utf-8")); }
    catch (e) { console.error(`Cannot parse ${CLAUDE_SETTINGS}`); process.exit(1); }
  }

  if (!settings.hooks) settings.hooks = {};

  const hooks = settings.hooks.Notification || [];
  const hookCmd = `${getHookCommand()} _hook-handler`;

  const idx = hooks.findIndex((h) =>
    h.hooks?.some((hh) => hh.command?.includes("claude-notify") && hh.command?.includes("_hook-handler"))
  );

  if (options.remove) {
    if (idx >= 0) {
      hooks.splice(idx, 1);
      settings.hooks.Notification = hooks;
      fs.writeFileSync(CLAUDE_SETTINGS, JSON.stringify(settings, null, 2) + "\n");
      console.log("Hook removed.");
    } else {
      console.log("No hook found to remove.");
    }
    return;
  }

  const entry = {
    matcher: "idle_prompt",
    hooks: [{ type: "command", command: hookCmd }],
  };

  if (idx >= 0) hooks[idx] = entry;
  else hooks.push(entry);

  settings.hooks.Notification = hooks;
  const dir = path.dirname(CLAUDE_SETTINGS);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CLAUDE_SETTINGS, JSON.stringify(settings, null, 2) + "\n");

  console.log("Hook configured.");
  console.log(`  Event:   Notification (idle_prompt)`);
  console.log(`  Command: ${hookCmd}`);
}

module.exports = setupHookCommand;
