# Claude Notify

Get push notifications on your iPhone when Claude Code finishes a task.

Built for SSH workflows — know when Claude is done without watching the terminal.

## Setup

### 1. Install [Bark](https://apps.apple.com/app/bark/id1403753865) on your iPhone (free)

### 2. Install the CLI

```bash
npm install -g @fishason/cc-notify
```

### 3. Initialize

```bash
claude-notify init
```

Scan the QR code with your phone, paste your Bark key on the binding page.

### 4. Enable the hook

```bash
claude-notify setup-hook
```

Done. You'll get a push notification whenever Claude Code is idle and waiting for input.

## Commands

```
claude-notify init          Register device, show QR code
claude-notify init --force  Re-register (new QR code)
claude-notify test          Send a test notification
claude-notify status        Check binding status
claude-notify setup-hook    Configure Claude Code hook
claude-notify pause         Pause notifications
claude-notify resume        Resume notifications
```

## How it works

```
Claude Code finishes → idle 60s → Hook fires → Cloudflare Worker → Bark → iPhone
```

Notifications show the session name (set via `/rename` in Claude Code) or the project directory.

## Mac notifications

iPhone notifications sync to Mac via iPhone Mirroring (macOS Sequoia + iOS 18) or notification forwarding with the same Apple ID.

## Requirements

- Node.js >= 18
- iPhone with [Bark](https://github.com/Finb/Bark) app

## License

MIT
