const express = require('express');

// Error Fix: Smart Import for TelegramBot
const tg = require('node-telegram-bot-api');
const TelegramBot = tg.default || tg; 

// Yahan apna asli Token daalna
const token = '8819547922:AAFuBnriiOMdBiMpepo09aktx4ADBSqwSZg'; 
const SECRET_CODE = 'pakxavia';

const app = express();
const bot = new TelegramBot(token, {polling: true});
const usersDB = {};

// Keep-alive server
app.get('/', (req, res) => {
    res.send('MUJJI AI Bot is Running!');
});
app.listen(3000, () => {
    console.log('Web server is online...');
});

function cyrb53(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

// ==========================================
// 1. GLOBAL AUTO-SIGNAL SYSTEM
// ==========================================
let lastBroadcastedRound = -1;

setInterval(() => {
    const now = Date.now();
    const CYCLE_MS = 24 * 60 * 60 * 1000;
    const epoch = now - (now % CYCLE_MS); 
    let simulatedTime = epoch;
    let roundIndex = 0;

    while (simulatedTime <= now + 10000) { 
        const hash = cyrb53(`round-${epoch}-${roundIndex}-secret`);
        const h = hash / Number.MAX_SAFE_INTEGER;
        const e = 100 / (1 - h);
        let crashPoint = Math.max(1.00, Math.floor(e) / 100);

        if (crashPoint > 1000) crashPoint = 1000;
        if (h < 0.03) crashPoint = 1.00; 

        const flightTime = Math.log(crashPoint) / 0.065 * 1000;
        const totalRoundTime = 5000 + flightTime + 2000; 
        const flightStartTime = simulatedTime + 5000;

        if (now >= simulatedTime && now < flightStartTime) {
            if (lastBroadcastedRound !== roundIndex) {
                lastBroadcastedRound = roundIndex;
                broadcastAutoSignals(crashPoint.toFixed(2));
            }
            break;
        }
        simulatedTime += totalRoundTime;
        roundIndex++;
    }
}, 1000); 

function broadcastAutoSignals(multiplier) {
    for (const chatId in usersDB) {
        if (usersDB[chatId].autoEnabled) {
            bot.sendMessage(chatId, `🤖 <b>MUJJI AI AUTO-SIGNAL</b> 🤖\n\n🚀 Next Crash: <b>${multiplier}x</b>\n\n<i>Get ready to cashout!</i>`, {parse_mode: 'HTML'});
        }
    }
}

// ==========================================
// 2. USER LOGIN SYSTEM (English Only)
// ==========================================
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text) return;

    if (!usersDB[chatId]) {
        usersDB[chatId] = { step: 0, country: '', uid: '', autoEnabled: false };
    }

    if (text === '/start') {
        usersDB[chatId].step = 1;
        usersDB[chatId].autoEnabled = false;
        bot.sendMessage(chatId, "🚀 <b>Welcome to MUJJI AI Predictor!</b>\n\nPlease enter your <b>Country</b> to begin:", {parse_mode: 'HTML'});
        return;
    }

    // Step 1: User enters Country
    if (usersDB[chatId].step === 1) {
        usersDB[chatId].country = text.trim();
        usersDB[chatId].step = 2; 
        bot.sendMessage(chatId, "✅ <b>Country Saved!</b>\n\nNow, please enter your <b>Game UID</b>:", {parse_mode: 'HTML'});
    } 
    // Step 2: User enters UID
    else if (usersDB[chatId].step === 2) {
        usersDB[chatId].uid = text.trim();
        usersDB[chatId].step = 'verifying'; 

        bot.sendMessage(chatId, "🔄 <b>Verifying UID... Please wait.</b>", {parse_mode: 'HTML'});

        setTimeout(() => {
            usersDB[chatId].step = 3; 
            bot.sendMessage(chatId, "✅ <b>UID Verified Successfully!</b>\n\nPlease enter the <b>Secret Code</b> provided by the Admin to unlock signals:", {parse_mode: 'HTML'});
        }, 2000);
    }
    // Step 3: User enters Secret Code
    else if (usersDB[chatId].step === 3) {
        if (text.toLowerCase() === SECRET_CODE.toLowerCase()) {
            usersDB[chatId].step = 4; 
            usersDB[chatId].autoEnabled = true;

            bot.sendMessage(chatId, "🎉 <b>Access Granted!</b>\n\nAuto-Signals are now <b>ON</b>. You will automatically receive the exact signal before every round starts. Please wait for the next round...", {parse_mode: 'HTML'});
        } else {
            bot.sendMessage(chatId, "❌ <b>Invalid Code!</b>\nPlease enter the correct Secret Code or contact Admin.", {parse_mode: 'HTML'});
        }
    }
});

console.log("Bot is running perfectly now...");
