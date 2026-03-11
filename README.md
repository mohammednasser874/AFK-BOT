# Minecraft AFK Bot

An automated Minecraft AFK bot using [Mineflayer](https://github.com/PrismarineJS/mineflayer) that runs on GitHub Actions with intelligent anti-AFK protection.

## Features

- **Smart Anti-AFK**: Random movements every minute to avoid being kicked
  - Arm swinging (15-45 second intervals)
  - Head rotation (20-60 second intervals)
  - Small walks/jumps (30-90 second intervals)
  - Continuous subtle movements
- **AuthMe Auto-Login**: Automatically handles `/login` and `/register` commands
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
| `AUTHME_PASSWORD` | No | - | AuthMe plugin password (see below) |

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

- `@AFKBot status` - Shows runtime, health, food, auth status, and position
- `@AFKBot pos` - Shows current coordinates
- `@AFKBot auth` - Shows AuthMe authentication status
- `@AFKBot stop` - Gracefully shuts down the bot

## AuthMe Plugin Support

If the server uses the [AuthMe](https://github.com/AuthMe/AuthMeReloaded) plugin, the bot can automatically handle authentication:

### Setup

1. Add the `AUTHME_PASSWORD` secret to your GitHub repository
2. The bot will automatically detect and respond to:
   - `/register` prompts (for new accounts)
   - `/login` prompts (for existing accounts)

### How it works

- When you join, AuthMe typically sends a message like "Please /login" or "Please /register"
- The bot detects these messages and automatically sends the appropriate command
- It waits 2-4 seconds (randomized) before responding to appear more natural
- After successful authentication, anti-AFK routines start automatically
- If authentication fails 3 times, the bot reconnects and tries again

### AuthMe Features

- **Auto-Register**: Detects register prompts and sends `/register <password> <password>`
- **Auto-Login**: Detects login prompts and sends `/login <password>`
- **Success Detection**: Recognizes successful authentication messages
- **Error Handling**: Handles wrong password, already registered, etc.
- **Anti-AFK Delay**: Won't move until fully authenticated

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
