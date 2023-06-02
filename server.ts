import {
    Client,
    GatewayIntentBits,
    Events,
    ActivityType,
    Collection,
    Channel
} from 'discord.js';
import { ADMIN_ROLE, BOT_ACTIVITY, BOT_NAME, TOKEN } from './src/config';
import { getCommands } from './src/commands/commands';
import { ContentController } from './src/ContentController';
import { reportBcApiConnection } from './src/ballchasingAPI';
import {
    hasRole,
    isInCorrectForum,
    pruneThreadFromGroupNameWarning
} from './src/util';
import { botHealth, divisionHelp } from './src/commands/interactions/embeds';
import { handleParentSetCommand } from './src/commands/interactions/rl_setparent';
import { processThreadsNotDoneYet } from './src/commands/interactions/rl_check';

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

    client.user.setPresence({
        activities: [{ name: BOT_ACTIVITY, type: ActivityType.Watching }]
    });

    client.user.setUsername(BOT_NAME);

    if (!client.user.avatar) {
        try {
            client.user.setAvatar('./src/media/pfp.webp');
        } catch (err) {
            console.error(`Unable to set avatar! ${err}`);
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName) {
        case 'rl_health': {
            const infoEmbed = await botHealth(controller, client);
            await interaction.reply({ embeds: [infoEmbed], ephemeral: true });
            break;
        }
        case 'rl_divisionhelp': {
            const divisionHelpEmbed = await divisionHelp();
            await interaction.reply({
                embeds: [divisionHelpEmbed],
                ephemeral: true
            });
            break;
        }
        case 'rl_setparent': {
            const guild = client.guilds.cache.get(interaction.guild.id);
            guild.members.fetch(interaction.user.id).then(async (member) => {
                if (hasRole(member.roles.cache, ADMIN_ROLE)) {
                    handleParentSetCommand(interaction);
                } else {
                    interaction.reply({
                        content: `Only admins (${ADMIN_ROLE}) can update this.`,
                        ephemeral: true
                    });
                }
            });
            break;
        }
        case 'rl_check': {
            const guild = client.guilds.cache.get(interaction.guild.id);
            const isRoleEnough = await guild.members
                .fetch(interaction.user.id)
                .then((member) => hasRole(member.roles.cache, ADMIN_ROLE));

            if (!isRoleEnough) {
                interaction.reply({
                    content: `Only admins (${ADMIN_ROLE}) can run checks.`,
                    ephemeral: true
                });
                return;
            }
            interaction.reply({
                content: 'On it!',
                ephemeral: true
            });

            //From ChannelManager, get the channels
            const channels = client.channels.cache;

            const tasks = await processThreadsNotDoneYet(channels, controller);

            Promise.all(tasks).then(() => {
                controller.processQueue();
            });
            break;
        }
    }
});

client.on(Events.ThreadCreate, async (thrc) => {
    const messagesInThread = await thrc.messages.fetch();
    if (messagesInThread.some((mes) => mes.attachments.size === 0)) {
        await controller.createNewTask(thrc);
    }
});

client.on(Events.ThreadUpdate, async (updt) => {
    const updatedThread = await client.channels.fetch(updt.id);

    if (
        (updt.isThread() && updt.archived) ||
        (updatedThread.isThread() && updatedThread.archived)
    )
        return;

    if (!(await isInCorrectForum(client, updatedThread))) return;

    const tasks = await processThreadsNotDoneYet(
        new Collection<string, Channel>([[updatedThread.id, updatedThread]]),
        controller
    );

    Promise.all(tasks).then(() => {
        controller.processQueue();
        pruneThreadFromGroupNameWarning(updatedThread);
    });
});

client.on(Events.MessageCreate, async (message) => {
    if (
        message.author.bot ||
        !(await isInCorrectForum(client, message.channel))
    )
        return;

    if (message.attachments.size > 0) {
        await controller.addToPostQueue(message);
    }

    controller.cleanUpTasks();
    controller.processQueue();
});

client.on(Events.ShardError, (err) => {
    console.error(`Error with Discord: ${err}`);
});

client.on(Events.ShardDisconnect, (event) => {
    console.warn(`Disconnected from Discord: ${event}`);
});

client.on(Events.ShardReconnecting, () => {
    console.log('Reconnecting to Discord....');
});

client.on(Events.ShardResume, () => {
    console.log('Reconnected to Discord');
});

client.login(TOKEN);
getCommands();
