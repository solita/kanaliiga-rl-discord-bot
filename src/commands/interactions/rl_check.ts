import { Channel, Collection } from 'discord.js';
import { ContentController } from '../../ContentController';

export const handleCheckCommand = async (
    channels: Collection<string, Channel>,
    controller: ContentController
) => {
    const promises = [];
    let timercounter = 0;

    for (const chan of channels) {
        //excluding admin channels, voicechannels etc..
        if (!chan[1].isThread()) continue;
        // From MessageManager, fetch all messages in that channel
        const messages = await chan[1].messages.fetch();

        for (const mes of messages) {
            //If the message from the channel contains attachments
            if (mes[1].attachments.size === 0) continue;
            // From ReactionManager, fetch all reactions in that message
            const reactionsInThisMessage = mes[1].reactions.cache;

            /* 
            From a list of reactions, filter only users
            that is a bot, by using ReactionUsersManager
            while preserving Discords Collection type
            */
            const botUsersInThoseReactions = reactionsInThisMessage.filter(
                (reaction) =>
                    reaction.users
                        .fetch()
                        .then((usr) => usr.filter((user) => user.bot === true))
            );

            if (botUsersInThoseReactions.size > 0) continue;

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

    return promises;
};
