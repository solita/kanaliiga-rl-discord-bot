import { Attachment, Channel, Collection, Role, TextChannel, ThreadChannel } from 'discord.js';

const reFileExtension = /(?:\.([^.]+))?$/;
export const ACCEPTABLE_FILE_EXTENSION = '.replay';

export const parseFileExtension = (fileName: string) => {
    return `.${reFileExtension.exec(fileName)[1]}`;
};

export const allAttahcmentsAreCorrectType = (
    attachments: Collection<string, Attachment>
): boolean => {
    for (const value of attachments) {
        if (parseFileExtension(value[1].url) !== ACCEPTABLE_FILE_EXTENSION) {
            return false;
        }
    }

    return true;
};

export const getDivisionName = (postTitle: string) => {
    const splitString = postTitle.split(',');
    //splits into array to get division name, for example: [ 'Solita Ninja vs Solita Herkku', 'Challengers', '1.5.2023' ]

    const postTitleDivisionName = splitString[1];

    if (postTitleDivisionName) return postTitleDivisionName.trim();

    return postTitleDivisionName;
};

export const hasRole = (
    roles: Collection<string, Role>,
    roleToCompare: string
) => {
    return roles.some((role) => role.name === roleToCompare);
};

export const checkDateObject = (date: Date, milliseconds?: number) => {
    const currentTime = new Date();
    const targetDate = new Date(
        currentTime.getTime() - milliseconds || 259200000
    );
    //default 3 days
    return date < targetDate;
};

export const previousMessageIsBot = async (channel: ThreadChannel): Promise<boolean> => {
    if (channel.partial) {
        await channel.fetch(true)
    }
    const messages = await channel.messages.fetch({ limit: 10, cache: true });
    messages.map((msg) => console.log(msg.content))
    const prevMessage = messages.first()
    //console.log(prevMessage.content, prevMessage.author.bot)
    return prevMessage.author.bot
}
