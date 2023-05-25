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

    if (interaction.commandName === 'rl_health') {
        const infoEmbed = await botHealth(controller, client);
        await interaction.reply({ embeds: [infoEmbed] });
    } else if (interaction.commandName === 'rl_divisionhelp') {
        const divisionHelpEmbed = await divisionHelp();
        await interaction.reply({ embeds: [divisionHelpEmbed] });
    } else if (interaction.commandName === 'rl_setparent') {
        const guild = client.guilds.cache.get(interaction.guild.id);
        guild.members.fetch(interaction.user.id).then((member) => {
            if (hasRole(member.roles.cache, ADMIN_ROLE)) {
                if (
                    bcParentGroup(
                        interaction.options.get('id').value.toString()
                    )
                ) {
                    interaction.reply(
                        `Parent group set. New parent group is ${bcParentGroup()}`
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
    } else if (interaction.commandName === 'rl_check') {
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

        const promises = [];
        let timercounter = 0;

        for (const chan of channels) {
            //excluding admin channels, voicechannels etc..
            if (chan[1].isThread()) {
                // From MessageManager, fetch all messages in that channel
                const messages = await chan[1].messages.fetch();

                for (const mes of messages) {
                    //If the message from the channel contains attachments
                    if (mes[1].attachments.size > 0) {
                        // From ReactionManager, fetch all reactions in that message
                        const reactionsInThisMessage = mes[1].reactions.cache;

                        /* 
                        From a list of reactions, filter only users
                        that is a bot, by using ReactionUsersManager
                        while preserving Discords Collection type
                        */
                        const botUsersInThoseReactions =
                            reactionsInThisMessage.filter((reaction) =>
                                reaction.users
                                    .fetch()
                                    .then((usr) =>
                                        usr.filter((user) => user.bot === true)
                                    )
                            );

                        if (botUsersInThoseReactions.size == 0) {
                            timercounter += 1;

                            /* 
                            add a new promise to array of promises being waited later, 
                            will resolve itself after postjob has been created 
                            */
                            promises.push(
                                new Promise<void>((r) => {
                                    // to introduce delay for Ballchasings api (for fetching froup ids)
                                    setTimeout(async () => {
                                        await controller.addToPostQueue(mes[1]);
                                        r();
                                    }, 600 * timercounter);
                                })
                            );
                        }
                    }
                }
            }
        }
        /* 
        wait for all postjobs to be created before 
        telling controller to process them all
        */
        Promise.all(promises).then(() => {
            controller.processQueue();
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
