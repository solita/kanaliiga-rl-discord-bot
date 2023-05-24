import { Client, GatewayIntentBits, Events } from 'discord.js';
import { ADMIN_ROLE, bcParentGroup, TOKEN } from './src/config';
import { getCommands, botHealth, divisionHelp } from './src/commands';
import { ContentController } from './src/ContentController';
import { reportBcApiConnection } from './src/ballchasingAPI';
import { hasRole } from './src/util';

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

    if (interaction.commandName === 'health') {
        const infoEmbed = await botHealth(controller, client);
        await interaction.reply({ embeds: [infoEmbed] });
    } else if (interaction.commandName === 'divisionhelp') {
        const divisionHelpEmbed = await divisionHelp();
        await interaction.reply({ embeds: [divisionHelpEmbed] });
    } else if (interaction.commandName === 'setparent') {
        const guild = client.guilds.cache.get(interaction.guild.id);
        guild.members.fetch(interaction.user.id).then(async (member) => {
            if (hasRole(member.roles.cache, ADMIN_ROLE)) {
                console.log('checking.....');
                if (
                    bcParentGroup(
                        interaction.options.get('id').value.toString(),
                        interaction.channel
                    )
                ) {
                    interaction.reply(
                        `Parent group set. New parent group is \`${await bcParentGroup()}\`.`
                    );
                    return;
                } else {
                    interaction.reply('Something went wrong.');
                }
            } else {
                interaction.reply(
                    `Only admins (${ADMIN_ROLE}) can update this.`
                );
            }
        });
    }
});

client.on(Events.ThreadCreate, async (thrc) => {
    await controller.createNewTask(thrc);
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
