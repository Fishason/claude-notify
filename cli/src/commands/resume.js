const { requireConfig } = require("../config");
const { toggle } = require("../api");

async function resumeCommand() {
  const config = requireConfig();
  try {
    const { data } = await toggle(config.worker_url, {
      machine_id: config.machine_id,
      notify_token: config.notify_token,
      active: true,
    });
    if (data.success) console.log("Notifications resumed.");
    else console.error(`Error: ${data.error}`);
  } catch (e) { console.error(`Failed: ${e.message}`); }
}

module.exports = resumeCommand;
