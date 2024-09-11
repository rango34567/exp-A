const { Client, Intents } = require('discord.js-selfbot-v13');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

const tokens = ["توكتك"];
const targetUsers = ["ايدي الشخص"];
const targetChannels = ["الروم"];
const messageId = "الرسالة";

const delayBetweenReplies = () => Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
const typingDelayForLongMessages = 2000;
const typingDelayForSpecialWords = () => Math.floor(Math.random() * (5000 - 2600 + 1)) + 2600;

const randomReplies = ['شقمك'];
const longMessageReplies = ['لوحها و خشيها بكس كسمك'];
const specialWordTriggers = {
  ".": ['نقطة بكسمك', 'كسمك يبن الشاكة بحشي النقطة بكصمك'],
  "نقطة": ['نقطة بكسمك', 'كسمك يبن الشاكة بحشي النقطة بكصمك']
};
const spamResponses = {
  cooldownReply: 'يبن السبامرجية شتسوي',
  replies: ['نيجمك توقف', 'قفز امك للسبام', 'جن جنون امك لو شنو']
};
const spamTriggerCount = 3;
let spamCooldown = 5; 
let messageHistory = {};
let processedMessages = new Set();
let lastSpamReply = null;

const clients = tokens.map(token => {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

  client.once('ready', async () => {
    const channel = await client.channels.fetch(targetChannels[0]);
    const messages = await channel.messages.fetch({ limit: 100 });

    let startProcessing = false;
    
    const userMessages = messages.filter(msg => 
      msg.author.id !== client.user.id && 
      targetUsers.includes(msg.author.id) &&
      targetChannels.includes(msg.channel.id)
    );

    userMessages.forEach(message => {
      if (message.id === messageId) {
        startProcessing = true;
      }
      if (startProcessing) {
        processedMessages.add(message.id);
      }
    });

    setInterval(async () => {
      for (let message of userMessages.values()) {
        if (!processedMessages.has(message.id)) continue;
        processedMessages.add(message.id);

        try {
          const randomReply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
          await client.channels.cache.get(targetChannels[0]).sendTyping(); 
          await new Promise(resolve => setTimeout(resolve, delayBetweenReplies()));
          await message.reply(randomReply);
        } catch (error) {
          if (error.code === 429) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
    }, 3000);
  });

  client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id) return;
    if (!targetUsers.includes(message.author.id) || !targetChannels.includes(message.channel.id)) return;

    if (processedMessages.has(message.id)) return;
    processedMessages.add(message.id);

    const messageContent = message.content.trim().toLowerCase();

    if (!messageHistory[messageContent]) messageHistory[messageContent] = 0;
    messageHistory[messageContent]++;

    if (messageHistory[messageContent] >= spamTriggerCount) {
      if (lastSpamReply === spamResponses.replies[Math.floor(Math.random() * spamResponses.replies.length)]) {
        spamTriggerCount = 6; 
      }
      lastSpamReply = spamResponses.replies[Math.floor(Math.random() * spamResponses.replies.length)];
      await client.channels.cache.get(targetChannels[0]).sendTyping(); 
      await new Promise(resolve => setTimeout(resolve, typingDelayForLongMessages)); 
      await message.reply(lastSpamReply);
      messageHistory[messageContent] = 0;
      return;
    }

    const specialWord = Object.keys(specialWordTriggers).find(word => messageContent === word);
    if (specialWord) {
      await client.channels.cache.get(targetChannels[0]).sendTyping(); 
      await new Promise(resolve => setTimeout(resolve, typingDelayForSpecialWords())); 
      const reply = specialWordTriggers[specialWord][Math.floor(Math.random() * specialWordTriggers[specialWord].length)];
      await message.reply(reply);
      return;
    }

    if (messageContent.length >= 100) { 
      await client.channels.cache.get(targetChannels[0]).sendTyping(); 
      await new Promise(resolve => setTimeout(resolve, typingDelayForLongMessages));  
      const reply = longMessageReplies[Math.floor(Math.random() * longMessageReplies.length)];
      await message.reply(reply);
      return;
    }

    try {
      await client.channels.cache.get(targetChannels[0]).sendTyping(); 
      await new Promise(resolve => setTimeout(resolve, delayBetweenReplies()));  
      const randomReply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
      await message.reply(randomReply);
    } catch (error) {
      if (error.code === 429) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  });

  client.on('error', (error) => {});

  client.login(token);
  return client;
});

const port = process.env.PORT || 3000;
server.listen(port, () => {});

app.get('/', (req, res) => {
  res.send(`<body><center><h1>Bot is running</h1></center></body>`);
});
