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

    if (data.success) {
      console.log("🔔 通知已恢复");
    } else {
      console.error(`❌ ${data.error}`);
    }
  } catch (e) {
    console.error(`❌ 请求失败: ${e.message}`);
  }
}

module.exports = resumeCommand;
