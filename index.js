const { Client, Intents } = require('discord.js-selfbot-v13');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const tokens = [
  "ODgyOTk0NTg4MTI4NzcyMTM2.GOEx-m._eIYAJQHR0U3zUq7ZBNxl75Tn2sepqwtHt1gho",
];

const targetUsers = [
  "1281223777253986412"
];
const targetChannels = [
  "1282028190637756550"
];

const delayBetweenReplies = () => Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
const typingDelayForLongMessages = 2000;
const typingDelayForSpecialWords = () => Math.floor(Math.random() * (5000 - 2600 + 1)) + 2600;

const randomReplies = [
  'مرحبا',

];

const longMessageReplies = [
  'لوحها و خشيها بكس كسمك',
];

const specialWordTriggers = {
  ".": ['نقطة بكسمك', 'كسمك يبن الشاكة بحشي النقطة بكصمك'],
  
  "نقطة": ['نقطة بكسمك', 'كسمك يبن الشاكة بحشي النقطة بكصمك']
};

const spamTriggerCount = 3;
const spamCooldownReply = 'يبن السبامرجية شتسوي';

let userSpamCount = {};

const clients = tokens.map(token => {
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
  });

  client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
  });

  client.on('messageCreate', async (message) => {
    if (!targetUsers.includes(message.author.id) || !targetChannels.includes(message.channel.id)) return;

    if (!userSpamCount[message.author.id]) userSpamCount[message.author.id] = 0;
    const messageContent = message.content.toLowerCase();

    const specialWord = Object.keys(specialWordTriggers).find(word => messageContent.includes(word));
    if (specialWord) {
      userSpamCount[message.author.id]++;

      if (userSpamCount[message.author.id] >= spamTriggerCount) {
        await new Promise(resolve => setTimeout(resolve, typingDelayForSpecialWords()));
        await message.reply(spamCooldownReply);
        userSpamCount[message.author.id] = 0;
      } else {
        await new Promise(resolve => setTimeout(resolve, typingDelayForSpecialWords()));
        const reply = specialWordTriggers[specialWord][Math.floor(Math.random() * specialWordTriggers[specialWord].length)];
        await message.reply(reply);
      }
      return;
    }

    userSpamCount[message.author.id] = 0;

    if (message.content.length > 20) {
      await new Promise(resolve => setTimeout(resolve, typingDelayForLongMessages));
      const reply = longMessageReplies[Math.floor(Math.random() * longMessageReplies.length)];
      await message.reply(reply);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, delayBetweenReplies()));
      const randomReply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
      const replyMessage = await message.reply(randomReply);
      console.log(`Replied to message: ${replyMessage.content}`);
    } catch (error) {
      console.error(`Error replying to message: ${error}`);

      if (error.code === 429) {
        console.log('Rate limited! Waiting before retrying...');
        await new Promise(resolve => setTimeout(resolve, 1000)); 
      }
    }
  });

  client.on('error', (error) => {
    console.error('Client encountered an error:', error);
  });

  client.login(token);
  return client;
});

app.get('/', (req, res) => {
  res.send(`
    <body>
      <center><h1>كسمك يا علاوي</h1></center>
    </body>
  `);
});

app.get('/webview', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <html>
      <head>
        <title>كسمك يا لحن</title>
      </head>
      <body style="margin: 0; padding: 0;">
        <iframe width="100%" height="100%" src="https://axocoder.vercel.app/" frameborder="0" allowfullscreen></iframe>
      </body>
    </html>
  `);
});

server.listen(8080, () => {
  console.log("I'm ready to nik ksm 3lawi..!");
  console.log("I'm ready to nik ksm l7n..!");
});
