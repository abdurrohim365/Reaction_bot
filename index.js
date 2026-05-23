const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf('8910641323:AAH2CI2u_160uxRA428PbjPe8nKK3BiCTRM'); // এখানে আপনার বটের টোকেন দিন
const ADMIN_ID = 2095910166; 

const chatIds = new Set();

bot.start((ctx) => {
    ctx.reply(`𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂 𝗔𝗹𝗮𝗶𝗸𝘂𝗺 🌸✨\n\nঅটো রিঅ্যাকশন বটটি সফলভাবে চালু হয়েছে।`, 
        Markup.inlineKeyboard([
            [Markup.button.url('📢 Join Channel', 'https://t.me/ArbeenTech')],
            [Markup.button.url('👥 Join Group', 'https://t.me/Arbeen_Tech')]
        ]));
});

// গ্রুপ আইডি অটো সেভ করার জন্য
bot.use((ctx, next) => {
    if (ctx.chat) {
        chatIds.add(ctx.chat.id);
    }
    return next();
});

// অটো রিঅ্যাকশন
bot.on(['message', 'channel_post'], async (ctx) => {
    try {
        const emojis = ['❤️', '🔥', '💯', '💋', '💘', '❤️‍🔥', '😱', '😍'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const msg = ctx.message || ctx.channelPost;
        await ctx.telegram.setMessageReaction(ctx.chat.id, msg.message_id, [{ type: 'emoji', emoji: randomEmoji }]);
    } catch (e) {}
});

// ব্রডকাস্ট কমান্ড
bot.command('broadcast', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const msg = ctx.message;
    const text = msg.text ? msg.text.split(' ').slice(1).join(' ') : "";

    if (!msg.photo && !text) return ctx.reply("❌ কিছু লিখে বা ছবি দিয়ে /broadcast লিখুন।");

    let success = 0, failed = 0;
    for (const chatId of chatIds) {
        if (chatId === ADMIN_ID) continue;
        try {
            if (msg.photo) {
                await ctx.telegram.sendPhoto(chatId, msg.photo[msg.photo.length - 1].file_id, { caption: msg.caption ? msg.caption.replace('/broadcast', '').trim() : "" });
            } else if (text) {
                await ctx.telegram.sendMessage(chatId, text);
            }
            success++;
        } catch (e) { failed++; }
    }
    ctx.reply(`✅ ব্রডকাস্ট সম্পন্ন!\nসফল: ${success} | ব্যর্থ: ${failed}`);
});

bot.launch();
console.log("Bot is running...");
