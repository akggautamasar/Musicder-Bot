module.exports = {
  bot_api_key: "YOUR_BOT_API_KEY_HERE",  // Replace with your Telegram bot token

  // Jiosaavn API endpoint (replace if you self-host)
  jiosaavn_api_url: "https://jiosaavn-api.vercel.app/",

  // Musicder API endpoint (replace if you self-host)
  musicder_url: "https://musicder-prod.vercel.app/",

  start_message: `<b>Hey, 👋👋</b>\n\n<em>Welcome to <b>Akgsmusic Bot</b>.\n\nJust send the Song's Name or, Jiosaavn Song's Link & You will get Best Matched Result(s) with their Download Link(s).\n\nBrought to you by @tprojects</em>`,

  about_message: `Created by <a href='https://tu.in.life'>Air</a>.`,

  help_message: `Send a Song name or Jiosaavn song link to get download links.\n\nCommands:\n/start - Welcome message\n/help - Help info\n/about - About the bot`
};
