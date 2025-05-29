const { Telegraf } = require("telegraf");
const config = require("../config");

const bot = new Telegraf(config.bot_api_key);

// JioSaavn and Musicder logic here
bot.on("text", async (ctx) => {
  const query = ctx.message.text;
  const apiUrl = `${config.jiosaavn_api_url}search?query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    if (data && data.length > 0) {
      await ctx.reply(`🎵 ${data[0].song} by ${data[0].primary_artists}\nDownload: ${data[0].media_preview_url}`);
    } else {
      await ctx.reply("❌ Song not found.");
    }
  } catch (e) {
    console.error(e);
    ctx.reply("⚠️ Failed to fetch song.");
  }
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    await bot.handleUpdate(req.body);
    res.status(200).send("OK");
  } else {
    res.status(200).send("Bot is running...");
  }
}
