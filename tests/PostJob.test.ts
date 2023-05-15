import { Message, ThreadChannel } from "discord.js";
import { PostJob } from "../src/PostJob";
import log from "../src/log";


describe("Content queue for each discord post which holds attachment url's in a list", ()=>{

    const groupId_Test = 10
    const threadId_Test = "Test_threadId"

    const mockThread = {
        id : threadId_Test,
        
    } as ThreadChannel



    const postJob = new PostJob(mockThread, groupId_Test)

    beforeEach(()=>{
        postJob.clearQueue()
    })

    

    it("Creating of an empty new queue worked", ()=>{
        
        expect(postJob.size()).toBe(0)
        expect(postJob.groupId).toBe(groupId_Test)
        expect(postJob.thread.id).toBe(threadId_Test)


    })

    it("Adds new Messages to queue", ()=>{

        for (let i = 0; i< 3 ; i++){
            
            const mockMessage = {
                id: i,
                url: `File ${i}`
            } as unknown as Message

            postJob.addToQueue(mockMessage)
        }
        
        expect(postJob.size()).toBe(3)

        expect(postJob.queue[0].id).toBe(0)
        expect(postJob.queue[2].id).toBe(2)
        expect(postJob.queue[0].url).toBe("File 0")
        expect(postJob.queue[2].url).toBe("File 2")

    })


    // it("Does not add a new URL to the queue if one already exists, and logs it", ()=>{
        
    //     const errorSpy = jest.spyOn(log, 'error')

    //     postJob.addToQueue("URL1")
    //     expect(postJob.size()).toBe(1)

    //     postJob.addToQueue("URL1")
    //     expect(errorSpy).toHaveBeenCalled()
    //     expect(postJob.size()).toBe(1)

    //     expect(postJob.queue[0]).toBe("URL1")


    // })

    // it("Dequeueing removes first from the queue and returns it", ()=>{


    //     postJob.addToQueue("URL1")
    //     postJob.addToQueue("URL2")
    //     postJob.addToQueue("URL3")

    //     const url1 = postJob.removeFromQueue()
    //     expect(postJob.size()).toBe(2)
    //     expect(url1).toBe("URL1")

    //     const url2 = postJob.removeFromQueue()
    //     expect(postJob.size()).toBe(1)
    //     expect(url2).toBe("URL2")

    //     expect(postJob.queue[0]).toBe("URL3")

    // })







})








