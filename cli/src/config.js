const fs = require("fs");
const path = require("path");
const os = require("os");

const CONFIG_DIR = path.join(os.homedir(), ".claude-notify");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

function ensureDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function configExists() {
  return fs.existsSync(CONFIG_FILE);
}

function loadConfig() {
  if (!configExists()) {
    return null;
  }
  return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
}

function saveConfig(data) {
  ensureDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2) + "\n");
}

function requireConfig() {
  const config = loadConfig();
  if (!config) {
    console.error("❌ 未初始化。请先运行: claude-notify init");
    process.exit(1);
  }
  return config;
}

module.exports = { CONFIG_DIR, CONFIG_FILE, configExists, loadConfig, saveConfig, requireConfig };
