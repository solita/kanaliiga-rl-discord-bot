import { PostJob } from "./PostJob"
import { DocumentProcessor } from "./DocumentProcessor"
import log from "./log"

const TIMELIMIT = 2000 //add this to .env

export class ContentController {
    tasks: PostJob[]
    processor: DocumentProcessor

    constructor() {
        this.tasks = []
        this.processor = new DocumentProcessor()
    }

    async findGroupId (groupName: string):Promise<number | null> {
        // try catch, return null if not found
        return 1
    }

    async createNewTask(threadId: string, groupName: string): Promise<string | void>{
        if (this.tasks.find(queue => queue.threadId === threadId)) {
            log.info(`Content queue with an ID of ${threadId} already exists.`)
            return
        }

        const groupId = await this.findGroupId(groupName)

        if (!groupId){
            log.error(`Group ID for ${groupName} not found`)
            return
        }

        this.tasks.push(new PostJob(threadId, groupId))
        log.info(`New queue created with ID ${threadId}`)
        return `New queue created with ID \`${threadId}\``
    }
    removeTask(threadId:string){
        this.tasks = this.tasks.filter(task => task.threadId !== threadId)
        return
        //todo: make task deleting work
    }
    clearTasks(){
        this.tasks = []
    }

    async processQueue() {

        //if (this.tasks.length > 0) {
            this.tasks.forEach(task => {
                if (this.tasks.length > 0){
                    this.removeTask(task.threadId)
                    return
                }
                task.queue.forEach(async url => {
                    const file = await this.processor.download(url)
                    this.processor.upload(file)
                })
            })
            console.log("After deletion length is ", this.tasks.length)
        //}
    }
}