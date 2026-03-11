# Minecraft AFK Bot

An automated Minecraft AFK bot using [Mineflayer](https://github.com/PrismarineJS/mineflayer) that runs on GitHub Actions with intelligent anti-AFK protection.

## Features

- **Smart Anti-AFK**: Random movements every minute to avoid being kicked
  - Arm swinging (15-45 second intervals)
  - Head rotation (20-60 second intervals)
  - Small walks/jumps (30-90 second intervals)
  - Continuous subtle movements
- **Auto-Reconnect**: Automatically reconnects if disconnected
- **Auto-Restart**: Stops at 5h 50m and automatically triggers a new run
- **Remote Commands**: Respond to chat commands for status checks
- **Health Monitoring**: Tracks health and food levels
- **Pathfinding**: Uses mineflayer-pathfinder for intelligent movement

## Setup

1. **Fork this repository**

2. **Configure Secrets** (Settings → Secrets and variables → Actions):

| Secret | Required | Default | Description |
|--------|----------|---------|-------------|
| `SERVER_HOST` | Yes | - | Minecraft server IP or hostname |
| `SERVER_PORT` | No | `25565` | Server port |
| `BOT_USERNAME` | No | `AFKBot_GH` | Bot's username |
| `SERVER_VERSION` | No | `1.20.1` | Minecraft version |
| `AUTH_TYPE` | No | `offline` | Authentication: `offline`, `microsoft`, or `mojang` |
| `BOT_PASSWORD` | No | - | Password (for online servers) |

3. **Start the Bot**

   Go to Actions → Minecraft AFK Bot → Run workflow

## Anti-AFK Actions

The bot performs these actions at random intervals:

- **Arm Swinging**: Simulates clicking/using items
- **Head Turning**: Looks around randomly
- **Walking**: Small forward/back/side movements
- **Jumping**: Occasional jumps (sometimes while sprinting)
- **Sneaking**: Brief crouch toggles
- **Pathfinding**: Walks to nearby random positions

## Chat Commands

If you mention the bot's username in chat, it can respond to commands:

- `@AFKBot status` - Shows runtime, health, food, and position
- `@AFKBot pos` - Shows current coordinates
- `@AFKBot stop` - Gracefully shuts down the bot

## Runtime Behavior

- **Max Runtime**: 5 hours 50 minutes (350 minutes)
- **Auto-Restart**: Automatically triggers a new workflow run when time is up
- **Continuous Operation**: With GitHub Actions scheduling, the bot runs 24/7
- **Logs**: Available in the Actions tab for each run

## Requirements

- Minecraft server (vanilla, Spigot, Paper, etc.)
- For cracked/offline servers: use `AUTH_TYPE: offline`
- For premium servers: use `AUTH_TYPE: microsoft` with valid credentials

## Disclaimer

**Use at your own risk!** Some servers prohibit AFK bots. Make sure to:
- Check server rules before using
- Use on servers you own or have permission to use
- Not use for malicious purposes (spam, griefing, etc.)

## License

MIT
