import { PostJob } from "./PostJob"
import log from "./log"

// const TIMELIMIT = 2000 //add this to .env

export class ContentController {
    tasks: PostJob[]

    constructor() {
        this.tasks = []
    }

    async findGroupId(): Promise<number | null> {
        // try catch, return null if not found
        
        return 1
    }

    async createNewTask(threadId: string, groupName: string): Promise<PostJob> {

        const existingTask = this.tasks.find(queue => queue.threadId === threadId)
        if (existingTask) {
            log.info(`Content queue with an ID of ${threadId} already exists.`)
            return existingTask
        }

        const groupId = await this.findGroupId()

        if (!groupId) {
            log.error(`Group ID for ${groupName} not found`)
            return
        }

        const task = new PostJob(threadId, groupId)
        this.tasks.push(task)
        return task
    }
    removeTask(threadId: string) {
        this.tasks = this.tasks.filter(task => task.threadId !== threadId)
        return
        //todo: make task deleting work
    }
    clearTasks() {
        this.tasks = []
    }

    async processQueue() {

        this.tasks.forEach(async task => {
            await task.process()
        })
    }

    async addToPostQueue(url: string, threadId: string, groupName: string) {
        const task = await this.createNewTask(threadId, groupName)
        task.addToQueue(url)
    }
}