const { requireConfig } = require("../config");
const { notify } = require("../api");

async function testCommand() {
  const config = requireConfig();

  console.log("📡 发送测试通知...");

  try {
    const { data } = await notify(config.worker_url, {
      machine_id: config.machine_id,
      notify_token: config.notify_token,
      cwd: process.cwd(),
    });

    if (data.success) {
      console.log(`✅ ${data.message}`);
    } else {
      console.error(`❌ ${data.error}`);
    }
  } catch (e) {
    console.error(`❌ 请求失败: ${e.message}`);
  }
}

module.exports = testCommand;
