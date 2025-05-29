// index.js
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const settings = require('./settings');

const bot = new Telegraf(settings.bot_api_key);

bot.start((ctx) => {
    ctx.reply(settings.start_message, { parse_mode: "HTML" });
});

bot.help((ctx) => {
    ctx.reply(settings.help_message, { parse_mode: "HTML" });
});

bot.command('about', (ctx) => {
    ctx.reply(settings.about_message, { parse_mode: "HTML" });
});

bot.on('text', async (ctx) => {
    const query = ctx.message.text;

    try {
        const isLink = query.startsWith("http") && query.includes("jiosaavn.com");
        const apiUrl = isLink
            ? `${settings.jiosaavn_api_url}song/?link=${encodeURIComponent(query)}`
            : `${settings.jiosaavn_api_url}search/?query=${encodeURIComponent(query)}`;

        const response = await axios.get(apiUrl);
        const results = isLink ? [response.data.data] : response.data.data.results;

        if (!results || results.length === 0 || !results[0]) {
            ctx.reply("❌ No song found. Please try again.");
            return;
        }

        results.slice(0, 5).forEach((song) => {
            const title = song.title;
            const album = song.album || "Unknown Album";
            const artist = song.more_info?.singers || "Unknown Artist";
            const songId = song.id;

            const caption = `🎵 <b>${title}</b>\n🎨 Artist: <b>${artist}</b>\n🎶 Album: <b>${album}</b>`;
            const downloadUrl = `${settings.musicder_url}download/?id=${songId}`;

            ctx.reply(caption, {
                parse_mode: "HTML",
                ...Markup.inlineKeyboard([
                    Markup.button.url("⬇️ Download", downloadUrl)
                ])
            });
        });

    } catch (error) {
        console.error("Error fetching song:", error.message);
        ctx.reply("⚠️ Something went wrong. Please try again later.");
    }
});

bot.launch()
    .then(() => console.log("✅ Bot started successfully!"))
    .catch((err) => console.error("❌ Failed to launch bot:", err));
