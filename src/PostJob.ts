import { ThreadChannel, Message } from 'discord.js';
import { DocumentProcessor } from './DocumentProcessor';
import log from './log';

export class PostJob {
    groupId: string; // Ballchasing groupID
    thread: ThreadChannel;
    queue: Message[]; // array of Messages's
    processor: DocumentProcessor;
    createdAt: number;
    closeReminderSent: boolean;

    constructor(thread: ThreadChannel, groupId: string) {
        this.groupId = groupId;
        this.thread = thread;
        this.queue = [];
        this.processor = new DocumentProcessor();
        this.createdAt = Date.now();
        this.closeReminderSent = false;
    }

    addToQueue(newMessage: Message) {
        if (this.queue.find((mes) => mes.id === newMessage.id)) {
            log.error('Message exists in queue already: ' + newMessage.id);
            return;
        }
        log.info(`A new message was added to task ${this.thread.id}`);
        this.queue.push(newMessage);
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

    async sendCloseReminder() {
        if (!this.closeReminderSent) {
            const messages = (await this.thread.messages.fetch()).filter(
                (msg) => msg.attachments.size > 0
            );
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
    }

    process() {
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
                        message.channel.send(
                            `Error downloading a file. ${err.status} ${err.statusText}`
                        );
                        return;
                    });

                if (!file) return;

                const fileName = attachment.url.split('/').at(-1);

                try {
                    const response = await this.processor.upload(
                        file,
                        fileName,
                        this.groupId
                    );
                    await message.channel.sendTyping();

                    //Timeout for the link to freshen up and discord embedded link preview to work
                    setTimeout(async () => {
                        await message.channel.send(response);
                        if (message.attachments.last().id === attachment.id) {
                            this.sendCloseReminder();
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
