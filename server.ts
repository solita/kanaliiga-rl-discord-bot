import { Client, GatewayIntentBits, Events } from 'discord.js';
import { TOKEN } from './src/config';
import { getCommands } from './src/commands';
import { ContentController } from './src/ContentController';
import { reportBcApiConnection } from './src/ballchasingAPI';


const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const controller = new ContentController()

client.on(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  console.log(await reportBcApiConnection())
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
    console.log('Bot has replied with pong!')
  }
});



client.on(Events.ThreadCreate, async thrc => {

  const newTask = await controller.createNewTask(thrc)
  newTask && thrc.send(`New task created id: ${newTask.thread.id}`)
})

client.on(Events.MessageCreate, async message => {

  if (message.author.bot || !message.channel.isThread()) {
    //do nothing if the message is from a bot, or is outside a thread
    return
  }

  if (message.attachments.size > 0) {
    await controller.addToPostQueue(message)
  }

  controller.processQueue();

})


client.login(TOKEN);
getCommands();

