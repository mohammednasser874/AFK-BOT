const mineflayer = require('mineflayer');
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const Movements = require('mineflayer-pathfinder').Movements;
const { GoalNear, GoalBlock } = require('mineflayer-pathfinder').goals;

// Configuration from environment variables
const BOT_USERNAME = process.env.BOT_USERNAME || 'AFKBot_' + Math.floor(Math.random() * 1000);
const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const SERVER_PORT = parseInt(process.env.SERVER_PORT) || 25565;
const SERVER_VERSION = process.env.SERVER_VERSION || '1.20.1';
const AUTH_TYPE = process.env.AUTH_TYPE || 'offline'; // 'microsoft', 'mojang', or 'offline'
const MAX_RUNTIME_MINUTES = 350; // 5 hours 50 minutes (350 minutes)

// Track runtime
const startTime = Date.now();
let lastActivityTime = Date.now();
let isShuttingDown = false;

// Create bot instance
function createBot() {
    const options = {
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: BOT_USERNAME,
        version: SERVER_VERSION,
        auth: AUTH_TYPE,
        checkTimeoutInterval: 60000, // Check connection every minute
    };

    // Add password for online mode if provided
    if (process.env.BOT_PASSWORD) {
        options.password = process.env.BOT_PASSWORD;
    }

    const bot = mineflayer.createBot(options);

    // Load plugins
    bot.loadPlugin(pathfinder);

    // Store original position for reference
    let originalPosition = null;
    let mcData = null;

    // Bot spawn event
    bot.on('spawn', () => {
        console.log(`[${getTimestamp()}] Bot spawned successfully!`);
        console.log(`[${getTimestamp()}] Username: ${bot.username}`);
        console.log(`[${getTimestamp()}] Server: ${SERVER_HOST}:${SERVER_PORT}`);
        console.log(`[${getTimestamp()}] Position: ${formatPosition(bot.entity.position)}`);

        originalPosition = bot.entity.position.clone();

        // Load mcData after spawn
        mcData = require('minecraft-data')(bot.version);
        const defaultMove = new Movements(bot, mcData);
        bot.pathfinder.setMovements(defaultMove);

        // Initial delay before starting anti-AFK
        setTimeout(() => {
            console.log(`[${getTimestamp()}] Starting anti-AFK routines...`);
            startAntiAfkRoutines(bot);
        }, 5000);
    });

    // Login event
    bot.on('login', () => {
        console.log(`[${getTimestamp()}] Bot logged in successfully`);
    });

    // Error handling
    bot.on('error', (err) => {
        console.error(`[${getTimestamp()}] Bot error:`, err.message);
    });

    // Kicked from server
    bot.on('kicked', (reason, loggedIn) => {
        console.log(`[${getTimestamp()}] Bot was kicked! Reason: ${reason}`);
        if (!isShuttingDown) {
            console.log(`[${getTimestamp()}] Reconnecting in 10 seconds...`);
            setTimeout(createBot, 10000);
        }
    });

    // End/Disconnect event
    bot.on('end', () => {
        console.log(`[${getTimestamp()}] Bot disconnected`);
        if (!isShuttingDown) {
            console.log(`[${getTimestamp()}] Reconnecting in 10 seconds...`);
            setTimeout(createBot, 10000);
        }
    });

    // Chat message handler - can be used for remote commands
    bot.on('message', (jsonMsg) => {
        const message = jsonMsg.toString();
        console.log(`[${getTimestamp()}] Chat: ${message}`);

        // Simple command processing (if message contains bot username)
        if (message.includes(bot.username) && !message.includes(bot.username + '>')) {
            handleCommand(bot, message);
        }
    });

    // Handle death
    bot.on('death', () => {
        console.log(`[${getTimestamp()}] Bot died! Respawning...`);
        // Bot auto-respawns, but we log it
    });

    // Health monitoring
    bot.on('health', () => {
        if (bot.health < 10) {
            console.log(`[${getTimestamp()}] WARNING: Low health! ${bot.health}/20`);
        }
    });

    return bot;
}

