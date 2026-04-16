const { requireConfig } = require("../config");
const { status } = require("../api");

async function statusCommand() {
  const config = requireConfig();

  try {
    const { data } = await status(config.worker_url, config.machine_id);
    if (!data.success) { console.error(`Error: ${data.error}`); return; }

    console.log(`Machine:       ${data.machine_name}`);
    console.log(`Bound:         ${data.bound ? "Yes" : "No"}`);
    console.log(`Notifications: ${data.is_active ? "On" : "Off"}`);
  } catch (e) {
    console.error(`Failed: ${e.message}`);
  }
}

module.exports = statusCommand;
