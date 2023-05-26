import { ApplicationCommandOptionType, Client, REST, Routes } from 'discord.js';
import { CLIENT_ID, TOKEN } from '../config';

const rest = new REST({ version: '10' }).setToken(TOKEN);

const commands = [
    {
        name: 'rl_health',
        description: 'Replies with bot health and status'
    },
    {
        name: 'rl_divisionhelp',
        description: 'Replies with available subgroups in ballchasing.com'
    },
    {
        name: 'rl_setparent',
        description: 'Set a new parent groupId',
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: 'id',
                description:
                    'string without spaces. Can be found from ballchasing.com/group/xxxxxxxxx',
                required: true
            }
        ]
    },
    {
        name: 'rl_check',
        description:
            'Checks old posts and makes sure there are no missing posts while a bot was offline'
    }
];

export const getCommands = async () => {
    try {
        await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: commands
        });
    } catch (error) {
        console.error(error);
    }
};
