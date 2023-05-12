import { DocumentProcessor } from './DocumentProcessor'
import log from './log'


export class PostJob{

    groupId: number // Ballchasing groupID
    threadId: string // Thread Id from discord Post
    queue: string[] // array of URL's
    createdAt: number
    processor: DocumentProcessor

    constructor(threadId:string, groupId:number){
        this.groupId = groupId
        this.threadId = threadId
        this.createdAt = Date.now()
        this.queue = []
        this.processor = new DocumentProcessor()
    }

    addToQueue(url:string){
        if(this.queue.find(item => item === url)){
            log.error('Item exists in queue: ' + this.threadId)
            return
        }
        log.info(`New URL: ${url} added to task ${this.threadId}`)
        this.queue.push(url)
    }

    removeFromQueue(): string | undefined {
        return this.queue.shift()
    }

    clearQueue(){
        this.queue = []
    }

    size(): number {
        return this.queue.length
    }

    async process() {
        while (this.size() > 0) {
            const url = this.removeFromQueue()
            const file = await this.processor.download(url)
            await this.processor.upload(file)
        }
        
    }
}