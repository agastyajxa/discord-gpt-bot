const { Client, GatewayIntentBits } = require('discord.js');
const { OpenAI } = require('openai');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!ask')) {
    const userQuestion = message.content.slice(5).trim();

    if (!userQuestion) {
      return message.reply('Please ask a question after "!ask".');
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userQuestion }],
      });

      message.reply(response.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error);
      message.reply('An error occurred while connecting to OpenAI.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);;