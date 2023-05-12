import { ContentController } from "../src/ContentController";




describe("Content controller", () => {

    const threadId_Test = "Test_ThreadID"
    const groupName_Test = "Test_GroupName"

    const controller = new ContentController()

    beforeEach(()=>{
        controller.clearTasks()
    })

    it("New instance of Controller and documentProcessor is defined", ()=>{
        expect(controller).toBeDefined()
    })


    it("New PostJobs are created and added to controllers queue", async ()=>{

        const TASK_COUNT = 4

        for (let i = 0; i < TASK_COUNT ; i++){
            await controller.createNewTask(threadId_Test+i, groupName_Test+i)
        }

        expect(controller.tasks.length).toBe(TASK_COUNT)
        expect(controller.tasks[0].threadId).toBe(threadId_Test+"0")
        expect(controller.tasks[3].threadId).toBe(threadId_Test+"3")
        expect(controller.tasks[0].groupId).toBeDefined()
        expect(controller.tasks[3].groupId).toBeDefined()

        expect(controller.tasks[0].queue.length).toBe(0)
        expect(controller.tasks[3].queue.length).toBe(0)

    })

    it("Removes a ContentQueue with a specific thread id from the tasks list", async ()=>{
        await controller.createNewTask(threadId_Test, groupName_Test)
        await controller.createNewTask(threadId_Test+"1", groupName_Test)
        expect(controller.tasks.length).toBe(2)


        controller.removeTask(threadId_Test)
        expect(controller.tasks.length).toBe(1)

    })

    
    it("Add URLs to a specific PostJob's queue", async () => {

        await controller.createNewTask(threadId_Test, groupName_Test)
        await controller.createNewTask(threadId_Test+'1', groupName_Test)

        for (let i = 0; i < 3; i++){
            await controller.addToPostQueue("URL"+i, threadId_Test, groupName_Test)
            await controller.addToPostQueue("URL"+i, threadId_Test+'1', groupName_Test)
        }

        expect(controller.tasks[0].size()).toBe(3)
        expect(controller.tasks[1].size()).toBe(3)
        expect(controller.tasks[0].queue[0]).toBe("URL0")
        expect(controller.tasks[1].queue[2]).toBe("URL2")
        
    })

    it("New postjob is created if it doesnt exist when adding new URL to its queue", async ()=>{

        await controller.addToPostQueue("URL1", threadId_Test, groupName_Test)

        expect(controller.tasks.length).toBe(1)
        expect(controller.tasks[0].size()).toBe(1)
        expect(controller.tasks[0].threadId).toBe(threadId_Test)
        expect(controller.tasks[0].queue[0]).toBe("URL1")


    })
    
    it("Processing of each PostJobs queue of URL's", async ()=> {

        await controller.createNewTask(threadId_Test, groupName_Test)
        await controller.createNewTask(threadId_Test+'1', groupName_Test)

        for (let i = 0; i < 3; i++){
            await controller.addToPostQueue("URL"+i, threadId_Test, groupName_Test)
            await controller.addToPostQueue("URL"+i, threadId_Test+'1', groupName_Test)
        }

        await controller.processQueue()

        await new Promise((r) => setTimeout(r, 1000));

        expect(controller.tasks.length).toBe(2)
        expect(controller.tasks[0].size()).toBe(0)
        expect(controller.tasks[1].size()).toBe(0)

    })

    // TODO: Test for removing a ContentQueue from tasks list if its empty and old enough

})

