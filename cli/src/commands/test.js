const { requireConfig } = require("../config");
const { notify } = require("../api");

async function testCommand() {
  const config = requireConfig();
  console.log("Sending test notification...");

  try {
    const { data } = await notify(config.worker_url, {
      machine_id: config.machine_id,
      notify_token: config.notify_token,
      cwd: process.cwd(),
      session_name: "Test Notification",
    });

    if (data.success) console.log(`Done: ${data.message}`);
    else console.error(`Error: ${data.error}`);
  } catch (e) {
    console.error(`Failed: ${e.message}`);
  }
}

module.exports = testCommand;
