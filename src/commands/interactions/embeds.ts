import { Client, EmbedBuilder } from 'discord.js';
import { APPLICATION_VERSION, CAPTAIN_ROLE, bcParentGroup } from '../../config';
import { fetchGroups, pingBCApi } from '../../ballchasingAPI';
import { ContentController } from '../../ContentController';

export const divisionHelp = async () => {
    const embedContainer = new EmbedBuilder()
        .setColor('#22c9c9')
        .setTitle(`${bcParentGroup()}`)
        .setURL(`https://ballchasing.com/group/${bcParentGroup()}`)
        .setDescription(
            'These are the available divisions to upload replays to. They are case sensitive.'
        );

    return fetchGroups(bcParentGroup())
        .then((data) => {
            if (data.length > 0) {
                embedContainer.addFields({ name: '\n', value: ' ' });
                data.forEach((group) => {
                    embedContainer.addFields({
                        name: ' ',
                        value: `${group.name}`
                    });
                });
            } else {
                embedContainer.addFields({
                    name: '\n',
                    value: `No subgroups found for ${bcParentGroup()}`
                });
            }
            return embedContainer;
        })
        .catch((err) => {
            embedContainer.setDescription(
                `An error occured while trying to find subgroups. ${err.status} - ${err.statusText}`
            );
            return embedContainer;
        });
};

export const botHealth = async (
    controller: ContentController,
    client: Client
): Promise<EmbedBuilder> => {
    const story: string[] = [];
    const ballchasinStatus = await pingBCApi();
    const isBotHealthy = ballchasinStatus.status === 200;

    story.push(`Bot is ${isBotHealthy ? 'healthy 🫶' : 'not healthy 😮‍💨'} `);

    if (!isBotHealthy) {
        story.push(
            `Connection to ballchasing seems to have a problem: \n` +
                `${ballchasinStatus.url} - ${ballchasinStatus.status} - ${ballchasinStatus.statusText}`
        );
    } else {
        story.push(
            `Connection to Ballchasing.com is Ok! - ${ballchasinStatus.status}`
        );
    }
    story.push(`Captain role: ${CAPTAIN_ROLE}`);

    const embedContainer = new EmbedBuilder()
        .setColor(isBotHealthy ? '#53b33b' : '#d12020')
        .setTitle(`Kanaliiga RL Discord Bot ${APPLICATION_VERSION}`)
        .setURL('https://github.com/solita/kanaliiga-rl-discord-bot')
        .setDescription(story.join('\n'))
        .addFields(
            {
                name: 'Health',
                value: `${isBotHealthy ? 'OK' : 'Not OK'}`,
                inline: true
            },
            {
                name: 'In Memory',
                value: `${controller.tasks.length}`,
                inline: true
            },
            { name: '\n', value: ' ' },
            {
                name: 'Ballchasing',
                value: `${ballchasinStatus.status}`,
                inline: true
            },
            {
                name: 'Uptime',
                value: `${(client.uptime / 1000 / 86400).toFixed(2)} days`,
                inline: true
            }
        );

    return embedContainer;
};
