const crypto = require("crypto");
const os = require("os");
const readline = require("readline");
const { configExists, loadConfig, saveConfig } = require("../config");
const { register } = require("../api");

async function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => { rl.close(); resolve(answer.trim()); });
  });
}

async function initCommand(options) {
  const existingConfig = loadConfig();

  if (existingConfig && !options.force) {
    console.log("⚠️  已经初始化过了。使用 --force 重新注册设备。");
    console.log(`   Machine ID: ${existingConfig.machine_id}`);
    console.log(`   Worker URL: ${existingConfig.worker_url}`);
    return;
  }

  console.log("🔧 Claude Notify 初始化\n");

  // Worker URL: reuse existing, or accept from flag/env, or prompt once
  let workerUrl = options.url
    || process.env.CLAUDE_NOTIFY_URL
    || (existingConfig && existingConfig.worker_url);

  if (!workerUrl) {
    workerUrl = await prompt("Worker URL: ");
  }
  workerUrl = workerUrl.replace(/\/+$/, "");

  if (!workerUrl.startsWith("https://")) {
    console.error("❌ Worker URL 必须以 https:// 开头");
    process.exit(1);
  }

  // Generate new credentials
  const machineId = crypto.randomUUID();
  const notifyToken = crypto.randomBytes(32).toString("hex");
  const machineName = os.hostname();

  console.log(`📋 设备: ${machineName}`);
  console.log(`📡 注册中...`);

  try {
    const { data } = await register(workerUrl, {
      machine_id: machineId,
      notify_token: notifyToken,
      machine_name: machineName,
    });
    if (!data.success) { console.error(`❌ ${data.error}`); process.exit(1); }
  } catch (e) {
    console.error(`❌ 无法连接: ${e.message}`);
    process.exit(1);
  }

  saveConfig({ machine_id: machineId, notify_token: notifyToken, worker_url: workerUrl });

  const bindUrl = `${workerUrl}/bind?id=${machineId}`;
  console.log("✅ 注册成功\n");
  console.log("📱 扫码绑定手机:\n");

  try {
    const qrcode = require("qrcode-terminal");
    qrcode.generate(bindUrl, { small: true }, (qr) => {
      console.log(qr);
      console.log(`\n🔗 ${bindUrl}`);
      console.log(`\n运行 claude-notify setup-hook 配置自动通知`);
    });
  } catch {
    console.log(`🔗 ${bindUrl}\n`);
    console.log(`运行 claude-notify setup-hook 配置自动通知`);
  }
}

module.exports = initCommand;
