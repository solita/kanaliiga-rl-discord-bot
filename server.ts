import { Client, GatewayIntentBits } from 'discord.js';
import { TOKEN } from './src/config';
import { getCommands } from './src/commands';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
    console.log('Bot has replied with pong!')
  }
});

client.on("message", async message => {
    if (message.author.bot) return;

  // Ignore messages not sent in a text channel
    if (message.channel.type !== 'text') return;

  // Log the message content and author to the console
    console.log(`[${message.guild.name}][${message.channel.name}] ${message.author.tag}: ${message.content}`);
})

/*client.on('threadCreate', async () => {
    console.log('Thread has been created')
})*/


client.login(TOKEN);
getCommands();