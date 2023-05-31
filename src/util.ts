import {
    Attachment,
    Channel,
    Client,
    Collection,
    ForumChannel,
    Message,
    Role
} from 'discord.js';
import { TARGET_CHANNEL_NAME } from './config';

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

export const isInCorrectForum = async (
    client: Client,
    channel: Channel
): Promise<boolean> => {
    if (!channel.isThread()) return false;

    const parent = await client.channels.fetch(channel.parentId);
    if ((parent as ForumChannel).name === TARGET_CHANNEL_NAME) return true;

    return false;
};

export const getAttachmentCount = (
    threadMessages: Collection<string, Message>
): number => {
    return threadMessages.reduce((acc: number, msg: Message) => {
        return acc + msg.attachments.size;
    }, 0);
};

export const pruneThreadFromGroupNameWarning = async (channel: Channel) => {
    if (!channel.isThread()) return;

    const messages = await channel.messages.fetch();

    for (const mes of messages) {
        if (mes[1].content.includes('post did not make too much sense')) {
            await mes[1].delete();
        }
    }
};
