const { Client, Intents } = require('discord.js-selfbot-v13');

const tokens = ["توكنك"];
const targetUsers = ["الشخص"];
const targetChannels = ["الروم"];
const MessageId = "ايدي الرسالة";
const randomReplies = ['كسمك'];
const specialWords = ["نقطة"];
const specialReplies = ["احشيلك النقطة بنص كسمك عطوا"];
const getRandomDelay = () => Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000;

const clients = tokens.map(token => {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

  client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    for (const channelId of targetChannels) {
      const channel = await client.channels.fetch(channelId);
      let lastMessageId = MessageId;
      while (lastMessageId) {
        const messages = await channel.messages.fetch({ limit: 100, before: lastMessageId });
        const messageArray = Array.from(messages.values()).reverse();
        for (const message of messageArray) {
          if (targetUsers.includes(message.author.id)) {
            try {
              await new Promise(resolve => setTimeout(resolve, getRandomDelay()));
              let replyMessageContent = randomReplies[Math.floor(Math.random() * randomReplies.length)];
              for (const word of specialWords) {
                if (message.content.includes(word)) {
                  const specialIndex = specialWords.indexOf(word);
                  replyMessageContent = specialReplies[specialIndex];
                  break;
                }
              }
              const replyMessage = await message.reply(replyMessageContent);
              console.log(`Replied to message: ${replyMessage.content}`);
            } catch (error) {
              console.error(`Error replying to message: ${error}`);
              if (error.code === 429) {
                console.log('Rate limited! Waiting before retrying...');
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          }
        }
        lastMessageId = messageArray.length > 0 ? messageArray[0].id : null;
      }
    }

    client.on('messageCreate', async (message) => {
      if (!targetUsers.includes(message.author.id) || !targetChannels.includes(message.channel.id)) return;
      try {
        await new Promise(resolve => setTimeout(resolve, getRandomDelay()));
        let replyMessageContent = randomReplies[Math.floor(Math.random() * randomReplies.length)];
        for (const word of specialWords) {
          if (message.content.includes(word)) {
            const specialIndex = specialWords.indexOf(word);
            replyMessageContent = specialReplies[specialIndex];
            break;
          }
        }
        const replyMessage = await message.reply(replyMessageContent);
        console.log(`Replied to message: ${replyMessage.content}`);
      } catch (error) {
        console.error(`Error replying to message: ${error}`);
        if (error.code === 429) {
          console.log('Rate limited! Waiting before retrying...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    });
  });

  client.on('error', (error) => {
    console.error('Client encountered an error:', error);
  });

  client.login(token);
  return client;
});

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
