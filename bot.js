// ========================================================
// DDDDD   III  SSSSS  CCCCC  OOO   RRRR   DDDD      GGGGG  PPPP   TTTTT
// D   D    I   S      C      O   O  R   R  D   D    G       P   P    T
// D   D    I   SSSSS  C      O   O  RRRR   D   D    G  GG   PPPP     T
// D   D    I      S  C      O   O  R  R   D   D    G   G   P        T
// DDDDD   III  SSSSS  CCCCC  OOO   R   R  DDDD      GGGGG   P        T
// ========================================================
// ========================================================
// IMPORTING NECESSARY MODULES
// ========================================================
const { Client, GatewayIntentBits } = require('discord.js');  // Importing Discord.js to create the bot
const { OpenAI } = require('openai');                          // Importing OpenAI API library for model interaction
require('dotenv').config();                                     // Loading environment variables from .env file

// ========================================================
// CONFIGURING THE DISCORD BOT CLIENT
// ========================================================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,           // Intent for guild-related events
    GatewayIntentBits.GuildMessages,    // Intent for handling messages in guilds
    GatewayIntentBits.MessageContent,   // Intent to access message content (for reading and responding)
  ],
});

// ========================================================
// CONFIGURING OPENAI API CONNECTION
// ========================================================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Loading the API key from the environment
});

// ========================================================
// BOT IS READY EVENT - ONCE THE BOT IS ONLINE
// ========================================================
client.once('ready', () => {
  console.log('Bot is online and ready to interact!');  // Notify in console when the bot is successfully connected
});

// ========================================================
// MESSAGE CREATION EVENT - WHEN A NEW MESSAGE IS SENT
// ========================================================
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;  // Ignore messages from other bots

  // Check if the message starts with the command "!ask"
  if (message.content.startsWith('!ask')) {
    const userQuestion = message.content.slice(5).trim();  // Extract the user question from the message
    if (!userQuestion) return message.reply('Please ask a question after "!ask".');  // If no question is asked

    try {
      // ====================================================
      // INTERACTING WITH OPENAI - GETTING A RESPONSE
      // ====================================================
      const response = await openai.completions.create({
        model: 'text-davinci-003',         // Using the "text-davinci-003" model for text completion
        prompt: userQuestion,              // The user’s question is passed as the prompt
        max_tokens: 100,                   // Setting the maximum number of tokens for the response
      });

      // ====================================================
      // SENDING THE OPENAI RESPONSE BACK TO DISCORD
      // ====================================================
      message.reply(response.choices[0].text);  // Send the response back to the Discord channel
    } catch (error) {
      // ====================================================
      // ERROR HANDLING - IF SOMETHING GOES WRONG WITH OPENAI
      // ====================================================
      console.error('Error details:', error.response ? error.response.data : error.message);  // Log detailed error in the console
      message.reply('An error occurred while connecting to OpenAI.');  // Send a generic error message to the Discord channel
    }
  }
});

// ========================================================
// LOGGING INTO DISCORD WITH THE BOT TOKEN
// ========================================================
client.login(process.env.DISCORD_TOKEN);  // Log in to Discord with the provided bot token from environment variables
