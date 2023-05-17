import { Message, ThreadChannel } from "discord.js"

import { PostJob } from "./PostJob"
import log from "./log"
import { ACCEPTABLE_FILE_EXTENSION, allAttahcmentsAreCorrectType, checkRoleIsRLCaptain, getDivisionName } from "./util"
import { fetchGroups, searchGroupId } from "./ballchasingAPI"


// const TIMELIMIT = 2000 //add this to .env

export class ContentController {
    tasks: PostJob[]

    constructor() {
        this.tasks = []
    }

    async createNewTask(thread: ThreadChannel): Promise<PostJob> {

        const existingTask = this.tasks.find(th => th.thread.id === thread.id)
        if (existingTask) {
            log.info(`Content queue with an ID of ${thread.id} already exists.`)
            return existingTask
        }
        

        const response = await fetchGroups().then(data => data).catch(error =>{
            thread.send(`Error with Ballchasing api! ${error.status} ${error.statusText}`)
            return
        })
        if (response) {
            const groupName = getDivisionName(thread.name)
            const [groupId, allRecords] = searchGroupId(groupName, response)
            if (!groupId) {
                log.error(`Group ID for ${thread.name} not found`)
                await thread.send(`Your post did not make too much sense to me, maybe theres a typo?\n`+
                `I tried with '${thread.name}'\n`+
                `but only found groups named: \n${allRecords.join("\n")}`)
                return
            }
            
            const task = new PostJob(thread, groupId)
            this.tasks.push(task)
            return task
        }
        
    }

    // removeTask(threadId: string) {
    //     this.tasks = this.tasks.filter(task => task.threadId !== threadId)
    //     return
    //     //todo: make task deleting work
    // }

    clearTasks() {
        this.tasks = []
    }

    processQueue() {

        this.tasks.forEach(task => {
            task.process()
        })
    }

    async addToPostQueue(message:Message) {
        if (!checkRoleIsRLCaptain(message)) {
            return
        }

        if (allAttahcmentsAreCorrectType(message.attachments)){
            const task = await this.createNewTask(message.channel as ThreadChannel)
            if (task) task.addToQueue(message)
            return
        }

        message.channel.send(`Only acceptable filetype is ${ACCEPTABLE_FILE_EXTENSION}`)
        message.react('🚫')

    }
}