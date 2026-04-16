#!/usr/bin/env node

const { program } = require("commander");

program
  .name("claude-notify")
  .description("Claude Code 完成通知推送工具")
  .version("1.0.0");

program
  .command("init")
  .description("初始化设备，生成绑定二维码")
  .option("-u, --url <url>", "Worker URL")
  .option("-f, --force", "强制重新初始化")
  .action(async (options) => {
    const init = require("../src/commands/init");
    await init(options);
  });

program
  .command("test")
  .description("发送测试通知")
  .action(async () => {
    const test = require("../src/commands/test");
    await test();
  });

program
  .command("status")
  .description("查看设备绑定状态")
  .action(async () => {
    const status = require("../src/commands/status");
    await status();
  });

program
  .command("setup-hook")
  .description("配置 Claude Code hook (自动通知)")
  .option("-r, --remove", "移除 hook")
  .action(async (options) => {
    const setupHook = require("../src/commands/setup-hook");
    await setupHook(options);
  });

program
  .command("pause")
  .description("暂停通知")
  .action(async () => {
    const pause = require("../src/commands/pause");
    await pause();
  });

program
  .command("resume")
  .description("恢复通知")
  .action(async () => {
    const resume = require("../src/commands/resume");
    await resume();
  });

program
  .command("_hook-handler", { hidden: true })
  .description("内部: hook 调用入口")
  .action(async () => {
    const hookHandler = require("../src/commands/hook-handler");
    await hookHandler();
  });

program.parse();
