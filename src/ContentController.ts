import { Message, ThreadChannel } from "discord.js"

import { PostJob } from "./PostJob"
import log from "./log"


// const TIMELIMIT = 2000 //add this to .env

export class ContentController {
    tasks: PostJob[]

    constructor() {
        this.tasks = []
    }

    async findGroupId(): Promise<string | null> {
        // try catch, return null if not found
        
        return '1'
    }

    async createNewTask(thread: ThreadChannel) {

        const existingTask = this.tasks.find(th => th.thread.id === thread.id)
        if (existingTask) {
            log.info(`Content queue with an ID of ${thread.id} already exists.`)
            return existingTask
        }

        const groupId = await this.findGroupId()
        if (!groupId) {
            log.error(`Group ID for ${thread.name} not found`)
            return
        }

        const task = new PostJob(thread, groupId)
        this.tasks.push(task)
        return task
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
            
        const task = await this.createNewTask(message.channel as ThreadChannel)
        if (task){
            task.addToQueue(message)
            
        } 

    }
}