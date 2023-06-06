import { ThreadChannel, Message } from 'discord.js';
import { DocumentProcessor } from './DocumentProcessor';
import log from './log';
import { getAttachmentCount, getDivisionName } from './util';
import { FILE_LIMIT } from './config';
import {
    TBallchasingGroup,
    createNewSubgroup,
    fetchGroups,
    searchGroupId
} from './ballchasingAPI';

export default class PostJob {
    groupId: string; // Ballchasing groupID
    thread: ThreadChannel;
    queue: Message[]; // array of Messages's
    processor: DocumentProcessor;
    createdAt: number;
    closeReminderSent: boolean;
    subGroup: TBallchasingGroup | undefined;

    constructor(thread: ThreadChannel, groupId: string) {
        this.groupId = groupId;
        this.thread = thread;
        this.queue = [];
        this.processor = new DocumentProcessor();
        this.createdAt = Date.now();
        this.closeReminderSent = false;
        this.subGroup;
    }

    getSubGroup() {
        return this.subGroup;
    }

    setSubGroup(subGroup: TBallchasingGroup) {
        this.subGroup = subGroup;
    }

    async addToQueue(newMessage: Message) {
        if (this.queue.find((mes) => mes.id === newMessage.id)) {
            log.error('Message exists in queue already: ' + newMessage.id);
            return;
        }
        const messages = await this.thread.messages.fetch();
        if (getAttachmentCount(messages) > FILE_LIMIT) {
            this.thread.send(
                `Your intended number of attachments exceeds the limit (${FILE_LIMIT}) of this post`
            );
            return;
        }

        log.info(`A new message was added to task ${this.thread.id}`);
        this.queue.push(newMessage);
        return;
    }

    removeFromQueue(): Message | undefined {
        return this.queue.shift();
    }

    clearQueue() {
        this.queue = [];
    }

    size(): number {
        return this.queue.length;
    }

    async sendLinkAndReminder() {
        if (!this.closeReminderSent) {
            const messages = await this.thread.messages
                .fetch()
                .then((msgs) => msgs.filter((msg) => msg.attachments.size > 0));

            const firsMessageWithFiles = messages.last();
            const botReactionsInThat =
                firsMessageWithFiles.reactions.cache.filter((rct) =>
                    rct.users
                        .fetch()
                        .then((usr) =>
                            usr.filter((reaction) => reaction.bot === true)
                        )
                );
            if (botReactionsInThat.size > 0 && messages.size === 1) {
                this.thread.send(
                    `🔗 Here's where your replays are going: ${this.subGroup.link.replace(
                        '/api/groups',
                        '/group'
                    )}`
                );
                //Timeouts are for UX reasons
                setTimeout(async () => {
                    await this.thread.sendTyping();
                    setTimeout(() => {
                        this.thread.send(
                            'Remember to close the post once youre ready! ❤️'
                        );
                    }, 2500);
                }, 2500);
            }
            this.closeReminderSent = true;
        }
        return;
    }

    async process() {
        if (!this.subGroup) {
            const subGroupNameWithoutDivision = this.thread.name.replace(
                `, ${getDivisionName(this.thread.name)},`,
                ' '
            );
            //removes division name from subgroup to avoid repeating itself
            try {
                this.setSubGroup(
                    await createNewSubgroup(
                        this.groupId,
                        subGroupNameWithoutDivision
                    )
                );
                console.log('New created group', this.subGroup);
            } catch (error) {
                if (error.status && error.status === 400) {
                    try {
                        const existingGroups = await fetchGroups(this.groupId);
                        const targetGroup = searchGroupId(
                            subGroupNameWithoutDivision,
                            existingGroups
                        )[0];
                        console.log('New existing group: ', targetGroup);
                        this.setSubGroup(targetGroup);
                    } catch (err) {
                        console.error(err);
                        this.thread.send(
                            'Something went wrong. 🙁 I could not process your request. Please try again in another thread.'
                        );
                        return;
                    }
                } else {
                    this.thread.send(
                        'Something went wrong. 🙁 I could not process your request. Please try again in another thread.'
                    );
                    return;
                }
            }
        }
        while (this.size() > 0) {
            const message = this.removeFromQueue();
            const arrayOfMultifileEmojies = [
                '1️⃣',
                '2️⃣',
                '3️⃣',
                '4️⃣',
                '5️⃣',
                '6️⃣',
                '7️⃣'
            ];

            message.attachments.forEach(async (attachment) => {
                const file = await this.processor
                    .download(attachment.url)
                    .catch(async (err) => {
                        await message.channel.sendTyping();
                        console.log(err);
                        message.channel.send(
                            `Error downloading a file. \n${attachment.name} \n${
                                err.status ? err.status : err
                            } ` + `${err.statusText ? err.statusText : ''}`
                        );
                        return;
                    });

                if (!file) return;

                const fileName = attachment.name;

                try {
                    const response = await this.processor.upload(
                        file,
                        fileName,
                        this.subGroup.id
                    );
                    await message.channel.sendTyping();

                    //Timeout for the link to freshen up and discord embedded link preview to work
                    setTimeout(async () => {
                        if (response) {
                            await message.channel.send(response);
                        }
                        if (message.attachments.last().id === attachment.id) {
                            this.sendLinkAndReminder();
                        }
                    }, 3000);
                } catch (err) {
                    await message.channel.sendTyping();

                    //This timeout is for UX reasons
                    setTimeout(() => {
                        message.channel.send(
                            `There was an error uploading file: ${fileName} \n${err}`
                        );
                    }, 3000);

                    arrayOfMultifileEmojies.shift();
                    return;
                }

                await message.react('✅');
                await message.react(arrayOfMultifileEmojies.shift());
            });
        }
    }
}
