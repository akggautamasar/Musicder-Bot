import { Telegraf } from "telegraf";
import axios from "axios";
import config from "../config.js";

const bot = new Telegraf(config.bot_api_key);

bot.start((ctx) => ctx.replyWithHTML(config.start_message));

bot.help((ctx) => ctx.replyWithHTML(config.help_message));

bot.command("about", (ctx) => ctx.replyWithHTML(config.about_message));

bot.on("text", async (ctx) => {
  const query = ctx.message.text.trim();

  // If user sends a JioSaavn link, extract query accordingly, else treat as song name
  let searchQuery = query;

  // If input looks like a JioSaavn URL, extract song ID or relevant part
  if (/https?:\/\/(www\.)?jiosaavn\.com/.test(query)) {
    // Extract song ID from URL or use whole URL as query
    searchQuery = query;
  }

  try {
    const response = await axios.get(
      `${config.jiosaavn_api_url}search?query=${encodeURIComponent(searchQuery)}`
    );

    const data = response.data;

    if (!data || !data.data || data.data.length === 0) {
      return ctx.reply("❌ No songs found for your query.");
    }

    // Pick top 3 results to send
    const songs = data.data.slice(0, 3);

    let replyText = "🎶 <b>Search Results:</b>\n\n";

    for (const song of songs) {
      // Each song usually has: title, primary_artists, album, media_preview_url etc.
      replyText += `🎵 <b>${song.title}</b> by <i>${song.primary_artists}</i>\n`;
      replyText += `Album: ${song.album}\n`;
      replyText += `Download Preview: <a href="${song.media_preview_url}">Listen</a>\n\n`;
    }

    replyText += `\nSend me another song name or JioSaavn link!`;

    await ctx.replyWithHTML(replyText, { disable_web_page_preview: true });
  } catch (error) {
    console.error("Error fetching song:", error.message);
    ctx.reply("⚠️ Failed to fetch song. Please try again later.");
  }
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).send("OK");
    } catch (e) {
      console.error("Telegram Bot Error:", e);
      res.status(500).send("Error");
    }
  } else {
    res.status(200).send("Telegram bot is running...");
  }
}
