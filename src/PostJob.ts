import log from './log'


export class PostJob{

    groupId: number // Ballchasing groupID
    threadId: string // Thread Id from discord Post
    queue: string[] // array of URL's
    createdAt: number

    constructor(threadId:string, groupId:number){
        this.groupId = groupId
        this.threadId = threadId
        this.createdAt = Date.now()
        this.queue = []
    }

    addToQueue(url:string){
        if(this.queue.find(item => item === url)){
            log.error('Item exists in queue: ' + this.threadId)
            return
        }

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
}