const fs = require("fs");
const path = require("path");
const os = require("os");
const { requireConfig } = require("../config");

const CLAUDE_SETTINGS_PATH = path.join(os.homedir(), ".claude", "settings.json");

function getClaudeNotifyPath() {
  // Resolve the actual path of this CLI tool for the hook command
  // Use 'which' equivalent: the bin entry that npm links
  try {
    const binPath = require.resolve("../../bin/claude-notify.js");
    return `node ${binPath}`;
  } catch {
    // Fallback: assume it's in PATH
    return "claude-notify";
  }
}

async function setupHookCommand(options) {
  requireConfig(); // just validate config exists

  const cmdPath = getClaudeNotifyPath();
  const hookCommand = `${cmdPath} _hook-handler`;

  // Read existing settings
  let settings = {};
  if (fs.existsSync(CLAUDE_SETTINGS_PATH)) {
    try {
      settings = JSON.parse(fs.readFileSync(CLAUDE_SETTINGS_PATH, "utf-8"));
    } catch (e) {
      console.error(`❌ 无法解析 ${CLAUDE_SETTINGS_PATH}: ${e.message}`);
      process.exit(1);
    }
  } else {
    console.log("⚠️  未找到 Claude Code 配置文件，将创建新文件。");
  }

  // Merge hook config
  if (!settings.hooks) {
    settings.hooks = {};
  }

  const notificationHooks = settings.hooks.Notification || [];

  // Check if our hook already exists
  const existingIndex = notificationHooks.findIndex((h) =>
    h.hooks?.some((hh) => hh.command?.includes("claude-notify _hook-handler"))
  );

  const hookEntry = {
    matcher: "idle_prompt",
    hooks: [
      {
        type: "command",
        command: hookCommand,
      },
    ],
  };

  if (existingIndex >= 0) {
    notificationHooks[existingIndex] = hookEntry;
    console.log("🔄 更新已有的 hook 配置...");
  } else {
    notificationHooks.push(hookEntry);
    console.log("➕ 添加 hook 配置...");
  }

  settings.hooks.Notification = notificationHooks;

  // Write back
  const dir = path.dirname(CLAUDE_SETTINGS_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CLAUDE_SETTINGS_PATH, JSON.stringify(settings, null, 2) + "\n");

  console.log(`✅ Hook 已配置到 ${CLAUDE_SETTINGS_PATH}`);
  console.log(`   事件: Notification (idle_prompt)`);
  console.log(`   命令: ${hookCommand}`);
  console.log("\n💡 Claude Code 空闲等待输入时将自动推送通知到你的手机。");

  if (options.remove) {
    // Remove mode
    if (existingIndex >= 0) {
      notificationHooks.splice(existingIndex, 1);
      settings.hooks.Notification = notificationHooks;
      fs.writeFileSync(CLAUDE_SETTINGS_PATH, JSON.stringify(settings, null, 2) + "\n");
      console.log("✅ Hook 已移除");
    } else {
      console.log("⚠️  未找到已配置的 hook");
    }
  }
}

module.exports = setupHookCommand;
