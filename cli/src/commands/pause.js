const { requireConfig } = require("../config");
const { toggle } = require("../api");

async function pauseCommand() {
  const config = requireConfig();
  try {
    const { data } = await toggle(config.worker_url, {
      machine_id: config.machine_id,
      notify_token: config.notify_token,
      active: false,
    });
    if (data.success) console.log("Notifications paused.");
    else console.error(`Error: ${data.error}`);
  } catch (e) { console.error(`Failed: ${e.message}`); }
}

module.exports = pauseCommand;
