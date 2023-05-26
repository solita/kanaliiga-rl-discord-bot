import { ChatInputCommandInteraction } from 'discord.js';
import { bcParentGroup } from '../../config';
import { fetchGroups } from '../../ballchasingAPI';
import log from '../../log';

export const handleParentSetCommand = async (
    interaction: ChatInputCommandInteraction
) => {
    if (!bcParentGroup(interaction.options.get('id').value.toString())) {
        interaction.reply('Something went wrong.');
        return;
    }

    interaction.reply(
        `Parent group set. New parent group is \`${bcParentGroup()}\`.`
    );
    try {
        const list = await fetchGroups();
        if (list.length < 1) {
            interaction.channel.send(
                '⚠️**Warning:** Parent group might not exist or is empty.'
            );
        }
    } catch (err) {
        log.error(err);
    }
    return;
};
