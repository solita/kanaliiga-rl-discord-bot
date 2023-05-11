import { ContentController } from "../src/ContentController";

const controller = new ContentController()

describe("Content controller", () => {

    const threadId_Test = "Test_ThreadID"
    const groupId_Test = "Test_GroupID"
    const groupName_Test = "Test_GroupName"

    beforeEach(()=>{
        controller.clearTasks()
    })

    it("New instance of Controller and documentProcessor is defined", ()=>{
        expect(controller).toBeDefined()
        expect(controller.processor).toBeDefined()
    })


    it("New ContentQueues are created and added to controllers queue", async ()=>{

        const TASK_COUNT = 4

        for (let i = 0; i < TASK_COUNT ; i++){
            await controller.createNewTask(threadId_Test+i, groupName_Test+i)
        }

        expect(controller.tasks.length).toBe(TASK_COUNT)
        expect(controller.tasks[0].threadId).toBe(threadId_Test+"0")
        expect(controller.tasks[3].threadId).toBe(threadId_Test+"3")
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

    // TODO: Test for adding new items to a specific ContentQueues queue (URL'S)
    
    // TODO: Test for adding new items to a ContentQueue 
    // that does not exists (expect a new ContentQueue to be created on the fly)

    // TODO: Test for processing all the ContentQueues

    // TODO: Test for removing a ContentQueue from tasks list if its empty and old enough


})

