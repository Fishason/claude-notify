# Claude Notify

Get push notifications on your iPhone when Claude Code finishes a task on your SSH server.

Uses [Bark](https://github.com/Finb/Bark) for push delivery and Cloudflare Workers + D1 as a lightweight backend.

## How it works

```
Claude Code idle → Hook triggers → Cloudflare Worker → Bark API → iPhone notification
```

Notifications include the session name (set via `/rename`) or the project directory.

## Quick Start

### 1. Install Bark on your iPhone

Download [Bark](https://apps.apple.com/app/bark/id1403753865) from the App Store (free).

### 2. Deploy the Worker (one-time)

You need a [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier is sufficient).

```bash
cd worker
npm install
npx wrangler login
npx wrangler d1 create claude-notify-db
```

Copy the `database_id` from the output into `wrangler.jsonc`, then:

```bash
npx wrangler d1 execute claude-notify-db --remote --file=./schema.sql
npx wrangler deploy
```

Note the Worker URL (e.g. `https://claude-notify.xxx.workers.dev`).

### 3. Install the CLI on your SSH server

```bash
npm install -g cc-notify
```

### 4. Initialize and bind

```bash
claude-notify init --url https://claude-notify.xxx.workers.dev
```

Scan the QR code with your iPhone, paste your Bark key on the binding page.

### 5. Set up the hook

```bash
claude-notify setup-hook
```

Done. Claude Code will now notify you when it's idle.

## CLI Commands

| Command | Description |
|---------|-------------|
| `claude-notify init` | Register device and show binding QR code |
| `claude-notify test` | Send a test notification |
| `claude-notify status` | Check binding status |
| `claude-notify setup-hook` | Configure Claude Code hook |
| `claude-notify pause` | Pause notifications |
| `claude-notify resume` | Resume notifications |

### Flags

- `claude-notify init --force` — Re-register device (keeps Worker URL)
- `claude-notify init --url <URL>` — Set Worker URL
- `claude-notify setup-hook --remove` — Remove the hook

### Environment variables

- `CLAUDE_NOTIFY_URL` — Worker URL (alternative to `--url` flag)

## Mac Notifications

iPhone notifications sync to Mac automatically via:
- **iPhone Mirroring** (macOS Sequoia + iOS 18)
- **Notification forwarding** when devices share the same Apple ID

## Architecture

```
┌─────────────┐     ┌──────────────────────┐     ┌──────────┐
│  SSH Server  │────▶│  Cloudflare Worker   │────▶│   Bark   │
│  (CLI hook)  │     │  + D1 Database       │     │   API    │
└─────────────┘     └──────────────────────┘     └────┬─────┘
                             │                         │
                    ┌────────┴────────┐          ┌─────▼─────┐
                    │  Binding Page   │          │  iPhone   │
                    │  (scan QR)      │          │  (APNs)   │
                    └─────────────────┘          └───────────┘
```

## Requirements

- Node.js >= 18
- Cloudflare account (free tier)
- iPhone with Bark app

## License

MIT
