const { Telegraf } = require('telegraf');
const axios = require('axios');
const config = require('./config');

const bot = new Telegraf(config.bot_api_key);

// /start command
bot.start((ctx) => {
  ctx.replyWithHTML(config.start_message);
});

// /help command
bot.help((ctx) => {
  ctx.replyWithHTML(config.help_message);
});

// /about command
bot.command('about', (ctx) => {
  ctx.replyWithHTML(config.about_message);
});

// Helper function to check if text is a Jiosaavn URL
function isJiosaavnUrl(text) {
  return text.includes('jiosaavn.com');
}

// Search song using Jiosaavn API
async function searchJiosaavn(query) {
  try {
    const response = await axios.get(`${config.jiosaavn_api_url}search`, {
      params: { query }
    });
    return response.data;
  } catch (error) {
    console.error('Error in Jiosaavn search:', error.message);
    return null;
  }
}

// Get song details using Musicder API (for direct download)
async function getMusicderDownload(song_id) {
  try {
    const response = await axios.get(`${config.musicder_url}download`, {
      params: { id: song_id }
    });
    return response.data;
  } catch (error) {
    console.error('Error in Musicder download:', error.message);
    return null;
  }
}

// On text message - search songs or fetch by URL
bot.on('text', async (ctx) => {
  const query = ctx.message.text.trim();

  try {
    // If user sends a Jiosaavn link, try to get the song id from it
    if (isJiosaavnUrl(query)) {
      // Extract song ID or share link (depends on Jiosaavn URL format)
      // For simplicity, call search API with the full URL or title
      const searchResult = await searchJiosaavn(query);

      if (!searchResult || !searchResult.results || searchResult.results.length === 0) {
        return ctx.reply("Sorry, no results found for your link.");
      }

      // Pick the first result
      const song = searchResult.results[0];

      // Now get download link via Musicder using song ID
      const downloadData = await getMusicderDownload(song.id);

      if (downloadData && downloadData.status === "success") {
        const songDetails = downloadData.data;

        let replyMsg = `<b>${songDetails.song}</b> by <i>${songDetails.singers}</i>\n\n🎵 <b>Download Links:</b>\n`;
        for (const [quality, url] of Object.entries(songDetails.download)) {
          replyMsg += `<a href="${url}">${quality}</a>\n`;
        }

        ctx.replyWithHTML(replyMsg, { disable_web_page_preview: true });
      } else {
        ctx.reply("Sorry, unable to fetch download links.");
      }

    } else {
      // User sent a song name: search Jiosaavn API
      const searchResult = await searchJiosaavn(query);

      if (!searchResult || !searchResult.results || searchResult.results.length === 0) {
        return ctx.reply("Sorry, no songs found matching your query.");
      }

      // Send top 3 matches as reply with buttons or just text with download links
      const topResults = searchResult.results.slice(0, 3);

      let replyMsg = `<b>Top results for:</b> <i>${query}</i>\n\n`;

      for (const song of topResults) {
        replyMsg += `🎵 <b>${song.title}</b> by <i>${song.primary_artists}</i>\n`;
        replyMsg += `🔗 JioSaavn Link: ${song.perma_url}\n\n`;
      }

      replyMsg += `\nSend the exact JioSaavn link to get download links!`;

      ctx.replyWithHTML(replyMsg);
    }

  } catch (error) {
    console.error('Error handling message:', error);
    ctx.reply("Oops! Something went wrong. Please try again later.");
  }
});

// Start bot
bot.launch().then(() => {
  console.log('Bot is up and running');
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
