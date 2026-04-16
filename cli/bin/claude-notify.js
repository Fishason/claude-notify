#!/usr/bin/env node

const { program } = require("commander");

program
  .name("claude-notify")
  .description("Push notifications when Claude Code finishes")
  .version("1.0.0");

program
  .command("init")
  .description("Register device and show binding QR code")
  .option("-f, --force", "Re-register device")
  .action(async (opts) => { await require("../src/commands/init")(opts); });

program
  .command("test")
  .description("Send a test notification")
  .action(async () => { await require("../src/commands/test")(); });

program
  .command("status")
  .description("Check binding status")
  .action(async () => { await require("../src/commands/status")(); });

program
  .command("setup-hook")
  .description("Configure Claude Code hook")
  .option("-r, --remove", "Remove the hook")
  .action(async (opts) => { await require("../src/commands/setup-hook")(opts); });

program
  .command("pause")
  .description("Pause notifications")
  .action(async () => { await require("../src/commands/pause")(); });

program
  .command("resume")
  .description("Resume notifications")
  .action(async () => { await require("../src/commands/resume")(); });

program
  .command("_hook-handler", { hidden: true })
  .action(async () => { await require("../src/commands/hook-handler")(); });

program.parse();