// Anti-AFK routines
function startAntiAfkRoutines(bot) {
    // Routine 1: Random arm swing every 15-45 seconds
    setInterval(() => {
        if (isShuttingDown) return;
        performRandomArmSwing(bot);
    }, getRandomInterval(15000, 45000));

    // Routine 2: Head rotation every 20-60 seconds
    setInterval(() => {
        if (isShuttingDown) return;
        performRandomHeadTurn(bot);
    }, getRandomInterval(20000, 60000));

    // Routine 3: Small movement every 30-90 seconds
    setInterval(() => {
        if (isShuttingDown) return;
        performRandomMovement(bot);
    }, getRandomInterval(30000, 90000));

    // Routine 4: Jump occasionally every 60-180 seconds
    setInterval(() => {
        if (isShuttingDown) return;
        performRandomJump(bot);
    }, getRandomInterval(60000, 180000));

    // Routine 5: Look around continuously (subtle)
    setInterval(() => {
        if (isShuttingDown) return;
        performSubtleLook(bot);
    }, 3000);

    // Main anti-AFK: Change position every minute
    setInterval(() => {
        if (isShuttingDown) return;
        performAntiAfkSequence(bot);
    }, 60000); // Every minute

    console.log(`[${getTimestamp()}] All anti-AFK routines started!`);
}

// Perform a sequence of anti-AFK actions
function performAntiAfkSequence(bot) {
    if (!bot.entity) return;

    const actions = [
        () => performRandomMovement(bot),
        () => performRandomArmSwing(bot),
        () => performRandomHeadTurn(bot),
        () => performRandomJump(bot),
        () => performCrouchToggle(bot),
    ];

    // Execute 2-3 random actions
    const numActions = Math.floor(Math.random() * 2) + 2;
    const shuffled = actions.sort(() => Math.random() - 0.5);

    console.log(`[${getTimestamp()}] Performing anti-AFK sequence (${numActions} actions)`);

    shuffled.slice(0, numActions).forEach((action, index) => {
        setTimeout(() => {
            if (!isShuttingDown && bot.entity) {
                action();
            }
        }, index * 2000); // Stagger actions by 2 seconds
    });

    lastActivityTime = Date.now();
}

// Random arm swing (simulates clicking/using item)
function performRandomArmSwing(bot) {
    if (!bot.entity) return;

    const swingTypes = ['arm', 'off_hand', 'eat', 'drink'];
    const type = swingTypes[Math.floor(Math.random() * swingTypes.length)];

    switch(type) {
        case 'arm':
            bot.swingArm();
            break;
        case 'off_hand':
            bot.swingArm('off-hand');
            break;
        case 'eat':
            // Simulate eating if holding food
            bot.swingArm();
            break;
        case 'drink':
            // Simulate drinking
            bot.swingArm();
            break;
    }

    console.log(`[${getTimestamp()}] Anti-AFK: Arm swing (${type})`);
}

// Random head turning
function performRandomHeadTurn(bot) {
    if (!bot.entity) return;

    const yaw = Math.random() * Math.PI * 2; // 0 to 360 degrees
    const pitch = (Math.random() - 0.5) * Math.PI; // -90 to 90 degrees

    bot.look(yaw, pitch, false); // false = instant, true = smooth
    console.log(`[${getTimestamp()}] Anti-AFK: Head turn`);
}

// Subtle continuous looking (makes bot appear more natural)
function performSubtleLook(bot) {
    if (!bot.entity) return;

    const currentYaw = bot.entity.yaw;
    const currentPitch = bot.entity.pitch;

    // Small random adjustments
    const newYaw = currentYaw + (Math.random() - 0.5) * 0.3;
    const newPitch = currentPitch + (Math.random() - 0.5) * 0.2;

    bot.look(newYaw, newPitch, true); // true = smooth
}

// Random movement - walk a small distance
function performRandomMovement(bot) {
    if (!bot.entity || !bot.pathfinder) return;

    const moves = ['forward', 'back', 'left', 'right', 'small_walk'];
    const move = moves[Math.floor(Math.random() * moves.length)];

    switch(move) {
        case 'forward':
            bot.setControlState('forward', true);
            setTimeout(() => bot.setControlState('forward', false), 500 + Math.random() * 1000);
            break;
        case 'back':
            bot.setControlState('back', true);
            setTimeout(() => bot.setControlState('back', false), 500 + Math.random() * 1000);
            break;
        case 'left':
            bot.setControlState('left', true);
            setTimeout(() => bot.setControlState('left', false), 300 + Math.random() * 500);
            break;
        case 'right':
            bot.setControlState('right', true);
            setTimeout(() => bot.setControlState('right', false), 300 + Math.random() * 500);
            break;
        case 'small_walk':
            // Use pathfinder to walk to nearby random position
            const x = bot.entity.position.x + (Math.random() - 0.5) * 3;
            const z = bot.entity.position.z + (Math.random() - 0.5) * 3;
            const y = bot.entity.position.y;

            try {
                bot.pathfinder.goto(new GoalNear(x, y, z, 1)).catch(() => {
                    // Pathfinding failed, just do manual movement
                    bot.setControlState('forward', true);
                    setTimeout(() => bot.setControlState('forward', false), 1000);
                });
            } catch (e) {
                // Fallback to simple movement
                bot.setControlState('forward', true);
                setTimeout(() => bot.setControlState('forward', false), 1000);
            }
            break;
    }

    console.log(`[${getTimestamp()}] Anti-AFK: Movement (${move})`);
}

