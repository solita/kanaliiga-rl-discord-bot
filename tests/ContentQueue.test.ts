import { ContentQueue } from "../src/ContentQueue";
import log from "../src/log";


describe("Content queue for each discord post which holds attachment url's in a list", ()=>{

    const groupId_Test = 10
    const threadId_Test = "Test_threadId"

    

    const contentQueue = new ContentQueue(threadId_Test, groupId_Test)

    beforeEach(()=>{
        contentQueue.clearQueue()
    })

    it("Creating of an empty new queue worked", ()=>{
        

        expect(contentQueue.size()).toBe(0)
        expect(contentQueue.groupId).toBe(groupId_Test)
        expect(contentQueue.threadId).toBe(threadId_Test)
        expect(contentQueue.createdAt).toBeDefined()
        expect(typeof contentQueue.createdAt).toBe('number')

    })

    it("Adds new URL's to queue", ()=>{
        
        contentQueue.addToQueue("URL1")
        expect(contentQueue.size()).toBe(1)

        contentQueue.addToQueue("URL2")
        expect(contentQueue.size()).toBe(2)

        expect(contentQueue.queue[0]).toBe("URL1")
        expect(contentQueue.queue[1]).toBe("URL2")

    })


    it("Does not add a new URL to the queue if one already exists, and logs it", ()=>{
        
        const errorSpy = jest.spyOn(log, 'error')

        contentQueue.addToQueue("URL1")
        expect(contentQueue.size()).toBe(1)

        contentQueue.addToQueue("URL1")
        expect(errorSpy).toHaveBeenCalled()
        expect(contentQueue.size()).toBe(1)

        expect(contentQueue.queue[0]).toBe("URL1")


    })

    it("Dequeueing removes first from the queue and returns it", ()=>{


        contentQueue.addToQueue("URL1")
        contentQueue.addToQueue("URL2")
        contentQueue.addToQueue("URL3")

        const url1 = contentQueue.removeFromQueue()
        expect(contentQueue.size()).toBe(2)
        expect(url1).toBe("URL1")

        const url2 = contentQueue.removeFromQueue()
        expect(contentQueue.size()).toBe(1)
        expect(url2).toBe("URL2")

        expect(contentQueue.queue[0]).toBe("URL3")

    })







})








