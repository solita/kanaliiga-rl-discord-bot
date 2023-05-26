import { Client, GatewayIntentBits, Events } from 'discord.js';
import { ADMIN_ROLE, TOKEN } from './src/config';
import { getCommands } from './src/commands/commands';
import { ContentController } from './src/ContentController';
import { reportBcApiConnection } from './src/ballchasingAPI';
import { hasRole } from './src/util';
import { botHealth, divisionHelp } from './src/commands/interactions/embeds';
import { handleParentSetCommand } from './src/commands/interactions/rl_setparent';
import { handleCheckCommand } from './src/commands/interactions/rl_check';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const controller = new ContentController();

client.on(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    console.log(await reportBcApiConnection());
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName){

        case 'rl_health':
            const infoEmbed = await botHealth(controller, client);
            await interaction.reply({ embeds: [infoEmbed] });
            break

        case 'rl_divisionhelp':
            const divisionHelpEmbed = await divisionHelp();
            await interaction.reply({ embeds: [divisionHelpEmbed] });   
            break

        case 'rl_setparent':{
            const guild = client.guilds.cache.get(interaction.guild.id);
            guild.members.fetch(interaction.user.id).then(async (member) => {
                if (hasRole(member.roles.cache, ADMIN_ROLE)) {
                    handleParentSetCommand(interaction);
                } else {
                    interaction.reply(
                        `Only admins (${ADMIN_ROLE}) can update this.`
                    )}
            });
            break
        }
        
        case 'rl_check':{
            const guild = client.guilds.cache.get(interaction.guild.id);
            const isRoleEnough = await guild.members
                .fetch(interaction.user.id)
                .then((member) => hasRole(member.roles.cache, ADMIN_ROLE));

            if (!isRoleEnough) {
                interaction.reply(`Only admins (${ADMIN_ROLE}) can run checks.`);
                return;
            }
            interaction.reply('On it!');

            //From ChannelManager, fetch all channels
            const channels = client.channels.cache;

            const jobAddTasks = await handleCheckCommand(channels, controller);

            Promise.all(jobAddTasks).then(() => {
                controller.processQueue();
            });
            break
        }
    }
});

client.on(Events.ThreadCreate, async (thrc) => {
    const messagesInThread = await thrc.messages.fetch();

    if (messagesInThread.some((mes) => mes.attachments.size === 0)) {
        await controller.createNewTask(thrc);
    }
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot || !message.channel.isThread()) {
        //do nothing if the message is from a bot, or is outside a thread
        return;
    }

    if (message.attachments.size > 0) {
        await controller.addToPostQueue(message);
    }

    controller.cleanUpTasks();
    controller.processQueue();
});

client.login(TOKEN);
getCommands();
