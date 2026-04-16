const crypto = require("crypto");
const os = require("os");
const { configExists, loadConfig, saveConfig } = require("../config");
const { register } = require("../api");

const WORKER_URL = "https://claude-notify.y3343454050.workers.dev";

async function initCommand(options) {
  const existing = loadConfig();

  if (existing && !options.force) {
    console.log("Already initialized. Use --force to re-register.");
    console.log(`  Machine: ${existing.machine_id}`);
    return;
  }

  const machineId = crypto.randomUUID();
  const notifyToken = crypto.randomBytes(32).toString("hex");
  const machineName = os.hostname();

  console.log(`Registering ${machineName}...`);

  try {
    const { data } = await register(WORKER_URL, {
      machine_id: machineId,
      notify_token: notifyToken,
      machine_name: machineName,
    });
    if (!data.success) { console.error(`Error: ${data.error}`); process.exit(1); }
  } catch (e) {
    console.error(`Connection failed: ${e.message}`);
    process.exit(1);
  }

  saveConfig({ machine_id: machineId, notify_token: notifyToken, worker_url: WORKER_URL });

  const bindUrl = `${WORKER_URL}/bind?id=${machineId}`;
  console.log("Registered.\n");
  console.log("Scan to bind your phone:\n");

  try {
    const qrcode = require("qrcode-terminal");
    qrcode.generate(bindUrl, { small: true }, (qr) => {
      console.log(qr);
      console.log(`\n${bindUrl}`);
      console.log(`\nThen run: claude-notify setup-hook`);
    });
  } catch {
    console.log(bindUrl);
    console.log(`\nThen run: claude-notify setup-hook`);
  }
}

module.exports = initCommand;