// Random jumping
function performRandomJump(bot) {
    if (!bot.entity) return;

    const jumpTypes = ['normal', 'sprint'];
    const type = jumpTypes[Math.floor(Math.random() * jumpTypes.length)];

    if (type === 'sprint') {
        bot.setControlState('sprint', true);
        bot.setControlState('jump', true);
        setTimeout(() => {
            bot.setControlState('jump', false);
            setTimeout(() => bot.setControlState('sprint', false), 500);
        }, 500);
    } else {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 250);
    }

    console.log(`[${getTimestamp()}] Anti-AFK: Jump (${type})`);
}

// Crouch toggle (sneak/unsneak)
function performCrouchToggle(bot) {
    if (!bot.entity) return;

    bot.setControlState('sneak', true);
    setTimeout(() => {
        bot.setControlState('sneak', false);
    }, 1000 + Math.random() * 2000);

    console.log(`[${getTimestamp()}] Anti-AFK: Crouch toggle`);
}

// Handle chat commands
function handleCommand(bot, message) {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('status')) {
        const runtime = Math.floor((Date.now() - startTime) / 1000 / 60);
        const health = bot.health || '?';
        const food = bot.food || '?';
        const pos = formatPosition(bot.entity?.position);
        bot.chat(`Status: ${runtime}min | HP: ${health}/20 | Food: ${food}/20 | Pos: ${pos}`);
    }
    else if (lowerMsg.includes('pos') || lowerMsg.includes('position')) {
        const pos = formatPosition(bot.entity?.position);
        bot.chat(`Position: ${pos}`);
    }
    else if (lowerMsg.includes('stop') || lowerMsg.includes('shutdown')) {
        bot.chat('Shutting down AFK bot...');
        gracefulShutdown(bot);
    }
}

// Helper: Get random interval between min and max
function getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper: Format position
function formatPosition(pos) {
    if (!pos) return 'unknown';
    return `X:${Math.floor(pos.x)} Y:${Math.floor(pos.y)} Z:${Math.floor(pos.z)}`;
}

// Helper: Get timestamp
function getTimestamp() {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

// Graceful shutdown
function gracefulShutdown(bot) {
    isShuttingDown = true;
    console.log(`[${getTimestamp()}] Initiating graceful shutdown...`);

    if (bot) {
        bot.chat('AFK Bot disconnecting. Goodbye!');
        setTimeout(() => {
            bot.quit();
            process.exit(0);
        }, 1000);
    } else {
        process.exit(0);
    }
}

// Runtime monitoring - shutdown at 5h 50m
function checkRuntime() {
    const elapsedMinutes = (Date.now() - startTime) / 1000 / 60;

    if (elapsedMinutes >= MAX_RUNTIME_MINUTES) {
        console.log(`[${getTimestamp()}] Runtime limit reached (${MAX_RUNTIME_MINUTES} minutes). Shutting down for restart...`);
        gracefulShutdown(bot);
        return;
    }

    // Log status every 10 minutes
    if (Math.floor(elapsedMinutes) % 10 === 0) {
        const remaining = MAX_RUNTIME_MINUTES - elapsedMinutes;
        console.log(`[${getTimestamp()}] Runtime: ${Math.floor(elapsedMinutes)}min / ${MAX_RUNTIME_MINUTES}min (${Math.floor(remaining)}min remaining)`);
    }
}

// Start the bot
console.log('==========================================');
console.log('       Minecraft AFK Bot Starting        ');
console.log('==========================================');
console.log(`Bot Username: ${BOT_USERNAME}`);
console.log(`Server: ${SERVER_HOST}:${SERVER_PORT}`);
console.log(`Version: ${SERVER_VERSION}`);
console.log(`Max Runtime: ${MAX_RUNTIME_MINUTES} minutes (5h 50m)`);
console.log('==========================================');

// Create bot
const bot = createBot();

// Start runtime checker
setInterval(checkRuntime, 60000); // Check every minute

// Handle process signals
process.on('SIGINT', () => gracefulShutdown(bot));
process.on('SIGTERM', () => gracefulShutdown(bot));
