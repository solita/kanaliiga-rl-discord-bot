import { Client, GatewayIntentBits, Events } from 'discord.js';
import { TOKEN } from './src/config';
import { getCommands } from './src/commands';
import { ContentController } from './src/ContentController';
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const controller = new ContentController()

client.on(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
    console.log('Bot has replied with pong!')
  }
});

client.on(Events.ThreadCreate, thrc => {
    console.log(`Thread created with ID ${thrc.id}`)

})

client.on(Events.MessageCreate, async message => {
    //console.log('Message received with content ' + message.content + 'with ID ' + message.id)
    //console.log(message)
    //if (Object.keys(message.attachments).length === 0){
     //   console.log("no attathcments")
     //   return
    //}
    if (message.author.bot || !message.channel.isThread()) {
        //do nothing if the message is from a bot, or is outside a thread
        return
    }
    const task = await controller.createNewTask(message.channelId, 'TestGroupName')
    const channel = message.channel
    controller.processQueue();
    task && channel.send(task)
})


client.login(TOKEN);
getCommands();