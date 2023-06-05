import { Message, ThreadChannel } from 'discord.js';
import PostJob from './PostJob';
import log from './log';
import { fetchGroups, searchGroupId } from './ballchasingAPI';
import { CAPTAIN_ROLE, bcParentGroup, clearCacheInterval } from './config';
import {
    ACCEPTABLE_FILE_EXTENSION,
    allAttahcmentsAreCorrectType,
    checkDateObject,
    getDivisionName,
    hasRole
} from './util';

export class ContentController {
    tasks: PostJob[];

    constructor() {
        this.tasks = [];
    }

    async createNewTask(thread: ThreadChannel): Promise<PostJob> {
        const existingTask = this.tasks.find(
            (th) => th.thread.id === thread.id
        );
        if (existingTask) return existingTask;

        const groupName = getDivisionName(thread.name);
        if (!groupName) {
            thread.send(
                'Your post seemed to be malformatted in some way. Check that your formatting is:\n{Team vs Team}, {Division name}, {DD.MM.YYYY}'
            );
            return;
        }

        const response = await fetchGroups(bcParentGroup())
            .then((data) => data)
            .catch((error) => {
                thread.send(
                    `Error with Ballchasing api! ${error.status} ${error.statusText}`
                );
                return;
            });
        if (response) {
            const [groupId, allRecords] = searchGroupId(groupName, response);
            if (!groupId) {
                log.error(`Group ID for ${groupName} not found`);

                await thread.sendTyping();

                //This timeout is for UX reasons
                setTimeout(async () => {
                    await thread.send(
                        `Your post did not make too much sense to me, maybe theres a typo?\n` +
                            `I tried with '${groupName}'\n` +
                            `but only found groups named: \n${allRecords.join(
                                '\n'
                            )}`
                    );
                }, 3000);
                return;
            }

            const task = new PostJob(thread, groupId.id);
            this.tasks.push(task);
            return task;
        }
    }

    removeTask(threadId: string) {
        this.tasks = this.tasks.filter((task) => task.thread.id !== threadId);
        return;
    }

    cleanUpTasks() {
        //checks if the postjob has an empty queue and that it is older than a given amount of time
        this.tasks = this.tasks.filter((task) => {
            const taskIsOld = checkDateObject(
                new Date(task.createdAt),
                clearCacheInterval
            );
            if (!taskIsOld && task.queue.length > 0) {
                return task;
            }
        });
    }

    clearTasks() {
        this.tasks = [];
    }

    processQueue() {
        this.tasks.forEach((task) => {
            task.process();
        });
    }

    async addToPostQueue(message: Message) {
        if (!hasRole(message.member?.roles.cache, CAPTAIN_ROLE)) {
            message.channel.send(
                `Only those with ${CAPTAIN_ROLE} as their role can upload replays.`
            );
            return;
        }

        if (allAttahcmentsAreCorrectType(message.attachments)) {
            const task = await this.createNewTask(
                message.channel as ThreadChannel
            );
            if (task) await task.addToQueue(message);
            return;
        }

        await message.channel.send(
            `This isn't Rocket League! Only acceptable filetype is ${ACCEPTABLE_FILE_EXTENSION}`
        );
    }
}
