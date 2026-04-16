const { requireConfig } = require("../config");
const { status } = require("../api");

async function statusCommand() {
  const config = requireConfig();

  try {
    const { data } = await status(config.worker_url, config.machine_id);

    if (!data.success) {
      console.error(`❌ ${data.error}`);
      return;
    }

    console.log("📊 设备状态:");
    console.log(`   设备名称: ${data.machine_name}`);
    console.log(`   绑定状态: ${data.bound ? "✅ 已绑定" : "❌ 未绑定"}`);
    console.log(`   通知开关: ${data.is_active ? "🔔 开启" : "🔕 关闭"}`);
    console.log(`   Worker:   ${config.worker_url}`);
  } catch (e) {
    console.error(`❌ 请求失败: ${e.message}`);
  }
}

module.exports = statusCommand;
