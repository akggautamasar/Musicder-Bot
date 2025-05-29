module.exports = {
  bot_api_key: process.env.BOT_API_KEY,  // Load from environment variable

  jiosaavn_api_url: "https://jiosaavn-api.vercel.app/",
  musicder_url: "https://musicder-prod.vercel.app/",

  start_message: `<b>Hey, 👋👋</b>\n\n<em>Welcome to <b>Akgsmusic Bot</b>.\n\nJust send the Song's Name or JioSaavn Link & get best matched results with download links.\n\nBrought to you by @tprojects</em>`,

  about_message: `Created by <a href='https://tu.in.life'>Air</a>.`,

  help_message: `Send me a song name or JioSaavn link and I will provide download links for the best matching songs.`,
};
