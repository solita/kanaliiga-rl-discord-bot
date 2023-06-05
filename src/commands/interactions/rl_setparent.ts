import { ChatInputCommandInteraction } from 'discord.js';
import { bcParentGroup } from '../../config';
import { fetchGroups } from '../../ballchasingAPI';
import log from '../../log';

export const handleParentSetCommand = async (
    interaction: ChatInputCommandInteraction
) => {
    let parentGroupMaybeEmpty = false;
    if (!bcParentGroup(interaction.options.get('id').value.toString())) {
        interaction.reply({
            content: 'Something went wrong.',
            ephemeral: true
        });
        return;
    }
    try {
        const list = await fetchGroups(bcParentGroup());
        if (list.length < 1) {
            parentGroupMaybeEmpty = true;
        }
    } catch (err) {
        log.error(err);
    }
    interaction.reply({
        content: `Parent group set. New parent group is \`${bcParentGroup()}\`.${
            parentGroupMaybeEmpty
                ? '\n⚠️ **Warning**: Parent group might not exist or is empty.'
                : ''
        }`,
        ephemeral: true
    });
    return;
};
